import '@tanstack/react-table'
import type { RowData } from '@tanstack/react-table'

declare module '@tanstack/react-table' {
  export interface TableMeta<TData extends RowData> {
    onEdit: (id: TData) => void
    onDelete: (id: TData) => void
  }
}
