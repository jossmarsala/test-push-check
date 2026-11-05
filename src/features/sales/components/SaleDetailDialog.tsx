import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Printer } from '@animateicons/react/lucide'
import { ArrowLeftRight } from 'lucide-react'
import type { SaleRecord } from '../types/sales.types'

interface SaleDetailDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  sale: SaleRecord | null
  onExchangeSale?: (sale: SaleRecord) => void
}

export const SaleDetailDialog: React.FC<SaleDetailDialogProps> = ({
  open,
  onOpenChange,
  sale,
  onExchangeSale,
}) => {
  if (!sale) return null

  const handlePrint = () => {
    window.print()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[var(--dialog-sm-max-width)] rounded-[var(--radius-card-lg)] border-[var(--dashboard-card-border)] bg-[var(--neutral-surface)] p-6">
        <DialogHeader>
          <DialogTitle className="text-sm font-bold text-[var(--neutral-emphasis)] leading-none">
            Comprobante de Venta
          </DialogTitle>
          <DialogDescription className="sr-only">
            Detalle del comprobante de venta
          </DialogDescription>
        </DialogHeader>

        {/* Printable ticket card */}
        <div className="space-y-3.5 pt-2 text-xs">
          {/* Metadata Grid */}
          <div className="rounded-[var(--dashboard-input-radius)] border border-[var(--neutral-border-subtle)] bg-[var(--neutral-subtle)]/60 p-3 space-y-1.5">
            <div className="flex justify-between">
              <span className="text-[var(--neutral-muted)]">Fecha y Hora:</span>
              <span className="font-medium text-[var(--neutral-emphasis)]">
                {sale.fechaCompleta} - {sale.hora} hs
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--neutral-muted)]">Cliente:</span>
              <span className="font-semibold text-[var(--neutral-emphasis)]">
                {sale.cliente}
              </span>
            </div>
            {sale.clienteContacto && (
              <div className="flex justify-between">
                <span className="text-[var(--neutral-muted)]">Contacto:</span>
                <span className="text-[var(--neutral-body)]">{sale.clienteContacto}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-[var(--neutral-muted)]">Atendido por:</span>
              <span className="text-[var(--neutral-body)]">{sale.vendedor}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--neutral-muted)]">Medio de pago:</span>
              <span className="font-semibold text-[var(--neutral-emphasis)]">
                {sale.pago}
              </span>
            </div>

            {/* Split payment detail */}
            {sale.splitPayments && sale.splitPayments.length > 0 && (
              <div className="pt-1 border-t border-[var(--neutral-border-subtle)] space-y-0.5">
                <span className="text-[10px] uppercase font-semibold text-[var(--neutral-muted)]">
                  Desglose de Pago Dividido:
                </span>
                {sale.splitPayments.map((sp, idx) => (
                  <div key={idx} className="flex justify-between text-[11px] font-mono">
                    <span className="text-[var(--neutral-body)]">• {sp.method}:</span>
                    <span className="font-semibold text-[var(--neutral-emphasis)]">${sp.amount.toLocaleString('es-AR')}</span>
                  </div>
                ))}
              </div>
            )}

            {sale.ringSize && (
              <div className="flex justify-between pt-1 border-t border-[var(--neutral-border-subtle)]">
                <span className="text-[var(--neutral-muted)]">Medida / Talla:</span>
                <span className="font-semibold text-amber-600 dark:text-amber-400 font-mono">
                  {sale.ringSize}
                </span>
              </div>
            )}
          </div>

          {/* Items breakdown */}
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--neutral-muted)] block mb-1.5">
              Artículos
            </span>
            <div className="rounded-[var(--dashboard-input-radius)] border border-[var(--neutral-border-subtle)] bg-[var(--neutral-surface)] divide-y divide-[var(--neutral-border-subtle)]">
              {sale.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-2.5 text-xs"
                >
                  <div className="max-w-[190px]">
                    <span className="font-semibold text-[var(--neutral-emphasis)] block truncate">
                      {item.name}
                    </span>
                    <span className="text-[10px] text-[var(--neutral-muted)]">
                      {item.quantity} x ${item.unitPrice.toLocaleString('es-AR')}
                    </span>
                  </div>
                  <span className="font-bold font-mono text-[var(--neutral-emphasis)]">
                    ${(item.quantity * item.unitPrice).toLocaleString('es-AR')}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          {sale.notas && (
            <div className="rounded-[var(--dashboard-input-radius)] border border-[var(--neutral-border-subtle)] bg-[var(--neutral-surface)] p-2.5 text-xs">
              <span className="text-[10px] uppercase font-semibold text-[var(--neutral-muted)] block">
                Observaciones:
              </span>
              <p className="text-[var(--neutral-body)] mt-0.5">{sale.notas}</p>
            </div>
          )}

          {/* Total */}
          <div className="flex items-center justify-between p-3 rounded-[var(--dashboard-input-radius)] bg-[var(--neutral-subtle)] border border-[var(--neutral-border-subtle)]">
            <span className="text-xs font-semibold text-[var(--neutral-emphasis)]">
              TOTAL COBRADO:
            </span>
            <span className="text-lg font-bold font-mono text-[var(--neutral-emphasis)]">
              ${sale.total.toLocaleString('es-AR')}
            </span>
          </div>

          {/* Historial de Cambio Realizado (Si aplica) */}
          {(sale.cambiosRealizados || 0) >= 1 && sale.cambioHistorico?.[0] && (
            <div className="rounded-[var(--dashboard-input-radius)] border border-[var(--neutral-border-subtle)] bg-[var(--neutral-subtle)]/40 p-3 space-y-1.5 text-xs text-left">
              <div className="flex justify-between items-center text-[11px] text-[var(--neutral-muted)]">
                <span className="font-medium text-[var(--neutral-emphasis)]">Cambio registrado</span>
                <span className="font-mono">{sale.cambioHistorico[0].fechaCompleta}</span>
              </div>
              <div className="flex justify-between text-[11px] text-[var(--neutral-body)]">
                <span className="text-[var(--neutral-muted)]">Devuelto:</span>
                <span>{sale.cambioHistorico[0].productoDevuelto}</span>
              </div>
              <div className="flex justify-between text-[11px] text-[var(--neutral-body)]">
                <span className="text-[var(--neutral-muted)]">Entregado:</span>
                <span className="font-medium text-[var(--neutral-emphasis)]">{sale.cambioHistorico[0].productoNuevo}</span>
              </div>
              <div className="flex justify-between text-[11px] text-[var(--neutral-body)] pt-1 border-t border-[var(--neutral-border-subtle)]">
                <span className="text-[var(--neutral-muted)]">Diferencia:</span>
                <span className="font-mono font-medium text-[var(--neutral-emphasis)]">
                  {sale.cambioHistorico[0].diferenciaMonto > 0
                    ? `+$${sale.cambioHistorico[0].diferenciaMonto.toLocaleString('es-AR')}`
                    : sale.cambioHistorico[0].saldoAFavorEmitido
                    ? `Saldo a favor: $${sale.cambioHistorico[0].saldoAFavorEmitido.toLocaleString('es-AR')}`
                    : '$0'}
                </span>
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex items-center justify-between gap-2 pt-2 border-t border-[var(--neutral-border-subtle)]">
            <div>
              {onExchangeSale && (
                (sale.cambiosRealizados || 0) >= 1 ? (
                  <span className="text-xs text-[var(--neutral-muted)] font-mono">
                    1 cambio registrado
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      onOpenChange(false)
                      onExchangeSale(sale)
                    }}
                    className="inline-flex h-9 items-center justify-center gap-1.5 rounded-[var(--radius-btn)] border border-[var(--neutral-border)] bg-[var(--neutral-surface)] px-3 text-xs font-medium text-[var(--neutral-body)] hover:text-[var(--neutral-emphasis)] hover:bg-[var(--neutral-subtle)] transition-colors cursor-pointer"
                  >
                    <ArrowLeftRight className="h-3.5 w-3.5 text-[var(--neutral-muted)]" />
                    <span>Cambiar producto</span>
                  </button>
                )
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="inline-flex h-9 items-center justify-center rounded-[var(--radius-btn)] border border-[var(--neutral-border)] bg-[var(--neutral-surface)] px-4 text-xs font-medium text-[var(--neutral-muted)] hover:text-[var(--neutral-emphasis)] hover:bg-[var(--neutral-subtle)] transition-colors cursor-pointer"
              >
                Cerrar
              </button>
              <button
                type="button"
                onClick={handlePrint}
                className="inline-flex h-9 items-center justify-center gap-1.5 rounded-[var(--radius-btn)] bg-[var(--neutral-brand)] px-4 text-xs font-medium text-white hover:bg-[var(--neutral-brand-hover)] active:scale-[0.98] transition-all cursor-pointer shadow-xs"
              >
                <Printer className="h-3.5 w-3.5" />
                <span>Imprimir Ticket</span>
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
