import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { ProductCategory, BulkPriceUpdateFormData } from '../types/products.types'

interface UpdatePricesDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onApplyPriceUpdate: (data: BulkPriceUpdateFormData) => void
  totalProductsCount: number
}

const CATEGORIES: ProductCategory[] = ['Todos', 'Anillos', 'Aros', 'Cadenas', 'Pulseras']

export const UpdatePricesDialog: React.FC<UpdatePricesDialogProps> = ({
  open,
  onOpenChange,
  onApplyPriceUpdate,
  totalProductsCount,
}) => {
  const [category, setCategory] = useState<ProductCategory>('Todos')
  const [percentage, setPercentage] = useState<string>('10')
  const [isIncrease, setIsIncrease] = useState<boolean>(true)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const pct = parseFloat(percentage.replace(/[^0-9.]/g, '')) || 0
    if (pct <= 0) return

    onApplyPriceUpdate({
      category,
      percentage: pct,
      isIncrease,
      applyToAll: category === 'Todos',
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[var(--dialog-sm-max-width)] rounded-[var(--radius-card-lg)] border-[var(--dashboard-card-border)] bg-[var(--neutral-surface)] p-6">
        <DialogHeader>
          <DialogTitle className="text-base font-bold text-[var(--neutral-emphasis)]">
            Actualización masiva precios
          </DialogTitle>
          <DialogDescription className="text-xs text-[var(--neutral-muted)]">
            Ajusta los precios de venta por porcentaje según margen comercial o categoría.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-1">
          {/* Category scope with shadcn/ui Select */}
          <div>
            <label className="block text-xs font-medium text-[var(--neutral-emphasis)] mb-1.5">
              Categoría a actualizar
            </label>
            <Select
              value={category}
              onValueChange={(val) => {
                setCategory(val as ProductCategory)
              }}
            >
              <SelectTrigger className="h-10 w-full rounded-[var(--dashboard-input-radius)] border border-[var(--neutral-border)] bg-[var(--neutral-surface)] px-3 text-xs text-[var(--neutral-emphasis)] focus-visible:border-[var(--sidebar-ring)] focus-visible:ring-1 focus-visible:ring-[var(--sidebar-ring)] shadow-2xs cursor-pointer">
                <SelectValue placeholder="Seleccionar categoría" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat === 'Todos' ? `Todos los productos (${totalProductsCount})` : cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Operation type: Increase or Discount */}
          <div>
            <label className="block text-xs font-medium text-[var(--neutral-emphasis)] mb-1.5">
              Tipo de ajuste
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setIsIncrease(true)}
                className={`inline-flex h-9.5 items-center justify-center rounded-[var(--dashboard-btn-radius)] border text-xs font-medium transition-all cursor-pointer ${
                  isIncrease
                    ? 'border-[var(--neutral-emphasis)] bg-[var(--neutral-subtle)] text-[var(--neutral-emphasis)] font-semibold shadow-2xs'
                    : 'border-[var(--neutral-border)] bg-[var(--neutral-surface)] text-[var(--neutral-muted)] hover:text-[var(--neutral-emphasis)]'
                }`}
              >
                + Aumento (%)
              </button>
              <button
                type="button"
                onClick={() => setIsIncrease(false)}
                className={`inline-flex h-9.5 items-center justify-center rounded-[var(--dashboard-btn-radius)] border text-xs font-medium transition-all cursor-pointer ${
                  !isIncrease
                    ? 'border-[var(--neutral-emphasis)] bg-[var(--neutral-subtle)] text-[var(--neutral-emphasis)] font-semibold shadow-2xs'
                    : 'border-[var(--neutral-border)] bg-[var(--neutral-surface)] text-[var(--neutral-muted)] hover:text-[var(--neutral-emphasis)]'
                }`}
              >
                - Descuento (%)
              </button>
            </div>
          </div>

          {/* Percentage Input */}
          <div>
            <label className="block text-xs font-medium text-[var(--neutral-emphasis)] mb-1">
              Porcentaje a aplicar
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.5"
                min="0.1"
                max="100"
                required
                value={percentage}
                onChange={(e) => setPercentage(e.target.value)}
                placeholder="10"
                className="h-10 w-full rounded-[var(--dashboard-input-radius)] border border-[var(--neutral-border)] bg-[var(--neutral-surface)] pl-3 pr-8 text-xs font-semibold text-[var(--neutral-emphasis)] focus:border-[var(--sidebar-ring)] focus:outline-hidden"
              />
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-xs font-medium text-[var(--neutral-muted)]">
                %
              </span>
            </div>
            <p className="mt-1 text-[11px] text-[var(--neutral-muted)]">
              Ejemplo: Un producto de $38.95 pasará a ser{' '}
              <strong className="text-[var(--neutral-emphasis)]">
                $
                {isIncrease
                  ? (38.95 * (1 + (parseFloat(percentage) || 0) / 100)).toFixed(2)
                  : (38.95 * (1 - (parseFloat(percentage) || 0) / 100)).toFixed(2)}
              </strong>
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[var(--neutral-border-subtle)]">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="inline-flex h-9.5 items-center justify-center rounded-[var(--radius-btn)] border border-[var(--neutral-border)] bg-[var(--neutral-surface)] px-4 text-xs font-medium text-[var(--neutral-muted)] hover:text-[var(--neutral-emphasis)] hover:bg-[var(--neutral-subtle)] transition-all cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="inline-flex h-9.5 items-center justify-center rounded-[var(--radius-btn)] bg-[var(--neutral-brand)] px-5 text-xs font-medium text-white hover:bg-[var(--neutral-brand-hover)] active:scale-[0.98] transition-all cursor-pointer shadow-xs"
            >
              Aplicar actualización
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

