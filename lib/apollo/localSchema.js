import { makeExecutableSchema } from 'graphql-tools'
import store from 'store'

const typeDefs = `
  schema {
    query: Query
    mutation: Mutation
  }
  type Query {
    queryLog: QueryLog
  }
  type QueryLog {
    entry: [QueryLogEntry!]!
  }
  type QueryLogEntry {
    name: String
  }
  type Mutation {
    appendToLog(name: String!): QueryLog
  }
`

const resolvers = {
  Query: {
    queryLog: () => {
      return JSON.parse(store.queryLog)
    }
  },
  Mutation: {
    appendToLog: ({ name }) => {
      const logEntry = { name }
      const queryLogArray = JSON.parse(store.queryLog)

      queryLogArray.push(logEntry)
      store.queryLog = JSON.stringify(queryLogArray)

      return JSON.parse(store.queryLog)
    }
  },
  QueryLog: {
    entry: data => {
      return data
    }
  },
  QueryLogEntry: {
    name: data => {
      return data.name
    }
  }
}

const localSchema = makeExecutableSchema({
  typeDefs: [typeDefs],
  resolvers
})

export default localSchema
