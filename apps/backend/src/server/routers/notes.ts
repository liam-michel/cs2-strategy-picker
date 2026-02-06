import { createUseCaseExecutor } from '../../common/error/error-utils.js'
import { NoteCreateSchema } from '../../common/schemas.js'
import { createNotesUseCases } from '../../notes/notes.application.js'
import { createTRPCRouter } from './trpc.js'
type NotesRouterDeps = {
  t: ReturnType<typeof createTRPCRouter>
  notesUseCases: ReturnType<typeof createNotesUseCases>
  executor: ReturnType<typeof createUseCaseExecutor>
}
export function createNotesRouter(deps: NotesRouterDeps) {
  const { t, notesUseCases, executor } = deps
  const { router, protectedProcedure } = t
  return router({
    createNote: protectedProcedure.input(NoteCreateSchema).mutation(({ ctx, input }) => {
      return executor.execute('createNote', notesUseCases.createNote, input)
    }),
  })
}
