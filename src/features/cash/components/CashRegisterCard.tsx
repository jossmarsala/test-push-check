import React, { useState } from 'react'
import { CircleDollarSign, CircleCheck as CheckCircle2, CircleAlert as AlertCircle, UserRound } from '@animateicons/react/lucide'
import { useAuth } from '@/hooks/useAuth'
import { CashRegisterConfirmDialog } from './CashRegisterConfirmDialog'
import type { CashRegisterState } from '../types/cash.types'

interface CashRegisterCardProps {
  registerState: CashRegisterState
  onCloseRegister: (countedMoney: number, observations: string, responsableCierre?: string) => void
  onReopenRegister: () => void
}

export const CashRegisterCard: React.FC<CashRegisterCardProps> = ({
  registerState,
  onCloseRegister,
  onReopenRegister,
}) => {
  const { profile } = useAuth()
  const defaultUser = profile
    ? [profile.first_name, profile.last_name].filter(Boolean).join(' ') || profile.email
    : 'Juana Pérez (Administradora)'

  const [dineroContadoStr, setDineroContadoStr] = useState(
    registerState.dineroContado !== undefined
      ? registerState.dineroContado.toString()
      : registerState.dineroEsperado.toString()
  )
  const [responsableCierre, setResponsableCierre] = useState(
    registerState.responsableCierre || defaultUser
  )
  const [motivos, setMotivos] = useState(registerState.observaciones || '')
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)

  const countedMoney = parseFloat(dineroContadoStr.replace(/[^0-9.]/g, '')) || 0
  const expectedMoney = registerState.dineroEsperado
  const difference = countedMoney - expectedMoney

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsConfirmOpen(true)
  }

  const handleConfirmAction = () => {
    setIsConfirmOpen(false)
    if (registerState.estado === 'abierta') {
      onCloseRegister(countedMoney, motivos, responsableCierre)
    } else {
      onReopenRegister()
    }
  }

  return (
    <div className="rounded-[var(--radius-card)] border border-[var(--neutral-border-subtle)] bg-[var(--neutral-card)] p-5 shadow-2xs flex flex-col justify-between transition-all">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-semibold tracking-tight text-[var(--neutral-emphasis)] leading-tight">
              Gestionar caja
            </h2>
          </div>
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
              registerState.estado === 'abierta'
                ? 'bg-[var(--ventas-trend-up-bg)] text-[var(--ventas-trend-up-fg)]'
                : 'bg-[var(--neutral-subtle)] text-[var(--neutral-muted)]'
            }`}
          >
            {registerState.estado === 'abierta' ? 'Caja abierta' : 'Caja cerrada'}
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Top row: Dinero contado & Dinero esperado */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            {/* Dinero contado */}
            <div>
              <label className="block text-xs font-medium text-[var(--neutral-emphasis)] mb-1.5">
                Dinero contado
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-[var(--neutral-muted)]">
                  <CircleDollarSign className="h-4 w-4 stroke-[1.75]" />
                </span>
                <input
                  type="number"
                  step="0.01"
                  required
                  disabled={registerState.estado === 'cerrada'}
                  value={dineroContadoStr}
                  onChange={(e) => setDineroContadoStr(e.target.value)}
                  placeholder="0.00"
                  className="h-10 w-full rounded-[var(--radius-input)] border border-[var(--neutral-border)] bg-[var(--neutral-surface)] pl-9 pr-3 text-xs font-bold font-mono text-[var(--neutral-emphasis)] focus:border-[var(--sidebar-ring)] focus:outline-hidden disabled:opacity-50 transition-all shadow-2xs"
                />
              </div>
            </div>

            {/* Dinero esperado */}
            <div className="sm:text-right">
              <span className="block text-xs font-medium text-[var(--neutral-muted)] mb-1.5">
                Dinero esperado
              </span>
              <div className="text-2xl sm:text-3xl font-bold font-mono text-[var(--neutral-emphasis)] leading-tight tabular-nums">
                ${expectedMoney.toLocaleString('es-AR')}
              </div>
            </div>
          </div>

          {/* Difference indicator */}
          {registerState.estado === 'abierta' && (
            <div
              className={`flex items-center gap-2 rounded-[var(--radius-input)] p-2.5 text-xs font-medium ${
                Math.abs(difference) < 0.01
                  ? 'bg-[var(--ventas-trend-up-bg)] text-[var(--ventas-trend-up-fg)]'
                  : difference < 0
                  ? 'bg-[var(--ventas-trend-down-bg)] text-[var(--ventas-trend-down-fg)]'
                  : 'bg-[var(--neutral-subtle)] text-[var(--neutral-emphasis)]'
              }`}
            >
              {Math.abs(difference) < 0.01 ? (
                <>
                  <CheckCircle2 className="h-4 w-4 stroke-[2.5]" />
                  <span>Cuadre exacto: Sin diferencias detectadas.</span>
                </>
              ) : difference < 0 ? (
                <>
                  <AlertCircle className="h-4 w-4 stroke-[2.5]" />
                  <span>
                    Faltante en caja: -${Math.abs(difference).toLocaleString('es-AR')}
                  </span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4 stroke-[2.5]" />
                  <span>
                    Sobrante en caja: +${difference.toLocaleString('es-AR')}
                  </span>
                </>
              )}
            </div>
          )}

          {/* Responsable de cierre */}
          <div>
            <label className="block text-xs font-medium text-[var(--neutral-emphasis)] mb-1.5">
              Usuario responsable de cierre
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-[var(--neutral-muted)]">
                <UserRound className="h-4 w-4 stroke-[1.75]" />
              </span>
              <input
                type="text"
                required
                disabled={registerState.estado === 'cerrada'}
                value={responsableCierre}
                onChange={(e) => setResponsableCierre(e.target.value)}
                placeholder="Nombre del usuario..."
                list="staff-responsables-list"
                className="h-10 w-full rounded-[var(--radius-input)] border border-[var(--neutral-border)] bg-[var(--neutral-surface)] pl-9 pr-3 text-xs font-medium text-[var(--neutral-emphasis)] focus:border-[var(--sidebar-ring)] focus:outline-hidden disabled:opacity-50 transition-all shadow-2xs"
              />
              <datalist id="staff-responsables-list">
                <option value="Juana Pérez (Administradora)" />
                <option value="Juan Pérez (Vendedor)" />
                <option value="Pablo Pérez" />
              </datalist>
            </div>
          </div>

          {/* Motivos / Observaciones */}
          <div>
            <label className="block text-xs font-medium text-[var(--neutral-emphasis)] mb-1.5">
              Motivos / Observaciones
            </label>
            <textarea
              rows={2}
              disabled={registerState.estado === 'cerrada'}
              value={motivos}
              onChange={(e) => setMotivos(e.target.value)}
              placeholder="Observaciones (opcional)..."
              className="w-full rounded-[var(--radius-input)] border border-[var(--neutral-border)] bg-[var(--neutral-surface)] p-3 text-xs text-[var(--neutral-emphasis)] placeholder:text-[var(--neutral-placeholder)] focus:border-[var(--sidebar-ring)] focus:outline-hidden disabled:opacity-50 transition-all resize-none shadow-2xs"
            />
          </div>

          {/* Closed shift summary */}
          {registerState.estado === 'cerrada' && (
            <div className="p-3 rounded-[var(--radius-input)] border border-[var(--neutral-border-subtle)] bg-[var(--neutral-subtle)]/60 text-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[var(--neutral-muted)]">Cerrada por:</span>
                <span className="font-semibold text-[var(--neutral-emphasis)]">
                  {registerState.responsableCierre || 'Administrador'}
                </span>
              </div>
              {registerState.horaCierre && (
                <div className="flex items-center justify-between text-[11px] text-[var(--neutral-muted)]">
                  <span>Hora de cierre:</span>
                  <span className="font-mono">{registerState.horaCierre} hs</span>
                </div>
              )}
            </div>
          )}

          {/* Action button: Cerrar caja */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full inline-flex h-10 items-center justify-center rounded-[var(--radius-btn)] border border-[var(--neutral-border)] bg-[var(--neutral-surface)] text-xs font-semibold text-[var(--neutral-emphasis)] hover:bg-[var(--neutral-subtle)] active:scale-[0.99] transition-all cursor-pointer shadow-2xs"
            >
              {registerState.estado === 'abierta' ? 'Cerrar caja' : 'Reabrir turno de caja'}
            </button>
          </div>
        </form>
      </div>

      <CashRegisterConfirmDialog
        open={isConfirmOpen}
        onOpenChange={setIsConfirmOpen}
        onConfirm={handleConfirmAction}
        isAbierta={registerState.estado === 'abierta'}
        userInCharge={responsableCierre || defaultUser}
        openingTime={registerState.horaApertura ? `Hoy, ${registerState.horaApertura} hs` : undefined}
      />
    </div>
  )
}
