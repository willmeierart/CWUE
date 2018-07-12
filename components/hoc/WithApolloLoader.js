import React, { Component } from 'react'
import Loader from 'react-loaders'
import ApolloError from '../ui/ApolloError'

// render loader if apollo taking forever to load

export default function WithApolloLoader (ComposedComponent) {
  class WrappedComponent extends Component {
    render () {
      // const { queries, data } = this.props
      // const conditions = queries
      //   ? queries.reduce((bool, query) => {
      //     Object.keys(this.props).forEach(prop => console.log(JSON.stringify(this.props[prop])))
      //     console.log(query)
      //     if (this.props[query].loading &&
      //       !this.props[query].error) { bool = true }
      //   }, false)
      //   : this.props.data.loading && !this.props.data.error
      if (this.props.data.error) return <ApolloError />
      return (
        <div className='with-apollo-loader' style={{ height: '100%' }}>
          { this.props.data.loading
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
