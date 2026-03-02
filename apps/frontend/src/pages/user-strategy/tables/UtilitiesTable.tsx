import { DataTable } from '@/components/ui/data-table'
import { columns, UtilityColumn } from '../tables/columns'

interface Props {
  data: UtilityColumn[]
}

export const UtilitiesTable: React.FC<Props> = ({ data }) => {
  return <DataTable columns={columns} data={data} />
}
