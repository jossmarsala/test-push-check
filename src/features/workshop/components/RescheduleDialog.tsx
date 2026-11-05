import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Calendar, CalendarClock } from 'lucide-react'
import type { Pedido } from '../types/workshop.types'

interface RescheduleDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  pedido: Pedido | null
  onConfirm: (pedidoId: string, newDate: string) => void
}

export const RescheduleDialog: React.FC<RescheduleDialogProps> = ({
  open,
  onOpenChange,
  pedido,
  onConfirm,
}) => {
  if (!pedido) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <RescheduleDialogInner
        key={pedido.id}
        pedido={pedido}
        onCancel={() => onOpenChange(false)}
        onConfirm={onConfirm}
      />
    </Dialog>
  )
}

const toDateInputValue = (dateStr?: string): string => {
  if (!dateStr) {
    const today = new Date()
    return today.toISOString().split('T')[0]
  }
  const cleanStr = dateStr.trim()
  if (/^\d{4}-\d{2}-\d{2}$/.test(cleanStr)) {
    return cleanStr
  }
  const parts = cleanStr.split(/[-/]/)
  if (parts.length === 3) {
    // DD-MM-YYYY
    if (parts[0].length <= 2 && parts[2].length === 4) {
      return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`
    }
    // YYYY-MM-DD
    if (parts[0].length === 4) {
      return `${parts[0]}-${parts[1].padStart(2, '0')}-${parts[2].padStart(2, '0')}`
    }
  }
  return new Date().toISOString().split('T')[0]
}

const formatDateToDisplay = (isoStr: string): string => {
  if (!isoStr) return ''
  const parts = isoStr.split('-')
  if (parts.length === 3 && parts[0].length === 4) {
    return `${parts[2]}-${parts[1]}-${parts[0]}`
  }
  return isoStr
}

const formatReadableDate = (isoStr: string): string => {
  if (!isoStr) return ''
  try {
    const [year, month, day] = isoStr.split('-').map(Number)
    if (!year || !month || !day) return ''
    const date = new Date(year, month - 1, day)
    return date.toLocaleDateString('es-AR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  } catch {
    return ''
  }
}

const RescheduleDialogInner: React.FC<{
  pedido: Pedido
  onCancel: () => void
  onConfirm: (id: string, date: string) => void
}> = ({ pedido, onCancel, onConfirm }) => {
  const [selectedDate, setSelectedDate] = useState(() => toDateInputValue(pedido.fechaEntrega))

  const readableDate = formatReadableDate(selectedDate)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedDate) return

    onConfirm(pedido.id, formatDateToDisplay(selectedDate))
    onCancel()
  }

  return (
    <DialogContent className="sm:max-w-[420px] rounded-[var(--radius-dashboard-card)] border-[var(--dashboard-card-border)] bg-[var(--dashboard-card-bg)] p-6 shadow-xl">
      <DialogHeader>
        <DialogTitle className="text-xl font-bold tracking-tight text-[var(--neutral-emphasis)] flex items-center gap-2">
          <CalendarClock className="h-5 w-5 text-[var(--neutral-brand)]" />
          <span>Reprogramar pedido</span>
        </DialogTitle>
        <DialogDescription className="text-sm text-[var(--neutral-muted)]">
          Seleccioná la nueva fecha de entrega para {pedido.cliente} ({pedido.pieza}).
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="space-y-4 py-2">
        <div className="space-y-2 text-left">
          <label
            htmlFor="reschedule-date-input"
            className="text-xs font-medium text-[var(--neutral-body)] flex items-center justify-between select-none"
          >
            <span className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-[var(--neutral-muted)]" />
              <span>Nueva fecha de entrega</span>
            </span>
            {pedido.fechaEntrega && (
              <span className="text-[11px] text-[var(--neutral-muted)] font-normal">
                Actual: {pedido.fechaEntrega}
              </span>
            )}
          </label>
          <div className="relative">
            <input
              id="reschedule-date-input"
              type="date"
              required
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              onClick={(e) => {
                try {
                  e.currentTarget.showPicker?.()
                } catch {
                  // Fallback for browsers without showPicker
                }
              }}
              className="h-11 w-full rounded-[var(--radius-dashboard-input)] border border-[var(--neutral-border)] bg-[var(--dashboard-card-bg)] px-3.5 text-sm font-medium text-[var(--neutral-emphasis)] focus-visible:outline-none focus-visible:border-[var(--neutral-brand)] focus-visible:ring-1 focus-visible:ring-[var(--neutral-brand)] shadow-2xs cursor-pointer [color-scheme:light] dark:[color-scheme:dark]"
            />
          </div>

          {readableDate && (
            <div className="rounded-lg bg-[var(--dashboard-subtle)]/60 px-3 py-2 text-xs text-[var(--neutral-body)] border border-[var(--neutral-border)]/50">
              <span className="text-[var(--neutral-muted)]">Entrega prevista: </span>
              <strong className="text-[var(--neutral-emphasis)] capitalize font-semibold">
                {readableDate}
              </strong>
            </div>
          )}
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
            className="h-10 rounded-[var(--radius-dashboard-btn)] bg-[var(--neutral-brand)] px-5 text-sm font-medium text-white shadow-xs hover:bg-[var(--neutral-brand-hover)] transition-all cursor-pointer"
          >
            Guardar fecha
          </button>
        </DialogFooter>
      </form>
    </DialogContent>
  )
}
