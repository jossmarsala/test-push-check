import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ReceiptText } from '@animateicons/react/lucide'
import type { ExpenseItem } from '../types/expenses.types'

interface ExpenseDetailDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  expense: ExpenseItem | null
}

export const ExpenseDetailDialog: React.FC<ExpenseDetailDialogProps> = ({
  open,
  onOpenChange,
  expense,
}) => {
  if (!expense) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[var(--dialog-sm-max-width)] rounded-[var(--radius-card-lg)] border-[var(--dashboard-card-border)] bg-[var(--neutral-surface)] p-6">
        <DialogHeader>
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--neutral-subtle)] text-[var(--neutral-emphasis)]">
              <ReceiptText className="h-4 w-4" />
            </div>
            <div>
              <DialogTitle className="text-sm font-bold text-[var(--neutral-emphasis)]">
                Comprobante de Gasto
              </DialogTitle>
              <DialogDescription className="text-[11px] text-[var(--neutral-muted)]">
                Registro #{expense.id} • Aguamarina Joyas
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-3.5 pt-2 text-xs">
          {/* Metadata Card */}
          <div className="rounded-[var(--dashboard-input-radius)] border border-[var(--neutral-border-subtle)] bg-[var(--neutral-subtle)]/60 p-3.5 space-y-2">
            <div className="flex justify-between">
              <span className="text-[var(--neutral-muted)]">Concepto:</span>
              <span className="font-semibold text-[var(--neutral-emphasis)] text-right max-w-[210px]">
                {expense.descripcion}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--neutral-muted)]">Categoría:</span>
              <span className="font-medium text-[var(--neutral-body)]">
                {expense.categoria}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--neutral-muted)]">Medio de pago:</span>
              <span className="font-semibold text-[var(--neutral-emphasis)]">
                {expense.medioPago}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--neutral-muted)]">Fecha y hora:</span>
              <span className="font-medium text-[var(--neutral-body)]">
                {expense.fechaCompleta} - {expense.hora} hs
              </span>
            </div>
            {expense.proveedor && (
              <div className="flex justify-between">
                <span className="text-[var(--neutral-muted)]">Proveedor / Beneficiario:</span>
                <span className="font-medium text-[var(--neutral-body)]">
                  {expense.proveedor}
                </span>
              </div>
            )}
            {expense.comprobanteNumero && (
              <div className="flex justify-between">
                <span className="text-[var(--neutral-muted)]">N° Comprobante:</span>
                <span className="font-mono text-[var(--neutral-emphasis)]">
                  {expense.comprobanteNumero}
                </span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-[var(--neutral-muted)]">Registrado por:</span>
              <span className="text-[var(--neutral-body)]">{expense.registradoPor}</span>
            </div>
          </div>

          {/* Receipt / Invoice Attachment Preview */}
          {expense.comprobanteUrl ? (
            <div className="rounded-[var(--dashboard-input-radius)] border border-[var(--neutral-border-subtle)] bg-[var(--neutral-surface)] p-2.5 space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-semibold text-[var(--neutral-emphasis)]">
                <span>Comprobante / Factura adjunta</span>
                <a
                  href={expense.comprobanteUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-[var(--brand-primary)] hover:underline"
                >
                  Ver tamaño completo &rarr;
                </a>
              </div>
              <div className="h-32 w-full rounded-md overflow-hidden bg-[var(--neutral-subtle)] border border-[var(--neutral-border-subtle)]">
                <img
                  src={expense.comprobanteUrl}
                  alt={`Comprobante ${expense.descripcion}`}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          ) : (
            <div className="p-2.5 rounded-[var(--dashboard-input-radius)] border border-dashed border-[var(--neutral-border-subtle)] text-[11px] text-[var(--neutral-muted)] text-center">
              Sin factura física o PDF adjunto
            </div>
          )}

          {/* Notes */}
          {expense.notas && (
            <div className="rounded-[var(--dashboard-input-radius)] border border-[var(--neutral-border-subtle)] bg-[var(--neutral-surface)] p-2.5 text-xs">
              <span className="text-[10px] uppercase font-semibold text-[var(--neutral-muted)] block">
                Notas adicionales:
              </span>
              <p className="text-[var(--neutral-body)] mt-0.5">{expense.notas}</p>
            </div>
          )}

          {/* Amount Box */}
          <div className="flex items-center justify-between p-3.5 rounded-[var(--dashboard-input-radius)] bg-[var(--neutral-subtle)] border border-[var(--neutral-border-subtle)]">
            <span className="text-xs font-semibold text-[var(--neutral-emphasis)]">
              TOTAL EGRESO:
            </span>
            <span className="text-xl font-bold font-mono text-[var(--neutral-emphasis)]">
              ${expense.monto.toLocaleString('es-AR')}
            </span>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end pt-2 border-t border-[var(--neutral-border-subtle)]">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="inline-flex h-9 items-center justify-center rounded-[var(--dashboard-btn-radius)] border border-[var(--neutral-border)] bg-[var(--neutral-surface)] px-4 text-xs font-medium text-[var(--neutral-emphasis)] hover:bg-[var(--neutral-subtle)] transition-all cursor-pointer"
            >
              Cerrar
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
