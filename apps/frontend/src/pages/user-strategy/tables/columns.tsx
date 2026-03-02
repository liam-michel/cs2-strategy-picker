import type { ColumnDef } from '@tanstack/react-table'
import { RowActions } from '@/components/ui/row-actions'
import type { inferProcedureOutput } from '@trpc/server'
import type { AppRouter } from '../../../../../backend/src/composition'

export type UtilityColumn = inferProcedureOutput<AppRouter['utility']['getStrategyUtilities']>[number]

export const columns: ColumnDef<UtilityColumn>[] = [
  { accessorKey: 'type', header: 'Type' },
  { accessorKey: 'location', header: 'Location' },
  { accessorKey: 'timing', header: 'Timing' },
  { accessorKey: 'order', header: 'Order' },
  { accessorKey: 'role', header: 'Role' },
  {
    id: 'actions',
    cell: ({ row, table }) => (
      <RowActions
        onEdit={() => table.options.meta?.onEdit?.(row.original)}
        onDelete={() => table.options.meta?.onDelete?.(row.original)}
      />
    ),
  },
]
