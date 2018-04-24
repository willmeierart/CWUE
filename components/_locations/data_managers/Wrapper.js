import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { graphql, compose } from 'react-apollo'
import { allLocations } from '../../../lib/apollo/queries'
import {
  getUserLocation,
  setMapZoom,
  setAllMarkers,
  setOfficialMapMarkers,
  setMapCenter,
  setActiveLocation,
  setLocPageState,
  setActiveResultsList,
  setActiveSearchPhrase,
  setStaticLocList,
  makeUserLocationPage,
  setUserNotification
} from '../../../lib/redux/actions'
import WithApolloLoader from '../../hoc/WithApolloLoader'
import ImperativeRouter from '../../../server/ImperativeRouter'
import { binder } from '../../../lib/_utils'

// this is the datamanager for the entire locations section, handles the route-based-page-view logic, etc

export default function DataManager (ComposedComponent) {
  class WrappedComponent extends Component {
    constructor (props) {
      super(props)
      this.state = { mapZoomModifier: 0 }
      binder(this, [
        'setPageStateViaUrl',
        'setPageStateGeoLoc',
        'setTemplate',
        'setMapZoomModifier',
        'setUserLocationStatus'
      ])
    }
    componentDidMount () {
      this.setPageStateViaUrl()
    }

    componentDidUpdate (prevProps) {
      if (
        this.props.activeLocation !== prevProps.activeLocation ||
        this.props.url !== prevProps.url
      ) { // if you change routes, re-evaluate page-view-state
        this.props.onSetActiveSearchPhrase('')
        this.setPageStateViaUrl()
      }
    }

    setUserLocationStatus (userLocationStatus) { // do we have the user's location yet?
      this.setState({ userLocationStatus })
    }

    setMapZoomModifier (mapZoomModifier) { // to more precisely handle zooming when only one result present
      console.log('mapZoomModifier changed to:', mapZoomModifier)
      this.setState({ mapZoomModifier })
    }

    setPageStateViaUrl () {
      const { url } = this.props
      const { query: { state, spec } } = url

      const initial = !state || state === '' || state === 'initial' // if there is an incomplete route then still render initial view

      switch (true) {
        case initial:
          if (initial && url.asPath !== '/carwash/locations') { // if it's supposed to be the initial view but it isn't, make it so
            ImperativeRouter.push('locations', { state: 'initial' }, false) 
          }
          this.setPageStateGeoLoc(state)
          break
        case state === 'detail':
          this.props.onSetActiveLocation(spec) // make sure if the detail view is rendered that there is a location to render data from
          this.setTemplate(state)
          break
        default:
          this.setTemplate(state)
          break
      }
    }

    setPageStateGeoLoc (state) { // determines whether initial view should be 'initial' or results near user's location, if that's available
      const { userLocation, userIsLocated, mapZoom, onSetMapZoom } = this.props
      if (userLocation !== null && userLocation !== 'denied' && userLocation !== {}) {
        if (!userIsLocated) { // if the user hasn't been located, then try again to locate them
          this.props.onGetUserLocation(null, async () => { 
            console.log('firing ongetuserlocation callback')
            // await onSetMapZoom(mapZoom - 2)
            // ImperativeRouter.push('locations', { state: 'results', spec: 'my-location' }, false)
          })
        } else {
          // onSetMapZoom(mapZoom - 2)
          ImperativeRouter.push('locations', { state: 'results', spec: 'my-location' }, false)
        }
      } else {
        // onSetMapZoom(mapZoom)
      }
    }

    setTemplate (template) {
      const { onSetLocPageState, pageState, url: { pathname } } = this.props
      if (template === 'initial' || template === 'results' || template === 'detail' || template === 'region') {
        onSetLocPageState(template)
      } else {
        if (pathname.indexOf('region') !== -1) {
          onSetLocPageState('region')
        } else if (pathname.indexOf('detail') !== -1) {
          onSetLocPageState('detail')
        } else {
          if (pageState === 'detail') {
            onSetLocPageState('detail')
          } else {
            console.warn('not a valid template state... \n ...attempting default switch')
            onSetLocPageState('results')
          }
        }
      }
    }

    render () {
      const { mapZoomModifier } = this.state
      return (
        <ComposedComponent {...this.props}
          setMapZoomModifier={this.setMapZoomModifier}
          mapZoomModifier={mapZoomModifier}
          setTemplate={this.setTemplate} />
      )
    }
  }
  return compose(
    graphql(allLocations)
  )(
    connect(mapStateToProps, mapDispatchToProps)(
      WithApolloLoader(
        WrappedComponent
      )
    )
  )
}

function mapStateToProps (state) {
  const {
    location: {
      userLocation,
      userIsLocated,
      mapCenter,
      mapZoom,
      allMarkers,
      officialMapMarkers,
      activeLocation,
      pageState,
      activeResults,
      activeSearchPhrase,
      staticLocationList,
      isUserLocationPage
    },
    env: { vpDims }
  } = state
  return {
    userLocation,
    userIsLocated,
    isUserLocationPage,
    mapCenter,
    mapZoom,
    officialMapMarkers,
    allMarkers,
    activeLocation,
    pageState,
    activeResults,
    activeSearchPhrase,
    staticLocationList,
    vpDims
  }
}

function mapDispatchToProps (dispatch) {
  return {
    onGetUserLocation: (ops, callback) => dispatch(getUserLocation(ops, callback)),
    onSetMapCenter: center => dispatch(setMapCenter(center)),
    onSetMapZoom: zoom => dispatch(setMapZoom(zoom)),
    onSetAllMarkers: markers => dispatch(setAllMarkers(markers)),
    onSetOfficialMapMarkers: markers => dispatch(setOfficialMapMarkers(markers)),
    onSetActiveLocation: location => dispatch(setActiveLocation(location)),
    onSetLocPageState: pageState => dispatch(setLocPageState(pageState)),
    onSetActiveResultsList: list => dispatch(setActiveResultsList(list)),
    onSetActiveSearchPhrase: phrase => dispatch(setActiveSearchPhrase(phrase)),
    onSetStaticLocList: locObj => dispatch(setStaticLocList(locObj)),
    onMakeUserLocationPage: bool => dispatch(makeUserLocationPage(bool)),
    onSetUserNotification: alertObj => dispatch(setUserNotification(alertObj))
  }
}

DataManager.propTypes = {
  userLocation: PropTypes.oneOfType([PropTypes.object, PropTypes.string]).isRequired,
  userIsLocated: PropTypes.bool.isRequired,
  isUserLocationPage: PropTypes.bool.isRequired,
  onMakeUserLocationPage: PropTypes.func.isRequired,
  mapCenter: PropTypes.object,
  mapZoom: PropTypes.number,
  allMarkers: PropTypes.array,
  officialMapMarkers: PropTypes.array,
  onSetAllMarkers: PropTypes.func.isRequired,
  activeLocation: PropTypes.object,
  pageState: PropTypes.string.isRequired,
  activeResults: PropTypes.array,
  onSetLocPageState: PropTypes.func,
  activeSearchPhrase: PropTypes.string,
  onSetActiveSearchPhrase: PropTypes.func,
  onSetStaticLocList: PropTypes.func,
  staticLocationList: PropTypes.array,
  vpDims: PropTypes.object,
  onSetUserNotification: PropTypes.func.isRequired
}
