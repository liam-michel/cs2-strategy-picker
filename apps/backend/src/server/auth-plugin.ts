import { FastifyPluginAsync } from 'fastify'
import type { Logger } from 'pino'

import type { SafeUser } from '../common/schemas/user'
import type { Storage } from '../storage/storage'
import { toHeaders } from '../utils/headers'
import type { BetterAuth } from './auth'
declare module 'fastify' {
  interface FastifyRequest {
    authUser: SafeUser | null
    requestLogger: Logger
  }
}

export const authPlugin: FastifyPluginAsync<{ storage: Storage; logger: Logger, betterAuth: BetterAuth }> = async (
  fastify,
  { storage, logger, betterAuth },
) => {
  fastify.addHook('onRequest', async (request) => {
    request.requestLogger = logger.child({
      requestId: request.id,
      url: request.url,
      method: request.method,
    })
  })
  fastify.addHook('preHandler', async (request) => {
    //default user to null
    request.authUser = null
    const session = await betterAuth.api.getSession({
      headers: toHeaders(request.headers),
    })

    if (!session) {
      return
    }
    const dbUser = await storage.user.findById({ id: session.user.id })
    if (!dbUser) {
      return
    }
    request.authUser = {
      id: dbUser.id,
      username: dbUser.username,
      email: dbUser.email,
      role: dbUser.role,
    }
    request.requestLogger = request.requestLogger.child({ userId: dbUser.id })
  })
}
