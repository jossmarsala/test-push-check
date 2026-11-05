import React from 'react'
import {
  PlusCircle,
  Wrench,
  Receipt,
  TrendingUp,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface DashboardQuickActionsProps {
  onNewSale?: () => void
  onNewOrder?: () => void
  onNewExpense?: () => void
}

export const DashboardQuickActions: React.FC<DashboardQuickActionsProps> = ({
  onNewSale,
  onNewOrder,
  onNewExpense,
}) => {
  const navigate = useNavigate()

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 select-none">
      <button
        type="button"
        onClick={() => {
          if (onNewSale) {
            onNewSale()
          } else {
            navigate('/ventas?action=new')
          }
        }}
        className="flex items-center gap-2.5 sm:gap-3 p-2.5 sm:p-3 rounded-[var(--radius-card)] bg-[var(--neutral-card)] border border-[var(--neutral-border-subtle)] hover:border-[var(--neutral-border)] hover:bg-[var(--neutral-subtle)] active:scale-[0.99] transition-all text-left shadow-2xs group cursor-pointer"
      >
        <div className="h-7.5 w-7.5 sm:h-8 sm:w-8 rounded-md bg-[var(--neutral-subtle)] text-[var(--neutral-muted)] group-hover:text-[var(--neutral-emphasis)] flex items-center justify-center shrink-0 transition-colors">
          <PlusCircle className="h-4 w-4 stroke-[1.5]" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-medium text-[var(--neutral-emphasis)] leading-tight">
            Nueva Venta
          </p>
          <p className="text-[11px] text-[var(--neutral-muted)] truncate">
            Mostrador
          </p>
        </div>
      </button>

      <button
        type="button"
        onClick={() => {
          if (onNewOrder) {
            onNewOrder()
          } else {
            navigate('/pedidos?action=new')
          }
        }}
        className="flex items-center gap-2.5 sm:gap-3 p-2.5 sm:p-3 rounded-[var(--radius-card)] bg-[var(--neutral-card)] border border-[var(--neutral-border-subtle)] hover:border-[var(--neutral-border)] hover:bg-[var(--neutral-subtle)] active:scale-[0.99] transition-all text-left shadow-2xs group cursor-pointer"
      >
        <div className="h-7.5 w-7.5 sm:h-8 sm:w-8 rounded-md bg-[var(--neutral-subtle)] text-[var(--neutral-muted)] group-hover:text-[var(--neutral-emphasis)] flex items-center justify-center shrink-0 transition-colors">
          <Wrench className="h-4 w-4 stroke-[1.5]" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-medium text-[var(--neutral-emphasis)] leading-tight">
            Nuevo Pedido
          </p>
          <p className="text-[11px] text-[var(--neutral-muted)] truncate">
            Taller
          </p>
        </div>
      </button>

      <button
        type="button"
        onClick={() => {
          if (onNewExpense) {
            onNewExpense()
          } else {
            navigate('/gastos?action=new')
          }
        }}
        className="flex items-center gap-2.5 sm:gap-3 p-2.5 sm:p-3 rounded-[var(--radius-card)] bg-[var(--neutral-card)] border border-[var(--neutral-border-subtle)] hover:border-[var(--neutral-border)] hover:bg-[var(--neutral-subtle)] active:scale-[0.99] transition-all text-left shadow-2xs group cursor-pointer"
      >
        <div className="h-7.5 w-7.5 sm:h-8 sm:w-8 rounded-md bg-[var(--neutral-subtle)] text-[var(--neutral-muted)] group-hover:text-[var(--neutral-emphasis)] flex items-center justify-center shrink-0 transition-colors">
          <Receipt className="h-4 w-4 stroke-[1.5]" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-medium text-[var(--neutral-emphasis)] leading-tight">
            Nuevo Gasto
          </p>
          <p className="text-[11px] text-[var(--neutral-muted)] truncate">
            Proveedor
          </p>
        </div>
      </button>

      <button
        type="button"
        onClick={() => navigate('/caja')}
        className="flex items-center gap-2.5 sm:gap-3 p-2.5 sm:p-3 rounded-[var(--radius-card)] bg-[var(--neutral-card)] border border-[var(--neutral-border-subtle)] hover:border-[var(--neutral-border)] hover:bg-[var(--neutral-subtle)] active:scale-[0.99] transition-all text-left shadow-2xs group cursor-pointer"
      >
        <div className="h-7.5 w-7.5 sm:h-8 sm:w-8 rounded-md bg-[var(--neutral-subtle)] text-[var(--neutral-muted)] group-hover:text-[var(--neutral-emphasis)] flex items-center justify-center shrink-0 transition-colors">
          <TrendingUp className="h-4 w-4 stroke-[1.5]" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-medium text-[var(--neutral-emphasis)] leading-tight">
            Arqueo de Caja
          </p>
          <p className="text-[11px] text-[var(--neutral-muted)] truncate">
            Balance
          </p>
        </div>
      </button>
    </div>
  )
}
