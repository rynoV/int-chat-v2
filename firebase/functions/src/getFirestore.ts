import admin, { ServiceAccount } from 'firebase-admin'
import { serviceAccount } from './firebase-admin-key'

export function getFirestore() {
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as ServiceAccount),
    })
  }
  return admin.firestore()
}

export const firestore = getFirestore()
