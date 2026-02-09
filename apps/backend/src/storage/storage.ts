import type { PrismaClient } from '@prisma/client'

import { createStrategyStorage, StrategyMethods } from '../services/strategy/strategy.storage'
import type { DbClient } from './types'
export type Storage = Readonly<{
  strategy: StrategyMethods
  transaction: <T>(callback: (repo: Readonly<Omit<Storage, 'transaction'>>) => Promise<T>) => Promise<T>
}>

export type Repo = Readonly<Omit<Storage, 'transaction'>>

function wrapDb(db: DbClient): Omit<Storage, 'transaction'> {
  return {
    strategy: createStrategyStorage(db),
  }
}

export function createStorage(db: PrismaClient): Storage {
  return {
    ...wrapDb(db),
    async transaction(callback) {
      return db.$transaction(async (tx) => {
        const repo = wrapDb(tx)
        return callback(repo)
      })
    },
  }
}
