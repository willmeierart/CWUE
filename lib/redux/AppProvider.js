import React from 'react'
import { Provider } from 'react-redux'
import Store from './Store'

import App from '../../components/App'

const AppProvider = ({ children, title, url }) => (
  <Provider store={Store}>
    <App url={url} title={title}>
      {children}
    </App>
  </Provider>
)

export default AppProvider
