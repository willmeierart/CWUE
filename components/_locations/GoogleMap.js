import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'
import MapManager from './data_managers/Map'
import NextRouter from 'next/router'
import { binder } from '../../lib/_utils'
import { getCoordsFromAddress } from '../../lib/_locationUtils'
import locData from '../../lib/_data/locData'
import equal from 'deep-equal'
import arrayEqual from 'array-equal'

class GoogleMap extends Component {
  constructor (props) {
    super(props)
    const { zoom } = this.props
    this.state = {
      center: {lat: 39.8283459, lng: -98.5794797},
      activeMarkers: [],
      markerSet: [],
      markerTitles: [],
      zoom: zoom || 3,
      bounds: null
    }
    binder(this, ['setCenter', 'setMarker', 'setMarkers', 'setCenterViaMarkers', 'setBounds', 'toggleActiveMarkers'])
  }

  componentDidMount () {
    const init = () => {
      const { template, onIdle, initialMapStyles, geoJSONstyles, url } = this.props
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
              this.setMarkers()
            })
          }
        } else if (template === 'initial') {
          this.map.data.loadGeoJson('/static/geoData/US_GEO.json')
          this.map.data.setStyle(geoJSONstyles)
        }
      }
    }
    init()
  }
  
  // componentWillUnmount () {
  //   NextRouter.onRouteChangeComplete(url => {
  //     if (url.query.state !== 'results') {
  //       this.toggleActiveMarkers()
  //     }
  //   })
  // }

  async componentDidUpdate (prevProps, prevState) {
    if (!equal(this.props, prevProps)) {
      console.log('props different')
      this.setMarkers()
      this.map.panTo(this.state.center)
      this.map.setZoom(this.props.zoom)
      if (this.props.url.query.state !== 'results') {
        this.toggleActiveMarkers()
      }
    }
    if (prevState.zoom !== this.state.zoom) {
      console.log('zoom different:', prevState.zoom, this.state.zoom)
      this.map.setZoom(this.state.zoom)
    }
    if (!equal(prevState.center, this.state.center)) {
      console.log('center different:', prevState.center, this.state.center)
      this.map.panTo(this.state.center)
    }
    if (!arrayEqual(prevState.activeMarkers, this.state.activeMarkers)) {
      console.log('markers different:', prevState.activeMarkers, this.state.activeMarkers)
      this.setMarkers()
      this.setCenterViaMarkers(this.state.activeMarkers)
    }
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
    this.setCenter(markerCenter.coords)
  }

  setCenter (center) {
    const setCenterType = center => {
      if (typeof center === 'string') {
        getCoordsFromAddress(center)
          .then(coords => {
            this.setState({ center: coords }, () => this.map.panTo(this.state.center))
          })
      } else {
        this.setState({ center }, () => this.map.panTo(this.state.center))
      }
    }
    if (center) {
      setCenterType(center)
    } else if (this.props.center) {
      setCenterType(this.props.center)
    } else {
      this.setState({ center: {lat: 39.740287, lng: -104.971806} })
    }
  }

  setMarkers () {
    const newMarkerTitles = [...this.state.markerTitles]
    this.props.markers.forEach((marker, i) => {
      const title = marker.title
      if (newMarkerTitles.indexOf(title) === -1) {
        newMarkerTitles.push(title)
      }
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
    this.setState({ markerTitles: newMarkerTitles })
    this.toggleActiveMarkers()
  }

  setMarker (marker) {
    const copiedMarkers = [...this.state.markerSet]
    const i = this.state.markerTitles.indexOf(marker.title)
    if (i === -1) {
      const m = new window.google.maps.Marker({
        position: marker.position,
        animation: marker.animation,
        title: marker.title,
        label: marker.label, 
        map: this.map,
        icon: marker.icon
      })
      window.google.maps.event.addListener(m, 'click', marker.onClick) // this is an important action
      copiedMarkers.push(m)
    }
    this.setState({ markerSet: copiedMarkers })
  }

  toggleActiveMarkers () {
    const activeMarkerTitles = this.props.markers.map(marker => marker.title)
    const newActiveMarkers = []
    this.state.markerSet.forEach(marker => {
      if (activeMarkerTitles.indexOf(marker.title) !== -1 && this.props.template === 'results') {
        newActiveMarkers.push(marker)
        marker.setMap(this.map)
      } else {
        marker.setMap(null)
      }
    })
    this.setState({ activeMarkers: newActiveMarkers })
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
  markers: PropTypes.array.isRequired,
  onIdle: PropTypes.bool,
  onSetMapZoom: PropTypes.func.isRequired,
  setTemplate: PropTypes.func.isRequired,
  template: PropTypes.string.isRequired,
  url: PropTypes.object.isRequired,
  vpDims: PropTypes.object.isRequired,
  zoom: PropTypes.number.isRequired
}

export default MapManager(GoogleMap)
