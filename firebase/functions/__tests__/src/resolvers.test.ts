import getFirestore from '../../src/getFirestore'
import * as firebase from '@firebase/testing'

import {
    firestorePreTest,
    firestoreTeardown,
    setupAdminTestDB,
    projectId,
} from '../helpers'

import { resolvers } from '../../src/resolvers'
import { Store } from '../../src/store'

jest.mock('../../src/getFirestore')
const mockedGetFirestore: jest.Mock = getFirestore as jest.Mock
mockedGetFirestore.mockImplementation(() => {
    return firebase.initializeAdminApp({ projectId }).firestore()
})

describe('Resolvers', () => {
    beforeEach(async () => {
        await firestorePreTest()
    })

    afterAll(async () => {
        await firestoreTeardown()
    })

    test('Writes Hello World', async () => {
        await (resolvers.Query as {
            hello(arg0: any, arg1: any, arg2: any): any
        }).hello(null, null, {
            dataSources: { store: new Store('Hello') },
        })
        const db = await setupAdminTestDB()
        const docRef = db.collection('Hello').doc('World')
        await expect(docRef.get()).toAllow()
        const docSnap = await docRef.get()
        expect(docSnap.data()).toEqual({ helloWorld: '!' })
    })
})
