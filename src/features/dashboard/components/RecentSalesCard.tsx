import React from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import type { RecentSaleItem } from '../types/dashboard.types'

const MOCK_RECENT_SALES: RecentSaleItem[] = [
  { id: '1', customerName: 'Darlene Robertson', time: '19:00', paymentMethod: 'Efectivo' },
  { id: '2', customerName: 'Ronald Richards', time: '19:40', paymentMethod: 'Tarjeta' },
  { id: '3', customerName: 'Jerome Bell', time: '20:40', paymentMethod: 'Efectivo' },
  { id: '4', customerName: 'Robert Fox', time: '20:45', paymentMethod: 'Efectivo' },
]

interface RecentSalesCardProps {
  sales?: RecentSaleItem[]
  historyLink?: string
}

export const RecentSalesCard: React.FC<RecentSalesCardProps> = ({
  sales = MOCK_RECENT_SALES,
  historyLink = '/ventas',
}) => {
  return (
    <section className="space-y-3">
      {/* Section Header with History Link */}
      <div className="flex items-center justify-between select-none">
        <h2 className="text-base sm:text-lg font-semibold tracking-tight text-[var(--neutral-emphasis)] leading-snug">
          Ventas de hoy
        </h2>

        <Link
          to={historyLink}
          className="group inline-flex items-center gap-1 text-xs font-medium text-[var(--neutral-muted)] hover:text-[var(--neutral-emphasis)] transition-colors"
        >
          <span>Ver todas</span>
          <ChevronRight className="h-3.5 w-3.5 stroke-[1.5]" />
        </Link>
      </div>

      {/* Card Table Container */}
      <div className="rounded-[var(--radius-card)] border border-[var(--neutral-border-subtle)] bg-[var(--neutral-card)] p-5 shadow-2xs overflow-hidden transition-all">
        {/* Table Header */}
        <div className="grid grid-cols-12 pb-2.5 mb-1 text-[11px] font-medium uppercase tracking-wider text-[var(--neutral-muted)] select-none">
          <div className="col-span-6">Cliente</div>
          <div className="col-span-3 text-left">Hora</div>
          <div className="col-span-3 text-right">Medio de pago</div>
        </div>

        {/* Table Rows */}
        <div className="space-y-0.5">
          {sales.map((sale) => (
            <div
              key={sale.id}
              className="grid grid-cols-12 items-center py-2 px-1.5 -mx-1.5 rounded-md text-xs transition-colors hover:bg-[var(--neutral-subtle)]"
            >
              {/* Customer Name */}
              <div className="col-span-6 font-medium text-[var(--neutral-emphasis)] truncate pr-2">
                {sale.customerName}
              </div>

              {/* Time */}
              <div className="col-span-3 text-left font-mono tabular-nums text-[var(--neutral-muted)]">
                {sale.time}
              </div>

              {/* Payment Method Badge */}
              <div className="col-span-3 flex justify-end">
                <span className="text-[11px] text-[var(--neutral-muted)]">
                  {sale.paymentMethod}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
