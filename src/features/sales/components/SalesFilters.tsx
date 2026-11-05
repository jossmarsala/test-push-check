import React from 'react'
import { Search, X } from '@animateicons/react/lucide'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { PaymentMethod } from '../types/sales.types'

interface SalesFiltersProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  activePaymentFilter: PaymentMethod | 'all' | string
  onPaymentFilterChange: (method: string) => void
}

const PAYMENT_OPTIONS: Array<{ label: string; value: string }> = [
  { label: 'Todos los pagos', value: 'all' },
  { label: 'Efectivo', value: 'Efectivo' },
  { label: 'Transferencia', value: 'Transferencia' },
  { label: 'Mercado Pago', value: 'Mercado Pago' },
]

export const SalesFilters: React.FC<SalesFiltersProps> = ({
  searchQuery,
  onSearchChange,
  activePaymentFilter,
  onPaymentFilterChange,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
      {/* Search Input: Matches exact wireframe placeholder & refined layout */}
      <div className="relative flex-1">
        <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-[var(--neutral-muted)]">
          <Search className="h-4 w-4 stroke-[1.75]" />
        </span>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Buscar por fecha, cliente o producto..."
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
      <div className="sm:w-48 shrink-0">
        <Select
          value={activePaymentFilter}
          onValueChange={onPaymentFilterChange}
        >
          <SelectTrigger className="h-10 w-full rounded-[var(--radius-input)] border border-[var(--neutral-border-subtle)] bg-[var(--neutral-surface)] px-3 text-xs sm:text-sm font-medium text-[var(--neutral-emphasis)] focus-visible:border-[var(--sidebar-ring)] focus-visible:ring-1 focus-visible:ring-[var(--sidebar-ring)] shadow-2xs cursor-pointer">
            <SelectValue placeholder="Filtrar por pago" />
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
  )
}
