import { useState } from 'react'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

interface DialogWrapperProps {
  title: string
  description?: string
  triggerLabel?: string
  children: (helpers: { close: () => void }) => React.ReactNode
  error?: string | null
  // Optional controlled props
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function DialogWrapper({
  title,
  description,
  triggerLabel,
  children,
  error,
  open: controlledOpen,
  onOpenChange,
}: DialogWrapperProps) {
  const [internalOpen, setInternalOpen] = useState(false)

  // If the caller passes `open`, we use that. Otherwise fall back to internal state.
  const isControlled = controlledOpen !== undefined
  const open = isControlled ? controlledOpen : internalOpen

  // If the caller passes `onOpenChange`, delegate to them. Otherwise manage internally.
  // Either way, the dialog always has a handler to call.
  const handleOpenChange = (next: boolean) => {
    if (!isControlled) setInternalOpen(next)
    onOpenChange?.(next)
  }

  const close = () => handleOpenChange(false)

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {triggerLabel && (
        <DialogTrigger asChild>
          <Button>{triggerLabel}</Button>
        </DialogTrigger>
      )}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        {error && <p className="text-sm text-destructive">{error}</p>}
        {children({ close })}
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
