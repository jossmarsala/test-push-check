import React from 'react'
import { ConfirmDestructiveDialog } from '@/components/ui/confirm-destructive-dialog'
import type { ExpenseItem } from '../types/expenses.types'

interface DeleteExpenseDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  expense: ExpenseItem | null
  onConfirmDelete: (expenseId: string) => void
}

export const DeleteExpenseDialog: React.FC<DeleteExpenseDialogProps> = ({
  open,
  onOpenChange,
  expense,
  onConfirmDelete,
}) => {
  if (!expense) return null

  return (
    <ConfirmDestructiveDialog
      open={open}
      onOpenChange={onOpenChange}
      title="¿Eliminar registro de gasto?"
      confirmLabel="Eliminar Gasto"
      cancelLabel="Volver"
      onConfirm={() => onConfirmDelete(expense.id)}
      description={
        <>
          Esta acción eliminará el gasto{' '}
          <strong className="text-[var(--neutral-emphasis)]">{expense.descripcion}</strong> por{' '}
          <strong className="text-[var(--neutral-emphasis)]">
            ${expense.monto.toLocaleString('es-AR')}
          </strong>.
        </>
      }
    />
  )
}
