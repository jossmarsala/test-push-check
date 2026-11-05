import React from 'react'
import { Search, X, Table, Kanban } from 'lucide-react'
import type { PedidoTabCategory } from '../types/workshop.types'

interface TabOption {
  id: PedidoTabCategory
  label: string
}

const TABS: TabOption[] = [
  { id: 'todos', label: 'Todos' },
  { id: 'hoy', label: 'Hoy' },
  { id: 'atrasados', label: 'Atrasados' },
  { id: 'en_taller', label: 'En taller' },
  { id: 'entregados', label: 'Entregados' },
  { id: 'garantias', label: 'Garantías' },
]

interface PedidosFiltersProps {
  activeTab: PedidoTabCategory
  onTabChange: (tab: PedidoTabCategory) => void
  searchQuery: string
  onSearchChange: (query: string) => void
  viewMode?: 'table' | 'kanban'
  onViewModeChange?: (mode: 'table' | 'kanban') => void
}

export const PedidosFilters: React.FC<PedidosFiltersProps> = ({
  activeTab,
  onTabChange,
  searchQuery,
  onSearchChange,
  viewMode = 'kanban',
  onViewModeChange,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 select-none">
      {/* Left: Filter Tab Pills */}
      <nav
        aria-label="Filtro de estados de pedidos"
        className="inline-flex items-center gap-1 p-1 rounded-full bg-[var(--product-pill-bg)] border border-[var(--neutral-border-subtle)] shadow-2xs overflow-x-auto max-w-full"
      >
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-all whitespace-nowrap cursor-pointer select-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--sidebar-ring)] ${
                isActive
                  ? 'bg-[var(--product-pill-active-bg)] text-[var(--product-pill-active-fg)] shadow-xs font-semibold'
                  : 'text-[var(--neutral-muted)] hover:text-[var(--neutral-emphasis)] hover:bg-[var(--neutral-subtle)]'
              }`}
            >
              {tab.label}
            </button>
          )
        })}
      </nav>

      <div className="flex items-center gap-2">
        {/* Right: Search Input matching app-wide standard */}
        <div className="relative w-full sm:w-64 lg:w-72">
          <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-[var(--neutral-muted)]">
            <Search className="h-4 w-4 stroke-[1.75]" />
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar por cliente, pieza o trabajo..."
            className="h-10 w-full rounded-[var(--radius-input)] border border-[var(--neutral-border-subtle)] bg-[var(--neutral-surface)] pl-10 pr-9 text-xs sm:text-sm font-normal text-[var(--neutral-emphasis)] placeholder:text-[var(--neutral-placeholder)] focus:border-[var(--sidebar-ring)] focus:outline-hidden focus:ring-1 focus:ring-[var(--sidebar-ring)] transition-all shadow-2xs"
          />

          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              aria-label="Limpiar búsqueda"
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-[var(--neutral-muted)] hover:text-[var(--neutral-emphasis)] cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* View mode toggle: Table vs Kanban */}
        {onViewModeChange && (
          <div className="inline-flex items-center gap-0.5 p-1 rounded-lg bg-[var(--neutral-subtle)] border border-[var(--neutral-border-subtle)]">
            <button
              type="button"
              onClick={() => onViewModeChange('table')}
              className={`p-1.5 rounded-md transition-all cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-[var(--neutral-card)] text-[var(--neutral-emphasis)] shadow-2xs'
                  : 'text-[var(--neutral-muted)] hover:text-[var(--neutral-emphasis)]'
              }`}
              title="Vista de lista"
            >
              <Table className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange('kanban')}
              className={`p-1.5 rounded-md transition-all cursor-pointer ${
                viewMode === 'kanban'
                  ? 'bg-[var(--neutral-card)] text-[var(--neutral-emphasis)] shadow-2xs'
                  : 'text-[var(--neutral-muted)] hover:text-[var(--neutral-emphasis)]'
              }`}
              title="Vista de tablero Kanban"
            >
              <Kanban className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

