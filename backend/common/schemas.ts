import { z } from 'zod';

export const NoteCreateSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(255, 'Title must be at most 255 characters'),
  content: z
    .string()
    .min(1, 'Content is required')
    .max(5000, 'Content must be at most 5000 characters'),
});
