import { setupTestDB, firestorePreTest, firestoreTeardown } from './helpers'

describe('Firestore Rules', () => {
    beforeEach(async () => {
        await firestorePreTest()
    })

    afterAll(async () => {
        await firestoreTeardown()
    })

    test('Secure by default', async () => {
        const db = await setupTestDB(null)
        const docRef = db.collection('testCol').doc('testDoc')
        await expect(docRef.set({ test: 'test1' })).toDeny()
    })
})
