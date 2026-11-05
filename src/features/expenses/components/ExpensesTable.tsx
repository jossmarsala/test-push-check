import React from 'react'
import { Eye, Trash2 } from '@animateicons/react/lucide'
import { EmptyState } from '@/components/ui/empty-state'
import type { ExpenseItem } from '../types/expenses.types'

interface ExpensesTableProps {
  expenses: ExpenseItem[]
  onViewExpense: (expense: ExpenseItem) => void
  onDeleteExpense: (expense: ExpenseItem) => void
  onResetFilters?: () => void
}

export const ExpensesTable: React.FC<ExpensesTableProps> = ({
  expenses,
  onViewExpense,
  onDeleteExpense,
  onResetFilters,
}) => {
  if (expenses.length === 0) {
    return (
      <EmptyState
        title="No se encontraron gastos"
        description="No hay registros de gastos que coincidan con los filtros aplicados."
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
                Fecha
              </th>
              <th className="py-3.5 px-4 sm:px-5 font-semibold uppercase tracking-wider text-[11px]">
                Gasto / Concepto
              </th>
              <th className="py-3.5 px-4 sm:px-5 font-semibold uppercase tracking-wider text-[11px]">
                Total
              </th>
              <th className="py-3.5 px-4 sm:px-5 font-semibold uppercase tracking-wider text-[11px]">
                Categoría
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
            {expenses.map((expense) => (
              <tr
                key={expense.id}
                className="hover:bg-[var(--neutral-subtle)]/50 transition-colors group"
              >
                {/* Fecha */}
                <td className="py-3.5 px-4 sm:px-5 whitespace-nowrap">
                  <span className="font-semibold text-[var(--neutral-emphasis)] block">
                    {expense.fecha}
                  </span>
                  <span className="text-[10px] text-[var(--neutral-muted)] font-mono tabular-nums block">
                    {expense.hora} hs
                  </span>
                </td>

                {/* Gasto / Concepto */}
                <td className="py-3.5 px-4 sm:px-5 max-w-[280px]">
                  <span className="font-semibold text-[var(--neutral-emphasis)] block leading-snug line-clamp-1">
                    {expense.descripcion}
                  </span>
                  {expense.proveedor && (
                    <span className="text-[11px] text-[var(--neutral-muted)] block mt-0.5 truncate">
                      {expense.proveedor}
                    </span>
                  )}
                </td>

                {/* Total */}
                <td className="py-3.5 px-4 sm:px-5 whitespace-nowrap">
                  <span className="font-bold text-sm text-[var(--neutral-emphasis)] font-mono tabular-nums">
                    ${expense.monto.toLocaleString('es-AR')}
                  </span>
                </td>

                {/* Categoría */}
                <td className="py-3.5 px-4 sm:px-5 whitespace-nowrap">
                  <span className="inline-flex rounded-full bg-[var(--neutral-subtle)] border border-[var(--neutral-border-subtle)] px-2.5 py-0.5 text-[11px] font-medium text-[var(--neutral-body)]">
                    {expense.categoria}
                  </span>
                </td>

                {/* Pago */}
                <td className="py-3.5 px-4 sm:px-5 whitespace-nowrap">
                  {expense.medioPago === 'Efectivo' && (
                    <span className="inline-flex rounded-full bg-[var(--ventas-badge-bg)] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--ventas-badge-fg)] shadow-2xs">
                      Efectivo
                    </span>
                  )}

                  {expense.medioPago === 'Transferencia' && (
                    <span className="inline-flex rounded-full bg-[var(--neutral-subtle)] border border-[var(--neutral-border-subtle)] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--neutral-emphasis)]">
                      Transferencia
                    </span>
                  )}

                  {expense.medioPago === 'Mercado Pago' && (
                    <span className="inline-flex rounded-full bg-[var(--neutral-subtle)] border border-[var(--neutral-border-subtle)] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--neutral-body)]">
                      Mercado Pago
                    </span>
                  )}

                  {expense.medioPago !== 'Efectivo' &&
                    expense.medioPago !== 'Transferencia' &&
                    expense.medioPago !== 'Mercado Pago' && (
                      <span className="inline-flex rounded-full bg-[var(--neutral-subtle)] border border-[var(--neutral-border-subtle)] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--neutral-body)]">
                        {expense.medioPago}
                      </span>
                    )}
                </td>

                {/* Acciones */}
                <td className="py-3.5 px-4 sm:px-5 text-right whitespace-nowrap">
                  <div className="inline-flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => onViewExpense(expense)}
                      title="Ver comprobante y detalle"
                      aria-label="Ver detalle"
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-[var(--neutral-muted)] hover:text-[var(--neutral-emphasis)] hover:bg-[var(--neutral-subtle)] active:scale-95 transition-all cursor-pointer"
                    >
                      <Eye className="h-4 w-4 stroke-[1.75]" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteExpense(expense)}
                      title="Eliminar gasto"
                      aria-label="Eliminar gasto"
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-[var(--neutral-muted)] hover:text-[var(--destructive)] hover:bg-[var(--destructive)]/10 active:scale-95 transition-all cursor-pointer"
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
