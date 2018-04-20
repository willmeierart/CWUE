import React, { Component } from 'react'
import PropTypes from 'prop-types'
import LocateMeBtn from '../LocateMeBtn'

export default class Initial extends Component {
  componentDidMount () {
    const { userLocation, onGetUserLocation, userIsLocated } = this.props
    if (userLocation !== 'denied' && !userIsLocated) {
      onGetUserLocation(window.location.pathname)
    }
  }
  render () {
    const { children, userIsLocated, userLocation, onMakeUserLocationPage } = this.props
    const Title = children[0]
    const SearchBar = children[1]
    const Map = children[2]
    const showBtn = typeof userLocation === 'object' && !userIsLocated

    return (
      <div className='template-wrapper'>
        <div className='title-wrapper'>{ Title }</div>
        <div className='search-wrapper'>{ SearchBar }</div>
        { showBtn && <LocateMeBtn onMakeUserLocationPage={onMakeUserLocationPage} /> }
        <div className='map-wrapper'>
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
  userLocation: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  userIsLocated: PropTypes.bool.isRequired,
  onMakeUserLocationPage: PropTypes.func.isRequired
}
