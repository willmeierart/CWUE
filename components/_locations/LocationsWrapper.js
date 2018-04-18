import React, { Component } from 'react'
import PropTypes from 'prop-types'
import equal from 'deep-equal'
import TemplateSwitcher from './templates/TemplateSwitcher'
import GoogleMap from './GoogleMap'
import SearchBar from './SearchBar'
import DataManager from './data_managers/Wrapper'
import { binder } from '../../lib/_utils'

import locData from '../../lib/_data/locData'
import ImperativeRouter from '../../server/ImperativeRouter'

class LocationsWrapper extends Component {
  constructor (props) {
    super(props)
    binder(this, ['setCenter', 'setMarkers', 'setActiveResults'])
    this.fakeData = false
  }
  componentDidMount () {
    const { data: { _Carwash_USA_Express, _Cloned_CWUE } } = this.props
    this.props.onSetStaticLocList({ _Carwash_USA_Express, _Cloned_CWUE })
    this.setActiveResults()
  }

  shouldComponentUpdate (newProps) {
    if (!equal(newProps, this.props)) {
      // console.log(newProps)
      return true
    }
    return true
  }

  setCenter (center) { this.props.onSetMapCenter(center) }
  setMarkers (markers) { this.props.onSetMapMarkers(markers) } // leave in case middleware logic needed

  setActiveResults (results) {
    const { onSetActiveResultsList, data: { _Carwash_USA_Express, _Cloned_CWUE } } = this.props
    // const data = {
    //   CarwashUSAExpress: _Carwash_USA_Express,
    //   Clone: _Cloned_CWUE
    // }
    if (this.fakeData) {
      onSetActiveResultsList(locData)
    } else if (results) {
      onSetActiveResultsList(results)
      // console.log(results)
    }
  }

  goToRegion () { ImperativeRouter.push('locations', { state: 'region' }, false) }

  render () {
    const { mapCenter, mapZoom, mapMarkers, onGetUserLocation, userLocation, onSetActiveLocation, activeResults, activeLocation, pageState, activeSearchPhrase, onSetActiveSearchPhrase, url, data, staticLocationList, onSetMapZoom, vpDims, setTemplate } = this.props
    const getMapDims = template => {
      const large = { width: '96vw', height: '40vw' }
      const small = { width: '40vw', height: '40vw' }
      switch (template) {
        case 'initial' :
          return large
        case ('results' || 'detail') :
          return small
        default:
          return small
      }
    }
    return (
      <div>
        <div className='region-btn' onClick={this.goToRegion}>regions page</div>
        <TemplateSwitcher
          template={pageState}
          onGetUserLocation={onGetUserLocation}
          onSetActiveLocation={onSetActiveLocation}
          setActiveResults={this.setActiveResults}
          activeResults={activeResults}
          userLocation={userLocation}
          activeLocation={activeLocation}
          searchPhrase={activeSearchPhrase}
          url={url}>
          <h1>LOCATIONS</h1>
          <SearchBar
            setCenter={this.setCenter}
            setMarkers={this.setMarkers}
            setTemplate={setTemplate}
            activeResults={activeResults}
            onSetActiveSearchPhrase={onSetActiveSearchPhrase}
            data={data}
            staticLocationList={staticLocationList}
            setActiveResults={this.setActiveResults}
            url={url} />
          <GoogleMap
            url={url}
            onIdle
            template={pageState}
            center={mapCenter}
            zoom={mapZoom}
            markers={mapMarkers}
            dims={getMapDims(pageState)}
            onSetMapZoom={onSetMapZoom}
            setTemplate={setTemplate}
            vpDims={vpDims} />
        </TemplateSwitcher>
        <style jsx>{`
          .region-btn {
            border: 1px solid black;
            border-radius: 5px;
            width: 100px;
            text-align: center;
            cursor: pointer;
            background: red;
            color: white;
            margin: 2em;
          }
        `}</style>
      </div>
    )
  }
}

LocationsWrapper.propTypes = {
  activeLocation: PropTypes.object,
  activeResults: PropTypes.array.isRequired,
  activeSearchPhrase: PropTypes.string.isRequired,
  data: PropTypes.object.isRequired,
  mapCenter: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  mapMarkers: PropTypes.array.isRequired,
  mapZoom: PropTypes.number.isRequired,
  onGetUserLocation: PropTypes.func.isRequired,
  onSetActiveLocation: PropTypes.func.isRequired,
  onSetActiveResultsList: PropTypes.func.isRequired,
  onSetLocPageState: PropTypes.func.isRequired,
  onSetMapMarkers: PropTypes.func.isRequired,
  onSetMapCenter: PropTypes.func.isRequired,
  onSetMapZoom: PropTypes.func.isRequired,
  onSetStaticLocList: PropTypes.func.isRequired,
  pageState: PropTypes.string.isRequired,
  serverState: PropTypes.object.isRequired,
  setTemplate: PropTypes.func.isRequired,
  staticLocationList: PropTypes.array.isRequired,
  userLocation: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  vpDims: PropTypes.object.isRequired,
  url: PropTypes.object.isRequired
}

export default DataManager(LocationsWrapper)
