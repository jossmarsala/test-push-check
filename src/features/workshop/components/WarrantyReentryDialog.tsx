import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import type { Pedido, RegistrarGarantiaFormData } from '../types/workshop.types'

interface WarrantyReentryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  pedido: Pedido | null
  onSubmit: (data: RegistrarGarantiaFormData) => void
}

const getDefaultDeliveryDate = (): string => {
  const target = new Date()
  target.setDate(target.getDate() + 4)
  const y = target.getFullYear()
  const m = String(target.getMonth() + 1).padStart(2, '0')
  const d = String(target.getDate()).padStart(2, '0')
  return `${d}-${m}-${y}`
}

const toDateInputFormat = (dateStr: string): string => {
  if (!dateStr) return ''
  const parts = dateStr.split(/[-/]/)
  if (parts.length === 3) {
    if (parts[0].length <= 2 && parts[2].length === 4) {
      return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`
    }
    if (parts[0].length === 4) {
      return `${parts[0]}-${parts[1].padStart(2, '0')}-${parts[2].padStart(2, '0')}`
    }
  }
  return dateStr
}

const toDisplayFormat = (isoStr: string): string => {
  if (!isoStr) return ''
  const parts = isoStr.split('-')
  if (parts.length === 3 && parts[0].length === 4) {
    return `${parts[2]}-${parts[1]}-${parts[0]}`
  }
  return isoStr
}

export const WarrantyReentryDialog: React.FC<WarrantyReentryDialogProps> = ({
  open,
  onOpenChange,
  pedido,
  onSubmit,
}) => {
  if (!pedido) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <WarrantyReentryDialogInner
        key={pedido.id}
        pedido={pedido}
        onClose={() => onOpenChange(false)}
        onSubmit={onSubmit}
      />
    </Dialog>
  )
}

const WarrantyReentryDialogInner: React.FC<{
  pedido: Pedido
  onClose: () => void
  onSubmit: (data: RegistrarGarantiaFormData) => void
}> = ({ pedido, onClose, onSubmit }) => {
  const [motivoFalla, setMotivoFalla] = useState('')
  const [orfebreNombre, setOrfebreNombre] = useState(pedido.orfebre || 'Esteban Ruiz')
  const [fechaEntrega, setFechaEntrega] = useState(() => getDefaultDeliveryDate())
  const [notas, setNotas] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!motivoFalla.trim()) return

    onSubmit({
      pedidoOriginalId: pedido.id,
      clienteNombre: pedido.cliente,
      contacto: pedido.contacto || '',
      pieza: pedido.pieza,
      motivoFalla: motivoFalla.trim(),
      orfebreNombre: orfebreNombre.trim(),
      fechaEntrega: toDisplayFormat(fechaEntrega),
      notas: notas.trim(),
      imagenes: [],
      imagePreviews: pedido.imagenes || [],
    })

    onClose()
  }

  return (
    <DialogContent className="max-w-[480px] rounded-[var(--radius-card-lg)] border-[var(--dashboard-card-border)] bg-[var(--neutral-surface)] p-6 shadow-xl">
      <DialogHeader className="pb-3 border-b border-[var(--neutral-border-subtle)] text-left">
        <DialogTitle className="text-base font-semibold text-[var(--neutral-emphasis)]">
          Reingreso por garantía
        </DialogTitle>
        <DialogDescription className="text-xs text-[var(--neutral-muted)]">
          Vinculado a la orden #{pedido.id.padStart(4, '0')} • Sin cargo para el cliente
        </DialogDescription>
      </DialogHeader>

      {/* Clean piece reference row */}
      <div className="rounded-lg border border-[var(--neutral-border-subtle)] bg-[var(--neutral-subtle)]/40 p-3 text-xs flex items-center justify-between">
        <div>
          <span className="font-medium text-[var(--neutral-emphasis)] block">{pedido.pieza}</span>
          <span className="text-[11px] text-[var(--neutral-muted)]">
            {pedido.cliente} {pedido.contacto && `• ${pedido.contacto}`}
          </span>
        </div>
        <span className="text-[11px] font-mono text-[var(--neutral-muted)]">Sin cargo ($0)</span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
        {/* Motivo de reingreso */}
        <div className="space-y-1 text-left">
          <label htmlFor="motivo-falla-input" className="font-medium text-[var(--neutral-emphasis)]">
            Motivo del reingreso
          </label>
          <textarea
            id="motivo-falla-input"
            rows={3}
            required
            value={motivoFalla}
            onChange={(e) => setMotivoFalla(e.target.value)}
            placeholder="Descripción del problema o ajuste necesario..."
            className="w-full rounded-[var(--radius-input)] border border-[var(--neutral-border)] bg-[var(--neutral-card)] p-2.5 text-xs text-[var(--neutral-emphasis)] placeholder:text-[var(--neutral-placeholder)] transition-all resize-none focus-visible:outline-none focus-visible:border-[var(--neutral-brand)]"
          />
        </div>

        {/* Orfebre y Fecha de entrega */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1 text-left">
            <label htmlFor="orfebre-input" className="font-medium text-[var(--neutral-body)]">
              Orfebre asignado
            </label>
            <input
              id="orfebre-input"
              type="text"
              required
              value={orfebreNombre}
              onChange={(e) => setOrfebreNombre(e.target.value)}
              placeholder="Nombre del orfebre"
              className="h-9 w-full rounded-[var(--radius-input)] border border-[var(--neutral-border)] bg-[var(--neutral-card)] px-2.5 text-xs text-[var(--neutral-emphasis)] focus-visible:outline-none focus-visible:border-[var(--neutral-brand)]"
            />
          </div>

          <div className="space-y-1 text-left">
            <label htmlFor="fecha-entrega-input" className="font-medium text-[var(--neutral-body)]">
              Fecha de entrega
            </label>
            <input
              id="fecha-entrega-input"
              type="date"
              required
              value={toDateInputFormat(fechaEntrega)}
              onChange={(e) => setFechaEntrega(toDisplayFormat(e.target.value))}
              className="h-9 w-full rounded-[var(--radius-input)] border border-[var(--neutral-border)] bg-[var(--neutral-card)] px-2.5 text-xs text-[var(--neutral-emphasis)] focus-visible:outline-none focus-visible:border-[var(--neutral-brand)] cursor-pointer"
            />
          </div>
        </div>

        {/* Observaciones técnicas opcionales */}
        <div className="space-y-1 text-left">
          <label htmlFor="notas-garantia-input" className="text-[11px] text-[var(--neutral-muted)]">
            Observaciones adicionales (opcional)
          </label>
          <input
            id="notas-garantia-input"
            type="text"
            value={notas}
            onChange={(e) => setNotas(e.target.value)}
            placeholder="Indicaciones para el banco de trabajo..."
            className="h-9 w-full rounded-[var(--radius-input)] border border-[var(--neutral-border)] bg-[var(--neutral-card)] px-2.5 text-xs text-[var(--neutral-emphasis)] placeholder:text-[var(--neutral-placeholder)] focus-visible:outline-none focus-visible:border-[var(--neutral-brand)]"
          />
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
            className="h-8 px-4 rounded-lg bg-[var(--neutral-brand)] hover:bg-[var(--neutral-brand-hover)] text-white text-xs font-medium transition-all cursor-pointer shadow-xs"
          >
            Registrar reingreso
          </button>
        </div>
      </form>
    </DialogContent>
  )
}
