import { NoteCreateSchema } from '../../common/schemas.js'
import { createNotesUseCases } from '../../notes/notes.application.js'
import { createTRPCRouter } from './trpc.js'

export function createNotesRouter(
  { router, protectedProcedure, adminProcedure }: ReturnType<typeof createTRPCRouter>,
  notesUseCases: ReturnType<typeof createNotesUseCases>,
) {
  return router.router({
    createNote: protectedProcedure.input(NoteCreateSchema).mutation(({ ctx, input }) => {
      return notesUseCases.createNote(input)
    }),
  })
}
