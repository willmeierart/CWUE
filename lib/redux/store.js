import { compose, createStore, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import { createLogger } from 'redux-logger'
// import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
// import { logger } from 'redux-logger'
import promise from 'redux-promise'
import thunk from 'redux-thunk'
import reducers from './reducers'
import { CHECK_IF_IE, CHECK_IF_MOBILE, CHECK_SW_AVAILABLE, GET_VP_DIMS, SET_MAP_ZOOM } from './actions/types'

// import {} from './actions/types'

const persistConfig = {
	key: 'root',
	storage
}

const logger = createLogger({
	predicate: (getState, action) => {
		return (
			action.type !== CHECK_IF_IE &&
			action.type !== CHECK_IF_MOBILE &&
			action.type !== CHECK_SW_AVAILABLE &&
			action.type !== GET_VP_DIMS &&
			action.type !== SET_MAP_ZOOM
		)
	}
})

const middlewares = [ thunk, promise ]

if (process.env.NODE_ENV === 'development') {
	middlewares.push(logger)
}

const reduxDevTools =
	typeof window !== 'undefined' ? window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__() : a => a

const store = compose(applyMiddleware(...middlewares))(createStore)(reducers, reduxDevTools)

export const initializeStore = (initialState = {}) =>
	createStore(reducers, composeWithDevTools(applyMiddleware(...middlewares)))

export default store
