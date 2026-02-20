import { columns, StrategyColumn } from '../../components/strategy-table/columns'
import { DataTable } from '@/components/ui/data-table'
import { useUserStrategies } from '@/hooks/user/useUserStrategies'
import { Button } from '@/components/ui/button'
import { CreateStrategyForm } from '@/forms/createStrategyForm'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog'
import { DialogWrapper } from '@/components/ui/dialog-wrapper'
export default function UserStrategies() {
  const { data, error } = useUserStrategies()

  if (error) {
    return <div>Error loading strategies: {error.message}</div>
  }

  return (
    <div>
      <DialogWrapper
        title="Create New Strategy"
        description="Fill out the form below to create a new strategy."
        triggerLabel="Create Strategy"
      >
        <CreateStrategyForm onSubmit={async () => console.log('hello')} />
      </DialogWrapper>

      <h1>My Strategies</h1>
      <DataTable columns={columns} data={data ?? []} />
    </div>
  )
}
