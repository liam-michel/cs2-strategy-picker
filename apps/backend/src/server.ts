import { fastifyTRPCPlugin } from '@trpc/server/adapters/fastify'
import Fastify from 'fastify'

import { setupApp } from './composition.js'

async function main() {
  const { appRouter, logger } = await setupApp()

  logger.info('App setup complete. Ready to start the server.')
  const fastify = Fastify({ loggerInstance: logger })
  await fastify.register(fastifyTRPCPlugin, {
    prefix: '/trpc',
    trpcOptions: { router: appRouter },
  })
  fastify.listen({ port: 3000 }, () => logger.info('Server listening on port 3000'))
}
// eslint-disable-next-line
await main().catch((error) => {
  // eslint-disable-next-line
  console.error('Failed to start server:', error)
  process.exit(1)
})
