import { trpc } from '@/lib/providers/trpc'
import { strategyRoute } from '@/router'
import { StrategyHeader } from './StrategyHeader'
import { useState } from 'react'
import { AddUtilitiesPanel } from './UtilityPicker'
import { Button } from '@/components/ui/button'
import { UtilitiesTable } from './tables/UtilitiesTable'
export default function StrategyDetail() {
  const [panelOpen, setPanelOpen] = useState(false)
  const { id } = strategyRoute.useParams()
  const utils = trpc.useUtils()
  const addUtilityMutation = trpc.utility.addUtility.useMutation()
  const {
    data: strategyData,
    error: strategyError,
    isLoading: strategyIsLoading,
  } = trpc.strategy.getUserStrategyById.useQuery({ id })

  const {
    data: utilitiesData,
    error: utilitiesError,
    isLoading: utilitiesIsLoading,
  } = trpc.utility.getStrategyUtilities.useQuery({ id })

  if (strategyIsLoading) return <div>Loading...</div>
  if (strategyError) return <div>Error: {strategyError.message}</div>
  if (!strategyData) return <div>Strategy not found</div>
  return (
    <>
      <StrategyHeader
        name={strategyData.name}
        description={strategyData.description}
        map={strategyData.map}
        side={strategyData.side}
        difficulty={strategyData.difficulty}
        economy={strategyData.economy}
      />
      <Button onClick={() => setPanelOpen(true)} className="mt-4">
        Add Utilities
      </Button>
      <AddUtilitiesPanel
        strategyId={id}
        isOpen={panelOpen}
        onClose={() => setPanelOpen(false)}
        onSubmit={async (utilities) => {
          await Promise.all(
            utilities.map((u) =>
              addUtilityMutation.mutateAsync({
                strategyId: id,
                type: u.type,
                role: u.role,
                location: u.location,
                timing: u.timing,
                order: u.order,
              }),
            ),
          )
          await utils.utility.getStrategyUtilities.invalidate({ id })
          setPanelOpen(false)
        }}
      />
      {utilitiesData && utilitiesData.length > 0 && <UtilitiesTable data={utilitiesData} />}
    </>
  )
}
