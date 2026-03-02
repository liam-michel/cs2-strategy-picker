import { DataTable } from '@/components/ui/data-table'
import { columns, StrategyColumn } from '../tables/columns'
import { useNavigate } from '@tanstack/react-router'

interface Props {
  data: StrategyColumn[]
  onEdit: (item: StrategyColumn) => void
  onDelete: (item: StrategyColumn) => void
}

export const StrategiesTable: React.FC<Props> = ({ data, onEdit, onDelete }) => {
  const navigate = useNavigate()

  const handleView = (item: StrategyColumn) => {
    navigate({ to: '/strategy/$id', params: { id: item.id } })
  }
  return <DataTable columns={columns} data={data} meta={{ onEdit, onDelete, onView: handleView }} />
}
