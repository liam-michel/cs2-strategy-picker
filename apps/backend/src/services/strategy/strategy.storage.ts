import type {
  AddStrategyApplicationInput,
  EditStrategyApplicationInput,
  IdInput,
  SearchInput,
} from '@cs2monorepo/shared'
import { jsonObjectFrom } from 'kysely/helpers/postgres'
import { z } from 'zod'

import type { StrategyWithDetails } from '../../storage/models'
import { Models } from '../../storage/models'
import type { KyselyDB } from '../../storage/types/types'
export type StrategyStorageMethods = {
  getStrategyRaw(data: IdInput): Promise<Models['Strategy'] | null>
  getStrategy(data: IdInput): Promise<Models['StrategyWithDetails'] | null>
  getUsersStrategies(data: IdInput): Promise<Models['StrategyWithDetails'][]>
  getUsersStrategiesPaginated(data: IdInput & SearchInput): Promise<Models['StrategyWithDetails'][]>
  createStrategy: (data: AddStrategyApplicationInput) => Promise<Models['StrategyWithDetails']>
  editStrategy: (data: EditStrategyApplicationInput) => Promise<Models['StrategyWithDetails']>
  softDeleteStrategy: (data: IdInput) => Promise<string>
  deleteStrategy: (data: IdInput) => Promise<string>
}

function getStrategyRaw(db: KyselyDB) {
  return async function (data: { id: string }): Promise<Models['Strategy'] | null> {
    const result = await db.selectFrom('Strategy').where('id', '=', data.id).selectAll().executeTakeFirst()
    if (!result) return null
    const input = result satisfies z.input<(typeof Models)['Strategy']>

    return Models['Strategy'].parse(input)
  }
}

function getStrategy(db: KyselyDB) {
  return async function (data: IdInput): Promise<Models['StrategyWithDetails'] | null> {
    const result = await db
      .selectFrom('Strategy')
      .select((eb) => [
        'Strategy.id',
        'Strategy.userId', // missing
        'Strategy.name',
        'Strategy.description',
        'Strategy.side',
        'Strategy.difficulty',
        'Strategy.mapId', // missing
        'Strategy.economy',
        'Strategy.ratingAverage', // missing
        'Strategy.ratingCount', // missing
        'Strategy.createdAt', // missing
        'Strategy.updatedAt', // missing
        'Strategy.deletedAt',
        jsonObjectFrom(
          eb.selectFrom('Map').select(['Map.id', 'Map.name', 'Map.isActive']).whereRef('Map.id', '=', 'Strategy.mapId'),
        )
          .$notNull()
          .as('map'),
      ])
      .where('Strategy.id', '=', data.id)
      .executeTakeFirst()

    if (!result) return null
    const input = result satisfies z.input<(typeof Models)['StrategyWithDetails']>

    return Models['StrategyWithDetails'].parse(input)
  }
}

function getUsersStrategies(db: KyselyDB) {
  return async function (data: IdInput): Promise<Models['StrategyWithDetails'][]> {
    const results = (await db
      .selectFrom('Strategy')
      .innerJoin('Map', 'Map.id', 'Strategy.mapId')
      .select((eb) => [
        'Strategy.id',
        'Strategy.userId',
        'Strategy.name',
        'Strategy.description',
        'Strategy.side',
        'Strategy.difficulty',
        'Strategy.mapId',
        'Strategy.economy',
        'Strategy.ratingAverage',
        'Strategy.ratingCount',
        'Strategy.deletedAt',
        'Strategy.createdAt',
        'Strategy.updatedAt',
        jsonObjectFrom(
          eb.selectFrom('Map').select(['Map.id', 'Map.name', 'Map.isActive']).whereRef('Map.id', '=', 'Strategy.mapId'),
        )
          .$notNull()
          .as('map'),
      ])
      .where('Strategy.userId', '=', data.id)
      .execute()) satisfies z.input<Models['StrategyWithDetails']>[]
    return Models['StrategyWithDetails'].array().parse(results)
  }
}
function getUsersStrategiesPaginated(db: KyselyDB) {
  return async function (data: IdInput & SearchInput): Promise<StrategyWithDetails[]> {
    const { id, page, limit, query } = data

    // Start with base query
    let queryBuilder = db
      .selectFrom('Strategy')
      .innerJoin('Map', 'Map.id', 'Strategy.mapId')
      .select((eb) => [
        'Strategy.id',
        'Strategy.userId',
        'Strategy.name',
        'Strategy.description',
        'Strategy.side',
        'Strategy.difficulty',
        'Strategy.mapId',
        'Strategy.economy',
        'Strategy.ratingAverage',
        'Strategy.ratingCount',
        'Strategy.deletedAt',
        'Strategy.createdAt',
        'Strategy.updatedAt',
        jsonObjectFrom(
          eb.selectFrom('Map').select(['Map.id', 'Map.name', 'Map.isActive']).whereRef('Map.id', '=', 'Strategy.mapId'),
        )
          .$notNull()
          .as('map'),
      ])
      .where('Strategy.userId', '=', id)

    // Add search filter if query exists
    if (query) {
      queryBuilder = queryBuilder.where((eb) =>
        eb.or([eb('Strategy.name', 'like', `%${query}%`), eb('Strategy.description', 'like', `%${query}%`)]),
      )
    }

    // Apply pagination
    const results = (await queryBuilder
      .offset((page - 1) * limit)
      .limit(limit)
      .execute()) satisfies z.input<Models['StrategyWithDetails']>[]

    // Parse results
    return results.map((result) => Models['StrategyWithDetails'].parse(result))
  }
}
function editStrategy(db: KyselyDB) {
  return async function (data: EditStrategyApplicationInput): Promise<StrategyWithDetails> {
    const map = await db.selectFrom('Map').select('id').where('name', '=', data.map).executeTakeFirst()
    if (!map) throw new Error('Map not found')

    await db
      .updateTable('Strategy')
      .set({
        name: data.name,
        description: data.description,
        side: data.side,
        difficulty: data.difficulty,
        economy: data.economy,
        mapId: map.id,
      })
      .where('id', '=', data.id)
      .returningAll()
      .executeTakeFirst()

    const updated = await getStrategy(db)({ id: data.id })
    if (!updated) throw new Error('Failed to retrieve updated strategy')
    return updated
  }
}

function createStrategy(db: KyselyDB) {
  return async function (data: AddStrategyApplicationInput): Promise<StrategyWithDetails> {
    const map = await db.selectFrom('Map').select('id').where('name', '=', data.map).executeTakeFirst()
    if (!map) throw new Error('Map not found')

    const id = crypto.randomUUID()
    await db
      .insertInto('Strategy')
      .values({
        id,
        name: data.name,
        description: data.description,
        mapId: map.id,
        userId: data.userId,
        side: data.side,
        difficulty: data.difficulty,
        economy: data.economy,
        updatedAt: new Date(),
        deletedAt: null,
      })
      .execute()
    const created = await getStrategy(db)({ id })
    if (!created) throw new Error('Failed to retrieve created strategy')
    return created
  }
}

function softDeleteStrategy(db: KyselyDB) {
  return async function (data: IdInput): Promise<string> {
    await db.updateTable('Strategy').set({ deletedAt: new Date() }).where('id', '=', data.id).execute()
    return data.id
  }
}

function deleteStrategy(db: KyselyDB) {
  return async function (data: IdInput): Promise<string> {
    await db.deleteFrom('Strategy').where('id', '=', data.id).execute()
    return data.id
  }
}

export function createStrategyStorage(db: KyselyDB): StrategyStorageMethods {
  return {
    getStrategyRaw: getStrategyRaw(db),
    getStrategy: getStrategy(db),
    getUsersStrategies: getUsersStrategies(db),
    getUsersStrategiesPaginated: getUsersStrategiesPaginated(db),
    createStrategy: createStrategy(db),
    editStrategy: editStrategy(db),
    softDeleteStrategy: softDeleteStrategy(db),
    deleteStrategy: deleteStrategy(db),
  }
}
