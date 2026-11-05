import React from 'react'
import { ConfirmDestructiveDialog } from '@/components/ui/confirm-destructive-dialog'
import type { ProductItem } from '../types/products.types'

interface DeleteProductDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  product: ProductItem | null
  onConfirmDelete: (productId: string) => void
}

export const DeleteProductDialog: React.FC<DeleteProductDialogProps> = ({
  open,
  onOpenChange,
  product,
  onConfirmDelete,
}) => {
  if (!product) return null

  return (
    <ConfirmDestructiveDialog
      open={open}
      onOpenChange={onOpenChange}
      title="¿Eliminar producto?"
      confirmLabel="Eliminar"
      cancelLabel="Cancelar"
      onConfirm={() => onConfirmDelete(product.id)}
      description={
        <>
          Esta acción eliminará <strong className="text-[var(--neutral-emphasis)]">{product.name}</strong> ({product.code}) del catálogo.
        </>
      }
    />
  )
}
