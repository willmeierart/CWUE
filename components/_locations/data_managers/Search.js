import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ImperativeRouter from '../../../server/ImperativeRouter'
import { geocodeByAddress, getLatLng } from '../../../lib/_locationUtils'
import { binder } from '../../../lib/_utils'

export default function SearchManager (ComposedComponent) {
  class WrappedComponent extends Component {
    constructor (props) {
      super(props)
      this.state = { nearbyResults: [] }
      binder(this, ['handleSelection', 'findResultsInRadius', 'makeMarker', 'getRelevantCoords', 'distanceServiceCallback', 'formatLocationData'])
      const mile = 1610
      this.radius = 5 * mile
    }

    componentDidMount () {
      const init = () => {
        if (typeof window !== 'undefined' || !window.google.maps.places) {
          if (!window.google) {
            console.log('no google')
            setTimeout(init, 500)
          } else {
            this.distanceService = new window.google.maps.DistanceMatrixService()
            this.autocompleteService = new window.google.maps.places.AutocompleteService()
            this.autocompleteOK = window.google.maps.places.PlacesServiceStatus.OK
          }
        } else {
          setTimeout(init, 500)
        }
      }
      init()
    }

    makeMarker (latLng, place) {
      return latLng && place ? {
        position: latLng,
        title: place.formatted_address || place.name,
        animation: 'drop',
        onClick: () => { console.log('clicked') }
      } : {}
    }

    getRelevantCoords (place, locationCoords) {
      console.log(place)
      if (place.geometry.bounds) {
        const { b, f } = place.geometry.bounds
        return [
          { lat: f.b, lng: b.b },
          { lat: f.f, lng: b.f }
        ]
      } else {
        const asyncLatLng = async () => {
          let LAT_LNG = []
          await getLatLng(place).then(latLng => {
            LAT_LNG = [latLng]
          })
          this.doDistanceService(LAT_LNG, locationCoords)
          // return LAT_LNG
        }
        return asyncLatLng()
      }
    }

    doDistanceService (coords1, coords2) {
      this.distanceService.getDistanceMatrix({
        origins: coords1,
        destinations: coords2,
        // unitSystem: window.google.maps.UnitSystem.IMPERIAL,
        travelMode: window.google.maps.TravelMode.DRIVING
      }, this.distanceServiceCallback)
    }

    distanceServiceCallback (response, status) {
      if (status === 'OK') {
        const origins = response.originAddresses
        // const destinations = response.destinationAddresses
        origins.forEach((origin, i) => {
          const results = response.rows[i].elements
          results.forEach((result, j) => {
            const distanceVal = result.distance.value
            if (distanceVal <= this.radius) {
              const location = this.props.staticLocationList[j]
              const newResults = [...this.state.nearbyResults]
              if (newResults.indexOf(location) === -1) {
                const makeMarkers = true
                this.geocode(origin, makeMarkers)

                newResults.push(location)
              }
              this.setState({ nearbyResults: newResults })
            }
          })
        })
      }
    }

    handleSelection (address, placeId, handleInput) {
      // called right above ^
      const { onSelect, onSetActiveSearchPhrase } = this.props
      onSelect
        ? onSelect(address, placeId) // this doesn't exist, as far as I know...
        : handleInput(address)

      this.geocode(address)
      onSetActiveSearchPhrase(address)
    }

    formatLocationData () {
      const { data } = this.props
    }

    geocode (address, makeMarkers) {
      geocodeByAddress(address).then(res => {
        // console.log(res)
        if (res.length > 0 && typeof res !== 'string') {
          const markers = []
          res.forEach(place =>
            getLatLng(place).then(latLng => {
              console.log('USE BOUNDS OF PLACE FOR MILEAGE COMPARISION && PLACE.TYPES === "LOCALITY / POLITICAL ?" FOR DETECTING STATE?', place)

              const marker = this.makeMarker(latLng, place)
              markers.push(marker)

              this.props.setCenter(latLng)
            }).then(() => {
              if (makeMarkers) {
                this.props.setMarkers(markers)
              }

              this.findResultsInRadius(place, this.props.staticLocationList)

              this.routeToResults(place)
            }).then(() => {
              console.log(this.props.url)
            })
          )
        } else {
          this.props.setMarkers([])
        }
      }).catch(err => { console.log(err) })
    }

    findResultsInRadius (place, locations) {
      const isRegion = types => types.reduce((bool, type) => {
        if ((type === 'locality' ||
          type === 'administrative_area_level_1') &&
          type === 'political') {
          bool = true
        }
        return bool
      }, false)
      // console.log(isRegion(place.types))
      const locationCoords = locations.map(location => location.coords)
      // console.log(locationCoords)
      this.getRelevantCoords(place, locationCoords)
      // console.log(nearbyLocations)
    }

    routeToResults (place) {
      const spec = place.formatted_address
        .toLowerCase()
        .replace(/(,)/g, '')
        .replace(/( )/g, '-')
      const query = { state: 'results', spec }

      ImperativeRouter.push('locations', query, false)
    }

    render () {
      return (
        <ComposedComponent {...this.props}
          handleSelection={this.handleSelection}
          autocompleteService={this.autocompleteService}
          autocompleteOK={this.autocompleteOK}
          distanceService={this.distanceService}
        />
      )
    }
  }
  return WrappedComponent
}

SearchManager.propTypes = {
  handleSelection: PropTypes.func
}