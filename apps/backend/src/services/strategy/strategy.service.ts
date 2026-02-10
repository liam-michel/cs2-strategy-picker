import { AddStrategyInput, IdInput } from '@cs2monorepo/shared'
import type { Logger } from 'pino'

import { Repo } from '../../storage/storage'
export type StrategyServiceDeps = {
  storage: Repo
  logger: Logger
}

export type StrategyService = {
  createStrategy: (data: AddStrategyInput) => ReturnType<Repo['strategy']['createStrategy']>
  softDeleteStrategy: (data: IdInput) => ReturnType<Repo['strategy']['softDeleteStrategy']>
  deleteStrategy: (data: IdInput) => ReturnType<Repo['strategy']['deleteStrategy']>
}

function createStrategy({ storage, logger }: StrategyServiceDeps) {
  return async function (data: AddStrategyInput) {
    logger.info('Creating a new strategy with data: %o', data)
    const strategy = await storage.strategy.createStrategy(data)

    // future business logic here
    return strategy
  }
}

function softDeleteStrategy({ storage, logger }: StrategyServiceDeps) {
  return async function (data: IdInput) {
    logger.info('Soft deleting a strategy with id: %o', data)
    return await storage.strategy.softDeleteStrategy(data)
  }
}

function deleteStrategy({ storage, logger }: StrategyServiceDeps) {
  return async function (data: IdInput) {
    logger.info('Deleting a strategy with id: %o', data)
    return await storage.strategy.deleteStrategy(data)
  }
}

export function createStrategyService(deps: StrategyServiceDeps): StrategyService {
  return {
    createStrategy: createStrategy(deps),
    softDeleteStrategy: softDeleteStrategy(deps),
    deleteStrategy: deleteStrategy(deps),
  }
}
