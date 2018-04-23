import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { ApolloProvider, getDataFromTree } from 'react-apollo'
import Head from 'next/head'
import initApollo from './initApollo'
// import store from './redux/store'

// Gets the display name of a JSX component for dev tools
function getComponentDisplayName (Component) {
  return Component.displayName || Component.name || 'Component'
}

export default (ComposedComponent, client) => {
  return class WithData extends Component {
    static displayName = `WithData(${getComponentDisplayName(
      ComposedComponent
    )})`
    static propTypes = {
      serverState: PropTypes.object.isRequired
    }

    static async getInitialProps (ctx) {
      let serverState = {}

      // evaluate getInitialProps()
      let composedInitialProps = {}
      if (ComposedComponent.getInitialProps) {
        composedInitialProps = await ComposedComponent.getInitialProps(ctx)
      }

      // Running all queries in the tree extracting the data
      if (!process.browser) {
        const apollo = await initApollo(null, client)
        // url prop if any of our queries needs it
        const url = { query: ctx.query, pathname: ctx.pathname }

        try {
          // Run all GraphQL queries
          await getDataFromTree(
            <ApolloProvider client={apollo}>
              <ComposedComponent url={url} {...composedInitialProps} />
            </ApolloProvider>
          )
        } catch (error) {
          console.log('serverside ... handle this later ...');
        }

        Head.rewind()

        serverState = {
          apollo: {
            data: apollo.cache.extract()
          }
        }
      }

      return {
        serverState,
        ...composedInitialProps
      }
    }

    constructor (props) {
      super(props)
      this.apollo = initApollo(this.props.serverState, client)
    }

    render () {
      return (
        <ApolloProvider client={this.apollo}>
          <ComposedComponent {...this.props} />
        </ApolloProvider>
      )
    }
  }
}
