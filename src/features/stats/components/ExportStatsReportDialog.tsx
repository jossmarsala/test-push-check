import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Printer, FileDown } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import type {
  BalanceStatsKpis,
  WorkshopStatsSummary,
} from '../types/stats.types'

interface ExportStatsReportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  balanceStats: BalanceStatsKpis
  workshopStats: WorkshopStatsSummary
}

export const ExportStatsReportDialog: React.FC<ExportStatsReportDialogProps> = ({
  open,
  onOpenChange,
  balanceStats,
  workshopStats,
}) => {
  const handlePrint = () => {
    window.print()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[480px] rounded-xl border border-[var(--neutral-border-subtle)] bg-[var(--neutral-surface)] p-6">
        <DialogHeader>
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--neutral-subtle)] text-[var(--neutral-emphasis)]">
              <FileDown className="h-4 w-4 stroke-[1.5]" />
            </div>
            <div>
              <DialogTitle className="text-sm font-medium text-[var(--neutral-emphasis)]">
                Informe de balance y estadísticas
              </DialogTitle>
              <DialogDescription className="text-xs text-[var(--neutral-muted)] mt-0.5">
                Resumen comercial mensual y estado operativo del taller
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 pt-2 text-xs">
          {/* Executive Summary Card */}
          <div className="rounded-lg border border-[var(--neutral-border-subtle)] bg-[var(--neutral-subtle)] p-4 space-y-2.5">
            <div className="flex justify-between border-b border-[var(--neutral-border-subtle)] pb-2 font-medium text-[var(--neutral-emphasis)]">
              <span>Joyería Aguamarina</span>
              <span className="font-mono tabular-nums">
                {new Date().toLocaleDateString('es-AR')}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-[var(--neutral-muted)]">Ventas del mes:</span>
              <span className="font-mono tabular-nums text-emerald-600 dark:text-emerald-400 font-medium">
                +{formatCurrency(balanceStats.ingresosMes)}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-[var(--neutral-muted)]">Gastos del mes:</span>
              <span className="font-mono tabular-nums text-rose-600 dark:text-rose-400 font-medium">
                -{formatCurrency(balanceStats.gastosMes)}
              </span>
            </div>

            <div className="flex justify-between border-t border-[var(--neutral-border-subtle)] pt-2 font-medium">
              <span className="text-[var(--neutral-emphasis)]">Utilidad neta:</span>
              <span className="font-mono tabular-nums text-emerald-600 dark:text-emerald-400 font-semibold">
                {formatCurrency(balanceStats.utilidadNeta)} ({balanceStats.margenNetoPct}% margen)
              </span>
            </div>

            <div className="flex justify-between border-t border-[var(--neutral-border-subtle)] pt-2">
              <span className="text-[var(--neutral-muted)]">Pedidos en taller:</span>
              <span className="font-mono tabular-nums text-[var(--neutral-body)]">
                {workshopStats.enTaller} piezas en proceso
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-[var(--neutral-muted)]">Entregados del mes:</span>
              <span className="font-mono tabular-nums text-[var(--neutral-body)]">
                {workshopStats.entregadosMes} pedidos ({workshopStats.cumplimientoPct}% a tiempo)
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex justify-end gap-2 pt-2 border-t border-[var(--neutral-border-subtle)]">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="flex h-10 items-center justify-center rounded-lg border border-[var(--neutral-border-subtle)] bg-[var(--neutral-surface)] px-4 text-xs font-medium text-[var(--neutral-body)] hover:bg-[var(--neutral-subtle)] active:scale-[0.98] transition-colors cursor-pointer"
            >
              Cerrar
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="flex h-10 items-center justify-center gap-2 rounded-lg bg-[var(--neutral-emphasis)] px-4 text-xs font-medium text-[var(--neutral-canvas)] hover:opacity-90 active:scale-[0.98] transition-colors cursor-pointer"
            >
              <Printer className="h-4 w-4 stroke-[1.5]" />
              <span>Imprimir o guardar PDF</span>
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
