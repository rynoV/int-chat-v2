import { IResolvers } from 'graphql-tools'
import { Store } from './store'

interface IContext {
    dataSources: {
        store: Store
    }
}

export const resolvers: IResolvers<any, IContext> = {
    Query: {
        async hello(_, __, { dataSources }) {
            const { store } = dataSources
            store.writeHelloWorld()
            return 'Hello World'
        },
    },
}
