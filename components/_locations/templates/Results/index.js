import React, { Component } from 'react'
import PropTypes from 'prop-types'
import UserLocationManager from './UserLocationManager'
import ResultsList from './ResultsList'
import ResultsErrorView from './ResultsErrorView'
import ImperativeRouter from '../../../../server/ImperativeRouter'
import { binder } from '../../../../lib/_utils'

class Results extends Component {
  constructor (props) {
    super(props)
    binder(this, ['pickLocation'])
  }

  componentDidMount () {
    // this.props.setActiveResults()
    const { url: { query: { spec } }, userLocation, activeResults } = this.props
    if (!spec || spec === 'my-location') {
      // if (typeof userLocation !== 'object') {
      //   ImperativeRouter.push('locations', { state: 'initial' }, true)
      // }
    }
    console.log(this.props)
  }
  shouldComponentUpdate (nextProps) {
    // console.log(this.props)
    if (this.props.activeResults !== nextProps.activeResults) {
      return true
    }
    return false
  }
  // componentWillUnmount () { this.props.setActiveResults() }

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
    const { children, activeResults, searchPhrase, url: { query: { spec } }, isUserLocationPage, userIsLocated, setTemplate, onGetUserLocation} = this.props
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
      if (isUserLocationPage) {
        if (hasResults) {
          return 'Locations near me'
        } else {
          return `There are no nearby locations. ${defaultErr}`
        }
      } else {
        if (searchPhrase) {
          if (hasResults) {
            return `Locations near ${searchPhrase}`
          } else {
            return `There are no locations near ${searchPhrase}. ${defaultErr}`
          }
        } else {
          if (spec) {
            if (hasResults) {
              return `Locations near ${formatQS(spec)}`
            } else {
              return `There are no locations near ${formatQS(spec)}. ${defaultErr}`
            }
          }
        }
      }
    }
    const renderView = userIsLocated || hasResults
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
              <ResultsList results={activeResults} pickLocation={this.pickLocation} />
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
  isUserLocationPage: PropTypes.bool,
  onSetActiveLocation: PropTypes.func.isRequired,
  onGetUserLocation: PropTypes.func.isRequired,
  activeResults: PropTypes.array.isRequired,
  setActiveResults: PropTypes.func.isRequired,
  searchPhrase: PropTypes.string.isRequired,
  url: PropTypes.object.isRequired
}

export default UserLocationManager(Results)
