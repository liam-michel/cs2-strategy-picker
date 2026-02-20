import type { Map, Side } from '@cs2monorepo/shared'
import type { ColumnDef } from '@tanstack/react-table'
export type StrategyColumn = {
  id: string
  name: string
  description: string
  side: Side
  difficulty: number
  map: Map
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
    accessorKey: 'map',
    header: 'Map',
  },
]
