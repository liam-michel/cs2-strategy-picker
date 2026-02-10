import { z } from 'zod'

import { EconomySchema, SideSchema } from '../schemas/common'

export const AddStrategySchema = z.object({
  name: z.string().min(1, 'Strategy name is required').max(50, 'Strategy name must be at most 50 characters long'),
  map: z.uuid('Invalid map ID format'),
  side: SideSchema,
  description: z.string().max(500, 'Description must be at most 500 characters long'),
  difficulty: z.number().min(1, 'Difficulty must be at least 1').max(5, 'Difficulty must be at most 5'),
  economy: z
    .array(EconomySchema)
    .max(EconomySchema.options.length, `Economy can have at most ${EconomySchema.options.length} items`),
})

export type AddStrategyInput = z.output<typeof AddStrategySchema>
