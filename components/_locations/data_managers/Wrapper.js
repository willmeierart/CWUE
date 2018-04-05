import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { graphql, compose } from 'react-apollo'
import NextRouter from 'next/router'
import ExecutionEnvironment from 'exenv'
import { allLocations } from '../../../lib/apollo/queries'
import {
  getUserLocation,
  setMapZoom,
  setMapMarkers,
  setMapCenter,
  setActiveLocation,
  setLocPageState,
  setActiveResultsList,
  setActiveSearchPhrase,
  setStaticLocList
} from '../../../lib/redux/actions'
import WithApolloLoader from '../../hoc/WithApolloLoader'
import { binder } from '../../../lib/_utils'

export default function DataManager (ComposedComponent) {
  class WrappedComponent extends Component {
    constructor (props) {
      super(props)
      binder(this, ['setPageStateViaUrl', 'setPageStateGeoLoc', 'setTemplate'])
    }
    componentDidMount () {
      this.setPageStateViaUrl()
    }

    componentDidUpdate (prevProps) {
      if (
        (this.props.userLocation !== prevProps.userLocation &&
        typeof this.props.userLocation === 'object') ||
        this.props.activeLocation !== prevProps.activeLocation ||
        this.props.url !== prevProps.url
      ) {
        this.setPageStateViaUrl()
      }
    }

    componentWillUnmount () {
      NextRouter.onRouteChangeComplete = url => { this.props.onSetActiveLocation(null) }
    }

    setPageStateViaUrl () {
      const { url } = this.props
      const { query: { state, spec } } = url
      const isServer = !ExecutionEnvironment.canUseDOM
      const initial = !state || state === '' || state === 'initial'

      switch (true) {
        case (initial || (state === 'results' && isServer)):
          this.setPageStateGeoLoc()
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

    setPageStateGeoLoc () {
      const { userLocation } = this.props
      if (userLocation !== null && userLocation !== 'denied') {
        // this.setTemplate('results') // need to have :spec of 'my-location'
        NextRouter.push({
          pathname: '/locations',
          query: {
            state: 'results',
            spec: 'my-location'
          },
          asPath: '/carwash/locations/results?search=my-location',
          shallow: true
        })
      } else {
        this.setTemplate('initial')
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
      return <ComposedComponent {...this.props} setTemplate={this.setTemplate} />
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
  const { location: { userLocation, mapCenter, mapZoom, mapMarkers, activeLocation, pageState, activeResults, activeSearchPhrase, staticLocationList } } = state
  return {
    userLocation,
    mapCenter,
    mapZoom,
    mapMarkers,
    activeLocation,
    pageState,
    activeResults,
    activeSearchPhrase,
    staticLocationList
  }
}

function mapDispatchToProps (dispatch) {
  return {
    onGetUserLocation: path => dispatch(getUserLocation(path)),
    onSetMapCenter: center => dispatch(setMapCenter(center)),
    onSetMapZoom: zoom => dispatch(setMapZoom(zoom)),
    onSetMapMarkers: markers => dispatch(setMapMarkers(markers)),
    onSetActiveLocation: location => dispatch(setActiveLocation(location)),
    onSetLocPageState: pageState => dispatch(setLocPageState(pageState)),
    onSetActiveResultsList: list => dispatch(setActiveResultsList(list)),
    onSetActiveSearchPhrase: phrase => dispatch(setActiveSearchPhrase(phrase)),
    onSetStaticLocList: locObj => dispatch(setStaticLocList(locObj))
  }
}

DataManager.propTypes = {
  userLocation: PropTypes.object,
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
  staticLocationList: PropTypes.array
}