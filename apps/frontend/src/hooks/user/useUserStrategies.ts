import { trpc } from '@/lib/providers/trpc'

export function useUserStrategies() {
  return trpc.strategy.getUsersStrategies.useQuery()
}
