import type { Economy, Map, Side } from '@cs2monorepo/shared'
import type { ColumnDef } from '@tanstack/react-table'
import { RowActions } from '../ui/row-actions'

export type StrategyColumn = {
  id: string
  name: string
  description: string
  side: Side
  difficulty: number
  map: string
  economy: string
}

export const columns: ColumnDef<StrategyColumn>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'description',
    header: 'Description',
  },
  {
    accessorKey: 'side',
    header: 'Side',
  },
  {
    accessorKey: 'difficulty',
    header: 'Difficulty',
  },
  {
    accessorKey: 'economy',
    header: 'Economy',
  },
  {
    accessorKey: 'map',
    header: 'Map',
  },
  {
    id: 'actions',
    cell: ({ table, row }) => (
      <RowActions
        onEdit={() => table.options.meta?.onEdit(row.original)}
        onDelete={() => table.options.meta?.onDelete(row.original)}
      />
    ),
  },
]
