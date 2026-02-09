//composition root

import pino from 'pino'

import { createUseCaseExecutor } from './common/error/error-utils.js'
import { createTRPCRouter } from './server/routers/trpc.js'
import { createStrategyRouter } from './services/strategy/strategy.router.js'
import { createPrismaClient } from './storage/db-client.js'
import { createStorage } from './storage/storage.js'

export async function setupApp() {
  //instantiate router
  const t = createTRPCRouter()
  //instantiate logger
  const logger = pino({ level: 'info' })
  //database client
  const dbClient = createPrismaClient('postgresql://invalid:invalid@localhost:5432/invalid')
  //storage object initialized
  const storage = createStorage(dbClient)
  //use-case executor, to be used by all use-cases for consistent error handling
  const executor = createUseCaseExecutor({ logger })

  //strategy router
  const strategyRouter = createStrategyRouter({
    t,
    executor,
  })

  const appRouter = t.router({
    strategy: strategyRouter,
  })
  return {
    t,
    logger,
    storage,
    appRouter,
  }
}
