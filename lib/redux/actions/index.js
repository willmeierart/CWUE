import {
  CHECK_IF_MOBILE,
  CHECK_IF_IE,
  CHECK_BROWSER,
  GET_VP_DIMS,
  LOCK_ORIENTATION,
  GET_USER_LOCATION,
  SET_MAP_CENTER,
  SET_MAP_MARKERS,
  SET_MAP_ZOOM,
  SET_ACTIVE_LOCATION,
  SET_ACTIVE_RESULTS_LIST,
  SET_LOC_PAGE_STATE,
  SET_ACTIVE_SEARCH_PHRASE,
  SET_STATIC_LOC_LIST
} from './types'

export const checkIfMobile = () => async dispatch => {
  const bool = window !== undefined && window.orientation !== undefined
  dispatch({
    type: CHECK_IF_MOBILE,
    payload: bool,
    center: 'denver',
    markers: []
  })
}

export const checkIfIE = () => async dispatch => {
  const check = () => {
    if (typeof window !== 'undefined') {
      return window.navigator.userAgent.indexOf('indows') !== -1
    } else { setTimeout(() => { check() }, 200) }
  }
  dispatch({
    type: CHECK_IF_IE,
    payload: check()
  })
}

export const checkBrowser = () => async dispatch => {
  let browser = 'unknown'
  if ((navigator.userAgent.indexOf('Opera') || navigator.userAgent.indexOf('OPR')) !== -1) {
    browser = 'opera'
  } else if (navigator.userAgent.indexOf('chrome') !== -1) {
    browser = 'chrome'
  } else if (navigator.userAgent.indexOf('Safari') !== -1) {
    browser = 'safari'
  } else if (navigator.userAgent.indexOf('Firefox') !== -1) {
    browser = 'firefox'
  } else if ((navigator.userAgent.indexOf('MSIE') !== -1) || (!!document.documentMode === true)) {
    browser = 'ie'
  }
  dispatch({
    type: CHECK_BROWSER,
    payload: browser
  })
}

export const getVPDims = () => async dispatch => {
  const getDims = () => {
    if (typeof window !== 'undefined') {
      // window.addEventListener('resize', () => { getDims() })
      return {
        width: window.innerWidth,
        height: window.innerHeight
      }
    } else { setTimeout(() => { getDims() }, 200) }
  }
  console.log(getDims())
  dispatch({
    type: GET_VP_DIMS,
    payload: getDims()
  })
}

export const lockOrientation = () => async dispatch => { // experimental, will not work yet in anything except firefox mobile
  const lockScreen = () => {
    if (typeof window !== 'undefined') {
      const { screen } = window
      screen.lockOrientationUniversal = screen.lockOrientation || screen.mozLockOrientation || screen.msLockOrientation
      if (typeof screen.lockOrientationUniversal !== 'undefined') {
        return screen.lockOrientationUniversal('portrait-primary')
      } else {
        console.log('"screen.lockOrientation" not supported on this device')
        return false
      }
    } else {
      setTimeout(() => { lockScreen() }, 500)
    }
  }
  dispatch({
    type: LOCK_ORIENTATION,
    payload: lockScreen()
  })
}

export const getUserLocation = path => async dispatch => {
  const geoSuccess = position => {
    console.log(position)
    const center = { lat: position.coords.latitude, lng: position.coords.longitude }
    dispatch({
      type: GET_USER_LOCATION,
      payload: center
    })
  }
  const geoError = error => {
    if (error.code === 1 || (error.code === 3 && path.indexOf('location') !== -1)) {
      // alert('Geolocation denied')
      dispatch({
        type: GET_USER_LOCATION,
        payload: 'denied'
      })
    } else {
      dispatch({
        type: GET_USER_LOCATION,
        payload: null
      })
    }
  }
  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(geoSuccess, geoError)
  } else {
    dispatch({
      type: GET_USER_LOCATION,
      payload: null
    })
  }
}

export const setMapCenter = center => async dispatch => {
  dispatch({
    type: SET_MAP_CENTER,
    payload: center
  })
}

export const setMapMarkers = markers => async dispatch => {
  const markerBackupProps = {
    animation: 'drop',
    title: '',
    label: '',
    onClick: () => { console.log('clicked') }
  }
  console.log(markers)
  const formattedMarkers = markers.reduce((allMarkers, thisMarker) => {
    if (thisMarker.position) {
      const safeMarker = { ...markerBackupProps, ...thisMarker }
      if (safeMarker.animation === 'drop') { safeMarker.animation = window.google.maps.Animation.DROP }
      else { safeMarker.animation = window.google.maps.Animation.BOUNCE }
      allMarkers.push(safeMarker)
    }
    return allMarkers
  }, [])

  dispatch({
    type: SET_MAP_MARKERS,
    payload: formattedMarkers
  })
}

export const setMapZoom = zoom => async dispatch => {
  dispatch({
    type: SET_MAP_ZOOM,
    payload: zoom
  })
}

export const setActiveLocation = loc => async dispatch => {
  dispatch({
    type: SET_ACTIVE_LOCATION,
    payload: loc
  })
}

export const setActiveResultsList = list => async dispatch => {
  dispatch({
    type: SET_ACTIVE_RESULTS_LIST,
    payload: list
  })
}

export const setActiveSearchPhrase = phrase => async dispatch => {
  dispatch({
    type: SET_ACTIVE_SEARCH_PHRASE,
    payload: phrase
  })
}

export const setLocPageState = pageState => async dispatch => {
  dispatch({
    type: SET_LOC_PAGE_STATE,
    payload: pageState
  })
}

export const setStaticLocList = locObj => async dispatch => {
  const flatList = Object.keys(locObj).reduce((list, key) => {
    const formatName = objName => objName.substring(1, objName.length).split('_').join(' ')
    locObj[key].allLocations.forEach(loc => {
      const brand = formatName(key)
      if (list.indexOf(loc) === -1) list.push({ ...loc, brand })
    })
    return list
  }, [])
  dispatch({
    type: SET_STATIC_LOC_LIST,
    payload: flatList
  })
}
