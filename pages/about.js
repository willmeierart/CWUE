import { withRouter } from "next/router";
import React, { Component } from 'react'
import AppProvider from '../lib/redux/AppProvider'
import AboutWrapper from '../components/_about/AboutWrapper'
import TopSubMenu from '../components/layout/TopSubMenu'
import withData from '../lib/apollo/withData'

class About extends Component {
  // static async getInitialProps (props) {
  //   console.log(props)
  //   return props
  // }
  render () {
    return (
      <AppProvider url={this.props.router} title='About'>
        <TopSubMenu url={this.props.router} />
        <AboutWrapper url={this.props.router} />
        <style jsx>{``}</style>
      </AppProvider>
    );
  }
}

export default withRouter(withData(About))
