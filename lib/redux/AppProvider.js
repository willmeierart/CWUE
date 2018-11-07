import React from 'react'
import { Provider } from 'react-redux'
import AppWrapper from '../../components/AppWrapper'

const AppProvider = ({ children, title, url, store }) => (
	<Provider store={store}>
		<AppWrapper url={url} title={title}>
			{children}
		</AppWrapper>
	</Provider>
)

export default AppProvider
