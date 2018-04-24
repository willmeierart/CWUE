import {
  GET_USER_LOCATION,
  SET_MAP_ZOOM,
  SET_ALL_MARKERS,
  SET_MAP_CENTER,
  SET_ACTIVE_LOCATION,
  SET_ACTIVE_RESULTS_LIST,
  SET_LOC_PAGE_STATE,
  SET_ACTIVE_SEARCH_PHRASE,
  SET_STATIC_LOC_LIST,
  MAKE_USER_LOCATION_PAGE
} from '../actions/types'

const initialState = {
  userLocation: {},
  userIsLocated: false,
  isUserLocationPage: false,
  allMarkers: [],
  mapZoom: 3,
  mapCenter: { lat: 39.8283459, lng: -98.57947969999998 }, // default of geographic center of US
  activeLocation: {},
  activeResults: [],
  activeSearchPhrase: '',
  pageState: 'initial',
  staticLocationList: []
}

export default function locationReducer (state = initialState, action) {
  const defaultAction = key => {
    const newState = { ...state }
    newState[key] = action.payload
    return newState
  }
  const flattenLocName = name => name.toLowerCase().replace(/([^a-z])/g, '')

  switch (action.type) {
    case GET_USER_LOCATION: {
      const newState = { ...state }
      newState.userLocation = action.payload
      console.log(action.payload)
      if (typeof action.payload === 'object' && action.payload.lat && action.payload.lng) {
        newState.userIsLocated = true
      }
      return newState
    }
    case SET_MAP_CENTER:
      return defaultAction('mapCenter')
    case SET_MAP_ZOOM:
      return defaultAction('mapZoom')
    case SET_ALL_MARKERS: {
      return defaultAction('allMarkers')
    }
    case SET_LOC_PAGE_STATE:
      return defaultAction('pageState')
    case SET_ACTIVE_RESULTS_LIST:
      return defaultAction('activeResults')
    case SET_ACTIVE_LOCATION: {
      const newState = { ...state }
      if (action.payload === null) {
        return defaultAction('activeLocation')
      } else {
        const activeLoc = newState.staticLocationList.find(result => {
          return flattenLocName(result.name) === flattenLocName(action.payload)
        })
        newState.activeLocation = activeLoc || null
        return newState
      }
    }
    case SET_ACTIVE_SEARCH_PHRASE:
      return defaultAction('activeSearchPhrase')
    case SET_STATIC_LOC_LIST:
      return defaultAction('staticLocationList')
    case MAKE_USER_LOCATION_PAGE:
      return defaultAction('isUserLocationPage')
    default:
      return state
  }
}
