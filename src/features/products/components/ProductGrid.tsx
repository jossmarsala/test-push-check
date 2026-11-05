import React from 'react'
import { Package } from 'lucide-react'
import { ProductCard } from './ProductCard'
import { EmptyState } from '@/components/ui/empty-state'
import type { ProductItem } from '../types/products.types'

interface ProductGridProps {
  products: ProductItem[]
  onViewDetails: (product: ProductItem) => void
  onEdit: (product: ProductItem) => void
  onDelete: (product: ProductItem) => void
  onViewHistory: (product: ProductItem) => void
  onToggleRemoteVisibility: (product: ProductItem) => void
  onResetFilters?: () => void
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  onViewDetails,
  onEdit,
  onDelete,
  onViewHistory,
  onToggleRemoteVisibility,
  onResetFilters,
}) => {
  if (products.length === 0) {
    return (
      <EmptyState
        title="No se encontraron productos"
        description="No hay artículos que coincidan con la búsqueda o el filtro de categoría seleccionado."
        icon={Package}
        actionLabel={onResetFilters ? 'Restablecer filtros' : undefined}
        onAction={onResetFilters}
      />
    )
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onViewDetails={onViewDetails}
          onEdit={onEdit}
          onDelete={onDelete}
          onViewHistory={onViewHistory}
          onToggleRemoteVisibility={onToggleRemoteVisibility}
        />
      ))}
    </div>
  )
}
