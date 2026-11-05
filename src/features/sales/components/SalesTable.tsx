import React from 'react'
import { Eye, Trash2, ArrowLeftRight } from 'lucide-react'
import { EmptyState } from '@/components/ui/empty-state'
import type { SaleRecord } from '../types/sales.types'

interface SalesTableProps {
  sales: SaleRecord[]
  onViewSale: (sale: SaleRecord) => void
  onDeleteSale: (sale: SaleRecord) => void
  onExchangeSale?: (sale: SaleRecord) => void
  onResetFilters?: () => void
}

export const SalesTable: React.FC<SalesTableProps> = ({
  sales,
  onViewSale,
  onDeleteSale,
  onExchangeSale,
  onResetFilters,
}) => {
  if (sales.length === 0) {
    return (
      <EmptyState
        title="No se encontraron ventas"
        description="No hay registros de ventas que coincidan con la búsqueda o filtro aplicado."
        actionLabel={onResetFilters ? 'Restablecer filtros' : undefined}
        onAction={onResetFilters}
      />
    )
  }

  return (
    <div className="overflow-hidden rounded-[var(--radius-card)] border border-[var(--neutral-border-subtle)] bg-[var(--neutral-card)] shadow-2xs transition-all">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-[var(--neutral-border-subtle)] bg-[var(--neutral-subtle)]/40 text-[var(--neutral-muted)]">
              <th className="py-3.5 px-4 sm:px-5 font-semibold uppercase tracking-wider text-[11px]">
                Producto(s)
              </th>
              <th className="py-3.5 px-4 sm:px-5 font-semibold uppercase tracking-wider text-[11px]">
                Total
              </th>
              <th className="py-3.5 px-4 sm:px-5 font-semibold uppercase tracking-wider text-[11px]">
                Cliente
              </th>
              <th className="py-3.5 px-4 sm:px-5 font-semibold uppercase tracking-wider text-[11px]">
                Fecha
              </th>
              <th className="py-3.5 px-4 sm:px-5 font-semibold uppercase tracking-wider text-[11px]">
                Pago
              </th>
              <th className="py-3.5 px-4 sm:px-5 font-semibold uppercase tracking-wider text-[11px] text-right">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--neutral-border-subtle)]">
            {sales.map((sale) => (
              <tr
                key={sale.id}
                className="hover:bg-[var(--neutral-subtle)]/50 transition-colors group"
              >
                {/* PRODUCTO(S) */}
                <td className="py-3.5 px-4 sm:px-5 max-w-[280px]">
                  <span className="font-medium text-[var(--neutral-body)] line-clamp-2 leading-relaxed">
                    {sale.productosTexto}
                  </span>
                  {(sale.cambiosRealizados || 0) >= 1 && (
                    <span className="text-[10px] text-[var(--neutral-muted)] font-mono block mt-0.5">
                      Cambio registrado
                    </span>
                  )}
                </td>

                {/* TOTAL */}
                <td className="py-3.5 px-4 sm:px-5">
                  <span className="font-bold text-sm text-[var(--neutral-emphasis)] font-mono tabular-nums">
                    ${sale.total.toLocaleString('es-AR')}
                  </span>
                </td>

                {/* CLIENTE */}
                <td className="py-3.5 px-4 sm:px-5">
                  <span className="font-semibold text-[var(--neutral-emphasis)] block">
                    {sale.cliente}
                  </span>
                  {sale.clienteContacto && (
                    <span className="text-[10px] text-[var(--neutral-muted)] block truncate max-w-[140px]">
                      {sale.clienteContacto}
                    </span>
                  )}
                </td>

                {/* FECHA */}
                <td className="py-3.5 px-4 sm:px-5 whitespace-nowrap">
                  <span className="font-semibold text-[var(--neutral-emphasis)] block">
                    {sale.fecha}
                  </span>
                  <span className="text-[10px] text-[var(--neutral-muted)] font-mono tabular-nums block">
                    {sale.hora}
                  </span>
                </td>

                {/* PAGO */}
                <td className="py-3.5 px-4 sm:px-5">
                  {sale.pago === 'Efectivo' && (
                    <span className="inline-flex rounded-full bg-[var(--ventas-badge-bg)] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--ventas-badge-fg)] shadow-2xs">
                      EFECTIVO
                    </span>
                  )}

                  {sale.pago === 'Transferencia' && (
                    <span className="inline-flex rounded-full bg-[var(--neutral-subtle)] border border-[var(--neutral-border-subtle)] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--neutral-emphasis)]">
                      TRANSFERENCIA
                    </span>
                  )}

                  {sale.pago === 'Mercado Pago' && (
                    <span className="inline-flex rounded-full bg-[var(--neutral-subtle)] border border-[var(--neutral-border-subtle)] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--neutral-body)]">
                      MERCADO PAGO
                    </span>
                  )}

                  {sale.pago === 'Tarjeta' && (
                    <span className="inline-flex rounded-full bg-[var(--neutral-subtle)] border border-[var(--neutral-border-subtle)] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--neutral-body)]">
                      TARJETA
                    </span>
                  )}

                  {sale.pago === 'Dividido' && (
                    <span className="inline-flex rounded-full bg-amber-500/10 border border-amber-500/30 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                      DIVIDIDO
                    </span>
                  )}
                </td>

                {/* ACCIONES */}
                <td className="py-3.5 px-4 sm:px-5 text-right">
                  <div className="inline-flex items-center gap-1">
                    {onExchangeSale && (
                      <button
                        type="button"
                        onClick={() => onExchangeSale(sale)}
                        title={(sale.cambiosRealizados || 0) >= 1 ? "Ver cambio registrado" : "Registrar cambio"}
                        aria-label="Cambio de producto"
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-[var(--neutral-muted)] hover:text-[var(--neutral-emphasis)] hover:bg-[var(--neutral-subtle)] active:scale-[0.98] transition-all cursor-pointer"
                      >
                        <ArrowLeftRight className="h-3.5 w-3.5 stroke-[1.75]" />
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => onViewSale(sale)}
                      title="Ver ticket de venta"
                      aria-label="Ver ticket"
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-[var(--neutral-muted)] hover:text-[var(--neutral-emphasis)] hover:bg-[var(--neutral-subtle)] active:scale-[0.98] transition-all cursor-pointer"
                    >
                      <Eye className="h-4 w-4 stroke-[1.75]" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteSale(sale)}
                      title="Anular venta"
                      aria-label="Anular venta"
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-[var(--neutral-muted)] hover:text-[var(--destructive)] hover:bg-[var(--destructive)]/10 active:scale-[0.98] transition-all cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4 stroke-[1.75]" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
