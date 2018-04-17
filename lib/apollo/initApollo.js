import { ApolloClient } from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import fetch from 'node-fetch'

let apolloClient = null

if (!process.browser) {
  global.fetch = fetch
}

function createClient (initialState, client) {
  console.log(client)
  const HttpLinkData = {
    uri: client === 'locations'
      ? process.env.GRAPHQL_PROXY
      : process.env.GRAPHCMS_ENDPOINT_PRIMARY,
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
  // Make sure to create a new client for every server-side request so that data
  // isn't shared between connections (which would be bad)
  if (!process.browser || client === 'locations') {
    return createClient(initialState, client)
  }

  // Reuse client on the client-side
  if (!apolloClient) {
    apolloClient = createClient(initialState, client)
  }
  return apolloClient
}
