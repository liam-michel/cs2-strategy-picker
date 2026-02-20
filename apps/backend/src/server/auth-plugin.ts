import { FastifyPluginAsync } from 'fastify'
import fp from 'fastify-plugin'
import type { Logger } from 'pino'

import type { SafeUser } from '../common/schemas/user'
import type { Storage } from '../storage/storage'
import type { BetterAuth } from './auth'
declare module 'fastify' {
  interface FastifyRequest {
    authUser: SafeUser | null
    requestLogger: Logger
  }
}
const authPluginfn: FastifyPluginAsync<{ storage: Storage; logger: Logger; betterAuth: BetterAuth }> = async (
  fastify,
  { storage, logger, betterAuth },
) => {
  fastify.decorateRequest('authUser', null)
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
    // Convert Fastify headers to standard Headers object
    const headers = new Headers()
    Object.entries(request.headers).forEach(([key, value]) => {
      if (value) headers.append(key, value.toString())
    })

    const session = await betterAuth.api.getSession({
      headers: headers,
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
      name: dbUser.name,
      email: dbUser.email,
      role: dbUser.role,
    }
    request.requestLogger = request.requestLogger.child({ userId: dbUser.id })
  })
  fastify.all('/api/auth/*', async (request, reply) => {
    // Extract the auth action from the URL
    // URL format: /api/auth/{action}/{provider} or /api/auth/{action}
    const urlParts = request.url.split('/')
    const authAction = urlParts[3] // e.g., 'sign-in', 'sign-up', 'sign-out'
    const authProvider = urlParts[4] // e.g., 'email', 'google' (optional)

    const actionWithProvider = authProvider ? `${authAction}/${authProvider}` : authAction
    request.requestLogger.info(
      {
        action: authAction,
        provider: authProvider,
        url: request.url,
      },
      `Auth request: ${actionWithProvider}`,
    )

    try {
      // Construct request URL
      const url = new URL(request.url, `http://${request.headers.host}`)

      // Convert Fastify headers to standard Headers object
      const headers = new Headers()
      Object.entries(request.headers).forEach(([key, value]) => {
        if (value) headers.append(key, value.toString())
      })

      // Create Fetch API-compatible request
      const req = new Request(url.toString(), {
        method: request.method,
        headers,
        ...(request.body ? { body: JSON.stringify(request.body) } : {}),
      })

      // Process authentication request
      const response = await betterAuth.handler(req)

      // Log the result
      if (response.status >= 200 && response.status < 300) {
        request.requestLogger.info(
          { action: authAction, provider: authProvider, status: response.status },
          `Auth ${authAction} successful`,
        )
      } else {
        request.requestLogger.warn(
          { action: authAction, provider: authProvider, status: response.status },
          `Auth ${authAction} failed`,
        )
      }

      // Forward response to client
      reply.status(response.status)
      response.headers.forEach((value, key) => reply.header(key, value))
      reply.send(response.body ? await response.text() : null)
    } catch (error) {
      request.requestLogger.error(
        { error, action: authAction, provider: authProvider },
        `Authentication error during ${authAction}`,
      )
      reply.status(500).send({
        error: 'Internal authentication error',
        code: 'AUTH_FAILURE',
      })
    }
  })
}

export const authPlugin = fp(authPluginfn)
