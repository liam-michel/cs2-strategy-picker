import { Logger } from 'pino'

import { Storage } from '../storage/storage'
import { createStrategyService } from './strategy/strategy.service'
import { createUserService } from './user/user.service'
export type Services = ReturnType<typeof createServices>

export type ServiceDeps = {
  storage: Storage
  logger: Logger
}

export function createServices(deps: ServiceDeps) {
  const { storage, logger } = deps
  return {
    strategy: createStrategyService({ storage, logger }),
    user: createUserService({ storage, logger }),
  }
}
