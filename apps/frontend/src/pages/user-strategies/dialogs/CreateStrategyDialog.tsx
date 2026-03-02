import { DialogWrapper } from '@/components/ui/dialog-wrapper'
import { StrategyForm } from '@/forms/StrategyForm'
import { trpc } from '@/lib/providers/trpc'

interface Props {
  onSuccess: () => void
}

export const CreateStrategyDialog: React.FC<Props> = ({ onSuccess }) => {
  const createMutation = trpc.strategy.createStrategy.useMutation()
  const utils = trpc.useUtils()

  return (
    <DialogWrapper
      title="Create New Strategy"
      description="Fill out the form below to create a new strategy."
      triggerLabel="Create Strategy"
    >
      {({ close }) => (
        <StrategyForm
          onSubmit={async (data) => {
            await createMutation.mutateAsync(data)
            await utils.strategy.getUsersStrategies.invalidate()
            onSuccess?.()
            close()
          }}
        />
      )}
    </DialogWrapper>
  )
}
