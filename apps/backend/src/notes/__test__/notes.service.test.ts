import * as td from 'testdouble'
import type { Logger } from 'pino'
import type { Note } from '@prisma/client'

import { createNotesService, type NotesServiceDeps } from '../note.service'
import type { Storage as NotesStorage } from '../notes.storage'
import { NoteCreateInput } from '../../common/schemas'

const storage = td.object<NotesStorage>()
const logger = td.object<Logger>()
const deps = { storage, logger } // ✅ Plain object, not td.object()
describe('Notes Service', () => {
  it('should create a note', async () => {
    //setup input data
    const inputData: NoteCreateInput = {
      title: 'Test Note',
      content: 'This is a test note.',
    }
    const expectedNote: Note = {
      id: '1',
      title: inputData.title,
      content: inputData.content,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    //stub storage method to return the expected note
    td.when(storage.notes.createNote(inputData)).thenResolve(expectedNote)
    //call the service method
    const notesService = await createNotesService(deps)
    const result = await notesService.createNote(inputData)
    //assert the result
    expect(result).toEqual(expectedNote)
    //verify that logger was called
    td.verify(logger.info('Creating a new note with data: %o', inputData))
  })
})
