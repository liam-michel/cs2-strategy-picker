import type { AddStrategyApplicationInput, IdInput, PaginationInput } from '@cs2monorepo/shared'
import type { Strategy } from '@prisma/client'

import type { DbClient } from '../../storage/types'

export type StrategyStorageMethods = {
  getStrategyRaw(data: IdInput): Promise<Strategy | null>
  getStrategy(data: IdInput): Promise<Strategy | null>
  getUsersStrategies(data: IdInput): Promise<Strategy[]>
  getUsersStrategiesPaginated(data: IdInput & PaginationInput): Promise<Strategy[]>
  createStrategy: (data: AddStrategyApplicationInput) => Promise<Strategy>
  softDeleteStrategy: (data: IdInput) => Promise<string>
  deleteStrategy: (data: IdInput) => Promise<string>
}

function getStrategyRaw(db: DbClient) {
  return async function (data: IdInput): Promise<Strategy | null> {
    return db.strategy.findUnique({
      where: { id: data.id },
    })
  }
}

function getStrategy(db: DbClient) {
  return async function (data: IdInput): Promise<Strategy | null> {
    return db.strategy.findUnique({
      where: { id: data.id },
      include: {
        economies: true,
        map: true,
      },
    })
  }
}

function getUsersStrategies(db: DbClient) {
  return async function (data: IdInput): Promise<Strategy[]> {
    return db.strategy.findMany({
      where: { userId: data.id },
      include: {
        economies: true,
        map: true,
      },
    })
  }
}

function getUsersStrategiesPaginated(db: DbClient) {
  return async function (data: IdInput & PaginationInput): Promise<Strategy[]> {
    const { id, page, limit } = data
    return db.strategy.findMany({
      where: { userId: id },
      include: {
        economies: true,
        map: true,
      },
      skip: (page - 1) * limit,
      take: limit,
    })
  }
}

function createStrategy(db: DbClient) {
  return async function (data: AddStrategyApplicationInput): Promise<Strategy> {
    return db.strategy.create({
      data: {
        name: data.name,
        description: data.description,
        mapId: data.map,
        side: data.side,
        difficulty: data.difficulty,
        userId: data.userId,
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
    getStrategyRaw: getStrategyRaw(db),
    getStrategy: getStrategy(db),
    getUsersStrategies: getUsersStrategies(db),
    getUsersStrategiesPaginated: getUsersStrategiesPaginated(db),
    createStrategy: createStrategy(db),
    softDeleteStrategy: softDeleteStrategy(db),
    deleteStrategy: deleteStrategy(db),
  }
}
