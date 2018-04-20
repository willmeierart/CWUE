import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ImperativeRouter from '../../../../server/ImperativeRouter'
import { binder } from '../../../../lib/_utils'

class ResultsErrorView extends Component {
  constructor (props) {
    super(props)
    binder(this, ['countDown', 'setLocationTitle'])
    this.state = {
      countdown: 3,
      locationTitle: ''
    }
    this.timeout = null
  }

  async componentDidMount () {
    if (this.props.url.query.spec) {
      this.setLocationTitle()
    }
    await this.props.onGetUserLocation('deny') 
    this.countDown()
  }

  setLocationTitle () {
    const { url } = this.props
    const { query } = url
    const qs = query.spec && query.spec !== ''
      ? query.spec
      : url.asPath.split('/results/')[1]
    const split1 = qs.split('-')
    const locationTitle = split1.map((wd, i) => {
      return wd.split('').map((letter, j) => {
        if (j === 0) {
          return letter.toUpperCase()
        }
        return letter
      }).join('')
    }).join(' ')
    this.setState({ locationTitle })
  }

  countDown () {
    const { countdown } = this.state
    this.interval = setTimeout(async () => {
      console.log(countdown)
      if (countdown === 0) {
        clearTimeout(this.timeout)
        await ImperativeRouter.push('locations', { state: 'initial', spec: '' }, false)
        this.props.setTemplate('initial')
      } else {
        this.setState({ countdown: countdown - 1 }, this.countDown)
      }
    }, 1000)
  }

  render () {
    return (
      <div className='outer-wrapper'>
        <div className='inner-wrapper'>
          <div className='apology'>Sorry! There are no locations near { this.state.locationTitle }</div>
          <div className='redirect'>Redirecting you in {this.state.countdown}...</div>
        </div>
        <style jsx>{`
          .outer-wrapper{}
          .inner-wrapper{}
        `}</style>
      </div>
    )
  }
}

ResultsErrorView.propTypes = {
  url: PropTypes.object.isRequired,
  setTemplate: PropTypes.func.isRequired,
  onGetUserLocation: PropTypes.func.isRequired
}

export default ResultsErrorView
