import { AddStrategyApplicationInput } from '@cs2monorepo/shared'
import type { Logger } from 'pino'
import * as td from 'testdouble'

import { Storage } from '../../../storage/storage'
import { createStrategyService } from '../strategy.service'

const storage = td.object<Storage>()
const logger = td.object<Logger>()
const deps = { storage, logger }
const service = createStrategyService(deps)

describe('Notes Service createStrategy', () => {
  it('should create a new strategy', async () => {
    const inputData: AddStrategyApplicationInput = {
      name: 'Test Strategy',
      description: 'This is a test strategy.',
      map: 'Test Map',
      side: 'T',
      difficulty: 1,
      economy: ['ECO'],
      userId: 'user-1',
    }
    const expectedStrategy = {
      id: '1',
      name: inputData.name,
      description: inputData.description,
      side: inputData.side,
      difficulty: inputData.difficulty,
      economies: [{ strategyId: '1', economy: 'ECO' }],
      map: {
        id: 'Test Map',
        name: 'Test Map',
      },
      deletedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    td.when(storage.strategy.createStrategy(inputData)).thenResolve(expectedStrategy)

    const result = await service.createStrategy(inputData)
    expect(result).toEqual(expectedStrategy)
  })
})
