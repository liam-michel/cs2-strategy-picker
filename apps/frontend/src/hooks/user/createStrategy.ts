import { trpc } from '@/lib/providers/trpc'

export function createUserStrategy() {
  return trpc.strategy.createStrategy.useMutation()
}
