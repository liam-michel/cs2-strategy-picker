import { DeleteForm } from '@/forms/DeleteForm'
import { trpc } from '@/lib/providers/trpc'
import { toast } from 'sonner'
import { StrategyColumn } from '../../../components/strategy-table/columns'

interface Props {
  strategy: StrategyColumn
  open?: boolean
  onOpenChange?: (open: boolean) => void
  onSuccess: () => void
}

export const DeleteStrategyDialog: React.FC<Props> = ({ strategy, open, onOpenChange, onSuccess }) => {
  const deleteMutation = trpc.strategy.deleteStrategy.useMutation()
  const utils = trpc.useUtils()

  if (!strategy) return null

  return (
    <DeleteForm
      title="Delete Strategy"
      description={`Are you sure you want to delete "${strategy.name}"? This action cannot be undone.`}
      open={open}
      onOpenChange={onOpenChange}
      onConfirm={async () => {
        deleteMutation.mutate(
          { id: strategy.id },
          {
            onSuccess: async () => {
              await utils.strategy.getUsersStrategies.invalidate()
              onSuccess?.()
            },
            onError: (err) => toast.error(err.message),
          },
        )
      }}
    />
  )
}
