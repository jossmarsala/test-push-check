import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import type { SaleRecord, RegistrarCambioFormData, PaymentMethod } from '../types/sales.types'

interface ProductExchangeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  sale: SaleRecord | null
  onSubmitExchange: (data: RegistrarCambioFormData) => void
}

const COMMON_REASONS = [
  'Talle o medida incorrecta',
  'Cambio de modelo',
  'Preferencia de diseño',
  'Otro motivo',
]

const PAYMENT_METHODS: PaymentMethod[] = [
  'Efectivo',
  'Transferencia',
  'Mercado Pago',
  'Tarjeta',
]

export const ProductExchangeDialog: React.FC<ProductExchangeDialogProps> = ({
  open,
  onOpenChange,
  sale,
  onSubmitExchange,
}) => {
  if (!sale) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <ProductExchangeDialogInner
        key={`${sale.id}-${sale.cambiosRealizados || 0}`}
        sale={sale}
        onClose={() => onOpenChange(false)}
        onSubmitExchange={onSubmitExchange}
      />
    </Dialog>
  )
}

const ProductExchangeDialogInner: React.FC<{
  sale: SaleRecord
  onClose: () => void
  onSubmitExchange: (data: RegistrarCambioFormData) => void
}> = ({ sale, onClose, onSubmitExchange }) => {
  const yaRealizoCambio = (sale.cambiosRealizados || 0) >= 1
  const ultimoCambio = sale.cambioHistorico?.[0]

  const initialReturnedItem = sale.items && sale.items.length > 0 ? sale.items[0] : null
  const [selectedItemName, setSelectedItemName] = useState<string>(
    initialReturnedItem ? initialReturnedItem.name : sale.productosTexto
  )
  const [returnedItemPrice, setReturnedItemPrice] = useState<number>(
    initialReturnedItem ? initialReturnedItem.unitPrice : sale.total
  )

  const [newProductName, setNewProductName] = useState('')
  const [newProductPriceStr, setNewProductPriceStr] = useState('')
  const [motivo, setMotivo] = useState(COMMON_REASONS[0])
  const [metodoDiferencia, setMetodoDiferencia] = useState<PaymentMethod>('Efectivo')

  const parsedNewPrice = parseFloat(newProductPriceStr.replace(/[^0-9.]/g, '')) || 0
  const diferencia = parsedNewPrice > 0 ? parsedNewPrice - returnedItemPrice : 0

  const handleReturnedItemSelect = (itemName: string) => {
    setSelectedItemName(itemName)
    const found = sale.items.find((i) => i.name === itemName)
    if (found) {
      setReturnedItemPrice(found.unitPrice)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (yaRealizoCambio) return
    if (!newProductName.trim() || parsedNewPrice <= 0) return

    const saldoAFavor = diferencia < 0 ? Math.abs(diferencia) : undefined

    onSubmitExchange({
      saleId: sale.id,
      productoDevuelto: selectedItemName,
      valorDevuelto: returnedItemPrice,
      productoNuevo: newProductName.trim(),
      valorNuevo: parsedNewPrice,
      diferenciaMonto: diferencia,
      diferenciaMetodoPago: diferencia > 0 ? metodoDiferencia : undefined,
      saldoAFavorEmitido: saldoAFavor,
      motivo,
    })

    onClose()
  }

  return (
    <DialogContent className="max-w-[480px] rounded-[var(--radius-card-lg)] border-[var(--dashboard-card-border)] bg-[var(--neutral-surface)] p-6 shadow-xl">
      <DialogHeader className="pb-3 border-b border-[var(--neutral-border-subtle)] text-left">
        <DialogTitle className="text-base font-semibold text-[var(--neutral-emphasis)]">
          {yaRealizoCambio ? 'Cambio registrado' : 'Registrar cambio de producto'}
        </DialogTitle>
        <DialogDescription className="text-xs text-[var(--neutral-muted)]">
          Ticket #{sale.ticketNumber} • {sale.cliente}
        </DialogDescription>
      </DialogHeader>

      {yaRealizoCambio ? (
        <div className="space-y-3.5 py-1 text-xs text-left">
          <p className="text-[var(--neutral-muted)] leading-relaxed">
            Este comprobante ya utilizó el único cambio permitido por compra. No se admiten cambios adicionales ni devoluciones de dinero.
          </p>

          {ultimoCambio && (
            <div className="rounded-lg border border-[var(--neutral-border-subtle)] bg-[var(--neutral-subtle)]/40 p-3 space-y-2">
              <div className="flex justify-between text-[11px] text-[var(--neutral-muted)]">
                <span>Fecha del cambio:</span>
                <span className="font-mono text-[var(--neutral-emphasis)]">{ultimoCambio.fechaCompleta}</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-[var(--neutral-muted)]">Devuelto:</span>
                <span className="text-[var(--neutral-emphasis)]">{ultimoCambio.productoDevuelto}</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-[var(--neutral-muted)]">Entregado:</span>
                <span className="font-medium text-[var(--neutral-emphasis)]">{ultimoCambio.productoNuevo}</span>
              </div>
              <div className="flex justify-between text-[11px] pt-1.5 border-t border-[var(--neutral-border-subtle)]">
                <span className="text-[var(--neutral-muted)]">Diferencia:</span>
                <span className="font-mono font-medium text-[var(--neutral-emphasis)]">
                  {ultimoCambio.diferenciaMonto > 0
                    ? `+$${ultimoCambio.diferenciaMonto.toLocaleString('es-AR')}`
                    : ultimoCambio.saldoAFavorEmitido
                    ? `Saldo a favor: $${ultimoCambio.saldoAFavorEmitido.toLocaleString('es-AR')}`
                    : '$0'}
                </span>
              </div>
            </div>
          )}

          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={onClose}
              className="h-8 px-3.5 rounded-lg border border-[var(--neutral-border)] text-xs font-medium text-[var(--neutral-body)] hover:text-[var(--neutral-emphasis)] hover:bg-[var(--neutral-subtle)] transition-colors cursor-pointer"
            >
              Cerrar
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs text-left">
          {/* Producto devuelto */}
          <div className="space-y-1">
            <label className="font-medium text-[var(--neutral-emphasis)] block">
              Producto a devolver
            </label>
            {sale.items && sale.items.length > 1 ? (
              <select
                value={selectedItemName}
                onChange={(e) => handleReturnedItemSelect(e.target.value)}
                className="h-9 w-full rounded-[var(--radius-input)] border border-[var(--neutral-border)] bg-[var(--neutral-card)] px-2.5 text-xs text-[var(--neutral-emphasis)] focus-visible:outline-none focus-visible:border-[var(--neutral-brand)]"
              >
                {sale.items.map((it) => (
                  <option key={it.id} value={it.name}>
                    {it.name} (${it.unitPrice.toLocaleString('es-AR')})
                  </option>
                ))}
              </select>
            ) : (
              <div className="flex items-center justify-between h-9 px-2.5 rounded-[var(--radius-input)] border border-[var(--neutral-border-subtle)] bg-[var(--neutral-subtle)]/40 text-xs">
                <span className="text-[var(--neutral-emphasis)] truncate">{selectedItemName}</span>
                <span className="font-mono text-[var(--neutral-muted)] shrink-0">
                  ${returnedItemPrice.toLocaleString('es-AR')}
                </span>
              </div>
            )}
          </div>

          {/* Nuevo producto */}
          <div className="grid grid-cols-3 gap-2.5">
            <div className="col-span-2 space-y-1">
              <label className="font-medium text-[var(--neutral-emphasis)] block">
                Nuevo producto
              </label>
              <input
                type="text"
                required
                value={newProductName}
                onChange={(e) => setNewProductName(e.target.value)}
                placeholder="Nombre de la nueva pieza"
                className="h-9 w-full rounded-[var(--radius-input)] border border-[var(--neutral-border)] bg-[var(--neutral-card)] px-2.5 text-xs text-[var(--neutral-emphasis)] placeholder:text-[var(--neutral-placeholder)] focus-visible:outline-none focus-visible:border-[var(--neutral-brand)]"
              />
            </div>
            <div className="space-y-1">
              <label className="font-medium text-[var(--neutral-emphasis)] block">
                Precio ($)
              </label>
              <input
                type="text"
                required
                value={newProductPriceStr}
                onChange={(e) => setNewProductPriceStr(e.target.value)}
                placeholder="0"
                className="h-9 w-full rounded-[var(--radius-input)] border border-[var(--neutral-border)] bg-[var(--neutral-card)] px-2.5 text-xs text-[var(--neutral-emphasis)] font-mono focus-visible:outline-none focus-visible:border-[var(--neutral-brand)]"
              />
            </div>
          </div>

          {/* Balance de diferencia */}
          {parsedNewPrice > 0 && (
            <div className="rounded-lg border border-[var(--neutral-border-subtle)] bg-[var(--neutral-subtle)]/30 p-2.5 space-y-2 text-xs">
              <div className="flex justify-between items-center text-xs">
                <span className="text-[var(--neutral-muted)]">Diferencia:</span>
                <span className="font-mono font-medium text-[var(--neutral-emphasis)]">
                  {diferencia > 0
                    ? `+$${diferencia.toLocaleString('es-AR')}`
                    : diferencia < 0
                    ? `-$${Math.abs(diferencia).toLocaleString('es-AR')} (saldo a favor)`
                    : '$0 (mano a mano)'}
                </span>
              </div>

              {diferencia > 0 && (
                <div className="pt-2 border-t border-[var(--neutral-border-subtle)] flex items-center justify-between gap-2">
                  <span className="text-[11px] text-[var(--neutral-muted)]">Cobro:</span>
                  <div className="flex gap-1">
                    {PAYMENT_METHODS.map((metodo) => (
                      <button
                        key={metodo}
                        type="button"
                        onClick={() => setMetodoDiferencia(metodo)}
                        className={`px-2 py-1 text-[11px] rounded border transition-colors cursor-pointer ${
                          metodoDiferencia === metodo
                            ? 'border-[var(--neutral-brand)] bg-[var(--neutral-card)] font-medium text-[var(--neutral-emphasis)]'
                            : 'border-[var(--neutral-border-subtle)] text-[var(--neutral-muted)] hover:bg-[var(--neutral-subtle)]'
                        }`}
                      >
                        {metodo}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Motivo */}
          <div className="space-y-1">
            <label className="font-medium text-[var(--neutral-emphasis)] block">
              Motivo
            </label>
            <select
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              className="h-9 w-full rounded-[var(--radius-input)] border border-[var(--neutral-border)] bg-[var(--neutral-card)] px-2.5 text-xs text-[var(--neutral-emphasis)] focus-visible:outline-none focus-visible:border-[var(--neutral-brand)]"
            >
              {COMMON_REASONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-[var(--neutral-border-subtle)]">
            <button
              type="button"
              onClick={onClose}
              className="h-8 px-3 rounded-lg border border-[var(--neutral-border)] text-xs font-medium text-[var(--neutral-body)] hover:text-[var(--neutral-emphasis)] hover:bg-[var(--neutral-subtle)] transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!newProductName.trim() || parsedNewPrice <= 0}
              className="h-8 px-4 rounded-lg bg-[var(--neutral-brand)] hover:bg-[var(--neutral-brand-hover)] disabled:opacity-40 text-white text-xs font-medium transition-all cursor-pointer shadow-xs"
            >
              Registrar cambio
            </button>
          </div>
        </form>
      )}
    </DialogContent>
  )
}
