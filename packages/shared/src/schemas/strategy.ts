import { z } from 'zod'

import { EconomySchema, MapSchema, SideSchema } from '../schemas/common'

export const AddStrategySchema = z.object({
  name: z.string().min(1, 'Strategy name is required').max(50, 'Strategy name must be at most 50 characters long'),
  map: MapSchema,
  side: SideSchema,
  description: z.string().max(500, 'Description must be at most 500 characters long'),
  difficulty: z.number().min(1, 'Difficulty must be at least 1').max(5, 'Difficulty must be at most 5'),
  economy: EconomySchema,
})

export const AddStrategyServiceSchema = AddStrategySchema.extend({
  userId: z.cuid(),
})

export const EditStrategySchema = AddStrategySchema.extend({
  id: z.cuid('Invalid strategy ID'),
})

export const EditStrategyServiceSchema = EditStrategySchema.extend({
  userId: z.cuid(),
})

export type AddStrategyInput = z.output<typeof AddStrategySchema>

export type AddStrategyApplicationInput = z.output<typeof AddStrategyServiceSchema>

export type EditStrategyInput = z.output<typeof EditStrategySchema>

export type EditStrategyApplicationInput = z.output<typeof EditStrategySchema>
