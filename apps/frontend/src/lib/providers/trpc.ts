import { createTRPCReact, httpBatchLink } from '@trpc/react-query'
import superjson from 'superjson'
import type { AppRouter } from '../../../../backend/src/composition'

export const trpc = createTRPCReact<AppRouter>()

export const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: 'http://localhost:3000/trpc',
      transformer: superjson, // 👈 MUST be here in v11
      fetch(url, options) {
        return fetch(url, {
          ...options,
          credentials: 'include',
        })
      },
    }),
  ],
})
