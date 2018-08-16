import {
  CHECK_IF_MOBILE,
  CHECK_IF_IE,
  CHECK_BROWSER,
  GET_VP_DIMS,
  LOCK_ORIENTATION,
  SET_USER_NOTIFICATION,
  OPEN_MOBILE_MENU
} from '../actions/types'

const initialState = {
  isMobile: null,
  mobileSideways: null,
  isIE: null,
  browser: null,
  vpDims: {
    width: null,
    height: null
  },
  screenLocked: false,
  userNotification: {
    alert: '',
    color: ''
  },
  menuOpen: false
}

export default function functionalReducer (state = initialState, action) {
  const defaultAction = key => {
    const newState = { ...state }
    newState[key] = action.payload
    return newState
  }

  switch (action.type) {
    case CHECK_IF_MOBILE: {
      return defaultAction('isMobile')
    }
    case OPEN_MOBILE_MENU: {
      return defaultAction('menuOpen')
    }
    case CHECK_IF_IE: {
      return defaultAction('isIE')
    }
    case CHECK_BROWSER: {
      return defaultAction('browser')
    }
    case GET_VP_DIMS: {
      const newDims = { ...state.dims }
      const { width, height } = action.payload
      let mobileSideways = false
      if (typeof window.orientation !== 'undefined' && window.orientation !== 0) {
        newDims.width = height
        newDims.height = width
        mobileSideways = true
      } else {
        newDims.width = width
        newDims.height = height
      }
      const newState = { ...state }
      newState.dims = newDims
      newState.mobileSideways = mobileSideways
      return newState
    }
    case LOCK_ORIENTATION: {
      return defaultAction('screenLocked')
    }
    case SET_USER_NOTIFICATION: {
      const newState = { ...state }
      const newNotification = { ...state.userNotification }
      newNotification.alert = action.payload.alert
      newNotification.color = action.payload.color
      newState.userNotification = newNotification
      return newState
    }
    default:
      return state
  }
}
