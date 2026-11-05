import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Wallet,
  Landmark,
  Smartphone,
  Pencil,
  DollarSign,
} from 'lucide-react'
import type { Pedido, MetodoPago, ConfirmPaymentDetails } from '../types/workshop.types'

interface PaymentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  pedido: Pedido | null
  onConfirm: (
    pedidoId: string,
    details: ConfirmPaymentDetails
  ) => void
}

export const PaymentDialog: React.FC<PaymentDialogProps> = ({
  open,
  onOpenChange,
  pedido,
  onConfirm,
}) => {
  if (!pedido) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <PaymentDialogInner
        key={pedido.id}
        pedido={pedido}
        onCancel={() => onOpenChange(false)}
        onConfirm={onConfirm}
      />
    </Dialog>
  )
}

const PaymentDialogInner: React.FC<{
  pedido: Pedido
  onCancel: () => void
  onConfirm: (id: string, details: ConfirmPaymentDetails) => void
}> = ({ pedido, onCancel, onConfirm }) => {
  const initialTotal = pedido.pagoTotal ?? 15000
  const existingAbonado =
    pedido.pagos && pedido.pagos.length > 0
      ? pedido.pagos.reduce((sum, p) => sum + p.monto, 0)
      : (pedido.señaAdelanto ?? 0)
  const initialSaldo = Math.max(0, initialTotal - existingAbonado)
  const isAlreadyPaid = initialTotal > 0 && initialSaldo <= 0

  const [totalPedido, setTotalPedido] = useState<number>(initialTotal)
  const [isEditingTotal, setIsEditingTotal] = useState(false)
  const [selectedMetodo, setSelectedMetodo] = useState<MetodoPago>('Transferencia')
  const [montoAbonar, setMontoAbonar] = useState<string>(
    initialSaldo > 0 ? String(initialSaldo) : '0'
  )
  const [fechaPago, setFechaPago] = useState<string>(() => new Date().toISOString().split('T')[0])

  const formatCurrency = (val: number) => {
    return `$${Math.round(val).toLocaleString('es-AR')}`
  }

  const parsedMonto = parseFloat(montoAbonar.replace(/[^0-9.]/g, '')) || 0
  const saldoPendienteActual = Math.max(0, totalPedido - existingAbonado)
  const nuevoSaldo = Math.max(0, totalPedido - (existingAbonado + parsedMonto))
  const isCancelado = totalPedido > 0 && existingAbonado + parsedMonto >= totalPedido

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onConfirm(pedido.id, {
      montoAbonado: parsedMonto,
      metodo: selectedMetodo,
      nuevoPagoTotal: totalPedido,
      fechaPago,
    })
    onCancel()
  }

  return (
    <DialogContent className="sm:max-w-[460px] max-h-[92vh] overflow-y-auto rounded-[var(--radius-dashboard-card)] border-[var(--dashboard-card-border)] bg-[var(--dashboard-card-bg)] p-6 shadow-xl">
      <DialogHeader>
        <DialogTitle className="text-lg sm:text-xl font-bold tracking-tight text-[var(--neutral-emphasis)] flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-[var(--neutral-brand)]" />
          <span>{isAlreadyPaid ? 'Registrar nuevo pago' : 'Registrar pago'}</span>
        </DialogTitle>
        <DialogDescription className="text-xs sm:text-sm text-[var(--neutral-muted)]">
          Cliente: <strong className="text-[var(--neutral-emphasis)]">{pedido.cliente}</strong> • {pedido.pieza}
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="space-y-4 py-2">
        {/* Financial Summary Card with editable Total */}
        <div className="rounded-[var(--radius-dashboard-input)] border border-[var(--neutral-border)] bg-[var(--dashboard-subtle)]/60 p-3.5 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[var(--neutral-muted)] flex items-center gap-1.5">
              <span>Importe total del pedido:</span>
              <button
                type="button"
                onClick={() => setIsEditingTotal((prev) => !prev)}
                className="inline-flex items-center gap-1 text-[11px] text-[var(--neutral-brand)] hover:underline cursor-pointer"
                title="Editar precio total"
              >
                <Pencil className="h-3 w-3" />
                <span>{isEditingTotal ? 'Listo' : 'Editar'}</span>
              </button>
            </span>
            {isEditingTotal ? (
              <div className="flex items-center gap-1">
                <span className="text-xs font-semibold text-[var(--neutral-muted)]">$</span>
                <input
                  type="number"
                  min="0"
                  value={totalPedido}
                  onChange={(e) => setTotalPedido(Number(e.target.value) || 0)}
                  className="h-7 w-28 rounded border border-[var(--neutral-border)] bg-[var(--dashboard-card-bg)] px-2 text-right text-xs font-bold text-[var(--neutral-emphasis)] focus:outline-none focus:border-[var(--neutral-brand)]"
                />
              </div>
            ) : (
              <span className="font-semibold text-sm text-[var(--neutral-emphasis)]">
                {formatCurrency(totalPedido)}
              </span>
            )}
          </div>

          {existingAbonado > 0 && (
            <div className="flex items-center justify-between text-xs">
              <span className="text-[var(--neutral-muted)]">Ya abonado anteriormente:</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-medium font-mono">
                {formatCurrency(existingAbonado)}
              </span>
            </div>
          )}

          <div className="pt-2 border-t border-[var(--neutral-border)]/60 flex items-center justify-between">
            <span className="text-xs font-semibold text-[var(--neutral-emphasis)]">
              Saldo pendiente:
            </span>
            <span className="text-sm font-bold text-[var(--neutral-brand)] font-mono">
              {formatCurrency(saldoPendienteActual)}
            </span>
          </div>
        </div>

        {/* Monto a registrar (without preset badges!) */}
        <div className="space-y-1.5 text-left">
          <label htmlFor="pago-monto-input" className="text-xs font-medium text-[var(--neutral-body)] select-none">
            Monto a abonar ($)
          </label>

          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-[var(--neutral-muted)]">
              $
            </span>
            <input
              id="pago-monto-input"
              type="number"
              step="any"
              min="0"
              value={montoAbonar}
              onChange={(e) => setMontoAbonar(e.target.value)}
              placeholder="0"
              className="h-11 w-full rounded-[var(--radius-dashboard-input)] border border-[var(--neutral-border)] bg-[var(--dashboard-card-bg)] pl-7 pr-3.5 text-sm font-bold text-[var(--neutral-emphasis)] placeholder:text-[var(--neutral-placeholder)] shadow-2xs focus-visible:outline-none focus-visible:border-[var(--neutral-brand)] focus-visible:ring-1 focus-visible:ring-[var(--neutral-brand)] font-mono"
            />
          </div>

          {/* Dynamic Result Feedback (automatically saves as cancelado when total is reached) */}
          {isCancelado ? (
            <div className="flex items-center gap-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-3 py-2 text-xs text-emerald-700 dark:text-emerald-300">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
              <span>
                El pedido quedará guardado como <strong>Cancelado</strong> (100% saldado, saldo restante: $0).
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2 rounded-lg bg-blue-500/10 border border-blue-500/20 px-3 py-2 text-xs text-blue-700 dark:text-blue-300">
              <AlertCircle className="h-4 w-4 shrink-0 text-blue-600 dark:text-blue-400" />
              <span>
                Quedará un saldo pendiente de <strong>{formatCurrency(nuevoSaldo)}</strong> tras este pago.
              </span>
            </div>
          )}
        </div>

        {/* Medio de pago */}
        <div className="space-y-1.5 text-left">
          <label className="text-xs font-medium text-[var(--neutral-body)] block select-none">
            Medio de pago
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: 'Efectivo', label: 'Efectivo', icon: Wallet },
              { id: 'Transferencia', label: 'Transferencia', icon: Landmark },
              { id: 'Mercado Pago', label: 'Mercado Pago', icon: Smartphone },
              { id: 'Tarjeta', label: 'Tarjeta', icon: CreditCard },
            ].map(({ id, label, icon: Icon }) => {
              const m = id as MetodoPago
              const isSelected = selectedMetodo === m
              return (
                <button
                  key={m}
                  type="button"
                  onClick={() => setSelectedMetodo(m)}
                  className={`flex flex-col items-center justify-center p-2.5 rounded-[var(--radius-dashboard-input)] border text-xs font-medium gap-1.5 transition-all cursor-pointer ${
                    isSelected
                      ? 'border-[var(--neutral-brand)] bg-[var(--dashboard-subtle)] text-[var(--neutral-emphasis)] ring-1 ring-[var(--neutral-brand)] shadow-2xs font-semibold'
                      : 'border-[var(--neutral-border)] bg-transparent text-[var(--neutral-body)] hover:bg-[var(--dashboard-subtle)]'
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isSelected ? 'text-[var(--neutral-brand)]' : 'text-[var(--neutral-muted)]'}`} />
                  <span>{label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Fecha de pago (full width, no nro comprobante / notas field!) */}
        <div className="space-y-1 text-left">
          <label htmlFor="pago-fecha-input" className="text-xs font-medium text-[var(--neutral-body)] flex items-center gap-1 select-none">
            <Calendar className="h-3 w-3 text-[var(--neutral-muted)]" />
            <span>Fecha del pago</span>
          </label>
          <input
            id="pago-fecha-input"
            type="date"
            value={fechaPago}
            onChange={(e) => setFechaPago(e.target.value)}
            onClick={(e) => {
              try {
                e.currentTarget.showPicker?.()
              } catch {
                // Fallback
              }
            }}
            className="h-10 w-full rounded-[var(--radius-dashboard-input)] border border-[var(--neutral-border)] bg-[var(--dashboard-card-bg)] px-3 text-xs text-[var(--neutral-emphasis)] focus-visible:outline-none focus-visible:border-[var(--neutral-brand)] cursor-pointer [color-scheme:light] dark:[color-scheme:dark]"
          />
        </div>

        <DialogFooter className="mt-5 pt-2 gap-2 sm:gap-0">
          <button
            type="button"
            onClick={onCancel}
            className="h-10 rounded-[var(--radius-dashboard-btn)] border border-[var(--neutral-border)] px-4 text-sm font-medium text-[var(--neutral-body)] hover:bg-[var(--dashboard-subtle)] transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="h-10 rounded-[var(--radius-dashboard-btn)] bg-[var(--neutral-brand)] px-5 text-sm font-medium text-white shadow-xs hover:bg-[var(--neutral-brand-hover)] transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <DollarSign className="h-4 w-4" />
            <span>
              {parsedMonto > 0
                ? `Confirmar pago de ${formatCurrency(parsedMonto)}`
                : 'Guardar cambios'}
            </span>
          </button>
        </DialogFooter>
      </form>
    </DialogContent>
  )
}
