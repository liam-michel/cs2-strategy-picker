import { Prisma } from '@prisma/client'
import type { Logger } from 'pino'
type UseCaseFunction<TInput, TOutput> = (input: TInput) => Promise<TOutput>

type UseCaseExecutorDeps = {
  logger: Logger
}

export function createUseCaseExecutor({ logger }: UseCaseExecutorDeps) {
  return {
    execute: async function <TInput, TOutput>(
      name: string,
      useCase: UseCaseFunction<TInput, TOutput>,
      input: TInput,
    ): Promise<TOutput> {
      const startTime = Date.now()
      try {
        logger.info({ msg: 'Executing use case', name, input })
        const result = await useCase(input)
        const duration = Date.now() - startTime
        logger.info({ msg: 'Use case executed successfully', name, duration })
        return result
      } catch (error) {
        logger.error({ msg: `Error executing use case: ${name}`, error })
        //check for prisma errors
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          switch (error.code) {
            case 'P2002': // Unique constraint failed
              throw new Error(`A record with this ${error.meta?.target || 'value'} already exists`, { cause: error })
            case 'P2003': // Foreign key constraint failed
              throw new Error(`Related record not found for ${error.meta?.field_name || 'unknown field'}`, {
                cause: error,
              })
            case 'P2025': // Record not found
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
