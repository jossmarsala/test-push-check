import React from 'react'
import { CircleDollarSign, CalendarClock, BarChart3 } from 'lucide-react'
import type { CashKpiOverview } from '../types/cash.types'

interface CashKpiRowProps {
  kpis: CashKpiOverview
}

export const CashKpiRow: React.FC<CashKpiRowProps> = ({ kpis }) => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {/* Card 1: Ingresos totales */}
      <div className="rounded-[var(--radius-card)] border border-[var(--neutral-border-subtle)] bg-[var(--neutral-card)] p-5 shadow-2xs flex flex-col justify-between transition-all">
        <div>
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-medium text-[var(--neutral-muted)]">
              Ingresos totales
            </h4>
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--neutral-subtle)] text-[var(--neutral-muted)]">
              <CircleDollarSign className="h-4 w-4 stroke-[1.75]" />
            </div>
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-[var(--neutral-emphasis)] tabular-nums">
            ${kpis.ingresosTotales.toLocaleString('es-AR')}
          </div>
        </div>

        <div className="mt-4 text-xs text-[var(--neutral-muted)]">
          {kpis.ingresosDetalle}
        </div>
      </div>

      {/* Card 2: Egresos totales */}
      <div className="rounded-[var(--radius-card)] border border-[var(--neutral-border-subtle)] bg-[var(--neutral-card)] p-5 shadow-2xs flex flex-col justify-between transition-all">
        <div>
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-medium text-[var(--neutral-muted)]">
              Egresos totales
            </h4>
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--neutral-subtle)] text-[var(--neutral-muted)]">
              <CalendarClock className="h-4 w-4 stroke-[1.75]" />
            </div>
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-[var(--neutral-emphasis)] tabular-nums">
            ${kpis.egresosTotales.toLocaleString('es-AR')}
          </div>
        </div>

        <div className="mt-4 text-xs text-[var(--neutral-muted)]">
          {kpis.egresosDetalle}
        </div>
      </div>

      {/* Card 3: Efectivo esperado en caja */}
      <div className="rounded-[var(--radius-card)] border border-[var(--neutral-border-subtle)] bg-[var(--neutral-card)] p-5 shadow-2xs flex flex-col justify-between transition-all">
        <div>
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-medium text-[var(--neutral-muted)]">
              Efectivo esperado en caja
            </h4>
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--neutral-subtle)] text-[var(--neutral-muted)]">
              <BarChart3 className="h-4 w-4 stroke-[1.75]" />
            </div>
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-[var(--neutral-emphasis)] tabular-nums">
            ${kpis.efectivoEsperado.toLocaleString('es-AR')}
          </div>
        </div>

        <div className="mt-4 text-xs text-[var(--neutral-muted)]">
          Meta: ${kpis.efectivoMeta.toLocaleString('es-AR')}
        </div>
      </div>
    </div>
  )
}
