import { Utility, PlayerRole } from '@cs2monorepo/shared'
import { FC, useState } from 'react'

// ── Types ────────────────────────────────────────────────────────────────────

type UtilityType = Utility

interface UtilityRow {
  id: string
  type: UtilityType
  location: string
  timing: string
  order: number | null
  role: PlayerRole | null
}

interface AddUtilitiesPanelProps {
  strategyId: string
  isOpen: boolean
  onClose: () => void
  onSubmit: (utilities: Omit<UtilityRow, 'id'>[]) => Promise<void>
}

// ── Constants ────────────────────────────────────────────────────────────────

const UTILITY_META: Record<UtilityType, { label: string; emoji: string; color: string; bg: string }> = {
  SMOKE: {
    label: 'Smoke',
    emoji: '💨',
    color: 'text-slate-300',
    bg: 'bg-slate-500/20 border-slate-500/40 hover:bg-slate-500/30',
  },
  FLASH: {
    label: 'Flash',
    emoji: '⚡',
    color: 'text-yellow-300',
    bg: 'bg-yellow-500/20 border-yellow-500/40 hover:bg-yellow-500/30',
  },
  HE_GRENADE: {
    label: 'HE',
    emoji: '💣',
    color: 'text-red-300',
    bg: 'bg-red-500/20 border-red-500/40 hover:bg-red-500/30',
  },
  MOLOTOV: {
    label: 'Molotov',
    emoji: '🔥',
    color: 'text-orange-300',
    bg: 'bg-orange-500/20 border-orange-500/40 hover:bg-orange-500/30',
  },
  INCENDIARY: {
    label: 'Incendiary',
    emoji: '🔥',
    color: 'text-amber-300',
    bg: 'bg-amber-500/20 border-amber-500/40 hover:bg-amber-500/30',
  },
  DECOY: {
    label: 'Decoy',
    emoji: '🎭',
    color: 'text-purple-300',
    bg: 'bg-purple-500/20 border-purple-500/40 hover:bg-purple-500/30',
  },
}

const UTILITY_TYPES = Object.keys(UTILITY_META) as UtilityType[]

const ROLES: PlayerRole[] = ['ENTRY', 'SUPPORT', 'LURKER', 'AWPER', 'IGL']

const ROLE_COLORS: Record<PlayerRole, string> = {
  ENTRY: 'bg-red-500/20 text-red-300 border-red-500/30',
  SUPPORT: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  LURKER: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  AWPER: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
  IGL: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
}

// ── Helpers ──────────────────────────────────────────────────────────────────

const newRow = (): UtilityRow => ({
  id: crypto.randomUUID(),
  type: 'SMOKE',
  location: '',
  timing: '',
  order: null,
  role: null,
})

// ── Sub-components ───────────────────────────────────────────────────────────

const UtilityTypeButton: FC<{
  type: UtilityType
  selected: boolean
  onClick: () => void
}> = ({ type, selected, onClick }) => {
  const meta = UTILITY_META[type]
  return (
    <button
      onClick={onClick}
      title={meta.label}
      className={`flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs font-semibold transition-all ${
        selected
          ? `${meta.bg} ${meta.color} ring-1 ring-inset ring-white/20 scale-[1.03]`
          : 'border-white/10 bg-white/5 text-white/40 hover:border-white/20 hover:text-white/60'
      }`}
    >
      <span>{meta.emoji}</span>
      <span>{meta.label}</span>
    </button>
  )
}

const inputCls =
  'w-full rounded-md border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs text-white/80 placeholder-white/20 outline-none transition focus:border-white/30 focus:bg-white/10 focus:ring-1 focus:ring-white/10'

const UtilityRowItem: FC<{
  row: UtilityRow
  index: number
  onChange: (id: string, patch: Partial<UtilityRow>) => void
  onRemove: (id: string) => void
}> = ({ row, index, onChange, onRemove }) => (
  <div className="group relative rounded-xl border border-white/[0.07] bg-white/[0.03] p-4 transition hover:border-white/10 hover:bg-white/[0.05]">
    {/* Row number + remove */}
    <div className="mb-3 flex items-center justify-between">
      <span className="text-[10px] font-bold uppercase tracking-widest text-white/20">Utility #{index + 1}</span>
      <button
        onClick={() => onRemove(row.id)}
        className="rounded p-1 text-white/20 opacity-0 transition hover:bg-white/10 hover:text-red-400 group-hover:opacity-100"
      >
        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>
    </div>

    {/* Type picker */}
    <div className="mb-3 flex flex-wrap gap-1.5">
      {UTILITY_TYPES.map((t) => (
        <UtilityTypeButton key={t} type={t} selected={row.type === t} onClick={() => onChange(row.id, { type: t })} />
      ))}
    </div>

    {/* Fields row */}
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      <div>
        <label className="mb-1 block text-[10px] font-semibold uppercase tracking-widest text-white/25">Location</label>
        <input
          className={inputCls}
          placeholder="e.g. A Site"
          value={row.location}
          onChange={(e) => onChange(row.id, { location: e.target.value })}
        />
      </div>

      <div>
        <label className="mb-1 block text-[10px] font-semibold uppercase tracking-widest text-white/25">Timing</label>
        <input
          className={inputCls}
          placeholder="e.g. On flash"
          value={row.timing}
          onChange={(e) => onChange(row.id, { timing: e.target.value })}
        />
      </div>

      <div>
        <label className="mb-1 block text-[10px] font-semibold uppercase tracking-widest text-white/25">Order</label>
        <input
          className={inputCls}
          type="number"
          placeholder="1"
          min={1}
          value={row.order ?? ''}
          onChange={(e) => onChange(row.id, { order: e.target.value ? parseInt(e.target.value, 10) : null })}
        />
      </div>

      <div>
        <label className="mb-1 block text-[10px] font-semibold uppercase tracking-widest text-white/25">Role</label>
        <select
          className={`${inputCls} cursor-pointer`}
          value={row.role || ''}
          onChange={(e) => onChange(row.id, { role: e.target.value as PlayerRole | null })}
        >
          <option value="">Any</option>
          {ROLES.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </div>
    </div>

    {/* Role badge preview */}
    {row.role && (
      <div className="mt-2.5 flex items-center gap-2">
        <span
          className={`rounded border px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest ${ROLE_COLORS[row.role as PlayerRole]}`}
        >
          {row.role}
        </span>
        <span className={`text-xs font-medium ${UTILITY_META[row.type].color}`}>
          {UTILITY_META[row.type].emoji} {UTILITY_META[row.type].label}
        </span>
      </div>
    )}
  </div>
)

// ── Main component ───────────────────────────────────────────────────────────

export const AddUtilitiesPanel: FC<AddUtilitiesPanelProps> = ({ strategyId, isOpen, onClose, onSubmit }) => {
  const [rows, setRows] = useState<UtilityRow[]>([newRow()])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (id: string, patch: Partial<UtilityRow>) => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)))
  }

  const handleRemove = (id: string) => {
    setRows((prev) => (prev.length > 1 ? prev.filter((r) => r.id !== id) : prev))
  }

  const handleAdd = () => setRows((prev) => [...prev, newRow()])

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      await onSubmit(
        rows.map(({ id, ...rest }) => ({
          ...rest,
        })),
      )
      setRows([newRow()])
      onClose()
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div className="fixed inset-y-0 right-0 z-50 flex w-full max-w-xl flex-col border-l border-white/[0.07] bg-slate-900 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/[0.07] px-6 py-5">
          <div>
            <h2 className="text-base font-bold uppercase tracking-wide text-white">Add Utilities</h2>
            <p className="mt-0.5 text-xs text-white/35">
              {rows.length} {rows.length === 1 ? 'utility' : 'utilities'} queued
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-white/30 transition hover:bg-white/10 hover:text-white/70"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Rows */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <div className="flex flex-col gap-3">
            {rows.map((row, i) => (
              <UtilityRowItem key={row.id} row={row} index={i} onChange={handleChange} onRemove={handleRemove} />
            ))}
          </div>

          {/* Add another */}
          <button
            onClick={handleAdd}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-white/10 py-3 text-xs font-semibold text-white/30 transition hover:border-white/20 hover:text-white/50"
          >
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
              <path d="M12 5v14M5 12h14" />
            </svg>
            Add another utility
          </button>
        </div>

        {/* Footer */}
        <div className="border-t border-white/[0.07] px-6 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="flex-1 rounded-lg border border-white/10 py-2.5 text-sm font-semibold text-white/50 transition hover:border-white/20 hover:text-white/70"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-[2] rounded-lg bg-blue-600 py-2.5 text-sm font-bold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? 'Saving…' : `Save ${rows.length} ${rows.length === 1 ? 'Utility' : 'Utilities'}`}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
