import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { SearchBar } from '@/components/SearchBar'
import { StrategiesTable } from './tables/StrategiesTable'
import { CreateStrategyDialog } from './dialogs/CreateStrategyDialog'
import { EditStrategyDialog } from './dialogs/EditStrategyDialog'
import { DeleteStrategyDialog } from './dialogs/DeleteStrategyDialog'
import { trpc } from '@/lib/providers/trpc'
import { StrategyColumn } from './tables/columns'
import { useQueryParams } from '@/hooks/useQueryParams'
import { useCurrentUser } from '@/lib/providers/AuthContext'
export default function UserStrategiesPage() {
  const user = useCurrentUser()
  const params = useQueryParams()
  const { query, page, limit } = params.params
  const { setParams } = params
  const { data, error, isLoading } = trpc.strategy.getUsersStrategiesPaginated.useQuery({
    query,
    page,
    limit,
  })
  const [selectedItem, setSelectedItem] = useState<StrategyColumn | null>(null)
  const [isEditOpen, setEditOpen] = useState(false)
  const [isDeleteOpen, setDeleteOpen] = useState(false)

  const utils = trpc.useUtils()
  const revalidate = () => utils.strategy.getUsersStrategiesPaginated.invalidate()

  if (error) return <div>Error loading strategies: {error.message}</div>

  return (
    <div className="flex justify-center items-start min-h-screen p-8">
      <Card className="w-full max-w-5xl">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{user.name} Strategies</CardTitle>
          <SearchBar
            onSubmit={(val) => setParams({ ...params.params, query: val })}
            placeholder="Search your strategies..."
            className="max-w-sm"
          />
          <CreateStrategyDialog onSuccess={revalidate} />
        </CardHeader>

        <CardContent>
          {isLoading && <div>Loading...</div>}
          {data && data.length === 0 && (
            <div>You have no strategies matching this query. Create one to get started!</div>
          )}

          {data && data.length > 0 && (
            <StrategiesTable
              data={data}
              onEdit={(item) => {
                setSelectedItem(item)
                setEditOpen(true)
              }}
              onDelete={(item) => {
                setSelectedItem(item)
                setDeleteOpen(true)
              }}
            />
          )}

          {selectedItem && (
            <EditStrategyDialog
              strategy={selectedItem}
              open={isEditOpen}
              onOpenChange={setEditOpen}
              onSuccess={() => setSelectedItem(null)}
            />
          )}

          {selectedItem && (
            <DeleteStrategyDialog
              strategy={selectedItem}
              open={isDeleteOpen}
              onOpenChange={setDeleteOpen}
              onSuccess={() => setSelectedItem(null)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
