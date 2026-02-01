import type { Prisma } from '@prisma/client'
import { Note } from '@prisma/client'
import { PrismaClient } from '@prisma/client'

import { IdInput, NoteCreateInput, PaginationInput } from '../common/schemas.js'

type DbClient = PrismaClient | Prisma.TransactionClient
export type NotesMethods = {
  getAllNotes: () => Promise<Note[]>
  createNote: (data: NoteCreateInput) => Promise<Note>
  deleteNote: (data: IdInput) => Promise<string>
  getNotesPaginated: (data: PaginationInput) => Promise<Note[]>
}

export type Storage = Readonly<{
  notes: NotesMethods
  transaction: <T>(callback: (repo: Readonly<Omit<Storage, 'transaction'>>) => Promise<T>) => Promise<T>
}>

function getAllNotes(db: DbClient) {
  return async function (): Promise<Note[]> {
    return db.note.findMany()
  }
}

function createNote(db: DbClient) {
  return async function (data: NoteCreateInput): Promise<Note> {
    return db.note.create({
      data,
    })
  }
}

function deleteNote(db: DbClient) {
  return async function (data: IdInput): Promise<string> {
    await db.note.delete({
      where: { id: data.id },
    })
    return data.id
  }
}

function getNotesPaginated(db: DbClient) {
  return async function (data: PaginationInput): Promise<Note[]> {
    const skip = (data.page - 1) * data.limit
    const take = data.limit

    return db.note.findMany({
      skip,
      take,
    })
  }
}
export function createPrismaClient(connectionString: string): PrismaClient {
  return new PrismaClient({
    datasources: {
      db: { url: connectionString },
    } as Prisma.PrismaClientOptions['datasources'],
  })
}
function wrapDb(db: DbClient): Omit<Storage, 'transaction'> {
  return {
    notes: {
      getAllNotes: getAllNotes(db),
      createNote: createNote(db),
      deleteNote: deleteNote(db),
      getNotesPaginated: getNotesPaginated(db),
    },
  }
}

export async function createNotesStorage(db: PrismaClient): Promise<Storage> {
  return {
    ...wrapDb(db),
    async transaction(callback) {
      return db.$transaction(async (tx) => {
        const repo = wrapDb(tx)
        return callback(repo)
      })
    },
  }
}
