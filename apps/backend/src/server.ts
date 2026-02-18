import fastifyCookie from '@fastify/cookie'
import fastifyCors from '@fastify/cors'
import { fastifyTRPCPlugin } from '@trpc/server/adapters/fastify'
import Fastify, { type FastifyRequest } from 'fastify'

import { setupApp } from './composition.js'
import { authPlugin } from './server/auth-plugin.js'
import { createContext } from './server/context.js'
async function main() {
  //application dependencies (long lived singletons) are created in the composition root
  const { appRouter, logger, storage, auth } = await setupApp()

  logger.info('App setup complete. Ready to start the server.')
  //initalise fastify server and register plugins
  const fastify = Fastify({ loggerInstance: logger })
  await fastify.register(fastifyCors, {
    origin: 'http://localhost:5173',
    credentials: true,
  })
  await fastify.register(fastifyCookie)
  //register auth plugin before trpc plugin so that the user is available in the context
  await fastify.register(authPlugin, { storage, logger, betterAuth: auth })
  await fastify.register(fastifyTRPCPlugin, {
    prefix: '/trpc',
    trpcOptions: {
      router: appRouter,
      createContext: ({ req }: { req: FastifyRequest }) => createContext({ request: req, storage }),
    },
  })
  fastify.listen({ port: 3000 }, () => logger.info('Server listening on port 3000'))
  logger.info('database url is: ' + process.env.DATABASE_URL)
}
// eslint-disable-next-line
await main().catch((error) => {
  // eslint-disable-next-line
  console.error('Failed to start server:', error)
  process.exit(1)
})
