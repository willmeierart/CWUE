import React, { Component } from 'react'
import AppProvider from '../lib/redux/AppProvider'
import HomeWrapper from '../components/_home'
import withData from '../lib/apollo/withData'

class HomePage extends Component {
  render () {
    return (
      <AppProvider url={this.props.url} title='Home'>
        <HomeWrapper url={this.props.url} />
      </AppProvider>
    );
  }
}

export default withData(HomePage)
