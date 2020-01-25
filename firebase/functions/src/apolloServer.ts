import { ApolloServer } from 'apollo-server-express'

import { typeDefs } from './schema'
import { resolvers } from './resolvers'

const dev = process.env.FUNCTIONS_EMULATOR

export const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: !!dev,
  playground: !!dev,
})
