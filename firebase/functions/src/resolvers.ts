import { firestore } from './getFirestore'

export const resolvers = {
  Query: {
    async hello() {
      console.log(firestore.collection)
      const collection = firestore.collection('testing')
      const docRef = collection.doc('test')
      await docRef.set({ test: 'testing2' })
      return 'Hello World'
    },
  },
}
