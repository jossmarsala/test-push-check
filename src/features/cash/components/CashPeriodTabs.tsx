import React from 'react'
import type { CashPeriod } from '../types/cash.types'

interface CashPeriodTabsProps {
  activePeriod: CashPeriod
  onPeriodChange: (period: CashPeriod) => void
}

const PERIODS: Array<{ id: CashPeriod; label: string }> = [
  { id: 'antes_ayer', label: 'Antes de ayer' },
  { id: 'ayer', label: 'Ayer' },
  { id: 'hoy', label: 'Hoy' },
]

export const CashPeriodTabs: React.FC<CashPeriodTabsProps> = ({
  activePeriod,
  onPeriodChange,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-1">
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium text-[var(--neutral-muted)]">
          Período:
        </span>
        <span className="text-xs font-semibold text-[var(--neutral-emphasis)]">
          {activePeriod === 'hoy'
            ? 'Hoy'
            : activePeriod === 'ayer'
            ? 'Ayer'
            : 'Antes de ayer'}
        </span>
      </div>

      {/* Period selector pills */}
      <nav
        aria-label="Selector de período de caja"
        className="inline-flex items-center gap-1 p-1 rounded-full bg-[var(--neutral-card)] border border-[var(--neutral-border-subtle)] shadow-2xs w-fit"
      >
        {PERIODS.map((p) => {
          const isActive = activePeriod === p.id
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => onPeriodChange(p.id)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-all whitespace-nowrap cursor-pointer select-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--sidebar-ring)] ${
                isActive
                  ? 'bg-[var(--neutral-brand)] text-white shadow-xs font-semibold'
                  : 'text-[var(--neutral-muted)] hover:text-[var(--neutral-emphasis)] hover:bg-[var(--neutral-subtle)]'
              }`}
            >
              {p.label}
            </button>
          )
        })}
      </nav>
    </div>
  )
}
