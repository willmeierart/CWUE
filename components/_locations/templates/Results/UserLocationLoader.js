import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { binder } from '../../../../lib/_utils'

class UserLocationLoader extends Component {
  constructor (props) {
    super(props)
    // binder(this, [''])
  }

  componentDidMount () {}

  render () {
    return (
      <div className='outer-wrapper'>
        <div className='inner-wrapper'> attempting to geolocate you! </div>
        <style jsx>{`
          .outer-wrapper, .inner-wrapper {
            width: 100%;
            height: 100%;
          }
          .inner-wrapper{
            display: flex;
            justify-content: center;
            align-items: center;
          }
        `}</style>
      </div>
    )
  }
}

UserLocationLoader.propTypes = {}

export default UserLocationLoader