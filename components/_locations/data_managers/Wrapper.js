// this is the datamanager for the entire locations section, handles the route-based-page-view logic, etc

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { graphql, compose } from 'react-apollo'
import { allEachLocations } from '../../../lib/apollo/queries'
import {
  getUserLocation,
  setMapZoom,
  setAllMarkers,
  setMapCenter,
  setActiveLocation,
  setLocPageState,
  setActiveResultsList,
  setActiveSearchPhrase,
  setStaticLocList,
  makeUserLocationPage,
  setUserNotification,
  setPromisePendingStatus
} from '../../../lib/redux/actions'
import WithApolloLoader from '../../hoc/WithApolloLoader'
import ImperativeRouter from '../../../server/ImperativeRouter'
import { binder } from '../../../lib/_utils'

// import StrictPropTypes from '../../hoc/StrictPropTypesChecker'
// @StrictPropTypes()

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
          console.log('isDetail, activeLocation:', this.props.activeLocation)
          if (!this.props.activeLocation || !this.props.activeLocation.hasOwnProperty('name')) {
            console.log('no active location in wrapper catch')
            this.setTemplate('initial') // make sure if the detail view is rendered that there is a location to render data from
            ImperativeRouter.push('locations', { state: 'initial' }, true)
          } else {
            console.log('firing else')
            this.setTemplate(state)
          }
          break
        default:
          this.setTemplate(state)
          break
      }
      console.log(state, url)
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
        console.log('setTemplate', template)
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
    graphql(allEachLocations)
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
      activeLocation,
      pageState,
      activeResults,
      activeSearchPhrase,
      staticLocationList,
      isUserLocationPage,
      promisePendingStatus
    },
    env: { vpDims }
  } = state
  return {
    userLocation,
    userIsLocated,
    isUserLocationPage,
    mapCenter,
    mapZoom,
    allMarkers,
    activeLocation,
    pageState,
    activeResults,
    activeSearchPhrase,
    staticLocationList,
    vpDims,
    promisePendingStatus
  }
}

function mapDispatchToProps (dispatch) {
  return {
    onGetUserLocation: (ops, callback) => dispatch(getUserLocation(ops, callback)),
    onSetMapCenter: center => dispatch(setMapCenter(center)),
    onSetMapZoom: zoom => dispatch(setMapZoom(zoom)),
    onSetAllMarkers: markers => dispatch(setAllMarkers(markers)),
    onSetActiveLocation: location => dispatch(setActiveLocation(location)),
    onSetLocPageState: pageState => dispatch(setLocPageState(pageState)),
    onSetActiveResultsList: list => dispatch(setActiveResultsList(list)),
    onSetActiveSearchPhrase: phrase => dispatch(setActiveSearchPhrase(phrase)),
    onSetStaticLocList: locObj => dispatch(setStaticLocList(locObj)),
    onMakeUserLocationPage: bool => dispatch(makeUserLocationPage(bool)),
    onSetUserNotification: alertObj => dispatch(setUserNotification(alertObj)),
    onSetPromisePendingStatus: bool => dispatch(setPromisePendingStatus(bool))
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
  onSetUserNotification: PropTypes.func.isRequired,
  onSetPromisePendingStatus: PropTypes.func.isRequired,
  promisePendingStatus: PropTypes.bool.isRequired
}
