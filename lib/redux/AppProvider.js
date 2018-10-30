import React from 'react'
import { Provider } from 'react-redux'
// import Store from './Store'
import App from '../../components/App'

const AppProvider = ({ children, title, url, store }) => (
	<Provider store={store}>
		<App url={url} title={title}>
			{children}
		</App>
	</Provider>
)

export default AppProvider
