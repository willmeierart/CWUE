import React, { Component } from 'react'
import PropTypes from 'prop-types'
import equal from 'deep-equal'
import ImperativeRouter from '../../../server/ImperativeRouter'
import { geocodeByAddress, getLatLng, makeMarker, normalizeRegionInputs } from '../../../lib/_locationUtils'
import { binder } from '../../../lib/_utils'

export default function SearchManager (ComposedComponent) {
  class WrappedComponent extends Component {
    constructor (props) {
      super(props)
      this.state = { searchIsRegion: false, nearbyResults: [], placeBounds: null }
      binder(this, [
        'handleSelection',
        'findResultsInRadius',
        'getRelevantCoords',
        'distanceServiceCallback',
        'setTheResults',
        'isInBounds',
        'searchIsRegion'
      ])
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
      this.setState({ nearbyResults: [], isRegion: false })
    }

    routeToResults (place) {
      const spec = place.formatted_address
        .toLowerCase()
        .replace(/(,)/g, '')
        .replace(/( )/g, '-')
      const query = { state: 'results', spec }

      ImperativeRouter.push('locations', query, false)
    }

    handleSelection (address, placeId, handleInput) { // passed as props to searchbar component (handleInput lives there), triggers everything below
      this.setState({ nearbyResults: [], isRegion: false, placeBounds: null })
      handleInput(address)
      this.geocode(address)
      this.props.onSetActiveSearchPhrase(address)
    }

    geocode (address, makeMarkers) {
      geocodeByAddress(address).then(res => {
        if (res.length > 0 && typeof res !== 'string') {
          const markers = []
          res.forEach(place =>
            getLatLng(place).then(latLng => {
              if (makeMarkers) {
                const marker = makeMarker(latLng, place)
                markers.push(marker)
              }
              this.props.setCenter(latLng)
            }).then(() => {
              if (makeMarkers) {
                this.setAllMarkers()
              }
              this.findResultsInRadius(place, this.props.staticLocationList)

              this.routeToResults(place)
            })
          )
        } else {
          this.props.setMarkers([])
        }
      }).catch(err => { console.log(err) })
    }

    searchIsRegion (types) {
      return types.reduce((bool, type) => {
        if ((type === 'locality' ||
          type === 'administrative_area_level_1') &&
          type === 'political') {
          bool = true
        }
        return bool
      }, false)
    }

    findResultsInRadius (place, locations) {
      this.setState({ searchIsRegion: this.searchIsRegion(place.types) })
      const locationCoords = locations.map(location => location.coordinates)
      this.getRelevantCoords(place, locationCoords)
    }

    getRelevantCoords (place, locationCoords) {
      if (place.geometry.bounds) {
        const { b, f } = place.geometry.bounds
        const bounds = [
          { lat: f.b, lng: b.b },
          { lat: f.f, lng: b.f }
        ]
        this.setState({ placeBounds: bounds })
      }
      const asyncLatLng = async () => {
        let LAT_LNG = []
        await getLatLng(place).then(latLng => {
          LAT_LNG = [latLng]
        })
        this.doDistanceService(LAT_LNG, locationCoords)
      }
      return asyncLatLng()
    }

    isInBounds (bounds, coords) {
      return coords.lat > bounds[0].lat &&
        coords.lat < bounds[1].lat &&
        coords.lng > bounds[0].lng &&
        coords.lng < bounds[1].lng
    }

    async doDistanceService (coords1, coords2) {
      await this.distanceService.getDistanceMatrix({
        origins: coords1,
        destinations: coords2,
        travelMode: window.google.maps.TravelMode.DRIVING
      }, this.distanceServiceCallback)
      this.setTheResults()
    }

    distanceServiceCallback (response, status) {
      if (status === 'OK') {
        const origins = response.originAddresses
        origins.forEach((origin, i) => {
          const results = response.rows[i].elements
          results.forEach((result, j) => {
            const distanceVal = result.distance.value
            if (distanceVal <= this.radius) {
              const location = this.props.staticLocationList[j]
              if (this.state.nearbyResults.indexOf(location) === -1) {
                const makeMarkers = true
                this.geocode(origin, makeMarkers)
                this.pushNewNearbyResult(location)
              }
            }
          })
        })
      }
    }

    setTheResults () { // this is where new results are actually set
      const { placeBounds, isRegion } = this.state
      const { staticLocationList, activeSearchPhrase } = this.props
      if (placeBounds) {
        staticLocationList.forEach(loc => {
          if (this.isInBounds(placeBounds, loc.coordinates)) {
            this.pushNewNearbyResult(loc)
          }
        })
      }
      if (isRegion) {
        const splitSearch = activeSearchPhrase.toLowerCase().split(/[^a-z]/g)
        splitSearch.forEach(wd => {
          staticLocationList.forEach(loc => {
            const usableProps = [
              loc.addressCity.toLowerCase(),
              loc.addressState.toLowerCase()
            ]
            if (loc.sEOLocationCategories.length > 0) {
              loc.sEOLocationCategories.forEach(seo => {
                const lowName = seo.name.toLowerCase()
                if (usableProps.indexOf(lowName) === -1) {
                  usableProps.push(lowName)
                }
                if (normalizeRegionInputs('city', seo)) {
                  this.pushNewNearbyResult(loc)
                }
              })
            }
            usableProps.forEach(prop => {
              if (wd === prop) {
                this.pushNewNearbyResult(loc)
              }
            })
          })
        })
      }
      this.props.setActiveResults(this.state.nearbyResults)
    }

    pushNewNearbyResult (loc) {
      const isInArr = this.state.nearbyResults.reduce((bool, val) => {
        if (equal(loc, val)) { bool = true }
        return bool
      }, false)
      if (!isInArr) {
        const newResults = [...this.state.nearbyResults]
        newResults.push(loc)
        this.setState({ nearbyResults: newResults })
      }
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
