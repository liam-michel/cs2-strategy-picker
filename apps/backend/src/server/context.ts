import type { FastifyRequest } from 'fastify'
import { Logger } from 'pino'

import { createStrategyUseCases } from '../services/strategy/strategy.application'
import { Storage } from '../storage/storage'

export type User = {
  id: string
  role: 'admin' | 'user'
  username: string
  email: string
}

export type AppContext = {
  user: User | null
  logger: Logger
  useCases: {
    strategy: ReturnType<typeof createStrategyUseCases>
  }
}

export async function createContext({
  request,
  logger,
  storage,
}: {
  request: FastifyRequest
  logger: Logger
  storage: Storage
}): Promise<AppContext> {
  const requestLogger = logger.child({
    requestId: request.id,
    url: request.url,
    method: request.method,
  })
  let user: User | null = null
  let contextLogger = requestLogger
  const authHeader = request.headers['authorization']
  if (authHeader) {
    try {
      const token = authHeader.replace('Bearer ', '')
      //TODO: Implement real auth here later
      user = {
        id: token,
        role: 'user',
        username: 'testuser',
        email: 'test@email.com',
      }
      contextLogger = requestLogger.child({ userId: user.id, username: user.username })
    } catch (error) {
      contextLogger.warn({ error }, 'Failed to parse auth token, proceeding with unauthenticated context')
    }
  }
  //create all use cases and add to context
  const useCases = {
    strategy: createStrategyUseCases({ storage, logger: contextLogger }),
  }
  return {
    user,
    logger: contextLogger,
    useCases,
  }
}
