import type { Logger } from 'pino'

import { IdInput, NoteCreateInput } from '../common/schemas.js'
import type { NotesService } from './note.service.js'

type Deps = {
  notesService: NotesService
  logger: Logger
}
export function createNotesUseCases({ notesService, logger }: Deps) {
  return {
    createNote: async (data: NoteCreateInput) => {
      logger.info('Use case: Creating note with data: %o', data)
      return notesService.createNote(data)
    },
    deleteNote: async (data: IdInput) => {
      logger.info('Use case: Deleting note with id: %o', data)
      return notesService.deleteNote(data)
    },
  }
}
