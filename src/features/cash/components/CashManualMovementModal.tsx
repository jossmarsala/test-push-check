import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ArrowDownLeft, ArrowUpRight } from 'lucide-react'
import type { CashMovementType, CashPaymentMethod } from '../types/cash.types'

interface CashManualMovementModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onRegisterMovement: (data: {
    tipo: CashMovementType
    concepto: string
    total: number
    pago: CashPaymentMethod
    responsable: string
  }) => void
}

export const CashManualMovementModal: React.FC<CashManualMovementModalProps> = ({
  open,
  onOpenChange,
  onRegisterMovement,
}) => {
  const [tipo, setTipo] = useState<CashMovementType>('egreso')
  const [concepto, setConcepto] = useState('Retiro de dueño')
  const [total, setTotal] = useState('')
  const [pago, setPago] = useState<CashPaymentMethod>('Efectivo')
  const [responsable, setResponsable] = useState('Pablo Pérez')

  const QUICK_CONCEPTOS: { label: string; tipo: CashMovementType; concepto: string }[] = [
    { label: 'Retiro de dueño', tipo: 'egreso', concepto: 'Retiro de dueño / socio' },
    { label: 'Cambio / sencillo', tipo: 'ingreso', concepto: 'Ingreso para cambio en billetes chicos' },
    { label: 'Adelanto personal', tipo: 'egreso', concepto: 'Adelanto de sueldo en efectivo' },
    { label: 'Aporte de caja', tipo: 'ingreso', concepto: 'Aporte de fondo para pagos de taller' },
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const amount = parseFloat(total.replace(/[^0-9.]/g, '')) || 0
    if (amount <= 0 || !concepto.trim()) return

    onRegisterMovement({
      tipo,
      concepto: concepto.trim(),
      total: amount,
      pago,
      responsable,
    })

    setTotal('')
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[420px] rounded-[var(--radius-card-lg)] border-[var(--dashboard-card-border)] bg-[var(--neutral-surface)] p-6">
        <DialogHeader>
          <DialogTitle className="text-sm font-bold text-[var(--neutral-emphasis)] leading-none">
            Movimiento Manual de Dinero (Cash In / Cash Out)
          </DialogTitle>
          <DialogDescription className="text-xs text-[var(--neutral-muted)] mt-1">
            Registra retiros de dueño o ingresos de cambio fuera del flujo habitual de ventas.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {/* Quick preset chips */}
          <div>
            <span className="text-[10px] uppercase font-semibold text-[var(--neutral-muted)] block mb-1.5">
              Motivos frecuentes:
            </span>
            <div className="grid grid-cols-2 gap-1.5 text-xs">
              {QUICK_CONCEPTOS.map((qc) => (
                <button
                  key={qc.label}
                  type="button"
                  onClick={() => {
                    setTipo(qc.tipo)
                    setConcepto(qc.concepto)
                  }}
                  className={`px-2 py-1.5 rounded-md border text-left transition-all ${
                    concepto === qc.concepto
                      ? 'border-[var(--brand-primary)] bg-[var(--brand-primary)]/10 text-[var(--neutral-emphasis)] font-semibold'
                      : 'border-[var(--neutral-border)] bg-[var(--neutral-subtle)] text-[var(--neutral-muted)] hover:text-[var(--neutral-emphasis)]'
                  }`}
                >
                  <span className="block truncate">{qc.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Type: Ingreso vs Egreso */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setTipo('ingreso')}
              className={`flex items-center justify-center gap-1.5 h-9 rounded-lg border text-xs font-semibold transition-all ${
                tipo === 'ingreso'
                  ? 'border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                  : 'border-[var(--neutral-border)] bg-[var(--neutral-surface)] text-[var(--neutral-muted)]'
              }`}
            >
              <ArrowDownLeft className="h-4 w-4" />
              <span>Ingreso manual (+)</span>
            </button>
            <button
              type="button"
              onClick={() => setTipo('egreso')}
              className={`flex items-center justify-center gap-1.5 h-9 rounded-lg border text-xs font-semibold transition-all ${
                tipo === 'egreso'
                  ? 'border-rose-500 bg-rose-500/10 text-rose-700 dark:text-rose-400'
                  : 'border-[var(--neutral-border)] bg-[var(--neutral-surface)] text-[var(--neutral-muted)]'
              }`}
            >
              <ArrowUpRight className="h-4 w-4" />
              <span>Retiro manual (-)</span>
            </button>
          </div>

          {/* Concepto */}
          <div>
            <label className="block text-xs font-medium text-[var(--neutral-emphasis)] mb-1">
              Concepto / Detalle *
            </label>
            <input
              type="text"
              required
              value={concepto}
              onChange={(e) => setConcepto(e.target.value)}
              placeholder="Ej.: Retiro para gastos menores de banco..."
              className="h-9 w-full rounded-md border border-[var(--neutral-border)] bg-[var(--neutral-card)] px-3 text-xs text-[var(--neutral-emphasis)] focus:outline-none focus:ring-1 focus:ring-[var(--sidebar-ring)]"
            />
          </div>

          {/* Monto & Medio */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-[var(--neutral-emphasis)] mb-1">
                Monto ($) *
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-2.5 flex items-center text-xs font-bold text-[var(--neutral-muted)]">
                  $
                </span>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  required
                  value={total}
                  onChange={(e) => setTotal(e.target.value)}
                  placeholder="0.00"
                  className="h-9 w-full rounded-md border border-[var(--neutral-border)] bg-[var(--neutral-card)] pl-6 pr-2 font-mono font-bold text-xs text-[var(--neutral-emphasis)] focus:outline-none focus:ring-1 focus:ring-[var(--sidebar-ring)]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[var(--neutral-emphasis)] mb-1">
                Medio de pago
              </label>
              <select
                value={pago}
                onChange={(e) => setPago(e.target.value as CashPaymentMethod)}
                className="h-9 w-full rounded-md border border-[var(--neutral-border)] bg-[var(--neutral-card)] px-2 text-xs text-[var(--neutral-emphasis)] focus:outline-none"
              >
                <option value="Efectivo">Efectivo</option>
                <option value="Transferencia">Transferencia</option>
                <option value="Mercado Pago">Mercado Pago</option>
                <option value="Tarjeta">Tarjeta</option>
              </select>
            </div>
          </div>

          {/* Responsable */}
          <div>
            <label className="block text-xs font-medium text-[var(--neutral-emphasis)] mb-1">
              Responsable
            </label>
            <input
              type="text"
              value={responsable}
              onChange={(e) => setResponsable(e.target.value)}
              className="h-9 w-full rounded-md border border-[var(--neutral-border)] bg-[var(--neutral-card)] px-3 text-xs text-[var(--neutral-emphasis)] focus:outline-none"
            />
          </div>

          {/* Footer actions */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-[var(--neutral-border-subtle)]">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="h-9 px-4 rounded-md border border-[var(--neutral-border)] bg-[var(--neutral-surface)] text-xs text-[var(--neutral-muted)] hover:text-[var(--neutral-emphasis)] transition-all cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="h-9 px-5 rounded-md bg-[var(--neutral-brand)] text-xs font-medium text-white hover:bg-[var(--neutral-brand-hover)] active:scale-95 transition-all cursor-pointer shadow-xs"
            >
              Guardar movimiento
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
