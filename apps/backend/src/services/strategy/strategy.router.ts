import { IdSchema } from '@cs2monorepo/shared'
import { AddStrategySchema } from '@cs2monorepo/shared'

import type { UseCaseExecutor } from '../../common/error/error-utils'
import type { createTRPCRouterReturn } from '../../server/routers/trpc'
type StrategyRouterDeps = {
  t: createTRPCRouterReturn
  executor: UseCaseExecutor
}

export function createStrategyRouter(deps: StrategyRouterDeps) {
  const { t, executor } = deps
  const { router, protectedProcedure } = t
  return router({
    createStrategy: protectedProcedure.input(AddStrategySchema).mutation(({ ctx, input }) => {
      return executor.execute('createStrategy', ctx.useCases.strategy.createStrategy(input))
    }),
    softDeleteStrategy: protectedProcedure.input(IdSchema).mutation(({ ctx, input }) => {
      return executor.execute('softDeleteStrategy', ctx.useCases.strategy.softDeleteStrategy(input))
    }),
    deleteStrategy: protectedProcedure.input(IdSchema).mutation(({ ctx, input }) => {
      return executor.execute('deleteStrategy', ctx.useCases.strategy.deleteStrategy(input))
    }),
  })
}
