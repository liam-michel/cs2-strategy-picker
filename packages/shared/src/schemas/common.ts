import { z } from 'zod'

export const NoteCreateSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title must be at most 255 characters'),
  content: z.string().min(1, 'Content is required').max(5000, 'Content must be at most 5000 characters'),
})

export const IdSchema = z.object({
  id: z.uuid('Invalid ID format'),
})

export const PaginationSchema = z.object({
  page: z.number().min(1, 'Page must be at least 1').default(1).catch(1),
  limit: z.number().min(1, 'Limit must be at least 1').max(100, 'Limit must be at most 100').default(10).catch(10),
})

export const SideSchema = z.enum(['T', 'CT'], 'Side must be either "T" or "CT"')
export const EconomySchema = z.enum(
  ['PISTOL', 'ANTI_ECO', 'ECO', 'FORCE_BUY', 'FULL_BUY'],
  'Economy must be one of: PISTOL, ANTI_ECO, ECO, FORCE_BUY, FULL_BUY',
)
export const PlayerRoleSchema = z.enum(
  ['ENTRY', 'SUPPORT', 'LURKER', 'AWPER', 'IGL'],
  'Player role must be one of: ENTRY, SUPPORT, LURKER, AWPER, IGL',
)
export const UtilitySchema = z.enum(
  ['SMOKE', 'FLASH', 'HE_GRENADE', 'MOLOTOV', 'INCENDIARY', 'DECOY'],
  'Utility must be one of: SMOKE, FLASH, HE_GRENADE, MOLOTOV, INCENDIARY, DECOY',
)
export const MapSchema = z.enum(
  ['Dust II', 'Inferno', 'Mirage', 'Nuke', 'Overpass', 'Vertigo', 'Ancient', 'Anubis', 'Train'],
  'Map must be a valid CS:GO map',
)
export const UserRoleSchema = z.enum(['USER', 'ADMIN'], 'User role must be either USER or ADMIN')

export const SearchSchema = z
  .object({
    query: z.string().max(255, 'Search query must be at most 255 characters').optional().nullable(),
  })
  .extend(PaginationSchema.shape)

export type IdInput = z.input<typeof IdSchema>

export type NoteCreateInput = z.output<typeof NoteCreateSchema>

export type Side = z.output<typeof SideSchema>
export type Economy = z.output<typeof EconomySchema>
export type PlayerRole = z.output<typeof PlayerRoleSchema>
export type Utility = z.output<typeof UtilitySchema>
export type UserRole = z.output<typeof UserRoleSchema>
export type Map = z.output<typeof MapSchema>
export type SearchInput = z.output<typeof SearchSchema>
