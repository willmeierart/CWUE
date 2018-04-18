import { connect } from 'react-redux'
import { graphql, compose } from 'react-apollo'
import withData from '../../lib/withData'

const ConnectReduxApollo = (
  mapStateToProps,
  mapDispatchToProps,
  queries,
  ComposedComponent
) => {
  console.log(this.props)
  const composedQueries = Object.keys(queries).map(query =>
    graphql(query, { name: `${query}` })
  )

  return connect(mapStateToProps, mapDispatchToProps)(
    withData(compose(composedQueries)(ComposedComponent))
  )
}

export default ConnectReduxApollo
