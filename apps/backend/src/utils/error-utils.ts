import { Prisma } from '@prisma/client'

import { ConflictError, DatabaseError, NotFoundError } from '../common/error/errors'

export function handlePrismaError(error: unknown) {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2025':
        throw new NotFoundError('Resource not found')
      case 'P2002':
        throw new ConflictError('Unique constraint failed')
      default:
        throw new DatabaseError('Database error occurred')
    }
  }
}
type AnyAsyncFn = (...args: unknown[]) => Promise<unknown>
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AsyncMethodRecord = Record<string, (...args: any[]) => Promise<unknown>>
function wrapMethod<T extends AnyAsyncFn>(fn: T): T {
  return (async (...args: Parameters<T>) => {
    try {
      return await fn(...args)
    } catch (error) {
      handlePrismaError(error)
    }
  }) as T
}

export function wrapWithErrorHandler<T extends AsyncMethodRecord>(storage: T): T {
  return Object.fromEntries(Object.entries(storage).map(([key, fn]) => [key, wrapMethod(fn)])) as T
}
