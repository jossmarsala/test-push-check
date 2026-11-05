import React from 'react'
import { Lock, Unlock } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'

export interface CashRegisterConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  isAbierta: boolean
  userInCharge: string
  openingTime?: string
  additionalDetails?: React.ReactNode
}

export const CashRegisterConfirmDialog: React.FC<CashRegisterConfirmDialogProps> = ({
  open,
  onOpenChange,
  onConfirm,
  isAbierta,
  userInCharge,
  openingTime,
  additionalDetails,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[420px] rounded-[var(--radius-card-lg)] border-[var(--dashboard-card-border)] bg-[var(--neutral-surface)] p-6">
        <DialogHeader className="pb-3 border-b border-[var(--neutral-border-subtle)]">
          <div className="flex items-center gap-2.5">
            <div
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                isAbierta
                  ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                  : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
              }`}
            >
              {isAbierta ? (
                <Lock className="h-4.5 w-4.5 stroke-[1.75]" />
              ) : (
                <Unlock className="h-4.5 w-4.5 stroke-[1.75]" />
              )}
            </div>
            <div>
              <DialogTitle className="text-base font-bold text-[var(--neutral-emphasis)] leading-snug">
                {isAbierta ? '¿Confirmar cierre de caja?' : '¿Confirmar apertura de caja?'}
              </DialogTitle>
              <DialogDescription className="text-xs text-[var(--neutral-muted)] mt-0.5">
                {isAbierta
                  ? 'Finalizarás el turno activo de cobros y operaciones.'
                  : 'Comenzarás un nuevo turno de cobros y operaciones.'}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Info details */}
        <div className="py-3 space-y-2.5 text-xs">
          <div className="p-3 rounded-lg bg-[var(--neutral-subtle)]/70 border border-[var(--neutral-border-subtle)] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[var(--neutral-muted)]">Responsable:</span>
              <span className="font-semibold text-[var(--neutral-emphasis)]">{userInCharge}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[var(--neutral-muted)]">Horario programado:</span>
              <span className="font-mono text-[var(--neutral-emphasis)]">
                Hoy, {new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })} hs
              </span>
            </div>
            {isAbierta && openingTime && (
              <div className="flex items-center justify-between pt-1 border-t border-[var(--neutral-border-subtle)]">
                <span className="text-[var(--neutral-muted)]">Turno iniciado:</span>
                <span className="font-mono text-[var(--neutral-muted)]">{openingTime}</span>
              </div>
            )}
            {additionalDetails}
          </div>

          <p className="text-[11px] text-[var(--neutral-muted)] leading-relaxed px-0.5">
            {isAbierta
              ? 'El arqueo y estado del turno quedará asentado en el historial de caja.'
              : 'La caja quedará lista para procesar cobros, compras y movimientos.'}
          </p>
        </div>

        {/* Footer buttons */}
        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[var(--neutral-border-subtle)]">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="inline-flex h-9 items-center justify-center rounded-[var(--dashboard-btn-radius)] border border-[var(--neutral-border)] bg-[var(--neutral-surface)] px-4 text-xs font-medium text-[var(--neutral-muted)] hover:text-[var(--neutral-emphasis)] hover:bg-[var(--neutral-subtle)] transition-all cursor-pointer select-none"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`inline-flex h-9 items-center justify-center rounded-[var(--dashboard-btn-radius)] px-4 text-xs font-medium text-white transition-all cursor-pointer select-none shadow-xs active:scale-[0.98] ${
              isAbierta
                ? 'bg-amber-600 hover:bg-amber-700'
                : 'bg-emerald-600 hover:bg-emerald-700'
            }`}
          >
            {isAbierta ? 'Confirmar cierre' : 'Confirmar apertura'}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
