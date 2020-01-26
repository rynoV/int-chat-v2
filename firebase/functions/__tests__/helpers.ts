import * as firebase from '@firebase/testing'
import { readFileSync } from 'fs'

export const projectId = `test-project-${Date.now()}`
const firebasePort = require('../../firebase.json').emulators.firestore.port
const port = firebasePort ? firebasePort : 8080
export const coverageUrl = `http://localhost:${port}/emulator/v1/projects/${projectId}:ruleCoverage.html`

const rules = readFileSync('../firestore.rules', 'utf8')
const allowAllRules = readFileSync('../allowAll.rules', 'utf8')

type firestore = firebase.firestore.Firestore

interface IMockData {
    collection: string
    doc: string
    data: object
}

/**
 * Put data in the database, ignoring rules.
 * @param {Firestore} db - Database to seed.
 * @param {IMockData[]} data - Data to seed.
 */
async function seedTestDB(db: firestore, data: IMockData[]) {
    await firebase.loadFirestoreRules({
        projectId,
        rules: allowAllRules,
    })

    for (const { collection, doc, data: itemData } of data) {
        await db
            .collection(collection)
            .doc(doc)
            .set(itemData)
    }

    await firebase.loadFirestoreRules({
        projectId,
        rules,
    })
}

/**
 * Initialize a test app and return firestore. Seed database ignoring
 * rules if data is given
 * @param {object} auth - Parameter description.
 * @param {IMockData[]?} data - Parameter description.
 * @returns {Firestore} Test database.
 */
export async function setupTestDB(
    auth: object,
    data?: IMockData[]
): Promise<firestore> {
    const db = firebase.initializeTestApp({ projectId, auth }).firestore()

    if (data) {
        await seedTestDB(db, data)
    }

    return db
}

/**
 * Initialize a test admin app and return firestore. Seed database ignoring
 * rules if data is given
 * @param {IMockData[]?} data - Parameter description.
 * @returns {Firestore} Test database.
 */
export async function setupAdminTestDB(data?: IMockData[]): Promise<firestore> {
    const db = firebase.initializeAdminApp({ projectId }).firestore()

    if (data) {
        await seedTestDB(db, data)
    }

    return db
}

export async function firestorePreTest() {
    // Clear the database between tests
    await firebase.clearFirestoreData({ projectId })
}

export async function firestoreTeardown() {
    await Promise.all(firebase.apps().map(app => app.delete()))
    console.log(`View rule coverage information at ${coverageUrl}\n`)
}

export {}
declare global {
    namespace jest {
        interface Matchers<R> {
            toAllow(): Promise<R>
            toDeny(): Promise<R>
        }
    }
}

expect.extend({
    async toAllow(x) {
        let pass = false
        try {
            await firebase.assertSucceeds(x)
            pass = true
        } catch (err) {}

        return {
            pass,
            message: () =>
                'Expected Firebase operation to be allowed, but it was denied',
        }
    },
    async toDeny(x) {
        let pass = false
        try {
            await firebase.assertFails(x)
            pass = true
        } catch (err) {}
        return {
            pass,
            message: () =>
                'Expected Firebase operation to be denied, but it was allowed',
        }
    },
})
