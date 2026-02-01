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

export type IdInput = z.input<typeof IdSchema>

export type NoteCreateInput = z.output<typeof NoteCreateSchema>

export type PaginationInput = z.output<typeof PaginationSchema>
