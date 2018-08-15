import React, { Component } from 'react'
import UserLocationLoader from './UserLocationLoader'
import { binder } from '../../../../lib/_utils'

export default function UserLocationManager (ComposedComponent) {
  class WrappedComponent extends Component {
    constructor (props) {
      super(props)
      this.state = { isUserLocationPage: false }
      binder(this, ['determineComponentState'])
    }

    componentDidMount () {
      if (this.props.userIsLocated && this.props.searchPhrase === '') {
        this.props.onMakeUserLocationPage(true)
      }
    }

    determineComponentState () { // manages whether view is of a specific search's results or user location results
      const { isUserLocationPage, userIsLocated, onMakeUserLocationPage, userLocation } = this.props
      switch (true) {
        case !isUserLocationPage :
          return <ComposedComponent makeUserLocationPage={onMakeUserLocationPage} {...this.props} />
        case isUserLocationPage :
          if (userIsLocated || userLocation === 'denied' || userLocation === 'unavailable') {
            return <ComposedComponent isUserLocationPage {...this.props} />
          }
          return <UserLocationLoader {...this.props} />
        default :
          return <ComposedComponent makeUserLocationPage={onMakeUserLocationPage} {...this.props} />
      }
    }

    render () {
      return this.determineComponentState()
    }
  }
  return WrappedComponent
}
