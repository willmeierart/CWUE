import React, { Component } from 'react'
import PropTypes from 'prop-types'
import UserLocationManager from './UserLocationManager'
import ResultsList from './ResultsList'
import { binder } from '../../../../lib/_utils'

// this view particularly has a lot going on, so it gets its own folder

class Results extends Component {
  constructor (props) {
    super(props)
    this.state = {
      locationsNearPhrase: ''
    }
    binder(this, ['pickLocation', 'setLocationsNearPhrase'])
  }

  componentDidMount () {
    console.warn('COMPONENT DID MOUNT', this.props)
    const { url: { query: { spec } } } = this.props
    if (spec === 'my-location') {
      console.log(spec)
      this.props.onMakeUserLocationPage(true) // for SSR nav to my-location route
    }
    if (this.props.isUserLocationPage || spec === 'my-location') {
      this.setLocationsNearPhrase(true)
    } else {
      this.setLocationsNearPhrase()
    }
  }
  // shouldComponentUpdate (nextProps) {
  //   if (this.props.activeResults !== nextProps.activeResults) {
  //     return true
  //   }
  //   return false
  // }
  componentDidUpdate () {

  }

  pickLocation (location) {
    if (typeof location === 'string') {
      this.props.onSetActiveLocation(location)
    } else if (typeof location === 'object' && location.name) {
      this.props.onSetActiveLocation(location.name)
    } else {
      console.log('error picking location')
    }
  }

  setLocationsNearPhrase (isMyLocationPage) { // switcher for message at top of page
    const {
      activeResults,
      searchPhrase,
      url: { query: { spec } },
      onSetUserNotification,
      userLocation,
      promisePendingStatus
    } = this.props
    const hasResults = activeResults.length > 0

    const formatQS = qs => {
      const splitta = qs.split('-')
      return splitta.map(wd => wd.toUpperCase()).join(' ') // parse search from url into usable phrase
    }

    console.log('checking usernotification: ', 'hasResults - ', hasResults, 'searchPhrase - ', searchPhrase, 'spec - ', spec, 'userlocation - ', userLocation, 'promisePendingStatus', promisePendingStatus)
    const defaultErr = 'Please browse this list of all our locations:'
    if (isMyLocationPage) {
      if (hasResults) {
        console.log('mylocation has results')

        onSetUserNotification({ alert: '', color: '' })
        this.setState({ locationsNearPhrase: 'Locations near me' })
      } else {
        console.log('mylocation no results')

        // showAllLocationsOnErr()
        if (!promisePendingStatus) {
          onSetUserNotification({
            alert: 'Sorry, looks like there are no nearby locations',
            color: 'red'
          })
        } else {
          // setTimeout(this.setLocationsNearPhrase, 1000)
          return
        }
        this.setState({ locationsNearPhrase: `There are no nearby locations. ${defaultErr}` })
      }
    } else {
      if (searchPhrase) {
        if (hasResults) {
          console.log('searchphrase has results')

          onSetUserNotification({ alert: '', color: '' })
          this.setState({ locationsNearPhrase: `Locations near ${searchPhrase}` })
        } else {
          console.log('searchphrase no results')
          if (!promisePendingStatus) {
            onSetUserNotification({
              alert: `Sorry, looks like there are no locations near ${searchPhrase}`,
              color: 'red'
            })
          } else {
            // setTimeout(this.setLocationsNearPhrase, 1000)
            return
          }
          this.setState({ locationsNearPhrase: `There are no locations near ${searchPhrase}. ${defaultErr}` })
        }
      } else {
        if (spec) {
          if (hasResults) {
            console.log('no searchphrase has spec has results')

            onSetUserNotification({ alert: '', color: '' })
            this.setState({ locationsNearPhrase: `Locations near ${formatQS(spec)}` })
          } else {
            console.log('no searchphrase has spec no results')

            // showAllLocationsOnErr()
            if (!promisePendingStatus) {
              onSetUserNotification({
                alert: `Sorry, looks like there are no locations near ${formatQS(spec)}`,
                color: 'red'
              })
            } else {
              setTimeout(this.setLocationsNearPhrase, 1000)
              return
            }
            this.setState({ locationsNearPhrase: `There are no locations near ${formatQS(spec)}. ${defaultErr}` })
          }
        }
      }
    }
  }

  render () {
    const {
      children,
      activeResults,
      staticLocationList
    } = this.props
    const hasResults = activeResults.length > 0
    const Title = children[0]
    const SearchBar = children[1]
    const Map = children[2]

    return (
      <section className='template-wrapper'>
        <div className='title-wrapper'>{ Title }</div>
        <section className='content-wrapper'>
          <div className='col col-left'>
            <h2 className='locations-near content'>
              { this.state.locationsNearPhrase }
              <hr />
            </h2>
            <div className='results-container content'>
              <ResultsList results={hasResults ? activeResults : staticLocationList} pickLocation={this.pickLocation} />
            </div>
          </div>
          <div className='col col-right'>
            <div className='search-wrapper content'>{ SearchBar }</div>
            <div className='map-wrapper content'>{ Map }</div>
          </div>
        </section>
        <style jsx>{`
          section {
            width: 100%;
            box-sizing: border-box;
            position: relative;
            display: flex;
            justify-content: center;
          }
          .template-wrapper {
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 2vw;
          }
          .content-wrapper {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
          }
          .col {
            width: 48%;
            display: flex;
            flex-direction: column;
          }
          .col-left {
            align-items: flex-start;
          }
          .col-right {
            align-items: center;
          }
          .locations-near {
            margin: 0;
          }
          .content {
            width: 100%;
          }
          .map-wrapper {
            display: flex;
            justify-content: center;
          }
        `}</style>
      </section>
    )
  }
}

Results.propTypes = {
  userLocation: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  userIsLocated: PropTypes.bool.isRequired,
  onMakeUserLocationPage: PropTypes.func.isRequired,
  isUserLocationPage: PropTypes.bool,
  onSetActiveLocation: PropTypes.func.isRequired,
  onGetUserLocation: PropTypes.func.isRequired,
  activeResults: PropTypes.array.isRequired,
  setActiveResults: PropTypes.func.isRequired,
  searchPhrase: PropTypes.string.isRequired,
  showAllLocationsOnErr: PropTypes.func.isRequired,
  url: PropTypes.object.isRequired,
  onSetUserNotification: PropTypes.func.isRequired,
  promisePendingStatus: PropTypes.bool.isRequired
}

export default UserLocationManager(Results)
