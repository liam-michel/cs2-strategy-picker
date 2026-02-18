//file for loading environment variables and providing a typed interface for them
import type { Logger } from 'pino'
import { z } from 'zod'
const envSchema = z.object({
  DATABASE_URL: z.string(),
  FRONTEND_URL: z.string(),
  BETTERAUTH_URL: z.string(),
})

export type EnvConfigDeps = {
  logger: Logger
}

export const parseEnv = (deps: EnvConfigDeps) => {
  const { logger } = deps
  const env = process.env
  const result = envSchema.safeParse(env)
  if (!result.success) {
    //log the error and exit the process
    logger.error({ errors: result.error.errors }, 'Invalid environment variables')
    process.exit(1)
  }
  return result.data
}
