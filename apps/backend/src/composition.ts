//composition root

import pino from 'pino'

import { createNotesService } from './notes/note.service.js'
import { createNotesUseCases } from './notes/notes.application.js'
import { createNotesStorage } from './notes/notes.storage.js'
import { createPrismaClient } from './notes/notes.storage.js'
import { createNotesRouter } from './server/routers/notes.js'
import { createTRPCRouter } from './server/routers/trpc.js'

export async function setupApp() {
  const t = createTRPCRouter()
  const logger = pino({ level: 'info' })
  const dbClient = createPrismaClient('postgresql://invalid:invalid@localhost:5432/invalid')
  const notesStorage = await createNotesStorage(dbClient)
  const notesService = await createNotesService({
    storage: notesStorage,
    logger,
  })
  const notesUseCases = createNotesUseCases({ notesService, logger })
  const notesRouter = createNotesRouter(t, notesUseCases)

  const appRouter = t.router({
    notes: notesRouter,
  })
  return {
    t,
    logger,
    appRouter,
  }
}
