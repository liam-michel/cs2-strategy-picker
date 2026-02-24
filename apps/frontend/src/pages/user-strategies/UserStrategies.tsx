import { columns, StrategyColumn } from '../../components/strategy-table/columns'
import { DataTable } from '@/components/ui/data-table'
import { StrategyForm } from '@/forms/StrategyForm'
import { DialogWrapper } from '@/components/ui/dialog-wrapper'
import { toast } from 'sonner'
import { trpc } from '@/lib/providers/trpc'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import useFormOpen from '@/hooks/ui/useFormOpen'
import { useState } from 'react'
import { DeleteForm } from '@/forms/DeleteForm'

export default function UserStrategies() {
  const { data, error, isLoading } = trpc.strategy.getUsersStrategies.useQuery()
  const createStrategyMutation = trpc.strategy.createStrategy.useMutation()
  const editStrategyMutation = trpc.strategy.editStrategy.useMutation()
  const deleteStrategyMutation = trpc.strategy.deleteStrategy.useMutation()

  const utils = trpc.useUtils()
  const revalidate = () => utils.strategy.getUsersStrategies.invalidate()

  //form opening closing state for the edit/delete
  const { isOpen: isEditOpen, openForm: openEditForm, closeForm: closeEditForm } = useFormOpen()
  const { isOpen: isDeleteOpen, openForm: openDeleteForm, closeForm: closeDeleteForm } = useFormOpen()
  const [selectedItem, setSelectedItem] = useState<StrategyColumn | null>(null)

  if (error) {
    return <div>Error loading strategies: {error.message}</div>
  }

  return (
    <div className="flex justify-center items-start min-h-screen p-8">
      <Card className="w-full max-w-5xl">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>My Strategies</CardTitle>
          <DialogWrapper
            title="Create New Strategy"
            description="Fill out the form below to create a new strategy."
            triggerLabel="Create Strategy"
          >
            {({ close }) => (
              <StrategyForm
                onSubmit={async (data) => {
                  createStrategyMutation.mutate(data, {
                    onSuccess: () => {
                      revalidate()
                      close()
                    },
                    onError: (err) => toast.error(err.message),
                  })
                }}
              />
            )}
          </DialogWrapper>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div>Loading...</div>
          ) : data?.length === 0 ? (
            <div>You have no strategies yet. Create one to get started!</div>
          ) : null}
          {data && data.length > 0 && (
            <DataTable
              columns={columns}
              data={data}
              meta={{
                onEdit: (item) => {
                  setSelectedItem(item)
                  openEditForm()
                },
                onDelete: (item) => {
                  setSelectedItem(item)
                  openDeleteForm()
                },
              }}
            />
          )}
          <DialogWrapper
            title="Edit Strategy"
            description="Update the fields below to edit your strategy."
            open={isEditOpen}
            onOpenChange={(open) => {
              if (!open) {
                setSelectedItem(null)
                closeEditForm()
              }
            }}
          >
            {({ close }) => (
              <StrategyForm
                initialData={
                  selectedItem
                    ? {
                        name: selectedItem.name,
                        map: selectedItem.map.name as
                          | 'Dust II'
                          | 'Inferno'
                          | 'Mirage'
                          | 'Nuke'
                          | 'Overpass'
                          | 'Vertigo'
                          | 'Ancient'
                          | 'Anubis'
                          | 'Train',
                        side: selectedItem.side,
                        description: selectedItem.description,
                        difficulty: selectedItem.difficulty,
                        economy: selectedItem.economy,
                      }
                    : undefined
                }
                onSubmit={async (data) => {
                  if (!selectedItem) return
                  console.log(data)
                  console.log(selectedItem.id)
                  editStrategyMutation.mutate(
                    { ...data, id: selectedItem.id },
                    {
                      onSuccess: () => {
                        revalidate()
                        close()
                      },
                      onError: (err) => toast.error(err.message),
                    },
                  )
                }}
              />
            )}
          </DialogWrapper>
          <DeleteForm
            title="Delete Strategy"
            description="Are you sure you want to delete this strategy? This action cannot be undone."
            open={isDeleteOpen}
            onOpenChange={closeDeleteForm}
            onConfirm={async () => {
              if (!selectedItem) return
              deleteStrategyMutation.mutate(
                { id: selectedItem.id },
                {
                  onSuccess: () => {
                    revalidate()
                    closeDeleteForm()
                  },
                  onError: (err) => toast.error(err.message),
                },
              )
            }}
          />
        </CardContent>
      </Card>
    </div>
  )
}
