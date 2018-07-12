import { withRouter } from "next/router";
import React, { Component } from 'react'
import AppProvider from '../lib/redux/AppProvider'
import HomeWrapper from '../components/_home-global/HomeWrapper'
import withData from '../lib/apollo/withData'

class HomePage extends Component {
  render () {
    return (
      <AppProvider url={this.props.router} title='Home'>
        <div>
          <HomeWrapper url={this.props.router} />
        </div>
        <style jsx>{`
        `}</style>
      </AppProvider>
    );
  }
}

export default withRouter(withData(HomePage));
