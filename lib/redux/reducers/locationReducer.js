import {
  GET_USER_LOCATION,
  SET_MAP_ZOOM,
  SET_MAP_MARKERS,
  SET_MAP_CENTER,
  SET_ACTIVE_LOCATION,
  SET_ACTIVE_RESULTS_LIST,
  SET_LOC_PAGE_STATE,
  SET_ACTIVE_SEARCH_PHRASE
} from '../actions/types'

const initialState = {
  userLocation: null,
  mapMarkers: [],
  mapZoom: 4,
  mapCenter: 'geographic center of the united states',
  activeLocation: null,
  activeResults: [],
  activeSearchPhrase: null,
  pageState: 'initial'
}

export default function locationReducer (state = initialState, action) {
  const defaultAction = key => {
    const newState = { ...state }
    newState[key] = action.payload
    return newState
  }
  const flattenLocName = name => name.toLowerCase().replace(/([ -])/g, '')

  switch (action.type) {
    case GET_USER_LOCATION:
      return defaultAction('userLocation')
    case SET_MAP_CENTER:
      return defaultAction('mapCenter')
    case SET_MAP_ZOOM:
      return defaultAction('mapZoom')
    case SET_MAP_MARKERS: {
      const newMapMarkers = [ ...state.mapMarkers ]
      const newState = { ...state }
      newMapMarkers.concat(action.payload)
      newState.mapMarkers = newMapMarkers
      return newState
    }
    case SET_LOC_PAGE_STATE:
      return defaultAction('pageState')
    case SET_ACTIVE_RESULTS_LIST:
      return defaultAction('activeResults')
    case SET_ACTIVE_LOCATION: {
      const newState = { ...state }
      if (newState.activeResults.length > 0) {
        if (action.payload === null) {
          return defaultAction('activeLocation')
        } else {
          const activeLoc = newState.activeResults.find(result => {
            console.log(result.name, action.payload)
            return flattenLocName(result.name) === flattenLocName(action.payload)
          })
          newState.activeLocation = activeLoc || null
          return newState
        }
      }
      return state
    }
    case SET_ACTIVE_SEARCH_PHRASE:
      return defaultAction('activeSearchPhrase')
    default:
      return state
  }
}
