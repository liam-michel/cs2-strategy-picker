import { IdSchema } from '@cs2monorepo/shared'

import type { createTRPCRouterReturn } from '../../server/routers/trpc'
type UserRouterDeps = {
  t: createTRPCRouterReturn
}
export function createUserRouter(deps: UserRouterDeps) {
  const { t } = deps
  const { router, protectedProcedure } = t
  return router({
    findById: protectedProcedure.input(IdSchema).query(({ ctx, input }) => {
      return ctx.executor.execute('findById', ctx.useCases.user.findByid(input))
    }),
  })
}
