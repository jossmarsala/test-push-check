import React from 'react'
import type { CashKpiOverview, CashRegisterState } from '../types/cash.types'

interface CashBreakdownRowProps {
  kpis: CashKpiOverview
  registerState: CashRegisterState
}

export const CashBreakdownRow: React.FC<CashBreakdownRowProps> = ({
  kpis,
  registerState,
}) => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {/* Card 1: Estado de caja */}
      <div className="rounded-[var(--radius-card)] border border-[var(--neutral-border-subtle)] bg-[var(--neutral-card)] p-5 shadow-2xs flex flex-col justify-between transition-all">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-semibold text-[var(--neutral-emphasis)]">
            Estado de caja
          </h4>
          <span className="text-[11px] font-medium text-[var(--neutral-muted)]">
            Abierta {registerState.horaApertura}
          </span>
        </div>

        <div className="mt-4 space-y-2 text-xs">
          <div className="flex items-center gap-2">
            <span
              className={`h-2 w-2 rounded-full ${
                registerState.estado === 'abierta'
                  ? 'bg-[var(--product-stock-green)]'
                  : 'bg-[var(--destructive)]'
              }`}
            />
            <span className="font-medium text-[var(--neutral-emphasis)]">
              {registerState.estado === 'abierta' ? 'Abierta ahora' : 'Cerrada'}
            </span>
          </div>

          <div className="space-y-1">
            <p className="text-[var(--neutral-muted)]">
              Apertura:{' '}
              <span className="font-medium text-[var(--neutral-body)]">
                {registerState.responsableApertura}
              </span>
            </p>
            {registerState.estado === 'cerrada' && registerState.responsableCierre && (
              <p className="text-[var(--neutral-muted)]">
                Cierre:{' '}
                <span className="font-medium text-[var(--neutral-body)]">
                  {registerState.responsableCierre}
                </span>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Card 2: Efectivo */}
      <div className="rounded-[var(--radius-card)] border border-[var(--neutral-border-subtle)] bg-[var(--neutral-card)] p-5 shadow-2xs flex flex-col justify-between transition-all">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-semibold text-[var(--neutral-emphasis)]">
            Efectivo en caja
          </h4>
          <span className="text-[11px] font-medium text-[var(--neutral-muted)]">
            Hoy
          </span>
        </div>

        <div className="mt-4 space-y-2.5 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-[var(--neutral-muted)]">Ingresos en efectivo</span>
            <span className="font-semibold text-[var(--neutral-emphasis)] tabular-nums">
              +${kpis.ingresosEfectivo.toLocaleString('es-AR')}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[var(--neutral-muted)]">Egresos en efectivo</span>
            <span className="font-semibold text-[var(--neutral-emphasis)] tabular-nums">
              -${kpis.egresosEfectivo.toLocaleString('es-AR')}
            </span>
          </div>
        </div>
      </div>

      {/* Card 3: Por otro medio de pago */}
      <div className="rounded-[var(--radius-card)] border border-[var(--neutral-border-subtle)] bg-[var(--neutral-card)] p-5 shadow-2xs flex flex-col justify-between transition-all">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-semibold text-[var(--neutral-emphasis)]">
            Otros medios de pago
          </h4>
          <span className="text-[11px] font-medium text-[var(--neutral-muted)]">
            Hoy
          </span>
        </div>

        <div className="mt-4 space-y-2.5 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-[var(--neutral-muted)]">Transferencias</span>
            <span className="font-semibold text-[var(--neutral-emphasis)] tabular-nums">
              ${kpis.transferenciasTotal.toLocaleString('es-AR')}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[var(--neutral-muted)]">Tarjeta / Mercado Pago</span>
            <span className="font-semibold text-[var(--neutral-emphasis)] tabular-nums">
              ${kpis.tarjetasTotal.toLocaleString('es-AR')}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
