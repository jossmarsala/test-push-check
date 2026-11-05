import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { CircleDollarSign } from '@animateicons/react/lucide'
import type { CashMovement } from '../types/cash.types'

interface CashMovementDetailModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  movement: CashMovement | null
}

export const CashMovementDetailModal: React.FC<CashMovementDetailModalProps> = ({
  open,
  onOpenChange,
  movement,
}) => {
  if (!movement) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[var(--dialog-sm-max-width)] rounded-[var(--radius-card-lg)] border-[var(--dashboard-card-border)] bg-[var(--neutral-surface)] p-6">
        <DialogHeader>
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--neutral-subtle)] text-[var(--neutral-emphasis)]">
              <CircleDollarSign className="h-4 w-4" />
            </div>
            <div>
              <DialogTitle className="text-sm font-bold text-[var(--neutral-emphasis)] leading-tight">
                Detalle del Movimiento
              </DialogTitle>
              <DialogDescription className="text-[11px] text-[var(--neutral-muted)]">
                Registro #{movement.id} • {movement.categoria}
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
                {movement.concepto}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--neutral-muted)]">Categoría:</span>
              <span className="font-medium text-[var(--neutral-body)]">
                {movement.categoria} ({movement.tipo})
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--neutral-muted)]">Medio de pago:</span>
              <span className="font-semibold text-[var(--neutral-emphasis)]">
                {movement.pago}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--neutral-muted)]">Horario registrado:</span>
              <span className="font-medium text-[var(--neutral-body)]">
                {movement.fecha} a las {movement.hora} hs
              </span>
            </div>
            {movement.comprobante && (
              <div className="flex justify-between">
                <span className="text-[var(--neutral-muted)]">Comprobante asociado:</span>
                <span className="font-mono text-[var(--neutral-emphasis)]">
                  {movement.comprobante}
                </span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-[var(--neutral-muted)]">Registrado por:</span>
              <span className="text-[var(--neutral-body)]">{movement.responsable}</span>
            </div>
          </div>

          {/* Amount Box */}
          <div className="flex items-center justify-between p-3.5 rounded-[var(--dashboard-input-radius)] bg-[var(--neutral-subtle)] border border-[var(--neutral-border-subtle)]">
            <span className="text-xs font-semibold text-[var(--neutral-emphasis)]">
              TOTAL DEL MOVIMIENTO:
            </span>
            <span
              className={`text-xl font-bold font-mono ${
                movement.total > 0
                  ? 'text-[var(--product-stock-green)]'
                  : 'text-[var(--destructive)]'
              }`}
            >
              {movement.total > 0
                ? `+$${movement.total.toLocaleString('es-AR')}`
                : `-$${Math.abs(movement.total).toLocaleString('es-AR')}`}
            </span>
          </div>

          {/* Close button */}
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
