import { initTRPC } from '@trpc/server'

import { DomainError } from '../../common/error/errors'
import type { AppContext } from '../context'

export type createTRPCRouterReturn = ReturnType<typeof createTRPCRouter>

export function createTRPCRouter() {
  const t = initTRPC.context<AppContext>().create({
    errorFormatter({ shape, error }) {
      const originalError = error.cause?.cause || error.cause
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

  const protectedProcedure = t.procedure.use(isAuthed)
  const adminProcedure = t.procedure.use(isAuthed).use(isAdmin)

  return {
    router: t.router,
    protectedProcedure,
    adminProcedure,
  }
}
