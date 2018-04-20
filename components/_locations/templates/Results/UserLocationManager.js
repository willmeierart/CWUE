import React, { Component } from 'react'
import UserLocationLoader from './UserLocationLoader'
import { binder } from '../../../../lib/_utils'

export default function UserLocationManager (ComposedComponent) {
  class WrappedComponent extends Component {
    constructor (props) {
      super(props)
      this.state = { isUserLocationPage: false }
      binder(this, ['determineComponentState', 'makeUserLocationPage'])
    }

    componentDidMount () {
      console.log(this.props)
      if (this.props.userIsLocated && this.props.searchPhrase === '') {
        this.makeUserLocationPage(true)
      }
    }

    makeUserLocationPage (isUserLocationPage) {
      this.setState({ isUserLocationPage })
    }

    determineComponentState () {
      switch (true) {
        case !this.state.isUserLocationPage :
          return <ComposedComponent makeUserLocationPage={this.makeUserLocationPage} {...this.props} />
        case this.state.isUserLocationPage && this.props.userIsLocated :
          return <ComposedComponent isUserLocationPage {...this.props} />
        case this.state.isUserLocationPage && !this.props.userIsLocated :
          return <UserLocationLoader {...this.props} />
        default :
          return <ComposedComponent makeUserLocationPage={this.makeUserLocationPage} {...this.props} />
      }
    }

    render () {
      return this.determineComponentState()
    }
  }
  return WrappedComponent
}
