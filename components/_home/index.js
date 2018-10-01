import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { graphql, compose } from 'react-apollo'
import { Link } from 'next-url-prettifier'
import { Router } from '../../server/routes'
import { homePage } from '../../lib/apollo/queries'
import { getUserLocation } from '../../lib/redux/actions'
import { binder, checkAllQueriesError } from '../../lib/_utils'
import WithApolloLoader from '../hoc/WithApolloLoader'
import FastPassCallout from './FastPassCallout'
import StoryCallout from './StoryCallout'
import BrandLogosImage from './BrandLogosImage'

class HomeWrapper extends Component {
  constructor (props) {
    super(props)
    binder(this, ['handleMobileTopSec'])
  }

  componentDidMount () {
    const { userLocation, onGetUserLocation } = this.props
    if (userLocation !== 'denied') {
      onGetUserLocation(window.location.pathname)
    }
  }

  handleMobileTopSec () {
    if (this.props.isMobile) {
      return (
        <div className='top-section'>
          <div className='top-img'>
          </div>
          <div className='callouts'>
            <FastPassCallout />
            <StoryCallout />
          </div>
          <style jsx>{`
          .top-section {
            display: flex;
            flex-direction: column;
            width: 100%;
            margin-top: 1.5vw;
          }
          .callouts {
            display: flex;
          }
          .top-img {
            display: flex;
            flex-shrink: 0;
            height: 100%;
            background: var(--color-blue);
            width: 100vw;
            height: calc(50vw + 1.5vw);
          }
        `}</style>
        </div>
      )
    } else {
      return (
        <div className='top-section'>
          <div className='callouts'>
            <FastPassCallout />
            <StoryCallout />
          </div>
          <div className='top-img'>
          </div>
          <style jsx>{`
          .top-section {
            display: flex;
            width: 100%;
          }
          .callouts {
            display: flex;
            flex-direction: column;
          }
          .top-img {
            display: flex;
            flex-shrink: 0;
            width: 100%;
            height: 100%;
            background: var(--color-blue);
            margin: 1.5vw 0;
            width: 75vw;
            height: calc(50vw + 1.5vw);
          }
        `}</style>
        </div>
      )
    }
  }

  render () {
    return (
      <div className='outer-wrapper'>
        <div className='inner-wrapper'>
          { this.handleMobileTopSec() }
          <BrandLogosImage />
        </div>
        <style jsx>{`
          .outer-wrapper {
            width: 100vw;
          }
          .inner-wrapper {
            display: flex;
            flex-direction: column;
            width: 100vw;
          }
        `}</style>
      </div>
    )
  }
}

function mapStateToProps (state) {
  const { location: { userLocation }, env: { isMobile } } = state
  return {
    userLocation,
    isMobile
  }
}

function mapDispatchToProps (dispatch) {
  return {
    onGetUserLocation: path => dispatch(getUserLocation(path))
  }
}

export default compose(
  graphql(homePage)
)(
  connect(mapStateToProps, mapDispatchToProps)(
    WithApolloLoader(HomeWrapper)
  )
)

HomeWrapper.propTypes = {
  data: PropTypes.object.isRequired,
  onGetUserLocation: PropTypes.func.isRequired,
  userLocation: PropTypes.oneOfType([PropTypes.object, PropTypes.string])
}
