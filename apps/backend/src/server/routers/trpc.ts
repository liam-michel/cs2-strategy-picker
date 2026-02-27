import { initTRPC, TRPCError } from '@trpc/server'
import superjson from 'superjson'
import { ZodError } from 'zod'

import { ConflictError, DomainError } from '../../common/error/errors'
import type { AppContext } from '../context'

export type createTRPCRouterReturn = ReturnType<typeof createTRPCRouter>

const DOMAIN_TO_TRPC: Record<string, TRPCError['code']> = {
  NOT_FOUND: 'NOT_FOUND',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  CONFLICT: 'CONFLICT',
  BAD_REQUEST_VALIDATION: 'BAD_REQUEST',
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
}

export function createTRPCRouter() {
  const t = initTRPC.context<AppContext>().create({
    transformer: superjson,
    errorFormatter({ shape, error }) {
      const originalError = error.cause instanceof DomainError ? error.cause : error.cause?.cause

      if (originalError instanceof ConflictError) {
        return {
          ...shape,
          data: {
            ...shape.data,
            code: originalError.code,
            message: originalError.message,
            fieldErrors: Object.fromEntries(
              (originalError.fields ?? []).map((field) => [field, originalError.message]),
            ),
          },
        }
      }

      if (originalError instanceof DomainError) {
        return {
          ...shape,
          data: {
            ...shape.data,
            code: originalError.code,
            message: originalError.message,
            stack: process.env.NODE_ENV === 'development' ? originalError.stack : undefined,
          },
        }
      }

      if (originalError instanceof ZodError) {
        return {
          ...shape,
          message: 'Invalid Input',
          data: {
            ...shape.data,
            code: 'VALIDATION_ERROR',
          },
        }
      }

      return {
        ...shape,
        data: {
          ...shape.data,
          stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
        },
      }
    },
  })

  const isAuthed = t.middleware(({ ctx, next }) => {
    if (!ctx.user) throw new Error('Unauthorized')
    return next({
      ctx: {
        user: ctx.user,
        auth: { userId: ctx.user.id },
      },
    })
  })

  const isAdmin = t.middleware(({ ctx, next }) => {
    if (!ctx.user || ctx.user.role !== 'ADMIN') throw new Error('Forbidden: Admins only')
    return next()
  })

  const baseProcedure = t.procedure.use(async ({ ctx, next }) => {
    try {
      const result = await next()

      if (!result.ok) {
        const error = result.error
        if (error.code === 'BAD_REQUEST' && error.cause instanceof ZodError) {
          ctx.logger.warn({ issues: error.cause.issues, code: error.code }, 'input validation failed')
        } else if (error.code === 'CONFLICT' || error.code === 'NOT_FOUND' || error.code === 'UNAUTHORIZED') {
          ctx.logger.warn({ err: error, code: error.code }, 'procedure failed')
        } else {
          ctx.logger.error({ err: error, code: error.code }, 'procedure failed')
        }
      }

      return result
    } catch (error) {
      if (error instanceof DomainError) {
        throw new TRPCError({
          code: DOMAIN_TO_TRPC[error.code] ?? 'INTERNAL_SERVER_ERROR',
          message: error.message,
          cause: error,
        })
      }
      throw error
    }
  })

  const publicProcedure = baseProcedure
  const protectedProcedure = baseProcedure.use(isAuthed)
  const adminProcedure = t.procedure.use(isAuthed).use(isAdmin)

  return {
    router: t.router,
    publicProcedure,
    protectedProcedure,
    adminProcedure,
  }
}
