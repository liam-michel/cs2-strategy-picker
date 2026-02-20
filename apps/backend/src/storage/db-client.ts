import { PrismaClient } from '@prisma/client'
import { PrismaClientOptions } from '@prisma/client/runtime/library'

export function createPrismaClient(connectionString: string): PrismaClient {
  return new PrismaClient({
    datasources: {
      db: { url: connectionString },
    } as PrismaClientOptions['datasources'],
  })
}
