import type { FastifyRequest } from 'fastify'

export type User = {
  id: string
  role: 'admin' | 'user'
  username: string
  email: string
}

export type AppContext = {
  user: User | null
}

export async function createContext({ request }: { request: FastifyRequest }): Promise<AppContext> {
  const authHeader = request.headers.authorization
  if (!authHeader) {
    return { user: null }
  }
  const token = authHeader.replace('Bearer ', '')
  //verify the token
  //TODO: implement real auth

  //TODO: verify roles

  const user: User = {
    id: token,
    username: 'testuser',
    email: 'testuser@example.com',
    role: 'user',
  }
  return { user }
}
