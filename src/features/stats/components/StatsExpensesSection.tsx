import React from 'react'
import { ArrowRight } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import type { ExpenseDistributionItem } from '../types/stats.types'

interface StatsExpensesSectionProps {
  distribution: ExpenseDistributionItem[]
  totalGastosMes: number
  onViewDetail: () => void
}

export const StatsExpensesSection: React.FC<StatsExpensesSectionProps> = ({
  distribution,
  totalGastosMes,
  onViewDetail,
}) => {
  return (
    <section className="space-y-3.5 flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-base sm:text-lg font-semibold tracking-tight text-[var(--neutral-emphasis)] leading-snug">
          Estructura de gastos
        </h2>

        <button
          type="button"
          onClick={onViewDetail}
          className="inline-flex h-8 items-center gap-1.5 rounded-[var(--radius-btn)] border border-[var(--neutral-border-subtle)] bg-[var(--neutral-surface)] px-2.5 text-xs font-medium text-[var(--neutral-emphasis)] hover:bg-[var(--neutral-subtle)] active:scale-[0.98] transition-colors cursor-pointer shadow-2xs"
        >
          <span>Ver detalle</span>
          <ArrowRight className="h-3.5 w-3.5 text-[var(--neutral-muted)]" />
        </button>
      </div>

      {/* Card */}
      <div className="rounded-[var(--radius-card)] border border-[var(--neutral-border-subtle)] bg-[var(--neutral-card)] p-5 shadow-2xs flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-xs text-[var(--neutral-muted)] mb-4">
            <span className="font-semibold text-[var(--neutral-emphasis)]">
              Rubros principales
            </span>
            <span className="font-mono text-xs text-[var(--neutral-muted)]">
              Total: {formatCurrency(totalGastosMes)}
            </span>
          </div>

          <div className="space-y-4">
            {distribution.map((item) => (
              <div key={item.label} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-[var(--neutral-emphasis)] truncate pr-2">
                    {item.label}
                  </span>
                  <div className="flex items-center gap-2 shrink-0 font-mono tabular-nums text-xs">
                    <span className="text-[var(--neutral-muted)] text-[11px]">
                      {item.percentage}%
                    </span>
                    <span className="font-semibold text-[var(--neutral-emphasis)]">
                      {formatCurrency(item.amount)}
                    </span>
                  </div>
                </div>

                <div className="h-1.5 w-full rounded-full bg-[var(--neutral-subtle)] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[var(--neutral-brand)] transition-all duration-300"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-4 mt-4 border-t border-[var(--neutral-border-subtle)] flex items-center justify-between text-xs text-[var(--neutral-muted)]">
          <span>Insumos y taller concentran el 50% de los egresos</span>
        </div>
      </div>
    </section>
  )
}
