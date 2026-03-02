import { DataTable } from '@/components/ui/data-table'
import { columns, StrategyColumn } from '../../../components/strategy-table/columns'

interface Props {
  data: StrategyColumn[]
  onEdit: (item: StrategyColumn) => void
  onDelete: (item: StrategyColumn) => void
}

export const StrategiesTable: React.FC<Props> = ({ data, onEdit, onDelete }) => {
  return <DataTable columns={columns} data={data} meta={{ onEdit, onDelete }} />
}
