import type { Prisma, PrismaClient } from '@prisma/client'

import { createStrategyStorage, StrategyStorageMethods } from '../services/strategy/strategy.storage'
import { createUserStorage, UserStorageMethods } from '../services/user/user.storage'
import { wrapWithErrorHandler } from '../utils/error-utils'
import type { DbClient } from './types'
export type Storage = Readonly<{
  strategy: StrategyStorageMethods
  user: UserStorageMethods
  transaction: <T>(callback: (repo: Readonly<Omit<Storage, 'transaction'>>) => Promise<T>) => Promise<T>
}>

export type Repo = Readonly<Omit<Storage, 'transaction'>>

function wrapDb(db: DbClient): Omit<Storage, 'transaction'> {
  return {
    strategy: wrapWithErrorHandler(createStrategyStorage(db)),
    user: wrapWithErrorHandler(createUserStorage(db)),
  }
}

export function createStorage(db: PrismaClient): Storage {
  return {
    ...wrapDb(db),
    async transaction(callback) {
      return db.$transaction(async (tx: Prisma.TransactionClient) => {
        const repo = wrapDb(tx)
        return callback(repo)
      })
    },
  }
}
