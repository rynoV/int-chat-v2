import { https } from 'firebase-functions'
import express from 'express'
import cors from 'cors'

import { apolloServer } from './apolloServer'

function configureServer() {
  const app = express()

  app.use(cors())

  apolloServer.applyMiddleware({ app })

  return app
}

const server = configureServer()

export const api = https.onRequest(server)
