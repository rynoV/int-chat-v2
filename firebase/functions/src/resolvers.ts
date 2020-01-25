import { IResolvers } from 'graphql-tools'

export const resolvers: IResolvers<any, {}> = {
  Query: {
    async hello() {
      return 'Hello World'
    },
  },
}
