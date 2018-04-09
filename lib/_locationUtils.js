import axios from 'axios'
import normalize from 'us-states-normalize'

export const geocodeByAddress = (address, callback) => {
  const geocoder = new window.google.maps.Geocoder()
  const OK = window.google.maps.GeocoderStatus.OK

  return new Promise((resolve, reject) => {
    geocoder.geocode({ address }, (results, status) => {
      if (status !== OK) {
        console.log('okaaaaay')
        if (callback) {
          console.warn('Deprecated: Passing a callback to geocodeByAddress is deprecated')
          callback({ status }, null, results)
          return
        }
        reject(status)
      }
      if (callback) {
        const latLng = {
          lat: results[0].geometry.location.lat(),
          lng: results[0].geometry.location.lng()
        }
        console.warn('Deprecated: Passing a callback to geocodeByAddress is deprecated')
        callback(null, latLng, results)
      }

      resolve(results)
    })
  })
}

export const getLatLng = result => {
  return new Promise((resolve, reject) => {
    try {
      const latLng = {
        lat: result.geometry.location.lat(),
        lng: result.geometry.location.lng()
      }
      resolve(latLng)
    } catch (e) {
      reject(e)
    }
  })
}

export const geocodeByPlaceId = (placeId, callback) => {
  const geocoder = new window.google.maps.Geocoder()
  const OK = window.google.maps.GeocoderStatus.OK

  return new Promise((resolve, reject) => {
    geocoder.geocode({ placeId }, (results, status) => {
      if (status !== OK) {
        // TODO: Remove callback support in the next major version.
        if (callback) {
          console.warn('Deprecated: Passing a callback to geocodeByAddress is deprecated')
          callback({ status }, null, results)
          return
        }
        reject(status)
      }

      // TODO: Remove callback support in the next major version.
      if (callback) {
        const latLng = {
          lat: results[0].geometry.location.lat(),
          lng: results[0].geometry.location.lng()
        }
        console.warn('Deprecated: Passing a callback to geocodeByPlaceId is deprecated')
        callback(null, latLng, results)
      }
      resolve(results)
    })
  })
}

export const getLatLngDistMiles = (lat1, lng1, lat2, lng2) => {
  const radlat1 = Math.PI * lat1 / 180
  const radlat2 = Math.PI * lat2 / 180
  const theta = lng1 - lng2
  const radtheta = Math.PI * theta / 180
  let dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta)
  dist = Math.acos(dist)
  dist = dist * 180 / Math.PI
  dist = dist * 60 * 1.1515
  return dist
}

export const getCoordsFromAddress = adr => {
  console.log(adr)
  const API_KEY = process.env.GOOGLE_MAPS_KEY
  return axios
    .get(`https://maps.googleapis.com/maps/api/geocode/json?address=${adr}&key=${API_KEY}`)
    .then(res => {
      console.log(res.data.results[0].geometry.location)
      return res.data.results[0].geometry.location
    })
    .catch(err => console.error(err))
}

export const makeMarker = (latLng, place) => {
  return latLng && place ? {
    position: latLng,
    title: place.formatted_address || place.name,
    animation: 'drop',
    onClick: () => { console.log('clicked') }
  } : {}
}

export const normalizeRegionInputs = (region, seoItem) => {
  if (seoItem.filterType === 'state') {
    if (normalize(region) === normalize(seoItem.name)) {
      return true
    }
  } else if (seoItem.filterType === 'city') {
    const lowAlpha = input => input.toLowerCase().replace(/[a-z]/g, '')
    if (lowAlpha(region) === lowAlpha(seoItem)) {
      return true
    }
  } else {
    return false
  }
}