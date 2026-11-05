import React from 'react'
import { Clock, SquarePen, Trash2, Eye, EyeOff } from '@animateicons/react/lucide'
import { EmptyState } from '@/components/ui/empty-state'
import type { ProductItem } from '../types/products.types'
import { usePermissions } from '@/hooks/usePermissions'

interface ProductListTableProps {
  products: ProductItem[]
  onViewDetails: (product: ProductItem) => void
  onEdit: (product: ProductItem) => void
  onDelete: (product: ProductItem) => void
  onViewHistory: (product: ProductItem) => void
  onToggleRemoteVisibility: (product: ProductItem) => void
  onResetFilters?: () => void
}

export const ProductListTable: React.FC<ProductListTableProps> = ({
  products,
  onViewDetails,
  onEdit,
  onDelete,
  onViewHistory,
  onToggleRemoteVisibility,
  onResetFilters,
}) => {
  const { products: permissions } = usePermissions()

  if (products.length === 0) {
    return (
      <EmptyState
        title="No se encontraron productos"
        description="No hay artículos que coincidan con la búsqueda o el filtro de categoría seleccionado."
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
              <th className="py-3.5 px-4 font-semibold uppercase tracking-wider text-[11px]">Código</th>
              <th className="py-3.5 px-4 font-semibold uppercase tracking-wider text-[11px]">Producto</th>
              <th className="py-3.5 px-4 font-semibold uppercase tracking-wider text-[11px]">Categoría</th>
              <th className="py-3.5 px-4 font-semibold uppercase tracking-wider text-[11px]">Catálogo remoto</th>
              <th className="py-3.5 px-4 font-semibold uppercase tracking-wider text-[11px]">Stock</th>
              <th className="py-3.5 px-4 font-semibold uppercase tracking-wider text-[11px]">Precio</th>
              <th className="py-3.5 px-4 font-semibold uppercase tracking-wider text-[11px] text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--neutral-border-subtle)]">
            {products.map((item) => {
              const isRemoteVisible = item.isRemoteVisible !== false

              return (
                <tr
                  key={item.id}
                  className="hover:bg-[var(--neutral-subtle)]/50 transition-colors"
                >
                  <td className="py-3.5 px-4 font-mono text-xs text-[var(--neutral-body)] font-medium">
                    {item.code}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div
                        onClick={() => onViewDetails(item)}
                        className="h-9 w-9 shrink-0 overflow-hidden rounded-[var(--radius-input)] bg-[var(--neutral-subtle)] flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity"
                        title="Ver detalles"
                      >
                        {item.imageUrl ? (
                          <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover" />
                        ) : (
                          <svg
                            className="h-4 w-4 text-[var(--neutral-placeholder)]"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            aria-hidden="true"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M6 3h12l4 6-10 12L2 9l4-6z"
                            />
                          </svg>
                        )}
                      </div>
                      <div>
                        <button
                          type="button"
                          onClick={() => onViewDetails(item)}
                          className="font-semibold text-[var(--neutral-emphasis)] text-left hover:text-[var(--neutral-brand)] transition-colors cursor-pointer block"
                        >
                          {item.name}
                        </button>
                        {item.metalPurity && (
                          <span className="text-[11px] text-[var(--neutral-muted)] block">
                            {item.metalPurity}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex rounded-full bg-[var(--neutral-subtle)] px-2.5 py-0.5 text-[11px] font-medium text-[var(--neutral-body)] border border-[var(--neutral-border-subtle)]">
                      {item.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    {permissions.canToggleVisibility ? (
                      <button
                        type="button"
                        onClick={() => onToggleRemoteVisibility(item)}
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium border transition-all cursor-pointer ${
                          isRemoteVisible
                            ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/25 hover:bg-emerald-500/20'
                            : 'bg-[var(--neutral-subtle)] text-[var(--neutral-muted)] border-[var(--neutral-border-subtle)] hover:bg-[var(--neutral-subtle)]/80'
                        }`}
                        title={isRemoteVisible ? 'Visible en catálogo. Clic para ocultar.' : 'Oculto. Clic para publicar.'}
                      >
                        <span>{isRemoteVisible ? 'Visible' : 'Oculto'}</span>
                      </button>
                    ) : (
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium border ${
                          isRemoteVisible
                            ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/25'
                            : 'bg-[var(--neutral-subtle)] text-[var(--neutral-muted)] border-[var(--neutral-border-subtle)]'
                        }`}
                      >
                        {isRemoteVisible ? 'Visible' : 'Oculto'}
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-medium text-[var(--product-stock-green)]">
                      {item.stock} en stock
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-sm text-[var(--neutral-emphasis)] font-mono tabular-nums">
                    ${item.price.toFixed(2)}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="inline-flex items-center gap-1">
                      {/* History (Stock and Prices) */}
                      <button
                        type="button"
                        onClick={() => onViewHistory(item)}
                        title="Ver historial de stock y precios"
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-[var(--neutral-muted)] hover:text-[var(--neutral-emphasis)] hover:bg-[var(--neutral-subtle)] active:scale-95 transition-all cursor-pointer"
                      >
                        <Clock className="h-4 w-4 stroke-[1.75]" />
                      </button>
                      {permissions.canEditProduct && (
                        <button
                          type="button"
                          onClick={() => onEdit(item)}
                          title="Editar producto"
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-[var(--neutral-muted)] hover:text-[var(--neutral-emphasis)] hover:bg-[var(--neutral-subtle)] active:scale-95 transition-all cursor-pointer"
                        >
                          <SquarePen className="h-4 w-4 stroke-[1.75]" />
                        </button>
                      )}
                      {permissions.canDeleteProduct && (
                        <button
                          type="button"
                          onClick={() => onDelete(item)}
                          title="Eliminar producto"
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-[var(--neutral-muted)] hover:text-[var(--destructive)] hover:bg-[var(--destructive)]/10 active:scale-95 transition-all cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4 stroke-[1.75]" />
                        </button>
                      )}
                      {/* Remote Catalog Visibility Toggle */}
                      {permissions.canToggleVisibility && (
                        <button
                          type="button"
                          onClick={() => onToggleRemoteVisibility(item)}
                          title={
                            isRemoteVisible
                              ? 'Visible en catálogo remoto (clic para ocultar)'
                              : 'Oculto en catálogo remoto (clic para publicar)'
                          }
                          className={`inline-flex h-8 w-8 items-center justify-center rounded-lg active:scale-95 transition-all cursor-pointer ${
                            isRemoteVisible
                              ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20'
                              : 'text-[var(--neutral-muted)] opacity-60 hover:opacity-100 hover:bg-[var(--neutral-subtle)]'
                          }`}
                        >
                          {isRemoteVisible ? (
                            <Eye className="h-4 w-4 stroke-[1.75]" />
                          ) : (
                            <EyeOff className="h-4 w-4 stroke-[1.75]" />
                          )}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
