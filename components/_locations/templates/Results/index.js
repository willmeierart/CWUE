import React, { Component } from 'react'
import PropTypes from 'prop-types'
import UserLocationManager from './UserLocationManager'
import ResultsList from './ResultsList'
import { binder } from '../../../../lib/_utils'

class Results extends Component {
  constructor (props) {
    super(props)
    binder(this, ['pickLocation'])
  }

  componentDidMount () {
    const { url: { query: { spec } } } = this.props
    if (spec === 'my-location') {
      this.props.onMakeUserLocationPage(true)
    }
  }
  shouldComponentUpdate (nextProps) {
    if (this.props.activeResults !== nextProps.activeResults) {
      return true
    }
    return false
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

  render () {
    const { children,
      activeResults,
      searchPhrase,
      url: { query: { spec } },
      isUserLocationPage,
      staticLocationList,
      onSetUserNotification
    } = this.props
    const hasResults = activeResults.length > 0
    const Title = children[0]
    const SearchBar = children[1]
    const Map = children[2]

    const formatQS = qs => {
      const splitta = qs.split('-')
      return splitta.map(wd => wd.toUpperCase()).join(' ')
    }

    const locationsNearPhrase = () => {
      const defaultErr = 'Please browse this list of all our locations:'
      if (isUserLocationPage || spec === 'my-location') {
        if (hasResults) {
          return 'Locations near me'
        } else {
          // showAllLocationsOnErr()
          onSetUserNotification({
            alert: 'Sorry, looks like there are no nearby locations',
            color: 'red'
          })
          return `There are no nearby locations. ${defaultErr}`
        }
      } else {
        if (searchPhrase) {
          if (hasResults) {
            return `Locations near ${searchPhrase}`
          } else {
            onSetUserNotification({
              alert: `Sorry, looks like there are no locations near ${searchPhrase}`,
              color: 'red'
            })
            return `There are no locations near ${searchPhrase}. ${defaultErr}`
          }
        } else {
          if (spec) {
            if (hasResults) {
              return `Locations near ${formatQS(spec)}`
            } else {
              // showAllLocationsOnErr()
              onSetUserNotification({
                alert: `Sorry, looks like there are no locations near ${formatQS(spec)}`,
                color: 'red'
              })
              return `There are no locations near ${formatQS(spec)}. ${defaultErr}`
            }
          }
        }
      }
    }
    return (
      <section className='template-wrapper'>
        <div className='title-wrapper'>{ Title }</div>
        <section className='content-wrapper'>
          <div className='col col-left'>
            <h2 className='locations-near content'>
              { locationsNearPhrase() }
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
  onSetUserNotification: PropTypes.func.isRequired
}

export default UserLocationManager(Results)
