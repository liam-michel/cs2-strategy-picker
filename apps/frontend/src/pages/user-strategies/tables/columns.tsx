import type { ColumnDef } from '@tanstack/react-table'
import { RowActions } from '@/components/ui/row-actions'
import type { inferProcedureOutput } from '@trpc/server'
import type { AppRouter } from '../../../../../backend/src/composition'

export type StrategyColumn = inferProcedureOutput<AppRouter['strategy']['getUsersStrategies']>[number]

export const columns: ColumnDef<StrategyColumn>[] = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'description', header: 'Description' },
  { accessorKey: 'side', header: 'Side' },
  { accessorKey: 'difficulty', header: 'Difficulty' },
  { accessorKey: 'economy', header: 'Economy' },
  {
    id: 'map',
    header: 'Map',
    cell: ({ row }) => row.original.map.name, // display transform lives here
  },
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
