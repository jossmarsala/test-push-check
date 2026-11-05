import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Printer, FileDown } from '@animateicons/react/lucide'
import type { CashKpiOverview, CashRegisterState } from '../types/cash.types'

interface ExportReportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  kpis: CashKpiOverview
  registerState: CashRegisterState
}

export const ExportReportDialog: React.FC<ExportReportDialogProps> = ({
  open,
  onOpenChange,
  kpis,
  registerState,
}) => {
  const [includeMovements, setIncludeMovements] = useState(true)

  const handlePrint = () => {
    window.print()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[var(--dialog-md-max-width)] rounded-[var(--radius-card-lg)] border-[var(--dashboard-card-border)] bg-[var(--neutral-surface)] p-6">
        <DialogHeader>
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--neutral-subtle)] text-[var(--neutral-emphasis)]">
              <FileDown className="h-4 w-4" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold text-[var(--neutral-emphasis)]">
                Exportar Reporte de Caja y Movimientos
              </DialogTitle>
              <DialogDescription className="text-xs text-[var(--neutral-muted)]">
                Genera un resumen contable consolidado para balance y control fiscal.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 pt-2 text-xs">
          {/* Report summary preview */}
          <div className="rounded-[var(--dashboard-input-radius)] border border-[var(--neutral-border-subtle)] bg-[var(--neutral-subtle)]/60 p-4 space-y-2.5">
            <div className="flex justify-between border-b border-[var(--neutral-border-subtle)] pb-2 font-semibold text-[var(--neutral-emphasis)]">
              <span>Joyería Aguamarina - Arqueo de Caja</span>
              <span>{new Date().toLocaleDateString('es-AR')}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-[var(--neutral-muted)]">Estado del turno:</span>
              <span className="font-medium text-[var(--neutral-emphasis)] capitalize">
                {registerState.estado} ({registerState.responsableApertura})
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-[var(--neutral-muted)]">Ingresos totales:</span>
              <span className="font-bold font-mono text-[var(--product-stock-green)]">
                +${kpis.ingresosTotales.toLocaleString('es-AR')}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-[var(--neutral-muted)]">Egresos totales:</span>
              <span className="font-bold font-mono text-[var(--destructive)]">
                -${kpis.egresosTotales.toLocaleString('es-AR')}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-[var(--neutral-muted)]">Saldo neto en efectivo:</span>
              <span className="font-bold font-mono text-[var(--neutral-emphasis)]">
                ${(kpis.ingresosEfectivo - kpis.egresosEfectivo).toLocaleString('es-AR')}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-[var(--neutral-muted)]">Transferencias bancarias:</span>
              <span className="font-mono text-[var(--neutral-body)]">
                ${kpis.transferenciasTotal.toLocaleString('es-AR')}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-[var(--neutral-muted)]">Tarjetas y Mercado Pago:</span>
              <span className="font-mono text-[var(--neutral-body)]">
                ${kpis.tarjetasTotal.toLocaleString('es-AR')}
              </span>
            </div>
          </div>

          {/* Options */}
          <label className="flex items-center gap-2 cursor-pointer text-xs text-[var(--neutral-body)]">
            <input
              type="checkbox"
              checked={includeMovements}
              onChange={(e) => setIncludeMovements(e.target.checked)}
              className="h-4 w-4 rounded border-[var(--neutral-border)] text-[var(--neutral-brand)]"
            />
            <span>Incluir desglose individual de movimientos en el anexo</span>
          </label>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[var(--neutral-border-subtle)]">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="inline-flex h-9.5 items-center justify-center rounded-[var(--radius-btn)] border border-[var(--neutral-border)] bg-[var(--neutral-surface)] px-4 text-xs font-medium text-[var(--neutral-muted)] hover:text-[var(--neutral-emphasis)] hover:bg-[var(--neutral-subtle)] transition-all cursor-pointer"
            >
              Cerrar
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex h-9.5 items-center justify-center gap-1.5 rounded-[var(--radius-btn)] bg-[var(--neutral-brand)] px-5 text-xs font-medium text-white hover:bg-[var(--neutral-brand-hover)] active:scale-[0.98] transition-all cursor-pointer shadow-xs"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Imprimir / Guardar PDF</span>
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
