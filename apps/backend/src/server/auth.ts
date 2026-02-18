import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'

import { DbClient } from '../storage/types'

type BetterAuthDeps = {
  db: DbClient
}

export type BetterAuth = ReturnType<typeof createBetterAuthSingleton>
export function createBetterAuthSingleton(deps: BetterAuthDeps) {
  const { db } = deps
  return betterAuth({
    baseURL: 'http://localhost:3000',
    trustedOrigins: ['http://localhost:5173'],
    database: prismaAdapter(db, {
      provider: 'postgresql',
    }),
    user: {
      additionalFields: {
        role: {
          type: 'string',
          required: false,
          defaultValue: 'USER',
        },
      },
    },
    emailAndPassword: {
      enabled: true,
    },
  })
}
