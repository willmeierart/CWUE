import React, { Component } from 'react'
import Loader from 'react-loaders'

export default function WithApolloLoader (ComposedComponent) {
  class WrappedComponent extends Component {
    render () {
      return (
        <div className='with-apollo-loader' style={{ height: '100%' }}>
          { this.props.data.loading && !this.props.data.error
            ? (
              <div className='loader-wrapper'>
                <Loader type='line-spin-fade-loader' active />
              </div>
            ) : (
              <ComposedComponent {...this.props} />
            )
          }
        </div>
      )
    }
  }
  return WrappedComponent
}
