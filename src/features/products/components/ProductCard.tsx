import React from 'react'
import {
  Clock,
  SquarePen,
  Trash2,
  Eye,
  EyeOff,
  MoreVertical,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { ProductItem } from '../types/products.types'
import { usePermissions } from '@/hooks/usePermissions'

interface ProductCardProps {
  product: ProductItem
  onViewDetails: (product: ProductItem) => void
  onEdit: (product: ProductItem) => void
  onDelete: (product: ProductItem) => void
  onViewHistory: (product: ProductItem) => void
  onToggleRemoteVisibility: (product: ProductItem) => void
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onViewDetails,
  onEdit,
  onDelete,
  onViewHistory,
  onToggleRemoteVisibility,
}) => {
  const { products } = usePermissions()
  const isRemoteVisible = product.isRemoteVisible !== false

  return (
    <div className="group relative flex flex-col justify-between rounded-[var(--radius-card)] border border-[var(--neutral-border-subtle)] bg-[var(--neutral-card)] p-4 shadow-2xs transition-all duration-300 hover:shadow-md hover:border-[var(--sidebar-ring)]">
      {/* Top Image Showcase */}
      <div
        onClick={() => onViewDetails(product)}
        title="Clic para ver detalles de la pieza"
        className="relative mb-4 h-48 w-full overflow-hidden rounded-[var(--radius-card-md)] bg-[var(--product-image-bg)] flex items-center justify-center transition-all cursor-pointer"
      >
        {/* Clean Contextual More Menu (top-right) */}
        <div className="absolute top-2.5 right-2.5 z-10">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                onClick={(e) => e.stopPropagation()}
                title="Más opciones"
                aria-label="Más opciones del producto"
                className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-background/80 text-[var(--neutral-muted)] backdrop-blur-md shadow-xs border border-[var(--neutral-border-subtle)] hover:text-[var(--neutral-emphasis)] hover:bg-background active:scale-95 transition-all cursor-pointer"
              >
                <MoreVertical className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation()
                  onViewDetails(product)
                }}
                className="cursor-pointer"
              >
                <Eye className="mr-2 h-4 w-4 text-[var(--neutral-muted)]" />
                <span>Ver detalles</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation()
                  onViewHistory(product)
                }}
                className="cursor-pointer"
              >
                <Clock className="mr-2 h-4 w-4 text-[var(--neutral-muted)]" />
                <span>Historial</span>
              </DropdownMenuItem>
              {products.canEditProduct && (
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation()
                    onEdit(product)
                  }}
                  className="cursor-pointer"
                >
                  <SquarePen className="mr-2 h-4 w-4 text-[var(--neutral-muted)]" />
                  <span>Editar producto</span>
                </DropdownMenuItem>
              )}
              {products.canToggleVisibility && (
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation()
                    onToggleRemoteVisibility(product)
                  }}
                  className="cursor-pointer"
                >
                  {isRemoteVisible ? (
                    <>
                      <EyeOff className="mr-2 h-4 w-4 text-[var(--neutral-muted)]" />
                      <span>Ocultar de web</span>
                    </>
                  ) : (
                    <>
                      <Eye className="mr-2 h-4 w-4 text-[var(--neutral-muted)]" />
                      <span>Mostrar en web</span>
                    </>
                  )}
                </DropdownMenuItem>
              )}
              {products.canDeleteProduct && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    variant="destructive"
                    onClick={(e) => {
                      e.stopPropagation()
                      onDelete(product)
                    }}
                    className="cursor-pointer"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    <span>Eliminar</span>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Product Image / Minimalist Placeholder */}
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 text-[var(--neutral-placeholder)] select-none">
            <svg
              className="h-11 w-11 text-[var(--neutral-placeholder)] opacity-35 transition-transform duration-500 group-hover:scale-110"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M6 3h12l4 6-10 12L2 9l4-6z"
              />
            </svg>
            <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--neutral-muted)] opacity-60">
              {product.code}
            </span>
          </div>
        )}
      </div>

      {/* Product Content with Generous Breathing Space */}
      <div className="flex flex-1 flex-col justify-between pt-1">
        <div className="cursor-pointer" onClick={() => onViewDetails(product)}>
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-medium uppercase tracking-wider text-[var(--neutral-muted)]">
              {product.category}
            </span>
            <span className="font-mono text-[11px] text-[var(--neutral-muted)]">
              {product.code}
            </span>
          </div>

          <h3 className="mt-1.5 text-base font-semibold text-[var(--neutral-emphasis)] leading-snug line-clamp-1 group-hover:text-[var(--neutral-brand)] transition-colors">
            {product.name}
          </h3>
        </div>

        {/* Price & Stock Stats Section */}
        <div className="mt-4 flex items-baseline justify-between pt-1">
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-bold text-[var(--neutral-emphasis)] font-mono tabular-nums tracking-tight">
              ${product.price.toFixed(2)}
            </span>
          </div>

          <div className="text-xs font-medium text-[var(--product-stock-green)]">
            {product.stock} en stock
          </div>
        </div>
      </div>
    </div>
  )
}
