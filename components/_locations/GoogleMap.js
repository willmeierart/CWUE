import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'
import MapManager from './data_managers/Map'
import NextRouter from 'next/router'
import { binder } from '../../lib/_utils'
import { getCoordsFromAddress, makeMarker, getLatLng, reverseGeocode } from '../../lib/_locationUtils'
import equal from 'deep-equal'
import arrayEqual from 'array-equal'

class GoogleMap extends Component {
  constructor (props) {
    super(props)
    this.state = {
      bounds: null
    }
    binder(this, ['setCenter', 'setCenterViaMarkers', 'setBounds', 'toggleActiveMarkers', 'setAllMarkers'])
  }

  componentDidMount () {
    const init = () => {
      const { template, onIdle, initialMapStyles, geoJSONstyles, url } = this.props
      if (!window.google) {
        console.warn('no google')
        setTimeout(init, 500)
      } else {
        console.log(this.state.zoom, this.props.mapZoomModifier)
        const { google } = window
        const mapNode = ReactDOM.findDOMNode(this.mapDOM)
        const { center } = this.props
        console.log(center)
        let mapCenter
        if (typeof center === 'object') {
          if (center instanceof google.maps.LatLng) {
            console.log('init: center is valid')
            mapCenter = center
          } else {
            console.log('init: center invalid, being converted to latlng')
            const centerify = new google.maps.LatLng(center.lat, center.lng)
            const { lat, lng } = centerify
            mapCenter = { lat: lat(), lng: lng() }
            // mapCenter = centerify
          }
        } else {
          console.log('init: center is a string, reverse geocoding')
          const reverseGeocoded = reverseGeocode(center)
          console.log(reverseGeocoded)
          const { lat } = reverseGeocoded.geometry.location
          const { lng } = reverseGeocoded.geometry.location
          mapCenter = { lat: lat(), lng: lng() }
        }
        
        this.map = new google.maps.Map(mapNode, {
          zoom: this.props.zoom,
          center: mapCenter,
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          disableDefaultUI: true,
          // zoomControl: false,
          // mapTypeControl: false,
          // scaleControl: false,
          // streetViewControl: false,
          // rotateControl: false,
          // fullscreenControl: false,
          styles: template === 'initial' ? initialMapStyles : null
          // gestureHandling: 'none'
        })
        if (template === 'results' || url.asPath.indexOf('results') !== -1) {
          if (onIdle) {
            google.maps.event.addListener(this.map, 'idle', () => {
              // this.setMarkers()
              // this.setAllMarkers()
              // this.toggleActiveMarkers()
            })
          }
        } else if (template === 'initial') {
          this.map.data.loadGeoJson('/static/geoData/US_GEO.json')
          this.map.data.setStyle(geoJSONstyles)
        }
        if (this.props.activeResults.length !== this.props.allMarkers.length || this.props.allMarkers.indexOf(undefined) !== -1) {
          this.setAllMarkers()
        }
      }
    }
    init()
  }

  componentDidUpdate (prevProps, prevState) {
    if (!equal(this.props, prevProps)) {
      // console.log('props different', this.props)
      // this.map.panTo(this.state.center)
      if (this.props.url.query.state !== 'results') {
        this.toggleActiveMarkers()
      }
      if (this.props.mapZoomModifier !== prevProps.mapZoomModifier || this.props.zoom !== prevProps.zoom) {
        console.log(this.props.mapZoomModifier)
        if (this.props.mapZoomModifier === 0) {
          this.map.setZoom(this.props.zoom)
        } else {
          this.map.setZoom(this.props.zoom)
        }
      }
      if (this.props.activeResults !== prevProps.activeResults) {
        this.toggleActiveMarkers()
      }
      if (this.props.center !== prevProps.center) {
        console.log(this.props.center)
        // console.log(this.map.getCenter())
        if (this.props.center instanceof window.google.maps.LatLng) {
          this.map.panTo(this.props.center)
        } else {
          const validLatLng = new window.google.maps.LatLng(this.props.center)
          const { lat, lng } = validLatLng
          this.map.panTo({ lat: lat(), lng: lng() })
        }
      }
    }
    // if (prevState.zoom !== this.state.zoom) {
    //   // console.log('zoom different:', prevState.zoom, this.state.zoom)
    //   this.map.setZoom(this.state.zoom)
    // }
    // if (!equal(prevState.center, this.state.center)) {
    //   // console.log('center different:', prevState.center, this.state.center)
    //   this.map.panTo(this.state.center)
    // }
  }

  setBounds (marker) {
    const mainAction = () => {
      if (marker) {
        this.setState({ bounds: this.state.bounds.extend(marker) }, () => {
          console.log(this.state.bounds)
          this.map.fitBounds(this.state.bounds)
        })
      }
    }
    if (!this.state.bounds) {
      this.setState({ bounds: new window.google.maps.LatLngBounds() }, mainAction)
    } else {
      mainAction()
    }
  }

  setCenterViaMarkers (markers) {
    let maxLat = null
    let minLat = null
    let maxLng = null
    let minLng = null

    this.setState({ bounds: new window.google.maps.LatLngBounds() })

    const markerCenter = markers.reduce((obj, marker) => {
      if (maxLat === null || marker.position.lat > maxLat) maxLat = marker.position.lat()
      if (minLat === null || marker.position.lat < minLat) minLat = marker.position.lat()
      if (maxLng === null || marker.position.lng > maxLng) maxLng = marker.position.lng()
      if (minLng === null || marker.position.lng < minLng) minLng = marker.position.lng()
      obj.coords.lat = parseFloat(((maxLat + minLat) / 2).toFixed(5))
      obj.coords.lng = parseFloat(((maxLng + minLng) / 2).toFixed(5))
      const invokedPos = { lat: marker.position.lat(), lng: marker.position.lng() }
      this.setBounds(invokedPos)
      return obj
    }, { coords: { lat: 0, lng: 0 } })
    console.log(markerCenter.coords)
    this.setCenter(markerCenter.coords)
  }

  setCenter (center) {
    const setCenterType = center => {
      if (typeof center === 'string') {
        getCoordsFromAddress(center)
          .then(coords => {
            console.log('center was a string, now coords are:', coords)
            this.props.setCenter(coords)
            // this.setState({ center: coords }, () => this.map.panTo(this.state.center))
          })
      } else {
        console.log('firing normally, center is:', center)
        // this.setState({ center }, () => this.map.panTo(this.state.center))
        this.props.setCenter(center)
        // this.setState({ center: coords }, () => this.map.panTo(this.state.center))
      }
    }
    if (center) {
      setCenterType(center)
    } else {
      console.log('was no center, using props')
      setCenterType(this.props.center)
    }
  }

  setAllMarkers () {
    const { staticLocationList, activeResults, setMarkers } = this.props
    const activeMarkerTitles = activeResults.map(result => result.name)
    const mappedAsMarkers = staticLocationList.map(loc => {
      const marker = makeMarker(loc)
      const newMarker = new window.google.maps.Marker({
        position: marker.position,
        animation: marker.animation,
        title: marker.title,
        label: marker.label || '',
        map: activeMarkerTitles.indexOf(marker.title) !== -1 ? this.map : null,
        icon: marker.icon || null
      })
      return newMarker
    })
    setMarkers(mappedAsMarkers)
  }

  toggleActiveMarkers () {
    const { activeResults, allMarkers, setMarkers } = this.props
    const activeMarkerTitles = activeResults.map(result => result.name)
    const newMarkers = allMarkers.map(marker => {
      if (activeMarkerTitles.indexOf(marker.title) !== -1) {
        marker.map = this.map
        marker.setMap(this.map)
      } else {
        marker.map = null
        marker.setMap(null)
      }
      return marker
    })
    setMarkers(newMarkers)
  }

  render () {
    const { dims: { width, height }, template } = this.props
    return (
      <div className='map-container'>
        <div onChange={this.updateAllMapProps} id='map' style={{ width: '100%', height: '100%' }} ref={map => { this.mapDOM = map }} />
        <style jsx>{`
          .map-container {
            pointer-events: ${template === 'initial' ? 'none' : 'all'};
            cursor: default!important;
            width: ${width};
            height: ${height};
          }
        `}</style>
      </div>
    )
  }
}

GoogleMap.propTypes = {
  center: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  dims: PropTypes.object.isRequired,
  geoJSONstyles: PropTypes.object.isRequired,
  initialMapStyles: PropTypes.array.isRequired,
  allMarkers: PropTypes.array.isRequired,
  onIdle: PropTypes.bool,
  onSetMapZoom: PropTypes.func.isRequired,
  setTemplate: PropTypes.func.isRequired,
  template: PropTypes.string.isRequired,
  url: PropTypes.object.isRequired,
  vpDims: PropTypes.object.isRequired,
  mapZoomModifier: PropTypes.number.isRequired,
  zoom: PropTypes.number.isRequired,
  activeResults: PropTypes.array.isRequired,
  setCenter: PropTypes.func.isRequired,
  setMarkers: PropTypes.func.isRequired
}

export default MapManager(GoogleMap)
