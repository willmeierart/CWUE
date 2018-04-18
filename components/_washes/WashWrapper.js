import React, { Component } from 'react'
// import ExecutionEnvironment from 'exenv'
import PropTypes from 'prop-types'
import equal from 'deep-equal'
import WashesTable from './WashesTable'
import WashFastPassCallout from './WashFastPassCallout'
import { binder } from '../../lib/_utils'
import washData from '../../lib/_data/washData'

class AboutWrapper extends Component {
  constructor (props) {
    super(props)
    this.state = {
      type: 'exterior-washes', // exterior-washes || full-service || express-detail || fleet-accounts || specials
      menuHeaderText: 'EXTERIOR CAR WASH MENU',
      pageHeaderText: 'EXTERIOR WASHES'
    }
    binder(this, ['setPageStateViaUrl', 'updateText', 'updateAll'])
  }
  componentDidMount () {
    this.updateAll()
  }

  componentDidUpdate (prevProps) {
    if (!equal(this.props.url, prevProps.url)) {
      this.updateAll()
    }
  }

  setPageStateViaUrl () {
    const { query: { title }, asPath, pathname } = this.props.url
    const splitPath = asPath.split(`${pathname}/`)
    const backupTitle = splitPath[splitPath.length - 1]
    const thisTitle = title || 'exterior-washes'
    this.setState({ type: thisTitle })
  }

  async updateAll () {
    await this.setPageStateViaUrl()
    this.updateText()
  }

  updateText () {
    const typeKey = this.state.type.split('-')[0]
    const { pageHeaderText, menuHeaderText, descriptionText } = washData[typeKey]
    this.setState({
      pageHeaderText,
      menuHeaderText,
      descriptionText
    })
  }

  render () {
    const { type } = this.state
    const typeKey = type.split('-')[0] || 'exterior'
    return (
      <div className='outer-wrapper'>
        <div className='inner-wrapper'>
          <div className='top-block'>
            <div className='col-2 col-left'>
              <h1>{ this.state.pageHeaderText }</h1>
              <div className='type-description'>{ this.state.descriptionText }</div>
            </div>
            <div className='col-2 col-right'>
              <WashFastPassCallout />
            </div>
          </div>
          <div className='menu-divider'>
            <span className='line' />
            <h2> { this.state.menuHeaderText } </h2>
            <span className='line' />
          </div>
          <div className='table-wrapper'>
            <WashesTable data={washData[typeKey].washes} />
          </div>
        </div>
        {/* <TemplateSwitcher template={template} /> */}
        <style jsx>{`
          .inner-wrapper {
            margin: 2vw;
          }
          .top-block {
            width: 100%;
            position: relative;
            display: flex;
            align-items: flex-end;
          }
          .col-2 {
            width: 50%;
            padding: 2vw;
          }
          .menu-divider {
            width: 100%;
            display: flex;
            justify-content: space-around;
            align-items: center;
          }
          .line {
            width: 20%;
            border-top: 1px solid black;
          }
        `}</style>
      </div>
    )
  }
}

AboutWrapper.propTypes = {
  url: PropTypes.object.isRequired
}

export default AboutWrapper
