import React, { Component } from 'react'
// import NextRouter from 'next/router'
// import { geocodeByAddress, getLatLng } from '../_locationUtils'
import { binder } from '../../../lib/_utils'

export default function MapManager (ComposedComponent) {
  class WrappedComponent extends Component {
    constructor (props) {
      super(props)
      binder(this, ['setZoomToScreenSize'])
    }
    componentDidMount () {
      this.setZoomToScreenSize()
      window.addEventListener('resize', this.setZoomToScreenSize)
    }
    setZoomToScreenSize () {
      const { onSetMapZoom } = this.props
      const w = window.innerWidth
      switch (true) {
        case w >= 1900:
          onSetMapZoom(5)
          return
        case w < 1900 && w >= 700:
          onSetMapZoom(4)
          return
        case w < 700:
          onSetMapZoom(3)
          return
        default:
          onSetMapZoom(4)
      }
    }
    render () {
      const initialMapStyles = [
        {
          'stylers': [
            { 'color': '#ffffff' }
          ]
        },
        {
        //   'featureType': 'water',
        //   'elementType': 'geometry',
        //   'stylers': [
        //     { 'visibility': 'off' }
        //   ]
        // }, {
        //   'featureType': 'landscape',
        //   'stylers': [
        //     { 'visibility': 'off' }
        //   ]
        // }, {
          'featureType': 'road',
          'stylers': [
            { 'visibility': 'off' }
          ]
        }, {
          'featureType': 'poi',
          'stylers': [
            { 'visibility': 'off' }
          ]
        }, {
          'featureType': 'administrative',
          'stylers': [
            { 'visibility': 'off' }
          ]
        }, {
          'elementType': 'labels',
          'stylers': [
            { 'visibility': 'off' }
          ]
        }
      ]
      const geoJSONstyles = {
        fillColor: 'red',
        fillOpacity: 1,
        zIndex: 2,
        strokeWeight: 1
      }
      return (
        <ComposedComponent geoJSONstyles={geoJSONstyles} initialMapStyles={initialMapStyles} {...this.props} />
      )
    }
  }
  return WrappedComponent
}
