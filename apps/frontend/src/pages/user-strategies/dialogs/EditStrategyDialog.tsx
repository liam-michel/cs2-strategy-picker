import { DialogWrapper } from '@/components/ui/dialog-wrapper'
import { StrategyForm } from '@/forms/StrategyForm'
import { trpc } from '@/lib/providers/trpc'
import { StrategyColumn } from '../../../components/strategy-table/columns'
import { Map } from '@cs2monorepo/shared'

interface Props {
  strategy: StrategyColumn
  open?: boolean
  onOpenChange?: (open: boolean) => void
  onSuccess: () => void
}

export const EditStrategyDialog: React.FC<Props> = ({ strategy, open, onOpenChange, onSuccess }) => {
  const editMutation = trpc.strategy.editStrategy.useMutation()
  const utils = trpc.useUtils()

  if (!strategy) return null // safety check

  const initialData = {
    name: strategy.name,
    map: strategy.map.name as Map,
    side: strategy.side,
    description: strategy.description,
    difficulty: strategy.difficulty,
    economy: strategy.economy,
  }

  return (
    <DialogWrapper
      title="Edit Strategy"
      description="Fill out the form below to edit your strategy."
      open={open}
      onOpenChange={onOpenChange}
      triggerLabel="Edit Strategy" // optional if you want a trigger button
    >
      {({ close }) => (
        <StrategyForm
          initialData={initialData}
          onSubmit={async (data) => {
            await editMutation.mutateAsync({ ...data, id: strategy.id })
            await utils.strategy.getUsersStrategies.invalidate()
            onSuccess?.()
            close()
          }}
        />
      )}
    </DialogWrapper>
  )
}
