import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight, Eye } from 'lucide-react'
import { INITIAL_SALES } from '@/features/sales/data/mockSales'
import { SaleDetailDialog } from '@/features/sales/components/SaleDetailDialog'
import type { SaleRecord } from '@/features/sales/types/sales.types'
import type { RecentSaleItem } from '../types/dashboard.types'

interface RecentSalesCardProps {
  sales?: (RecentSaleItem | SaleRecord)[]
  historyLink?: string
  maxItems?: number
  className?: string
}

function isSaleRecord(item: SaleRecord | RecentSaleItem): item is SaleRecord {
  return 'cliente' in item && 'total' in item
}

export const RecentSalesCard: React.FC<RecentSalesCardProps> = ({
  sales = INITIAL_SALES,
  historyLink = '/ventas',
  maxItems = 4,
  className = '',
}) => {
  const [selectedSale, setSelectedSale] = useState<SaleRecord | null>(null)

  const displayedSales = sales.slice(0, maxItems).map((item) => {
    if (isSaleRecord(item)) {
      return {
        id: item.id,
        customerName: item.cliente,
        productText: item.productosTexto,
        time: item.hora,
        paymentMethod: item.pago,
        total: item.total,
        originalRecord: item,
      }
    }
    return {
      id: item.id,
      customerName: item.customerName,
      productText: '',
      time: item.time,
      paymentMethod: item.paymentMethod,
      total: item.total,
      originalRecord: null,
    }
  })

  return (
    <section className={`space-y-2 sm:space-y-2.5 flex flex-col ${className}`}>
      {/* Section Header with History Link */}
      <div className="flex items-center justify-between select-none">
        <h2 className="text-sm sm:text-base font-semibold tracking-tight text-[var(--neutral-emphasis)] leading-snug">
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
      <div className="flex-1 flex flex-col justify-between rounded-[var(--radius-card)] border border-[var(--neutral-border-subtle)] bg-[var(--neutral-card)] p-4 sm:p-5 shadow-2xs overflow-hidden transition-all">
        {/* Table Header */}
        <div className="grid grid-cols-12 pb-2 mb-1 text-[11px] font-medium uppercase tracking-wider text-[var(--neutral-muted)] select-none">
          <div className="col-span-5 sm:col-span-4">Cliente</div>
          <div className="col-span-3 sm:col-span-3 text-right">Total</div>
          <div className="col-span-2 sm:col-span-2 text-center">Hora</div>
          <div className="col-span-2 sm:col-span-3 text-right pr-0.5">Pago</div>
        </div>

        {/* Table Rows */}
        <div className="space-y-0.5 divide-y divide-[var(--neutral-border-subtle)]/30">
          {displayedSales.length === 0 ? (
            <div className="py-6 text-center text-xs text-[var(--neutral-muted)]">
              No hay ventas registradas hoy
            </div>
          ) : (
            displayedSales.map((sale) => (
              <div
                key={sale.id}
                className="grid grid-cols-12 items-center py-2 px-1.5 -mx-1.5 rounded-md text-xs transition-colors hover:bg-[var(--neutral-subtle)] group cursor-pointer"
                onClick={() => sale.originalRecord && setSelectedSale(sale.originalRecord)}
              >
                {/* Customer Name & Product Subtitle */}
                <div className="col-span-5 sm:col-span-4 pr-1.5 min-w-0">
                  <span className="font-semibold text-[var(--neutral-emphasis)] text-xs block truncate leading-tight group-hover:text-[var(--sidebar-primary)] transition-colors">
                    {sale.customerName}
                  </span>
                  {sale.productText && (
                    <span className="text-[11px] text-[var(--neutral-muted)] block truncate leading-tight mt-0.5">
                      {sale.productText}
                    </span>
                  )}
                </div>

                {/* Total Amount */}
                <div className="col-span-3 sm:col-span-3 text-right font-bold font-mono text-[var(--neutral-emphasis)] tabular-nums text-xs sm:text-sm">
                  {typeof sale.total === 'number'
                    ? `$${sale.total.toLocaleString('es-AR')}`
                    : '—'}
                </div>

                {/* Time */}
                <div className="col-span-2 sm:col-span-2 text-center font-mono tabular-nums text-[var(--neutral-muted)] text-[11px]">
                  {sale.time}
                </div>

                {/* Payment Method Badge & Action Eye */}
                <div className="col-span-2 sm:col-span-3 flex items-center justify-end gap-1.5">
                  {sale.paymentMethod === 'Efectivo' && (
                    <span className="inline-flex rounded-full bg-[var(--ventas-badge-bg)] px-1.5 py-0.2 text-[9px] font-semibold uppercase tracking-wider text-[var(--ventas-badge-fg)] shadow-2xs">
                      Efectivo
                    </span>
                  )}

                  {sale.paymentMethod === 'Transferencia' && (
                    <span className="inline-flex rounded-full bg-[var(--neutral-subtle)] border border-[var(--neutral-border-subtle)] px-1.5 py-0.2 text-[9px] font-semibold uppercase tracking-wider text-[var(--neutral-emphasis)]">
                      Transf.
                    </span>
                  )}

                  {sale.paymentMethod === 'Mercado Pago' && (
                    <span className="inline-flex rounded-full bg-[var(--neutral-subtle)] border border-[var(--neutral-border-subtle)] px-1.5 py-0.2 text-[9px] font-semibold uppercase tracking-wider text-[var(--neutral-body)]">
                      MP
                    </span>
                  )}

                  {sale.paymentMethod === 'Tarjeta' && (
                    <span className="inline-flex rounded-full bg-[var(--neutral-subtle)] border border-[var(--neutral-border-subtle)] px-1.5 py-0.2 text-[9px] font-semibold uppercase tracking-wider text-[var(--neutral-body)]">
                      Tarjeta
                    </span>
                  )}

                  {sale.paymentMethod === 'Dividido' && (
                    <span className="inline-flex rounded-full bg-amber-500/10 border border-amber-500/30 px-1.5 py-0.2 text-[9px] font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                      Dividido
                    </span>
                  )}

                  {sale.originalRecord && (
                    <button
                      type="button"
                      title="Ver ticket de venta"
                      aria-label="Ver ticket"
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedSale(sale.originalRecord)
                      }}
                      className="hidden sm:inline-flex h-6 w-6 items-center justify-center rounded text-[var(--neutral-muted)] hover:text-[var(--neutral-emphasis)] hover:bg-[var(--neutral-subtle)] transition-colors cursor-pointer"
                    >
                      <Eye className="h-3 w-3 stroke-[1.75]" />
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Sale Detail Dialog Modal */}
      <SaleDetailDialog
        open={!!selectedSale}
        onOpenChange={(open) => !open && setSelectedSale(null)}
        sale={selectedSale}
      />
    </section>
  )
}
