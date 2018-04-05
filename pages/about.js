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
      <AppProvider url={this.props.url} title='About'>
        <TopSubMenu url={this.props.url} />
        <AboutWrapper url={this.props.url} />
        <style jsx>{``}</style>
      </AppProvider>
    )
  }
}

export default withData(About)
