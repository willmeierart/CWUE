import React, { Component } from 'react'
import ResultsList from '../ResultsList'
import { binder } from '../../../lib/_utils'

export default class Results extends Component {
  constructor (props) {
    super(props)
    binder(this, ['pickLocation'])
  }

  componentDidMount () {
    // this.props.setActiveResults()
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
    console.log(location)
    if (typeof location === 'string') {
      this.props.onSetActiveLocation(location)
    } else if (typeof location === 'object' && location.name) {
      this.props.onSetActiveLocation(location.name)
    } else {
      console.log('error picking location')
    }
  }

  render () {
    const { children, activeResults, searchPhrase, url: { query: { spec } } } = this.props
    const Title = children[0]
    const SearchBar = children[1]
    const Map = children[2]
    const formatQS = qs => {
      const splitta = qs.split('-')
      // splitta.reduce((a, b) => {}, [])
      return splitta.map(wd => {
        // const firstCap = wd[0].toUpperCase()
        // const rest = wd.substring(1, wd.length)
        // return [firstCap, rest].join('')
        return wd.toUpperCase()
      }).join(', ')
    }
    const locationsNear = searchPhrase
      ? `Locations Near ${searchPhrase}`
      : spec
        ? `Locations Near ${formatQS(spec)}`
        : 'Locations'
    return (
      <section className='template-wrapper'>
        <div className='title-wrapper'>{ Title }</div>
        <section className='content-wrapper'>
          <div className='col col-left'>
            <h2 className='locations-near content'>
              { locationsNear }
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
