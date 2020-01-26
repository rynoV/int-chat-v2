import { DataSource, DataSourceConfig } from 'apollo-datasource'
import getFirestore from './getFirestore'

interface IContextProps {}

export class Store extends DataSource {
    // @ts-ignore
    private context: IContextProps | undefined
    private readonly collection: FirebaseFirestore.CollectionReference<
        FirebaseFirestore.DocumentData
    >

    constructor(collection: string) {
        super()
        const firestore = getFirestore()
        this.collection = firestore.collection(collection)
    }

    /**
     * This is a function that gets called by ApolloServer when being setup.
     * This function gets called with the datasource config including things
     * like caches and context. We'll assign this.context to the request context
     * here, so we can know about the user making requests
     */
    public initialize(config: DataSourceConfig<IContextProps>) {
        this.context = config.context
    }

    public async writeHelloWorld() {
        this.collection.doc('World').set({ helloWorld: '!' })
    }
}
