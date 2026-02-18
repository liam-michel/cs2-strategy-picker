import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'

import { DbClient } from '../storage/types'

type BetterAuthDeps = {
  db: DbClient
  baseURL: string
  trustedOrigin: string
}

export type BetterAuth = ReturnType<typeof createBetterAuthSingleton>
export function createBetterAuthSingleton(deps: BetterAuthDeps) {
  const { db, baseURL, trustedOrigin } = deps
  return betterAuth({
    baseURL,
    trustedOrigins: [trustedOrigin],
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
