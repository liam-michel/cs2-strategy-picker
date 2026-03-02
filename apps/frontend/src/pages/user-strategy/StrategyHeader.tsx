import { FC } from 'react'

interface StrategyHeaderProps {
  name: string
  description?: string
  map: { name: string }
  side: string
  difficulty: number
  economy: string
}

const DIFFICULTY_LABELS: Record<number, string> = {
  1: 'Beginner',
  2: 'Easy',
  3: 'Intermediate',
  4: 'Hard',
  5: 'Expert',
}

const SIDE_STYLES: Record<string, { badge: string; bar: string }> = {
  CT: {
    badge: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    bar: 'bg-blue-500',
  },
  T: {
    badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    bar: 'bg-amber-500',
  },
}

const DifficultyPips: FC<{ difficulty: number; max?: number }> = ({ difficulty, max = 5 }) => (
  <div className="flex gap-1 mt-1.5">
    {Array.from({ length: max }).map((_, i) => (
      <div
        key={i}
        className={`h-1.5 w-5 rounded-full transition-colors ${i < difficulty ? 'bg-amber-400' : 'bg-white/10'}`}
      />
    ))}
  </div>
)

const MetaItem: FC<{ label: string; value: string; children?: React.ReactNode }> = ({ label, value, children }) => (
  <div className="flex flex-col gap-0.5">
    <span className="text-[10px] font-semibold uppercase tracking-widest text-white/30">{label}</span>
    <span className="text-sm font-semibold text-white/80">{value}</span>
    {children}
  </div>
)

export const StrategyHeader: FC<StrategyHeaderProps> = ({ name, description, map, side, difficulty, economy }) => {
  const sideStyle = SIDE_STYLES[side] ?? SIDE_STYLES.CT

  return (
    <div className="relative overflow-hidden rounded-xl border border-white/[0.06] bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm shadow-xl">
      {/* Top accent bar */}
      <div className={`absolute inset-x-0 top-0 h-[2px] ${sideStyle.bar}`} />

      <div className="px-7 pb-6 pt-7">
        {/* Header row */}
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h1 className="truncate text-2xl font-bold uppercase tracking-tight text-white">{name}</h1>
            {description && <p className="mt-1 text-sm leading-relaxed text-white/40">{description}</p>}
          </div>

          <span
            className={`mt-0.5 shrink-0 rounded-md border px-3 py-1 text-xs font-bold uppercase tracking-widest ${sideStyle.badge}`}
          >
            {side}
          </span>
        </div>

        {/* Divider */}
        <div className="my-5 h-px bg-white/[0.06]" />

        {/* Meta row */}
        <div className="flex flex-wrap gap-x-8 gap-y-4">
          <MetaItem label="Map" value={map.name} />
          <MetaItem label="Economy" value={economy.replace(/_/g, ' ')} />
          <MetaItem label="Difficulty" value={DIFFICULTY_LABELS[difficulty] ?? `Level ${difficulty}`}>
            <DifficultyPips difficulty={difficulty} />
          </MetaItem>
        </div>
      </div>
    </div>
  )
}
