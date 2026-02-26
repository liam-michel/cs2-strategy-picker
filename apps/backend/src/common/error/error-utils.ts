import { TRPCError } from '@trpc/server'
import { DatabaseError } from 'pg'
import type { Logger } from 'pino'

import { ConflictError, NotFoundError, ValidationError } from './errors'
import { InternalServerError } from './errors'
import { DomainError } from './errors'
const DOMAIN_TO_TRPC: Record<string, TRPCError['code']> = {
  NOT_FOUND: 'NOT_FOUND',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  CONFLICT: 'CONFLICT',
  BAD_REQUEST_VALIDATION: 'BAD_REQUEST',
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
}

type UseCaseExecutorDeps = {
  logger: Logger
}

export type UseCaseExecutor = ReturnType<typeof createUseCaseExecutor>

function parseFieldFromDetail(detail?: string): string[] {
  if (!detail) return []
  const match = /Key \(([^)]+)\)=/.exec(detail)
  if (!match) return []
  return match[1].split(', ').map((f) => f.replace(/"/g, '').trim())
}
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
          throw new TRPCError({
            code: DOMAIN_TO_TRPC[error.code] ?? 'INTERNAL_SERVER_ERROR',
            message: error.message,
            cause: error, // preserve the original for the error formatter
          })
        }

        if (error instanceof DatabaseError) {
          switch (error.code) {
            case '23505': {
              const fields = parseFieldFromDetail(error.detail)
              const conflictError = new ConflictError(
                `A record with this ${fields[0] ?? 'field'} already exists`,
                fields,
              )
              logger.warn({ err: error, name, fields }, 'Conflict error in use case')
              throw new TRPCError({
                code: 'CONFLICT',
                message: conflictError.message,
                cause: conflictError,
              })
            }
            case '23503': {
              const fields = parseFieldFromDetail(error.detail)
              const notFoundError = new NotFoundError(`Related record not found for ${fields[0] ?? 'field'}`)
              logger.warn({ err: error, name, fields }, 'Foreign key violation in use case')
              throw new TRPCError({
                code: 'NOT_FOUND',
                message: notFoundError.message,
                cause: notFoundError,
              })
            }
            case '23502': {
              const fields = parseFieldFromDetail(error.detail)
              const validationError = new ValidationError(`Missing required field: ${fields[0] ?? 'unknown'}`)
              logger.warn({ err: error, name, fields }, 'Not null violation in use case')
              throw new TRPCError({
                code: 'BAD_REQUEST',
                message: validationError.message,
                cause: validationError,
              })
            }

            default:
              logger.error({ err: error, name }, 'Unhandled database error')
              throw new InternalServerError('A database error occurred')
          }
        }

        logger.error({ err: error, name }, 'Unexpected error in use case')
        throw new InternalServerError('An unexpected error occurred')
      }
    },
  }
}
