//reusable delete form component for confirming deletion of anything (strategy/map etc)
import { DialogWrapper } from '@/components/ui/dialog-wrapper'

type DeleteFormProps = {
  title?: string
  description?: string
  onConfirm: () => Promise<void>
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export const DeleteForm = ({ title, description, onConfirm, open, onOpenChange }: DeleteFormProps) => (
  <DialogWrapper
    title={title ?? 'Delete Item'}
    description={description ?? 'This action cannot be undone.'}
    open={open}
    onOpenChange={onOpenChange}
  >
    {({ close }) => (
      <button
        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
        onClick={async () => {
          await onConfirm()
          close()
        }}
      >
        Confirm Deletion
      </button>
    )}
  </DialogWrapper>
)
