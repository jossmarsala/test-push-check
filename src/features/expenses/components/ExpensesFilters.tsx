import React from 'react'
import { Search, X } from '@animateicons/react/lucide'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { ExpenseCategoryFilter } from '../types/expenses.types'

interface ExpensesFiltersProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  activeCategory: ExpenseCategoryFilter
  onCategoryChange: (category: ExpenseCategoryFilter) => void
  categoryCounts?: Record<string, number>
  activePaymentFilter: string
  onPaymentFilterChange: (method: string) => void
}

const CATEGORIES: ExpenseCategoryFilter[] = [
  'Todos',
  'Servicios',
  'Insumos y taller',
  'Metales y piedras',
  'Alquiler y expensas',
  'Sueldos y honorarios',
  'Mantenimiento',
  'Otros',
]

const PAYMENT_OPTIONS: Array<{ label: string; value: string }> = [
  { label: 'Todos los pagos', value: 'all' },
  { label: 'Efectivo', value: 'Efectivo' },
  { label: 'Transferencia', value: 'Transferencia' },
  { label: 'Mercado Pago', value: 'Mercado Pago' },
  { label: 'Tarjeta', value: 'Tarjeta' },
  { label: 'Caja chica', value: 'Caja chica' },
]

export const ExpensesFilters: React.FC<ExpensesFiltersProps> = ({
  searchQuery,
  onSearchChange,
  activeCategory,
  onCategoryChange,
  categoryCounts,
  activePaymentFilter,
  onPaymentFilterChange,
}) => {
  return (
    <div className="space-y-4">
      {/* Search Input & Payment Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="relative flex-1">
          <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-[var(--neutral-muted)]">
            <Search className="h-4 w-4 stroke-[1.75]" />
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar por concepto, proveedor o comprobante..."
            className="h-10 w-full rounded-[var(--radius-input)] border border-[var(--neutral-border-subtle)] bg-[var(--neutral-surface)] pl-10 pr-9 text-xs sm:text-sm font-normal text-[var(--neutral-emphasis)] placeholder:text-[var(--neutral-placeholder)] focus:border-[var(--sidebar-ring)] focus:outline-hidden focus:ring-1 focus:ring-[var(--sidebar-ring)] transition-all shadow-2xs"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-[var(--neutral-muted)] hover:text-[var(--neutral-emphasis)] cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Quick Payment Method Selector with shadcn/ui Select */}
        <div className="sm:w-52 shrink-0">
          <Select
            value={activePaymentFilter}
            onValueChange={onPaymentFilterChange}
          >
            <SelectTrigger className="h-10 w-full rounded-[var(--radius-input)] border border-[var(--neutral-border-subtle)] bg-[var(--neutral-surface)] px-3 text-xs sm:text-sm font-medium text-[var(--neutral-emphasis)] focus-visible:border-[var(--sidebar-ring)] focus-visible:ring-1 focus-visible:ring-[var(--sidebar-ring)] shadow-2xs cursor-pointer">
              <SelectValue placeholder="Medio de pago" />
            </SelectTrigger>
            <SelectContent align="end">
              {PAYMENT_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Category Pills Navigation */}
      <nav
        aria-label="Filtro de categorías de gastos"
        className="inline-flex items-center gap-1 p-1 rounded-full bg-[var(--product-pill-bg)] border border-[var(--neutral-border-subtle)] shadow-2xs overflow-x-auto max-w-full"
      >
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat
          const count = categoryCounts ? categoryCounts[cat] : undefined

          return (
            <button
              key={cat}
              type="button"
              onClick={() => onCategoryChange(cat)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-all whitespace-nowrap cursor-pointer select-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--sidebar-ring)] ${
                isActive
                  ? 'bg-[var(--product-pill-active-bg)] text-[var(--product-pill-active-fg)] shadow-xs font-semibold'
                  : 'text-[var(--neutral-muted)] hover:text-[var(--neutral-emphasis)] hover:bg-[var(--neutral-subtle)]'
              }`}
            >
              <span>{cat}</span>
              {count !== undefined && count > 0 && (
                <span
                  className={`ml-1.5 text-[10px] font-semibold opacity-80 ${
                    isActive ? 'text-[var(--product-pill-active-fg)]' : 'text-[var(--neutral-muted)]'
                  }`}
                >
                  ({count})
                </span>
              )}
            </button>
          )
        })}
      </nav>
    </div>
  )
}
