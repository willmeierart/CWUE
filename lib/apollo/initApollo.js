import { ApolloClient } from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import fetch from 'node-fetch'

let apolloClient = null
const TEST_LOCAL = false

if (!process.browser) {
	global.fetch = fetch
}

function createClient (initialState, client) {
	const HttpLinkData = {
		uri:
			client === 'locations'
				? TEST_LOCAL ? process.env.NEXT_PUBLIC_GRAPHQL_PROXY_LOCAL : process.env.NEXT_PUBLIC_GRAPHQL_PROXY // this is for the multi-endpoint woven-schema for the locations page
				: process.env.NEXT_PUBLIC_GRAPHCMS_ENDPOINT_PRIMARY,
		fetch
	}
	return new ApolloClient({
		connectToDevTools: process.browser,
		ssrMode: !process.browser, // Disables forceFetch on the server (so queries are only run once)
		link: new HttpLink(HttpLinkData),
		cache: new InMemoryCache().restore(initialState || {})
	})
}

export default function initApollo (initialState, client) {
	if (!process.browser || client === 'locations') {
		// if we do run into problems down the road with the double-client provider, this is probably what's causing it...
		return createClient(initialState, client)
	}

	if (!apolloClient) {
		apolloClient = createClient(initialState, client)
	}
	return apolloClient
}
