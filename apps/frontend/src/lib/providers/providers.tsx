import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './queryclient'
import { ThemeProvider } from './theme-provider'
import { trpc } from './trpc'
import { trpcClient } from './trpc'
function Providers({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      </trpc.Provider>
    </ThemeProvider>
  )
}

export default Providers
