import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './queryclient'
function Providers({ children }: Readonly<{ children: React.ReactNode }>) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}

export default Providers
