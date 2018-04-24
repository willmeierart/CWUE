import { compose, createStore, applyMiddleware } from 'redux'
import { createLogger } from 'redux-logger'
import promise from 'redux-promise'
import thunk from 'redux-thunk'
import reducers from './reducers'

import { // you're able to toggle off redux logs for actions by adding them here
  SET_STATIC_LOC_LIST,
  SET_LOC_PAGE_STATE,
  SET_ACTIVE_SEARCH_PHRASE,
  // SET_MAP_ZOOM,
  // SET_MAP_CENTER,
  GET_VP_DIMS,
  SET_ALL_MARKERS,
  SET_USER_NOTIFICATION,
  MAKE_USER_LOCATION_PAGE,
  SET_ACTIVE_RESULTS_LIST,
  GET_USER_LOCATION
} from './actions/types'

const logger = createLogger({
  predicate: (getState, action) => {
    return (
      action.type !== SET_STATIC_LOC_LIST &&
      action.type !== SET_LOC_PAGE_STATE &&
      action.type !== SET_ACTIVE_SEARCH_PHRASE &&
      // action.type !== SET_MAP_ZOOM &&
      // action.type !== SET_MAP_CENTER &&
      action.type !== GET_VP_DIMS &&
      action.type !== SET_ALL_MARKERS &&
      action.type !== MAKE_USER_LOCATION_PAGE &&
      action.type !== SET_ACTIVE_RESULTS_LIST &&
      action.type !== SET_USER_NOTIFICATION &&
      action.type !== GET_USER_LOCATION
    )
  }
})

const middlewares = [thunk, promise]

if (process.env.NODE_ENV === 'development') {
  middlewares.push(logger)
}

const reduxDevTools =
  typeof window !== 'undefined'
    ? window.__REDUX_DEVTOOLS_EXTENSION__ &&
      window.__REDUX_DEVTOOLS_EXTENSION__()
    : function (a) {
        return a
      }

const Store = compose(applyMiddleware(...middlewares))(createStore)(
  reducers,
  reduxDevTools
)

export default Store
