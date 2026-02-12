import { betterAuth } from 'better-auth'
import { prismaAdapter } from "better-auth/adapters/prisma";

import { DbClient } from '../storage/types'

type BetterAuthDeps = {
  db: DbClient
}

export type BetterAuth = ReturnType<typeof createBetterAuthSingleton>;
export function createBetterAuthSingleton(deps: BetterAuthDeps){
  const { db } = deps
  return betterAuth({
    database: prismaAdapter(db, {
      provider: 'postgresql'
    }),
    user: {
      additionalFields: {
        username: {
          type: "string",
          required: true,
          // This means the field should be provided during sign-up
          input: true,
        },
        role: {
          type: "string",
          required: false,
          defaultValue: "USER",
        }
      }
    },
    emailAndPassword: {
      enabled: true,
    },
  })
}