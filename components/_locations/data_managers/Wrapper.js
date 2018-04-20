import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { graphql, compose } from 'react-apollo'
import NextRouter from 'next/router'
import ExecutionEnvironment from 'exenv'
import { allLocations, pageCopy } from '../../../lib/apollo/queries'
import {
  getUserLocation,
  setMapZoom,
  setMapMarkers,
  setMapCenter,
  setActiveLocation,
  setLocPageState,
  setActiveResultsList,
  setActiveSearchPhrase,
  setStaticLocList,
  makeUserLocationPage
} from '../../../lib/redux/actions'
import WithApolloLoader from '../../hoc/WithApolloLoader'
import ImperativeRouter from '../../../server/ImperativeRouter'
import { binder } from '../../../lib/_utils'

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
      ) {
        this.setPageStateViaUrl()
      }
      // if (this.props.userLocation !== prevProps.userLocation &&
      //   typeof this.props.userLocation === 'object' && this.props.userLocation !== {}
      // ) {
      //   ImperativeRouter.push('locations', { state: 'results', spec: 'my-location' }, false)
      // }
    }

    componentWillUnmount () {
      // NextRouter.onRouteChangeComplete =  url => { this.props.onSetActiveLocation(null) }
    }

    setUserLocationStatus (userLocationStatus) {
      this.setState({ userLocationStatus })
    }

    setMapZoomModifier (mapZoomModifier) {
      console.log('mapZoomModifier changed to:', mapZoomModifier)
      this.setState({ mapZoomModifier })
    }

    setPageStateViaUrl () {
      const { url } = this.props
      const { query: { state, spec } } = url
      // const isServer = !ExecutionEnvironment.canUseDOM
      const initial = !state || state === '' || state === 'initial'

      switch (true) {
        case initial:
          if (initial && url.asPath !== '/carwash/locations') {
            ImperativeRouter.push('locations', { state: 'initial' }, false) 
          }
          this.setPageStateGeoLoc(state)
          break
        case state === 'detail':
          this.props.onSetActiveLocation(spec)
          this.setTemplate(state)
          break
        default:
          this.setTemplate(state)
          break
      }
    }

    setPageStateGeoLoc (state) {
      console.log('setpgstgeoloc')
      const { userLocation } = this.props
      console.log(userLocation)
      if (userLocation !== null && userLocation !== 'denied') {
        // this.setTemplate('results') // need to have :spec of 'my-location'
        if (userLocation === {}) {
          this.props.onGetUserLocation(null, () => {
            console.log('firing ongetuserlocation callback');
            this.setState({ mapZoomModifier: -2 }, () => {
              ImperativeRouter.push('locations', { state: 'results', spec: 'my-location' }, false)
            })
          })
        }
        // else {
        //   ImperativeRouter.push('locations', { state: 'results', spec: 'my-location' }, false)
        // }
      } else {
        this.setState({ mapZoomModifier: 0 })
        // this.setTemplate('initial')
        // ImperativeRouter.push('locations', { state: 'initial' }, false)
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
          if (pageState === 'initial') {
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
      mapMarkers,
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
    mapMarkers,
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
    onSetMapMarkers: markers => dispatch(setMapMarkers(markers)),
    onSetActiveLocation: location => dispatch(setActiveLocation(location)),
    onSetLocPageState: pageState => dispatch(setLocPageState(pageState)),
    onSetActiveResultsList: list => dispatch(setActiveResultsList(list)),
    onSetActiveSearchPhrase: phrase => dispatch(setActiveSearchPhrase(phrase)),
    onSetStaticLocList: locObj => dispatch(setStaticLocList(locObj)),
    onMakeUserLocationPage: bool => dispatch(makeUserLocationPage(bool))
  }
}

DataManager.propTypes = {
  userLocation: PropTypes.oneOfType([PropTypes.object, PropTypes.string]).isRequired,
  userIsLocated: PropTypes.bool.isRequired,
  isUserLocationPage: PropTypes.bool.isRequired,
  onMakeUserLocationPage: PropTypes.func.isRequired,
  mapCenter: PropTypes.object,
  mapZoom: PropTypes.number,
  mapMarkers: PropTypes.array,
  activeLocation: PropTypes.object,
  pageState: PropTypes.string.isRequired,
  activeResults: PropTypes.array,
  onSetLocPageState: PropTypes.func,
  activeSearchPhrase: PropTypes.string,
  onSetActiveSearchPhrase: PropTypes.func,
  onSetStaticLocList: PropTypes.func,
  staticLocationList: PropTypes.array,
  vpDims: PropTypes.object
}
