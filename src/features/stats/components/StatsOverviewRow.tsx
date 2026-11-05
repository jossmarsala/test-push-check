import React from 'react'
import { TrendBadge } from '@/components/ui/trend-badge'
import { formatCurrency } from '@/lib/utils'
import type { BalanceStatsKpis } from '../types/stats.types'

interface StatsOverviewRowProps {
  stats: BalanceStatsKpis
}

export const StatsOverviewRow: React.FC<StatsOverviewRowProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {/* 1. Ingresos del mes */}
      <div className="rounded-[var(--radius-card)] border border-[var(--neutral-border-subtle)] bg-[var(--neutral-card)] p-5 shadow-2xs flex flex-col justify-between transition-all">
        <div>
          <h4 className="text-xs font-medium text-[var(--neutral-muted)]">
            Ingresos del mes
          </h4>
          <div className="mt-2 flex items-baseline gap-2.5 flex-wrap">
            <span className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--neutral-emphasis)] tabular-nums">
              {formatCurrency(stats.ingresosMes)}
            </span>
            <TrendBadge
              value={stats.variacionIngresosPct}
              isPositive={stats.variacionIngresosPct >= 0}
              prefix={stats.variacionIngresosPct >= 0 ? '+' : ''}
            />
          </div>
        </div>
        <div className="mt-4 text-xs text-[var(--neutral-muted)]">
          Hoy: <span className="font-semibold text-[var(--neutral-body)]">{formatCurrency(stats.ventasHoy)}</span>
        </div>
      </div>

      {/* 2. Gastos del mes */}
      <div className="rounded-[var(--radius-card)] border border-[var(--neutral-border-subtle)] bg-[var(--neutral-card)] p-5 shadow-2xs flex flex-col justify-between transition-all">
        <div>
          <h4 className="text-xs font-medium text-[var(--neutral-muted)]">
            Gastos del mes
          </h4>
          <div className="mt-2 flex items-baseline gap-2.5 flex-wrap">
            <span className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--neutral-emphasis)] tabular-nums">
              {formatCurrency(stats.gastosMes)}
            </span>
            <TrendBadge
              value={Math.abs(stats.variacionGastosPct)}
              isPositive={stats.variacionGastosPct <= 0}
              prefix={stats.variacionGastosPct <= 0 ? '-' : '+'}
            />
          </div>
        </div>
        <div className="mt-4 text-xs text-[var(--neutral-muted)]">
          Hoy: <span className="font-semibold text-[var(--neutral-body)]">{formatCurrency(stats.gastosHoy)}</span>
        </div>
      </div>

      {/* 3. Utilidad Neta Real */}
      <div className="rounded-[var(--radius-card)] border border-[var(--neutral-border-subtle)] bg-[var(--neutral-card)] p-5 shadow-2xs flex flex-col justify-between transition-all">
        <div>
          <h4 className="text-xs font-medium text-[var(--neutral-muted)]">
            Utilidad neta
          </h4>
          <div className="mt-2 flex items-baseline gap-2.5 flex-wrap">
            <span className="text-2xl sm:text-3xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400 tabular-nums">
              {formatCurrency(stats.utilidadNeta)}
            </span>
            <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              {stats.margenNetoPct}% margen
            </span>
          </div>
        </div>
        <div className="mt-4 text-xs text-[var(--neutral-muted)]">
          Ingresos menos egresos
        </div>
      </div>

      {/* 4. Balance neto de hoy */}
      <div className="rounded-[var(--radius-card)] border border-[var(--neutral-border-subtle)] bg-[var(--neutral-card)] p-5 shadow-2xs flex flex-col justify-between transition-all">
        <div>
          <h4 className="text-xs font-medium text-[var(--neutral-muted)]">
            Balance neto de hoy
          </h4>
          <div className="mt-2 flex items-baseline gap-2.5 flex-wrap">
            <span className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--neutral-emphasis)] tabular-nums">
              +{formatCurrency(stats.balanceHoy)}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

