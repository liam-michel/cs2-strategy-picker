import { AddStrategyInput, IdInput } from '@cs2monorepo/shared'
import { Strategy } from '@prisma/client'

import type { DbClient } from '../../storage/types'

export type StrategyStorageMethods = {
  createStrategy: (data: AddStrategyInput) => Promise<Strategy>
  softDeleteStrategy: (data: IdInput) => Promise<string>
  deleteStrategy: (data: IdInput) => Promise<string>
}

function createStrategy(db: DbClient) {
  return async function (data: AddStrategyInput): Promise<Strategy> {
    return db.strategy.create({
      data: {
        name: data.name,
        description: data.description,
        mapId: data.map,
        side: data.side,
        difficulty: data.difficulty,
        economies: {
          create: data.economy.map((economy) => ({
            economy: economy, // Changed from type: economy.type
          })),
        },
      },
      include: {
        economies: true,
        map: true,
      },
    })
  }
}

function softDeleteStrategy(db: DbClient) {
  return async function (data: IdInput): Promise<string> {
    await db.strategy.update({
      where: { id: data.id },
      data: { deletedAt: new Date() },
    })
    return data.id
  }
}

function deleteStrategy(db: DbClient) {
  return async function (data: IdInput): Promise<string> {
    await db.strategy.delete({
      where: { id: data.id },
    })
    return data.id
  }
}

export function createStrategyStorage(db: DbClient): StrategyStorageMethods {
  return {
    createStrategy: createStrategy(db),
    softDeleteStrategy: softDeleteStrategy(db),
    deleteStrategy: deleteStrategy(db),
  }
}
