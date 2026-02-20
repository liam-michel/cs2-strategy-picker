import { IdSchema, PaginationSchema } from '@cs2monorepo/shared'
import { AddStrategySchema } from '@cs2monorepo/shared'

import type { createTRPCRouterReturn } from '../../server/routers/trpc'
type StrategyRouterDeps = {
  t: createTRPCRouterReturn
}

export function createStrategyRouter(deps: StrategyRouterDeps) {
  const { t } = deps
  const { router, protectedProcedure } = t
  return router({
    getUsersStrategies: protectedProcedure.input(IdSchema).query(({ ctx, input }) => {
      return ctx.executor.execute('getUsersStrategies', ctx.useCases.strategy.getUsersStrategies(input))
    }),
    getUsersStrategiesPaginated: protectedProcedure
      .input(IdSchema.extend(PaginationSchema.shape))
      .query(({ ctx, input }) => {
        return ctx.executor.execute(
          'getUsersStrategiesPaginated',
          ctx.useCases.strategy.getUsersStrategiesPaginated(input),
        )
      }),
    createStrategy: protectedProcedure.input(AddStrategySchema).mutation(({ ctx, input }) => {
      return ctx.executor.execute(
        'createStrategy',
        ctx.useCases.strategy.createStrategy({
          ...input,
          userId: ctx.user.id,
        }),
      )
    }),
    softDeleteStrategy: protectedProcedure.input(IdSchema).mutation(({ ctx, input }) => {
      return ctx.executor.execute(
        'softDeleteStrategy',
        ctx.useCases.strategy.softDeleteStrategy({
          id: input.id,
          userId: ctx.user.id,
        }),
      )
    }),
    deleteStrategy: protectedProcedure.input(IdSchema).mutation(({ ctx, input }) => {
      return ctx.executor.execute(
        'deleteStrategy',
        ctx.useCases.strategy.deleteStrategy({
          id: input.id,
          userId: ctx.user.id,
        }),
      )
    }),
  })
}
