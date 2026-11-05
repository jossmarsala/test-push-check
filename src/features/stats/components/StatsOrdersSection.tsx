import React from 'react'
import { ArrowRight, CheckCircle2 } from 'lucide-react'
import type { WorkshopStatsSummary } from '../types/stats.types'

interface StatsOrdersSectionProps {
  summary: WorkshopStatsSummary
  onViewAllOrders: () => void
}

export const StatsOrdersSection: React.FC<StatsOrdersSectionProps> = ({
  summary,
  onViewAllOrders,
}) => {
  return (
    <section className="space-y-3.5 flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-base sm:text-lg font-semibold tracking-tight text-[var(--neutral-emphasis)] leading-snug">
          Rendimiento de taller
        </h2>

        <button
          type="button"
          onClick={onViewAllOrders}
          className="inline-flex h-8 items-center gap-1.5 rounded-[var(--radius-btn)] border border-[var(--neutral-border-subtle)] bg-[var(--neutral-surface)] px-2.5 text-xs font-medium text-[var(--neutral-emphasis)] hover:bg-[var(--neutral-subtle)] active:scale-[0.98] transition-colors cursor-pointer shadow-2xs"
        >
          <span>Ver pedidos</span>
          <ArrowRight className="h-3.5 w-3.5 text-[var(--neutral-muted)]" />
        </button>
      </div>

      {/* Card */}
      <div className="rounded-[var(--radius-card)] border border-[var(--neutral-border-subtle)] bg-[var(--neutral-card)] p-5 shadow-2xs flex-1 flex flex-col justify-between">
        <div className="grid grid-cols-2 gap-3.5">
          {/* Item 1 */}
          <div className="p-3 rounded-lg bg-[var(--neutral-subtle)]/60 flex flex-col justify-between">
            <span className="text-[11px] font-medium text-[var(--neutral-muted)]">
              En banco activo
            </span>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-2xl font-bold font-mono tracking-tight text-[var(--neutral-emphasis)]">
                {summary.enTaller}
              </span>
              <span className="text-[11px] text-[var(--neutral-muted)]">piezas</span>
            </div>
            <span className="mt-1 text-[10px] text-[var(--neutral-muted)]">
              Reparaciones y hechuras
            </span>
          </div>

          {/* Item 2 */}
          <div className="p-3 rounded-lg bg-[var(--neutral-subtle)]/60 flex flex-col justify-between">
            <span className="text-[11px] font-medium text-[var(--neutral-muted)]">
              Listos para retiro
            </span>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-2xl font-bold font-mono tracking-tight text-[var(--neutral-emphasis)]">
                {summary.listosEntrega}
              </span>
              <span className="text-[11px] text-[var(--neutral-muted)]">pedidos</span>
            </div>
            <span className="mt-1 text-[10px] text-[var(--neutral-muted)]">
              Avisados a clientes
            </span>
          </div>

          {/* Item 3 */}
          <div className="p-3 rounded-lg bg-[var(--neutral-subtle)]/60 flex flex-col justify-between">
            <span className="text-[11px] font-medium text-[var(--neutral-muted)]">
              Entregados del mes
            </span>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-2xl font-bold font-mono tracking-tight text-[var(--neutral-emphasis)]">
                {summary.entregadosMes}
              </span>
              <span className="text-[11px] text-[var(--neutral-muted)]">órdenes</span>
            </div>
            <span className="mt-1 text-[10px] text-[var(--neutral-muted)]">
              Trabajos despachados
            </span>
          </div>

          {/* Item 4 */}
          <div className="p-3 rounded-lg bg-[var(--neutral-subtle)]/60 flex flex-col justify-between">
            <span className="text-[11px] font-medium text-[var(--neutral-muted)] flex items-center justify-between">
              <span>A tiempo</span>
              <CheckCircle2 className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
            </span>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-2xl font-bold font-mono tracking-tight text-emerald-600 dark:text-emerald-400">
                {summary.cumplimientoPct}%
              </span>
            </div>
            <span className="mt-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
              Tasa de cumplimiento
            </span>
          </div>
        </div>

        <div className="pt-4 mt-4 border-t border-[var(--neutral-border-subtle)] flex items-center justify-between text-xs text-[var(--neutral-muted)]">
          <span>Tiempo promedio de entrega: 4 días hábiles</span>
        </div>
      </div>
    </section>
  )
}
