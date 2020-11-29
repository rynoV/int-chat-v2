import { ApolloServer } from 'apollo-server-express'

import { typeDefs } from './schema'
import { resolvers } from './resolvers'
import { Store } from './store'

const dev = process.env.FUNCTIONS_EMULATOR

export const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    dataSources() {
        return {
            store: new Store('Hello'),
        }
    },
    introspection: !!dev,
    playground: !!dev,
})
