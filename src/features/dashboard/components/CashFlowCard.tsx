import React from 'react'
import { ArrowDown, ArrowUp } from 'lucide-react'
import type { CashFlowData } from '../types/dashboard.types'

const DEFAULT_CASH_FLOW: CashFlowData = {
  total: 12480,
  expenses: 5000,
  income: 17480,
}

interface CashFlowCardProps {
  data?: CashFlowData
  className?: string
}

export const CashFlowCard: React.FC<CashFlowCardProps> = ({
  data = DEFAULT_CASH_FLOW,
  className = '',
}) => {
  const formatCurrency = (val: number) => {
    return val.toLocaleString('es-AR')
  }

  return (
    <section className={`space-y-2 sm:space-y-2.5 flex flex-col ${className}`}>
      {/* Section Title */}
      <h2 className="text-sm sm:text-base font-semibold tracking-tight text-[var(--neutral-emphasis)] leading-snug select-none">
        Flujo de caja de hoy
      </h2>

      {/* Card Container */}
      <div className="flex flex-col justify-between rounded-[var(--radius-card)] border border-[var(--neutral-border-subtle)] bg-[var(--neutral-card)] p-4 sm:p-5 shadow-2xs transition-all flex-1 min-h-[130px]">
        {/* Top Header Row with Total label */}
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-medium text-[var(--neutral-muted)] select-none">
            Balance neto del día
          </h4>
        </div>

        {/* Big Monetary Metric */}
        <div className="mt-3 flex flex-col">
          <div className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--neutral-emphasis)] tabular-nums leading-tight select-all">
            ${formatCurrency(data.total)}
          </div>

          {/* Submetrics Breakdown: Egresos vs Ingresos with arrows */}
          <div className="mt-2 flex items-center gap-2.5 text-xs text-[var(--neutral-muted)] tabular-nums flex-wrap">
            <span className="inline-flex items-center gap-1">
              <ArrowDown className="h-3.5 w-3.5 stroke-[2] text-rose-500" />
              <span>${formatCurrency(data.expenses)} egresos</span>
            </span>
            <span className="text-[var(--neutral-border)]">·</span>
            <span className="inline-flex items-center gap-1">
              <ArrowUp className="h-3.5 w-3.5 stroke-[2] text-emerald-500" />
              <span>${formatCurrency(data.income)} ingresos</span>
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
