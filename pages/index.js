import React, { Component } from 'react'
import AppProvider from '../lib/redux/AppProvider'
import HomeWrapper from '../components/_home-global/HomeWrapper'
import withData from '../lib/apollo/withData'

class HomePage extends Component {
  render () {
    return (
      <AppProvider url={this.props.url} title='Home'>
        <div>
          <HomeWrapper url={this.props.url} />
        </div>
        <style jsx>{`
        `}</style>
      </AppProvider>
    )
  }
}

export default withData(HomePage)
