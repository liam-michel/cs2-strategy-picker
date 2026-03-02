import type { AddStrategyApplicationInput, EditStrategyApplicationInput, IdInput } from '@cs2monorepo/shared'
import type { SearchInput } from '@cs2monorepo/shared'
import type { Logger } from 'pino'

import { Services } from '../create-services.ts'

type StrategyUseCaseDeps = {
  logger: Logger
  services: Services
}

export type StrategyUseCases = ReturnType<typeof createStrategyUseCases>

export function createStrategyUseCases({ logger, services }: StrategyUseCaseDeps) {
  const log = logger.child({ layer: 'useCase', domain: 'strategy' })
  return {
    getUsersStrategies: async (data: IdInput) => {
      log.info('Fetching strategies')
      return services.strategy.getUsersStrategies(data)
    },
    getUsersStrategiesPaginated: async (data: IdInput & SearchInput) => {
      log.info('Fetching paginated strategies with data: %o', data)
      return services.strategy.getUsersStrategiesPaginated(data)
    },
    createStrategy: async (data: AddStrategyApplicationInput) => {
      log.info('Creating strategy with data: %o', data)
      return services.strategy.createStrategy(data)
    },

    editStrategy: async (data: EditStrategyApplicationInput & { userId: string }) => {
      log.info('Editing strategy with id: %o, data: %o', data.id, data)
      return services.strategy.editStrategy(data)
    },
    softDeleteStrategy: async (data: IdInput & { userId: string }) => {
      log.info('Soft deleting strategy with id: %o', data)
      return services.strategy.softDeleteStrategy(data)
    },
    deleteStrategy: async (data: IdInput & { userId: string }) => {
      log.info('Deleting strategy with id: %o', data)
      return services.strategy.deleteStrategy(data)
    },
  }
}
