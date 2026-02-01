import { initTRPC } from '@trpc/server'

import type { AppContext } from '../context'

export function createTRPCRouter() {
  const t = initTRPC.context<AppContext>().create()

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
    if (!ctx.user || ctx.user.role !== 'admin') {
      throw new Error('Forbidden: Admins only')
    }
    return next()
  })

  const protectedProcedure = t.procedure.use(isAuthed)
  const adminProcedure = t.procedure.use(isAuthed).use(isAdmin)

  return {
    router: t,
    protectedProcedure,
    adminProcedure,
  }
}
