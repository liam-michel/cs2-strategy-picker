import { initTRPC } from '@trpc/server'
import superjson from 'superjson'
import { ZodError } from 'zod'

import { ConflictError } from '../../common/error/errors'
import { DomainError } from '../../common/error/errors'
import type { AppContext } from '../context'

export type createTRPCRouterReturn = ReturnType<typeof createTRPCRouter>

export function createTRPCRouter() {
  const t = initTRPC.context<AppContext>().create({
    transformer: superjson,
    errorFormatter({ shape, error }) {
      const originalError = error.cause?.cause || error.cause

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

      // <--- Add this console.error here
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
    if (!ctx.user) {
      throw new Error('Unauthorized')
    }
    return next({
      ctx: {
        // Don't spread ctx - it brings back user: User | null
        user: ctx.user, // This is now User (not null)
        auth: {
          userId: ctx.user.id,
        },
      },
    })
  })

  const isAdmin = t.middleware(({ ctx, next }) => {
    // Now TypeScript should know ctx.user is User
    if (!ctx.user || ctx.user.role !== 'ADMIN') {
      throw new Error('Forbidden: Admins only')
    }
    return next()
  })

  const baseProcedure = t.procedure.use(async ({ ctx, next }) => {
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
