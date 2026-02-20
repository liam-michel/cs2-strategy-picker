//composition root

import pino from 'pino'

import { createBetterAuthSingleton } from './server/auth.js'
import { createTRPCRouter } from './server/routers/trpc.js'
import { createStrategyRouter } from './services/strategy/strategy.router.js'
import { createPrismaClient } from './storage/db-client.js'
import { createStorage } from './storage/storage.js'
import { parseEnv } from './utils/envConfig.js'

export async function setupApp() {
  //instantiate logger
  const logger = pino({ level: 'info' })
  //parse env variables
  const envVars = parseEnv({ logger })
  //instantiate router
  const t = createTRPCRouter()
  //database client
  const dbClient = createPrismaClient(envVars.DATABASE_URL)
  //declare better-auth singleton
  const auth = createBetterAuthSingleton({
    db: dbClient,
    baseURL: envVars.BETTERAUTH_URL,
    trustedOrigin: envVars.FRONTEND_URL,
  })
  //storage object initialized
  const storage = createStorage(dbClient)
  //use-case executor, to be used by all use-cases for consistent error handling

  //strategy router
  const strategyRouter = createStrategyRouter({
    t,
  })

  const appRouter = t.router({
    strategy: strategyRouter,
  })
  return {
    t,
    logger,
    storage,
    appRouter,
    auth,
  }
}

type SetupAppReturn = Awaited<ReturnType<typeof setupApp>>
export type AppRouter = SetupAppReturn['appRouter']
