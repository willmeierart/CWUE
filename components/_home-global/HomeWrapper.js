import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getUserLocation } from '../../lib/redux/actions'
import { binder } from '../../lib/_utils'
import Logo from '../layout/Logo'
import FastPassCallout from './FastPassCallout'

class HomeWrapper extends Component {
  constructor (props) {
    super(props)
    binder(this, [])
  }

  componentDidMount () {
    console.log(this.props)
    const { userLocation, onGetUserLocation } = this.props
    if (userLocation !== 'denied') {
      onGetUserLocation(window.location.pathname)
    }
  }

  render () {
    return (
      <div className='outer-wrapper'>
        <div className='inner-wrapper'>
          <section className='header-content'>
            <div className='logo-wrapper'>
              <Logo isHomepage />
            </div>
            <div className='fastpass-wrapper'>
              <FastPassCallout />
            </div>
          </section>
        </div>
        <style jsx>{`
          .header-content {
            position: absolute;
            top: 0;
            width: 100vw;
            background: red;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            z-index: 0;
            padding: 2em;
            padding-top: 100px;
          }
          .logo-wrapper {
            margin: 1em;
          }
        `}</style>
      </div>
    )
  }
}

function mapStateToProps (state) {
  const { location: { userLocation } } = state
  return {
    userLocation
  }
}

function mapDispatchToProps (dispatch) {
  return {
    onGetUserLocation: path => dispatch(getUserLocation(path))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeWrapper)
