import { Prisma } from '@prisma/client'
import type { Logger } from 'pino'

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
        logger.error({ msg: `Error executing use case: ${name}`, error })
        //check for prisma errors
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          switch (error.code) {
            case 'P2002':
              throw new Error(`A record with this ${error.meta?.target || 'value'} already exists`, { cause: error })
            case 'P2003':
              throw new Error(`Related record not found for ${error.meta?.field_name || 'unknown field'}`, {
                cause: error,
              })
            case 'P2025':
              throw new Error('The requested record was not found', { cause: error })
            default:
              throw new Error('A database error occurred', { cause: error })
          }
        }
        throw new Error('An unexpected error occurred', { cause: error })
      }
    },
  }
}
