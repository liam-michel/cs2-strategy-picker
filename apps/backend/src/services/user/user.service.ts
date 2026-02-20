import type { IdInput } from '@cs2monorepo/shared'
import type { Logger } from 'pino'

import type { Repo } from '../../storage/storage'
export type UserServiceDeps = {
  storage: Repo
  logger: Logger
}

export type UserService = {
  findById: (data: IdInput) => ReturnType<Repo['user']['findById']>
}

function findById({ storage, logger }: UserServiceDeps) {
  return async function (data: IdInput) {
    logger.info('Finding user with id: %o', data)
    return await storage.user.findById(data)
  }
}

export function createUserService(deps: UserServiceDeps): UserService {
  return {
    findById: findById(deps),
  }
}
