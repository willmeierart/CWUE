import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { graphql, compose } from 'react-apollo'
import { homePage } from '../../lib/apollo/queries'
import { getUserLocation } from '../../lib/redux/actions'
import { binder, checkAllQueriesError } from '../../lib/_utils'
import WithApolloLoader from '../hoc/WithApolloLoader'
import Logo from '../layout/Logo'
import FastPassCallout from './FastPassCallout'

class HomeWrapper extends Component {
  constructor (props) {
    super(props)
    binder(this, [])
  }

  componentDidMount () {
    const { userLocation, onGetUserLocation } = this.props
    if (userLocation !== 'denied') {
      onGetUserLocation(window.location.pathname)
    }
    // checkAllQueriesError(['homePage'])
  }

  render () {
    return (
      <div className='outer-wrapper'>
        <div className='inner-wrapper'>
          <section className='header-content'>
            <div className='logo-wrapper'>
              <Logo isHomepage />
            </div>
            <div className='fastpass-wrapper'>
              <FastPassCallout />
            </div>
          </section>
        </div>
        <style jsx>{`
          .header-content {
            position: absolute;
            top: 0;
            width: calc(100vw - 4em);
            background: red;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            z-index: -1;
            padding: 2em;
            padding-top: 100px;
          }
          .logo-wrapper {
            margin: 1em;
          }
        `}</style>
      </div>
    )
  }
}

function mapStateToProps (state) {
  const { location: { userLocation } } = state
  return {
    userLocation
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
