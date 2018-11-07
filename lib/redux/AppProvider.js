import React from 'react'
import { Provider } from 'react-redux'
import AppWrapper from '../../components/AppWrapper'

// import Layout from '../../components/layout/LayoutHOC'
// const AppProvider = ({ children, title, url, store }) => <Provider store={store}>{children}</Provider>
// export default Layout(AppProvider)

const AppProvider = ({ children, title, url, store }) => (
	<Provider store={store}>
		<AppWrapper url={url} title={title}>
			{children}
		</AppWrapper>
	</Provider>
)

export default AppProvider
