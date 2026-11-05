import React, { useState } from 'react'
import { Eye, CircleDollarSign } from 'lucide-react'
import { EmptyState } from '@/components/ui/empty-state'
import type { CashMovement } from '../types/cash.types'

interface CashMovementsTableProps {
  movements: CashMovement[]
  onViewMovement: (movement: CashMovement) => void
}

type MovementFilterTab = 'todos' | 'ingresos' | 'egresos'

export const CashMovementsTable: React.FC<CashMovementsTableProps> = ({
  movements,
  onViewMovement,
}) => {
  const [activeTab, setActiveTab] = useState<MovementFilterTab>('todos')

  const filteredMovements = movements.filter((m) => {
    if (activeTab === 'ingresos') return m.tipo === 'ingreso'
    if (activeTab === 'egresos') return m.tipo === 'egreso'
    return true
  })

  return (
    <div className="rounded-[var(--radius-card)] border border-[var(--neutral-border-subtle)] bg-[var(--neutral-card)] p-5 shadow-2xs flex flex-col justify-between transition-all">
      {/* Header and Sub-tabs */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
          <h2 className="text-base sm:text-lg font-semibold tracking-tight text-[var(--neutral-emphasis)] leading-tight">
            Movimientos
          </h2>

          {/* Sub-filter tabs */}
          <div className="inline-flex items-center gap-1 p-1 rounded-full bg-[var(--neutral-subtle)] border border-[var(--neutral-border-subtle)] shadow-2xs w-fit text-xs">
            <button
              type="button"
              onClick={() => setActiveTab('todos')}
              className={`rounded-full px-3.5 py-1 text-xs font-medium transition-all whitespace-nowrap cursor-pointer select-none ${
                activeTab === 'todos'
                  ? 'bg-[var(--neutral-card)] text-[var(--neutral-emphasis)] font-semibold shadow-xs'
                  : 'text-[var(--neutral-muted)] hover:text-[var(--neutral-emphasis)]'
              }`}
            >
              Todos
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('ingresos')}
              className={`rounded-full px-3.5 py-1 text-xs font-medium transition-all whitespace-nowrap cursor-pointer select-none ${
                activeTab === 'ingresos'
                  ? 'bg-[var(--neutral-card)] text-[var(--neutral-emphasis)] font-semibold shadow-xs'
                  : 'text-[var(--neutral-muted)] hover:text-[var(--neutral-emphasis)]'
              }`}
            >
              Ingresos
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('egresos')}
              className={`rounded-full px-3.5 py-1 text-xs font-medium transition-all whitespace-nowrap cursor-pointer select-none ${
                activeTab === 'egresos'
                  ? 'bg-[var(--neutral-card)] text-[var(--neutral-emphasis)] font-semibold shadow-xs'
                  : 'text-[var(--neutral-muted)] hover:text-[var(--neutral-emphasis)]'
              }`}
            >
              Egresos
            </button>
          </div>
        </div>

        {/* Table or EmptyState */}
        {filteredMovements.length === 0 ? (
          <div className="py-4">
            <EmptyState
              icon={CircleDollarSign}
              title="Sin movimientos"
              description="No hay registros de caja para el filtro seleccionado."
              actionLabel={activeTab !== 'todos' ? 'Ver todos los movimientos' : undefined}
              onAction={activeTab !== 'todos' ? () => setActiveTab('todos') : undefined}
              className="min-h-[220px]"
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[var(--neutral-border-subtle)] bg-[var(--neutral-subtle)]/40 text-[11px] font-semibold uppercase tracking-wider text-[var(--neutral-muted)]">
                  <th className="py-3 px-3">
                    Hora
                  </th>
                  <th className="py-3 px-3">
                    Concepto
                  </th>
                  <th className="py-3 px-3">
                    Total
                  </th>
                  <th className="py-3 px-3">
                    Categoría
                  </th>
                  <th className="py-3 px-3">
                    Pago
                  </th>
                  <th className="py-3 px-3 text-right">
                    Detalle
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--neutral-border-subtle)]">
                {filteredMovements.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-[var(--neutral-subtle)]/50 transition-colors"
                  >
                    {/* Hora */}
                    <td className="py-3 px-3 whitespace-nowrap tabular-nums text-[var(--neutral-muted)]">
                      {item.hora}
                    </td>

                    {/* Concepto */}
                    <td className="py-3 px-3 max-w-[180px]">
                      <span className="font-semibold text-[var(--neutral-emphasis)] block truncate">
                        {item.concepto}
                      </span>
                    </td>

                    {/* Total */}
                    <td className="py-3 px-3 whitespace-nowrap font-semibold tabular-nums">
                      <span
                        className={
                          item.total > 0
                            ? 'text-[var(--product-stock-green)]'
                            : 'text-[var(--destructive)]'
                        }
                      >
                        {item.total > 0 ? `+$${item.total.toLocaleString('es-AR')}` : `-$${Math.abs(item.total).toLocaleString('es-AR')}`}
                      </span>
                    </td>

                    {/* Categoría */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span className="text-[var(--neutral-body)] font-medium">
                        {item.categoria}
                      </span>
                    </td>

                    {/* Pago */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      {item.pago === 'Efectivo' ? (
                        <span className="inline-flex rounded-full bg-[var(--ventas-badge-bg)] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--ventas-badge-fg)] shadow-2xs">
                          Efectivo
                        </span>
                      ) : (
                        <span className="inline-flex rounded-full bg-[var(--neutral-subtle)] border border-[var(--neutral-border-subtle)] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--neutral-body)]">
                          {item.pago}
                        </span>
                      )}
                    </td>

                    {/* Detalle */}
                    <td className="py-3 px-3 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => onViewMovement(item)}
                        title="Ver detalle del movimiento"
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-[var(--neutral-muted)] hover:text-[var(--neutral-emphasis)] hover:bg-[var(--neutral-subtle)] active:scale-[0.98] transition-all cursor-pointer"
                      >
                        <Eye className="h-4 w-4 stroke-[1.75]" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
