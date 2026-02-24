import type {
  AddStrategyApplicationInput,
  EditStrategyApplicationInput,
  IdInput,
  PaginationInput,
} from '@cs2monorepo/shared'
import type { Logger } from 'pino'

import { NotFoundError, UnauthorizedError } from '../../common/error/errors'
import { Repo } from '../../storage/storage'
export type StrategyServiceDeps = {
  storage: Repo
  logger: Logger
}

export type StrategyService = {
  getUsersStrategies: (data: IdInput) => ReturnType<Repo['strategy']['getUsersStrategies']>
  getUsersStrategiesPaginated: (
    data: IdInput & PaginationInput,
  ) => ReturnType<Repo['strategy']['getUsersStrategiesPaginated']>
  createStrategy: (data: AddStrategyApplicationInput) => ReturnType<Repo['strategy']['createStrategy']>
  editStrategy: (data: AddStrategyApplicationInput & IdInput) => ReturnType<Repo['strategy']['editStrategy']>
  softDeleteStrategy: (data: IdInput & { userId: string }) => ReturnType<Repo['strategy']['softDeleteStrategy']>
  deleteStrategy: (data: IdInput & { userId: string }) => ReturnType<Repo['strategy']['deleteStrategy']>
}

function getUsersStrategies({ storage, logger }: StrategyServiceDeps) {
  return async function (data: IdInput) {
    logger.info('Getting strategies for user with id: %o', data.id)
    return await storage.strategy.getUsersStrategies(data)
  }
}

function getUsersStrategiesPaginated({ storage, logger }: StrategyServiceDeps) {
  return async function (data: IdInput & PaginationInput) {
    logger.info(
      'Getting paginated strategies for user with id: %o, page: %o, limit: %o',
      data.id,
      data.page,
      data.limit,
    )
    return await storage.strategy.getUsersStrategiesPaginated(data)
  }
}

function createStrategy({ storage, logger }: StrategyServiceDeps) {
  return async function (data: AddStrategyApplicationInput) {
    logger.info('Creating a new strategy with data: %o', data)
    const strategy = await storage.strategy.createStrategy(data)

    // future business logic here
    return strategy
  }
}

function editStrategy({ storage, logger }: StrategyServiceDeps) {
  return async function (data: EditStrategyApplicationInput & { userId: string }) {
    //check if the user owns the strategy before allowing them to edit
    logger.info('Checking if user owns the strategy with id: %o', data.id)
    const strategy = await storage.strategy.getStrategyRaw({ id: data.id })
    if (!strategy) {
      logger.warn('Strategy with id %o not found', data.id)
      throw new NotFoundError('Strategy not found')
    } else if (strategy.userId !== data.userId) {
      logger.warn('User with id %o does not own strategy with id %o', data.userId, data.id)
      throw new UnauthorizedError('You are not authorized to edit this strategy')
    }
    logger.info('Editing strategy with id: %o, data: %o', data.id, data)
    const editedStrategy = await storage.strategy.editStrategy({
      id: data.id,
      name: data.name,
      description: data.description,
      side: data.side,
      difficulty: data.difficulty,
      map: data.map,
      economy: data.economy,
    })

    // future business logic here
    return editedStrategy
  }
}

function softDeleteStrategy({ storage, logger }: StrategyServiceDeps) {
  return async function (data: IdInput & { userId: string }) {
    logger.info('Checking if user owns the strategy with id: %o', data)
    const strategy = await storage.strategy.getStrategyRaw({ id: data.id })
    if (!strategy) {
      logger.warn('Strategy with id %o not found', data.id)
      throw new NotFoundError('Strategy not found')
    }
    if (strategy.userId !== data.userId) {
      logger.warn('User with id %o does not own strategy with id %o', data.userId, data.id)
      throw new UnauthorizedError('You are not authorized to delete this strategy')
    }
    logger.info('Soft deleting a strategy with id: %o', data)
    return await storage.strategy.softDeleteStrategy(data)
  }
}

function deleteStrategy({ storage, logger }: StrategyServiceDeps) {
  return async function (data: IdInput & { userId: string }) {
    logger.info('Checking if user owns the strategy with id: %o', data)
    const strategy = await storage.strategy.getStrategyRaw({ id: data.id })
    if (!strategy) {
      logger.warn('Strategy with id %o not found', data.id)
      throw new NotFoundError('Strategy not found')
    }
    if (strategy.userId !== data.userId) {
      logger.warn('User with id %o does not own strategy with id %o', data.userId, data.id)
      throw new UnauthorizedError('You are not authorized to delete this strategy')
    }
    logger.info('Deleting a strategy with id: %o', data)
    return await storage.strategy.deleteStrategy(data)
  }
}

export function createStrategyService(deps: StrategyServiceDeps): StrategyService {
  return {
    getUsersStrategies: getUsersStrategies(deps),
    getUsersStrategiesPaginated: getUsersStrategiesPaginated(deps),
    createStrategy: createStrategy(deps),
    editStrategy: editStrategy(deps),
    softDeleteStrategy: softDeleteStrategy(deps),
    deleteStrategy: deleteStrategy(deps),
  }
}
