import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { ApolloProvider, getDataFromTree } from 'react-apollo'
import Head from 'next/head'
import initApollo from './initApollo'

// Gets the display name of a JSX component for dev tools
function getComponentDisplayName (Component) {
	return Component.displayName || Component.name || 'Component'
}

export default ComposedComponent => {
	// passing 'client' as an extra prop allows for the 'locations' page to use a different graphql endpoint than the rest of the site
	return class WithData extends Component {
		static displayName = `WithData(${getComponentDisplayName(ComposedComponent)})`
		static propTypes = {
			serverState: PropTypes.object.isRequired
		}

		static async getInitialProps (ctx) {
			let serverState = {}
			let composedInitialProps = {}
			if (ComposedComponent.getInitialProps) {
				composedInitialProps = await ComposedComponent.getInitialProps(ctx)
			}

			if (!process.browser) {
				const url = { query: ctx.query, pathname: ctx.pathname }
				const client = ctx.pathname && ctx.pathname.indexOf('location') !== -1

				console.log(client)

				const apollo = await initApollo(null, client) // passing client here

				try {
					await getDataFromTree(
						<ApolloProvider client={apollo}>
							<ComposedComponent url={url} {...composedInitialProps} />
						</ApolloProvider>
					)
				} catch (error) {
					console.log(error)
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
			const client = props.url.pathname && props.url.pathname.indexOf('location') !== -1
			this.apollo = initApollo(this.props.serverState, client) // and here
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
