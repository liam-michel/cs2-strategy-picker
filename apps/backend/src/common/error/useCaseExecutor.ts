import { DatabaseError } from 'pg'
import type { Logger } from 'pino'

import { DomainError, InternalServerError } from './errors'

type UseCaseExecutorDeps = {
  logger: Logger
}

export type UseCaseExecutor = ReturnType<typeof createUseCaseExecutor>

export function createUseCaseExecutor({ logger }: UseCaseExecutorDeps) {
  return {
    execute: async function <TOutput>(name: string, useCasePromise: Promise<TOutput>): Promise<TOutput> {
      const startTime = Date.now()
      try {
        logger.info({ msg: 'Executing use case', name })
        const result = await useCasePromise
        const duration = Date.now() - startTime
        logger.info({ msg: 'Use case executed successfully', name, duration })
        return result
      } catch (error) {
        if (error instanceof DomainError) {
          logger.warn({ err: error, name }, 'Domain error in use case')
          throw error
        }

        if (error instanceof DatabaseError) {
          logger.error({ err: error, name }, 'Unhandled database error - consider handling in service layer')
          throw new InternalServerError('An unexpected database error occurred', { cause: error })
        }

        logger.error({ err: error, name }, 'Unexpected error in use case')
        throw new InternalServerError('An unexpected error occurred', { cause: error })
      }
    },
  }
}
