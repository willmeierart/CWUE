import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default class Initial extends Component {
  componentDidMount () {
    const { userLocation, onGetUserLocation } = this.props
    if (userLocation !== 'denied') {
      onGetUserLocation(window.location.pathname)
    }
  }
  render () {
    const { children } = this.props
    const Title = children[0]
    const SearchBar = children[1]
    const Map = children[2]

    return (
      <div className='template-wrapper'>
        <div className='title-wrapper'>{ Title }</div>
        <div className='search-wrapper'>{ SearchBar }</div>
        <div className='map-wrapper'>
          {/* <img alt='placeholder map' src='/static/images/placeholderMap.jpg' /> */}
          { Map }
        </div>
        <style jsx>{`
          .template-wrapper {
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          .map-wrapper {
            width: 96vw;
            position: relative;
          }
          img {
            width: 100%;
            border: 1px solid black;
            border-radius: 3px;
          }
        `}</style>
      </div>
    )
  }
}

Initial.propTypes = {
  onGetUserLocation: PropTypes.func.isRequired,
  userLocation: PropTypes.oneOfType([PropTypes.object, PropTypes.string])
}
