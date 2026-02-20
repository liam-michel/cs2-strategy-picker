import type { AddStrategyApplicationInput, IdInput } from '@cs2monorepo/shared'
import type { PaginationInput } from '@cs2monorepo/shared'
import type { Logger } from 'pino'

import { Services } from '../create-services.ts'

type StrategyUseCaseDeps = {
  logger: Logger
  services: Services
}

export type StrategyUseCases = ReturnType<typeof createStrategyUseCases>

export function createStrategyUseCases({ logger, services }: StrategyUseCaseDeps) {
  return {
    getUsersStrategies: async (data: IdInput) => {
      logger.info('Use case: Getting strategies for user with id: %o', data.id)
      return services.strategy.getUsersStrategies(data)
    },
    getUsersStrategiesPaginated: async (data: IdInput & PaginationInput) => {
      logger.info(
        'Use case: Getting paginated strategies for user with id: %o, page: %o, limit: %o',
        data.id,
        data.page,
        data.limit,
      )
      return services.strategy.getUsersStrategiesPaginated(data)
    },
    createStrategy: async (data: AddStrategyApplicationInput) => {
      logger.info('Use case: Creating strategy with data: %o', data)
      return services.strategy.createStrategy(data)
    },
    softDeleteStrategy: async (data: IdInput & { userId: string }) => {
      logger.info('Use case: Soft deleting strategy with id: %o', data)
      return services.strategy.softDeleteStrategy(data)
    },
    deleteStrategy: async (data: IdInput & { userId: string }) => {
      logger.info('Use case: Deleting strategy with id: %o', data)
      return services.strategy.deleteStrategy(data)
    },
  }
}
