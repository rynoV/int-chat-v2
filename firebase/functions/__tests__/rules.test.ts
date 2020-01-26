import * as firebase from '@firebase/testing'

import { projectId, coverageUrl, setup } from './helpers'

describe('Firestore Rules', () => {
    beforeEach(async () => {
        // Clear the database between tests
        await firebase.clearFirestoreData({ projectId })
    })

    afterAll(async () => {
        await Promise.all(firebase.apps().map(app => app.delete()))
        console.log(`View rule coverage information at ${coverageUrl}\n`)
    })

    test('Secure by default', async () => {
        const db = await setup(null)
        const docRef = db.collection('testCol').doc('testDoc')
        await expect(docRef.set({ test: 'test1' })).toDeny()
    })
})
