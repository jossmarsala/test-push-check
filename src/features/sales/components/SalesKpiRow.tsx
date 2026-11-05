import React from 'react'
import { TrendBadge } from '@/components/ui/trend-badge'
import type { SalesKpiData } from '../types/sales.types'
import { formatCurrency } from '@/lib/utils'

interface SalesKpiRowProps {
  kpis: SalesKpiData
  onNewSaleClick?: () => void
}

export const SalesKpiRow: React.FC<SalesKpiRowProps> = ({ kpis }) => {
  const ticketPromedio = Math.round(kpis.ingresosTotales / (kpis.ventasEsteMes || 1))
  const ticketMesPasado = Math.round(kpis.ingresosMesPasado / (kpis.ventasMesPasado || 1))
  const ticketVariacionPct =
    ticketMesPasado > 0
      ? Math.round(((ticketPromedio - ticketMesPasado) / ticketMesPasado) * 100)
      : 0
  const isTicketUp = ticketVariacionPct >= 0

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {/* Card 1: Ventas este mes */}
      <div className="rounded-[var(--radius-card)] border border-[var(--neutral-border-subtle)] bg-[var(--neutral-card)] p-5 shadow-2xs flex flex-col justify-between transition-all">
        <div>
          <h4 className="text-xs font-medium text-[var(--neutral-muted)]">
            Ventas este mes
          </h4>
          <div className="mt-2 flex items-baseline gap-3">
            <span className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--neutral-emphasis)] tabular-nums">
              {kpis.ventasEsteMes}
            </span>
            <TrendBadge
              value={kpis.ventasVariacionPct}
              isPositive={kpis.ventasVariacionPct >= 0}
            />
          </div>
        </div>

        <div className="mt-4 text-xs text-[var(--neutral-muted)]">
          Mes pasado: <span className="font-semibold text-[var(--neutral-body)]">{kpis.ventasMesPasado}</span>
        </div>
      </div>

      {/* Card 2: Ingresos totales */}
      <div className="rounded-[var(--radius-card)] border border-[var(--neutral-border-subtle)] bg-[var(--neutral-card)] p-5 shadow-2xs flex flex-col justify-between transition-all">
        <div>
          <h4 className="text-xs font-medium text-[var(--neutral-muted)]">
            Ingresos totales
          </h4>
          <div className="mt-2 flex items-baseline gap-3">
            <span className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--neutral-emphasis)] tabular-nums">
              {formatCurrency(kpis.ingresosTotales)}
            </span>
            <TrendBadge
              value={kpis.ingresosVariacionPct}
              isPositive={kpis.ingresosVariacionPct >= 0}
              prefix={kpis.ingresosVariacionPct >= 0 ? '+' : ''}
            />
          </div>
        </div>

        <div className="mt-4 text-xs text-[var(--neutral-muted)]">
          Mes pasado:{' '}
          <span className="font-semibold text-[var(--neutral-body)]">
            {formatCurrency(kpis.ingresosMesPasado)}
          </span>
        </div>
      </div>

      {/* Card 3: Ticket promedio */}
      <div className="rounded-[var(--radius-card)] border border-[var(--neutral-border-subtle)] bg-[var(--neutral-card)] p-5 shadow-2xs flex flex-col justify-between transition-all">
        <div>
          <h4 className="text-xs font-medium text-[var(--neutral-muted)]">
            Ticket promedio
          </h4>
          <div className="mt-2 flex items-baseline gap-3">
            <span className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--neutral-emphasis)] tabular-nums">
              {formatCurrency(ticketPromedio)}
            </span>
            <TrendBadge
              value={ticketVariacionPct}
              isPositive={isTicketUp}
              prefix={isTicketUp ? '+' : ''}
            />
          </div>
        </div>

        <div className="mt-4 text-xs text-[var(--neutral-muted)]">
          Mes pasado:{' '}
          <span className="font-semibold text-[var(--neutral-body)]">
            {formatCurrency(ticketMesPasado)}
          </span>
        </div>
      </div>
    </div>
  )
}
