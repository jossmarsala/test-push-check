import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Plus, Minus, Clock } from '@animateicons/react/lucide'
import { DollarSign, Package } from 'lucide-react'
import type { ProductItem } from '../types/products.types'
import { usePermissions } from '@/hooks/usePermissions'

interface ProductHistoryModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  product: ProductItem | null
  onAdjustStock: (productId: string, delta: number, reason: string) => void
  onUpdatePrice?: (productId: string, newPrice: number, reason: string) => void
}

export const ProductHistoryModal: React.FC<ProductHistoryModalProps> = ({
  open,
  onOpenChange,
  product,
  onAdjustStock,
  onUpdatePrice,
}) => {
  const { products } = usePermissions()
  const [activeTab, setActiveTab] = useState<'stock' | 'prices'>('stock')

  // Stock adjustment inputs
  const [adjustAmount, setAdjustAmount] = useState<string>('1')

  // Price adjustment inputs
  const [newPriceInput, setNewPriceInput] = useState<string>('')

  if (!product) return null

  const handleApplyAdjustment = (isAdd: boolean) => {
    const qty = parseInt(adjustAmount.replace(/[^0-9]/g, ''), 10) || 0
    if (qty <= 0) return

    const delta = isAdd ? qty : -qty
    const reasonText = isAdd ? `Ingreso de stock (+${qty} un.)` : `Egreso de stock (-${qty} un.)`
    onAdjustStock(product.id, delta, reasonText)
  }

  const handleApplyPriceChange = (e: React.FormEvent) => {
    e.preventDefault()
    if (!onUpdatePrice) return

    const parsedPrice = parseFloat(newPriceInput.replace(/[^0-9.]/g, ''))
    if (isNaN(parsedPrice) || parsedPrice <= 0) return

    onUpdatePrice(product.id, parsedPrice, 'Actualización de precio')
    setNewPriceInput('')
  }

  // Calculate price summary metrics
  const priceHistoryList = product.priceHistory || []
  const initialRecordedPrice =
    priceHistoryList.length > 0
      ? priceHistoryList[priceHistoryList.length - 1].oldPrice
      : product.price

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[var(--dialog-md-max-width)] sm:max-w-[560px] rounded-[var(--radius-card-lg)] border-[var(--dashboard-card-border)] bg-[var(--neutral-surface)] p-6">
        <DialogHeader>
          <div className="flex items-start justify-between gap-3">
            <div>
              <DialogTitle className="flex items-center gap-2 text-base font-bold text-[var(--neutral-emphasis)]">
                <Clock className="h-4.5 w-4.5 text-[var(--neutral-brand)]" />
                <span>Historial de stock y precios</span>
              </DialogTitle>
              <DialogDescription className="text-xs text-[var(--neutral-muted)] mt-1">
                {product.name} <span className="font-mono text-[var(--neutral-muted)]">({product.code})</span>
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Tab switch buttons */}
        <div className="flex items-center rounded-lg bg-[var(--neutral-subtle)] p-1 border border-[var(--neutral-border-subtle)] mt-2">
          <button
            type="button"
            onClick={() => setActiveTab('stock')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
              activeTab === 'stock'
                ? 'bg-[var(--neutral-surface)] text-[var(--neutral-emphasis)] font-semibold shadow-xs'
                : 'text-[var(--neutral-muted)] hover:text-[var(--neutral-emphasis)]'
            }`}
          >
            <Package className="h-3.5 w-3.5" />
            <span>Stock y Movimientos ({product.history?.length || 0})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('prices')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
              activeTab === 'prices'
                ? 'bg-[var(--neutral-surface)] text-[var(--neutral-emphasis)] font-semibold shadow-xs'
                : 'text-[var(--neutral-muted)] hover:text-[var(--neutral-emphasis)]'
            }`}
          >
            <DollarSign className="h-3.5 w-3.5" />
            <span>Historial de Precios ({priceHistoryList.length})</span>
          </button>
        </div>

        {/* TAB 1: STOCK MOVEMENTS */}
        {activeTab === 'stock' && (
          <div className="space-y-4 pt-2 animate-fade-in">
            {/* Quick stock adjustment widget */}
            {products.canAdjustStock && (
              <div className="rounded-[var(--dashboard-input-radius)] border border-[var(--neutral-border-subtle)] bg-[var(--neutral-subtle)] p-3">
                <h4 className="text-xs font-semibold text-[var(--neutral-emphasis)] mb-2">
                  Cambiar stock
                </h4>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    value={adjustAmount}
                    onChange={(e) => setAdjustAmount(e.target.value)}
                    placeholder="Cantidad"
                    className="h-9 flex-1 rounded-[var(--dashboard-input-radius)] border border-[var(--neutral-border)] bg-[var(--neutral-surface)] px-3 text-xs text-[var(--neutral-emphasis)]"
                  />
                  <button
                    type="button"
                    onClick={() => handleApplyAdjustment(true)}
                    className="inline-flex h-9 items-center justify-center gap-1 rounded-[var(--radius-btn)] bg-[var(--neutral-brand)] px-4 text-xs font-medium text-white hover:bg-[var(--neutral-brand-hover)] active:scale-[0.98] transition-all cursor-pointer shrink-0"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Sumar</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyAdjustment(false)}
                    disabled={product.stock <= 0}
                    className="inline-flex h-9 items-center justify-center gap-1 rounded-[var(--dashboard-btn-radius)] border border-[var(--neutral-border)] bg-[var(--neutral-surface)] px-4 text-xs font-medium text-[var(--neutral-emphasis)] hover:bg-[var(--neutral-subtle)] disabled:opacity-40 transition-all cursor-pointer shrink-0"
                  >
                    <Minus className="h-3.5 w-3.5" />
                    <span>Restar</span>
                  </button>
                </div>
              </div>
            )}

            {/* Movements list */}
            <div>
              <h4 className="text-xs font-semibold text-[var(--neutral-muted)] uppercase tracking-wider mb-2">
                Últimos registros de stock
              </h4>
              <div className="max-h-52 overflow-y-auto rounded-[var(--dashboard-input-radius)] border border-[var(--neutral-border-subtle)] bg-[var(--neutral-surface)] divide-y divide-[var(--neutral-border-subtle)]">
                {product.history && product.history.length > 0 ? (
                  product.history.map((mov) => (
                    <div
                      key={mov.id}
                      className="flex items-center justify-between p-3 text-xs"
                    >
                      <div>
                        <span className="font-medium text-[var(--neutral-emphasis)] block">
                          {mov.reason}
                        </span>
                        <span className="text-[11px] text-[var(--neutral-muted)] block">
                          {mov.date}
                        </span>
                      </div>
                      <span
                        className={`font-semibold font-mono ${
                          mov.type === 'ingreso'
                            ? 'text-[var(--product-stock-green)]'
                            : mov.type === 'egreso'
                            ? 'text-[var(--destructive)]'
                            : 'text-[var(--neutral-emphasis)]'
                        }`}
                      >
                        {mov.type === 'ingreso' ? '+' : mov.type === 'egreso' ? '-' : ''}
                        {mov.quantity} un.
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-xs text-[var(--neutral-muted)]">
                    Sin registros históricos de stock disponibles para esta pieza.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PRICE HISTORY */}
        {activeTab === 'prices' && (
          <div className="space-y-4 pt-2 animate-fade-in">
            {/* Price metrics summary cards (Variación Neta removed) */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="rounded-[var(--dashboard-input-radius)] border border-[var(--neutral-border-subtle)] bg-[var(--neutral-subtle)] p-2.5 text-center">
                <span className="text-[10px] text-[var(--neutral-muted)] uppercase tracking-wider block font-medium">
                  Precio Actual
                </span>
                <span className="text-sm font-bold text-[var(--neutral-emphasis)] mt-0.5 block">
                  ${product.price.toFixed(2)}
                </span>
              </div>

              <div className="rounded-[var(--dashboard-input-radius)] border border-[var(--neutral-border-subtle)] bg-[var(--neutral-subtle)] p-2.5 text-center">
                <span className="text-[10px] text-[var(--neutral-muted)] uppercase tracking-wider block font-medium">
                  Precio Inicial
                </span>
                <span className="text-sm font-bold text-[var(--neutral-muted)] mt-0.5 block">
                  ${initialRecordedPrice.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Quick price update widget */}
            {products.canEditPrices && onUpdatePrice && (
              <form
                onSubmit={handleApplyPriceChange}
                className="rounded-[var(--dashboard-input-radius)] border border-[var(--neutral-border-subtle)] bg-[var(--neutral-subtle)] p-3"
              >
                <h4 className="text-xs font-semibold text-[var(--neutral-emphasis)] mb-2">
                  Actualizar precio
                </h4>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-2.5 text-xs text-[var(--neutral-muted)] font-bold">
                      $
                    </span>
                    <input
                      type="number"
                      step="0.01"
                      min="0.01"
                      value={newPriceInput}
                      onChange={(e) => setNewPriceInput(e.target.value)}
                      placeholder={product.price.toFixed(2)}
                      className="h-9 w-full rounded-[var(--dashboard-input-radius)] border border-[var(--neutral-border)] bg-[var(--neutral-surface)] pl-7 pr-3 text-xs text-[var(--neutral-emphasis)] placeholder:text-[var(--neutral-placeholder)]"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={!newPriceInput.trim()}
                    className="inline-flex h-9 items-center justify-center gap-1 rounded-[var(--radius-btn)] bg-[var(--neutral-brand)] px-4 text-xs font-medium text-white hover:bg-[var(--neutral-brand-hover)] active:scale-[0.98] disabled:opacity-40 transition-all cursor-pointer shrink-0"
                  >
                    <span>Actualizar precio</span>
                  </button>
                </div>
              </form>
            )}

            {/* Price history list */}
            <div>
              <h4 className="text-xs font-semibold text-[var(--neutral-muted)] uppercase tracking-wider mb-2">
                Registro cronológico de precios
              </h4>
              <div className="max-h-52 overflow-y-auto rounded-[var(--dashboard-input-radius)] border border-[var(--neutral-border-subtle)] bg-[var(--neutral-surface)] divide-y divide-[var(--neutral-border-subtle)]">
                {priceHistoryList.length > 0 ? (
                  priceHistoryList.map((entry) => {
                    const isIncrease = entry.difference > 0
                    const isDecrease = entry.difference < 0

                    return (
                      <div
                        key={entry.id}
                        className="flex items-center justify-between p-3 text-xs hover:bg-[var(--neutral-subtle)]/50 transition-colors"
                      >
                        <div className="min-w-0 flex-1 pr-3">
                          <span className="font-semibold text-[var(--neutral-emphasis)] block truncate">
                            {entry.reason}
                          </span>
                          <span className="text-[11px] text-[var(--neutral-muted)] block mt-0.5">
                            {entry.date}
                          </span>
                        </div>

                        <div className="text-right shrink-0">
                          <div className="flex items-center justify-end gap-1.5 font-mono text-xs">
                            <span className="text-[var(--neutral-muted)] line-through">
                              ${entry.oldPrice.toFixed(2)}
                            </span>
                            <span className="text-[var(--neutral-muted)]">→</span>
                            <span className="font-bold text-[var(--neutral-emphasis)]">
                              ${entry.newPrice.toFixed(2)}
                            </span>
                          </div>
                          {entry.difference !== 0 && (
                            <span
                              className={`text-[10px] font-medium block mt-0.5 ${
                                isIncrease
                                  ? 'text-emerald-600 dark:text-emerald-400'
                                  : isDecrease
                                  ? 'text-rose-600 dark:text-rose-400'
                                  : 'text-[var(--neutral-muted)]'
                              }`}
                            >
                              {isIncrease ? '+' : ''}
                              ${entry.difference.toFixed(2)}
                              {entry.percentageChange !== undefined && entry.percentageChange !== 0 && (
                                <span className="ml-1">
                                  ({isIncrease ? '+' : ''}{entry.percentageChange}%)
                                </span>
                              )}
                            </span>
                          )}
                        </div>
                      </div>
                    )
                  })
                ) : (
                  <div className="p-4 text-center text-xs text-[var(--neutral-muted)]">
                    No hay cambios de precio registrados. El precio base actual es ${product.price.toFixed(2)}.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end pt-3 border-t border-[var(--neutral-border-subtle)]">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="inline-flex h-9 items-center justify-center rounded-[var(--dashboard-btn-radius)] border border-[var(--neutral-border)] bg-[var(--neutral-surface)] px-4 text-xs font-medium text-[var(--neutral-emphasis)] hover:bg-[var(--neutral-subtle)] transition-all cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
