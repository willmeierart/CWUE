import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ResultsList from './Results/ResultsList'
import { binder } from '../../../lib/_utils'

export default class Region extends Component {
  constructor (props) {
    super(props)
    binder(this, ['pickLocation'])
  }
  
  componentDidMount () {
    console.log(this.props)
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
    const { children, activeResults } = this.props
    const Title = children[0]
    const SearchBar = children[1]
    const Map = children[2]
    return (
      <section className='template-wrapper'>
        <div className='title-wrapper'>{ Title }</div>
        <section className='content-wrapper'>
          <div className='col col-left'>
            <h2 className='locations-near content'>
              Locations Near [search]
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

Region.propTypes = {

}
