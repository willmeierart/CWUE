import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import MapManager from './data_managers/Map'
import { binder } from '../../lib/_utils'
import { getCoordsFromAddress } from '../../lib/_locationUtils'
import locData from '../../lib/_data/locData'
// import { flip } from 'geojson-flip'
// const geoJSON = require('/static/geoData/US_GEO.js')
// const flippedGeoJson = flip(geoJSON)

class GoogleMap extends Component {
  constructor (props) {
    super(props)
    this.allMarkers = []
    this.state = {
      center: {lat: 39.8283459, lng: -98.5794797},
      markers: this.props.markers || [],
      zoom: this.props.zoom || 4,
      bounds: null
    }
    binder(this, ['setCenter', 'setMarker', 'setMarkers', 'setCenterViaMarkers', 'setBounds'])
  }

  componentDidMount () {
    const init = () => {
      const { template, onIdle, InitialMapStyles, markers } = this.props
      if (!window.google) {
        console.log('no google')
        setTimeout(init, 500)
      } else {
        const { google } = window
        const mapNode = ReactDOM.findDOMNode(this.mapDOM)
        this.map = new google.maps.Map(mapNode, {
          zoom: this.state.zoom,
          center: this.state.center,
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          disableDefaultUI: true,
          zoomControl: false,
          mapTypeControl: false,
          scaleControl: false,
          streetViewControl: false,
          rotateControl: false,
          fullscreenControl: false,
          styles: template === 'initial' ? InitialMapStyles : null,
          gestureHandling: 'none'
        })
        if (onIdle) {
          google.maps.event.addListener(this.map, 'idle', () =>
            onIdle(this.map, markers)
            // onIdle(this.map, this.allMarkers)
          )
        }

        this.setMarkers()
        // this.setState({ markers: markers })
        if (template === 'results') {
          this.setCenterViaMarkers(locData)
        } else if (template === 'initial') {
          // this.setCenter('geographic center of the united states')

          // this.map.data.addGeoJson(flippedGeoJson)
          this.map.data.loadGeoJson('/static/geoData/US_GEO.json')
          this.map.data.setStyle({
            fillColor: 'red',
            fillOpacity: 1,
            zIndex: 2,
            strokeWeight: 1
          })
        }
      }
    }
    init()
  }

  componentDidUpdate (prevProps, prevState) {
    if (JSON.stringify(this.props) !== JSON.stringify(prevProps)) {
      this.setState({
        markers: this.props.markers || [],
        zoom: this.props.zoom || 8
        // center: this.props.center
      })
    }
    if (JSON.stringify(this.state) !== JSON.stringify(prevState)) {
      if (this.map.getZoom() !== this.state.zoom) {
        this.map.setZoom(this.state.zoom)
      }
      if (JSON.stringify(prevState.center) !== JSON.stringify(this.state.center)) {
        this.map.panTo(this.state.center)
      }
      if (JSON.stringify(this.state.markers) !== JSON.stringify(prevState.markers)) {
        // this.setMarkers()
        // console.log(this.state.markers);
      }
    }
  }

  setBounds (marker) {
    const mainAction = () => {
      if (marker) this.setState({ bounds: this.state.bounds.extend(marker) })
      this.map.fitBounds(this.state.bounds)
      // console.log(this.state.bounds)
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

    const markerCenter = markers.reduce((obj, marker) => {
      if (maxLat === null || marker.coords.lat > maxLat) maxLat = marker.coords.lat
      if (minLat === null || marker.coords.lat < minLat) minLat = marker.coords.lat
      if (maxLng === null || marker.coords.lng > maxLng) maxLng = marker.coords.lng
      if (minLng === null || marker.coords.lng < minLng) minLng = marker.coords.lng
      obj.coords.lat = parseFloat(((maxLat + minLat) / 2).toFixed(5))
      obj.coords.lng = parseFloat(((maxLng + minLng) / 2).toFixed(5))
      // console.log(maxLat, maxLng)
      // console.log(coords);
      this.setBounds(marker.coords)
      return obj
    }, { coords: { lat: 0, lng: 0 } })
    // console.log(markerCenter)
    this.setCenter(markerCenter.coords)
  }

  setCenter (center) {
    const setCenterType = center => {
      if (typeof center === 'string') {
        // console.log(this.props.center)
        getCoordsFromAddress(center)
          .then(coords => {
            this.setState({ center: coords })
          })
      } else {
        this.setState({ center: this.props.center })
      }
    }
    if (center) {
      setCenterType(center)
    } else {
      if (this.props.center) {
        setCenterType(this.props.center)
      } else {
        this.setState({ center: {lat: 39.740287, lng: -104.971806} })
      }
    }
  }

  setMarkers () {
    // if (this.props.markers !== undefined) {
    this.props.markers.forEach((marker, i) => {
      if (typeof marker.position === 'string') {
        getCoordsFromAddress(marker.position)
          .then(coords => {
            marker.position = coords
            this.setMarker(marker)
          })
      } else if (typeof marker.position === 'object') {
        this.setMarker(marker)
      }
    })
    // }
  }

  setMarker (marker) {
    const m = new window.google.maps.Marker({
      position: marker.position,
      animation: marker.animation,
      title: marker.title,
      label: marker.label,
      map: this.map,
      icon: marker.icon
    })
    window.google.maps.event.addListener(m, 'click', marker.onClick) // this is an important action
    // this.allMarkers.push(m) // needs to somehow clear here
  }

  render () {
    const { width, height } = this.props.dims
    return (
      <div className='map-container'>
        <div id='map' style={{ width: '100%', height: '100%' }} ref={map => { this.mapDOM = map }} />
        <style jsx>{`
          .map-container {
            width: ${width};
            height: ${height};
          }
        `}</style>
      </div>
    )
  }
}

export default MapManager(GoogleMap)
