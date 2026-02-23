// components/ui/row-actions.tsx
import { Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface RowActionsProps {
  onEdit: () => void
  onDelete: () => void
  isDeleting?: boolean
}

export function RowActions({ onEdit, onDelete, isDeleting }: RowActionsProps) {
  return (
    <div className="flex gap-2">
      <Button variant="ghost" size="icon" onClick={onEdit}>
        <Pencil className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" onClick={onDelete} disabled={isDeleting}>
        <Trash2 className="h-4 w-4 text-destructive" />
      </Button>
    </div>
  )
}
