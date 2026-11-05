import React from 'react'
import { ConfirmDestructiveDialog } from '@/components/ui/confirm-destructive-dialog'
import type { SaleRecord } from '../types/sales.types'

interface DeleteSaleDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  sale: SaleRecord | null
  onConfirmDelete: (saleId: string) => void
}

export const DeleteSaleDialog: React.FC<DeleteSaleDialogProps> = ({
  open,
  onOpenChange,
  sale,
  onConfirmDelete,
}) => {
  if (!sale) return null

  return (
    <ConfirmDestructiveDialog
      open={open}
      onOpenChange={onOpenChange}
      title="¿Anular ticket de venta?"
      confirmLabel="Anular Venta"
      cancelLabel="Volver"
      onConfirm={() => onConfirmDelete(sale.id)}
      description={
        <>
          Esta acción anulará el ticket{' '}
          <strong className="text-[var(--neutral-emphasis)]">{sale.ticketNumber}</strong> de{' '}
          <strong className="text-[var(--neutral-emphasis)]">{sale.cliente}</strong> por un total de{' '}
          <strong className="text-[var(--neutral-emphasis)]">
            ${sale.total.toLocaleString('es-AR')}
          </strong>.
        </>
      }
    />
  )
}
