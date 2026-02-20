import { createTRPCReact, httpBatchLink } from '@trpc/react-query'
import type { AppRouter } from '../../../../backend/src/composition'

export const trpc = createTRPCReact<AppRouter>()

export const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: 'http://localhost:3000/trpc',
      fetch(url, options) {
        return fetch(url, {
          ...options,
          credentials: 'include', // include cookies in requests for authentication
        })
      },
    }),
  ],
})
