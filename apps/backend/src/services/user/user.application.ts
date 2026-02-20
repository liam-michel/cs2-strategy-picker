import type { IdInput } from '@cs2monorepo/shared'
import type { Logger } from 'pino'

import type { Services } from '../create-services.ts'
type UserUseCaseDeps = {
  logger: Logger
  services: Services
}

export type UserUseCases = ReturnType<typeof createUserUseCases>

export function createUserUseCases({ logger, services }: UserUseCaseDeps) {
  return {
    findByid: async (data: IdInput) => {
      logger.info('Use case: Finding user with id: %o', data)
      return services.user.findById(data)
    },
  }
}
