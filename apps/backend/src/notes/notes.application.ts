import type { Logger } from 'pino'

import { IdInput, NoteCreateInput } from '../common/schemas.js'
import { createNotesService } from './note.service.js'
import { Storage } from './notes.storage.js'

type Deps = {
  storage: Storage
  logger: Logger
}
export function createNotesUseCases({ logger, storage }: Deps) {
  return {
    createNote: async (data: NoteCreateInput) => {
      logger.info('Use case: Creating note with data: %o', data)
      const notesService = await createNotesService({ logger, storage })
      return notesService.createNote(data)
    },
    deleteNote: async (data: IdInput) => {
      logger.info('Use case: Deleting note with id: %o', data)
      const notesService = await createNotesService({ logger, storage })

      return notesService.deleteNote(data)
    },
  }
}
