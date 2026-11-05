import React from 'react'
import { LayoutGrid, List, Search, X } from 'lucide-react'
import type { ProductCategory, ProductViewMode } from '../types/products.types'

interface ProductsFilterBarProps {
  searchQuery?: string
  onSearchChange?: (val: string) => void
  viewMode: ProductViewMode
  onViewModeChange: (mode: ProductViewMode) => void
  activeCategory: ProductCategory
  onCategoryChange: (category: ProductCategory) => void
  categoryCounts?: Record<ProductCategory, number>
}

const CATEGORIES: ProductCategory[] = ['Todos', 'Anillos', 'Aros', 'Cadenas', 'Pulseras']

export const ProductsFilterBar: React.FC<ProductsFilterBarProps> = ({
  searchQuery,
  onSearchChange,
  viewMode,
  onViewModeChange,
  activeCategory,
  onCategoryChange,
  categoryCounts,
}) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        {/* Search Input */}
        {onSearchChange && (
          <div className="relative w-full sm:w-80 md:w-96 flex items-center">
            <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-[var(--neutral-muted)]">
              <Search className="h-4 w-4 stroke-[1.75]" />
            </span>
            <input
              type="text"
              value={searchQuery || ''}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Buscar por nombre o SKU..."
              className="h-10 w-full rounded-[var(--radius-input)] border border-[var(--neutral-border-subtle)] bg-[var(--neutral-surface)] pl-10 pr-9 text-xs sm:text-sm font-normal text-[var(--neutral-emphasis)] placeholder:text-[var(--neutral-placeholder)] focus:border-[var(--sidebar-ring)] focus:outline-hidden focus:ring-1 focus:ring-[var(--sidebar-ring)] transition-all shadow-2xs"
            />
            {searchQuery && (
              <div className="absolute inset-y-0 right-0 flex items-center pr-2">
                <button
                  type="button"
                  onClick={() => onSearchChange('')}
                  className="p-1 text-[var(--neutral-muted)] hover:text-[var(--neutral-emphasis)] cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Right side: View Mode Toggle */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          {/* Right: View Mode Toggle (Grid vs List) */}
          <div
            role="group"
            aria-label="Modo de visualización"
            className="inline-flex items-center gap-1 p-1 rounded-lg bg-[var(--neutral-subtle)] border border-[var(--neutral-border-subtle)]"
          >
            <button
              type="button"
              onClick={() => onViewModeChange('grid')}
              aria-label="Vista en cuadrícula"
              aria-pressed={viewMode === 'grid'}
              className={`inline-flex h-8 w-8 items-center justify-center rounded-md transition-all cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-[var(--product-toggle-active-bg)] text-[var(--product-toggle-active-fg)] shadow-xs'
                  : 'text-[var(--neutral-muted)] hover:text-[var(--neutral-emphasis)]'
              }`}
            >
              <LayoutGrid className="h-4 w-4 stroke-[1.75]" />
            </button>

            <button
              type="button"
              onClick={() => onViewModeChange('list')}
              aria-label="Vista en lista"
              aria-pressed={viewMode === 'list'}
              className={`inline-flex h-8 w-8 items-center justify-center rounded-md transition-all cursor-pointer ${
                viewMode === 'list'
                  ? 'bg-[var(--product-toggle-active-bg)] text-[var(--product-toggle-active-fg)] shadow-xs'
                  : 'text-[var(--neutral-muted)] hover:text-[var(--neutral-emphasis)]'
              }`}
            >
              <List className="h-4 w-4 stroke-[1.75]" />
            </button>
          </div>
        </div>
      </div>

      {/* Category Pills Bar (Todos, Anillos, Aros, Cadenas, Pulseras) */}
      <nav
        aria-label="Filtro de categorías de productos"
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
