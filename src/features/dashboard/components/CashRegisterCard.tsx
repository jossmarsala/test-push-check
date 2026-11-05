import React, { useState } from 'react'
import { Lock, Unlock, Clock, UserCheck } from 'lucide-react'
import { CashRegisterConfirmDialog } from '@/features/cash/components/CashRegisterConfirmDialog'
import { useToast } from '@/context/ToastContext'

interface CashRegisterCardProps {
  userInCharge?: string
  lastOpeningTime?: string
  lastClosingTime?: string
  initialStatus?: 'abierta' | 'cerrada'
  onToggleStatus?: (newStatus: 'abierta' | 'cerrada') => void
}

export const CashRegisterCard: React.FC<CashRegisterCardProps> = ({
  userInCharge = 'Juana Pérez (Administradora)',
  lastOpeningTime = 'Hoy, 08:30 hs',
  lastClosingTime = 'Ayer, 20:15 hs',
  initialStatus = 'abierta',
  onToggleStatus,
}) => {
  const { showToast } = useToast()
  const [status, setStatus] = useState<'abierta' | 'cerrada'>(initialStatus)
  const [openingTime, setOpeningTime] = useState(lastOpeningTime)
  const [closingTime, setClosingTime] = useState(lastClosingTime)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)

  const isAbierta = status === 'abierta'

  const handleConfirmToggle = () => {
    const nextStatus = isAbierta ? 'cerrada' : 'abierta'
    const nowTimeStr = `Hoy, ${new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })} hs`

    if (nextStatus === 'cerrada') {
      setClosingTime(nowTimeStr)
      showToast('Caja cerrada con éxito.')
    } else {
      setOpeningTime(nowTimeStr)
      showToast('Caja abierta con éxito.')
    }

    setStatus(nextStatus)
    setIsConfirmOpen(false)
    if (onToggleStatus) {
      onToggleStatus(nextStatus)
    }
  }

  return (
    <section className="space-y-3">
      {/* Section Title & Status Badge */}
      <div className="flex items-center justify-between select-none">
        <h2 className="text-base sm:text-lg font-semibold tracking-tight text-[var(--neutral-emphasis)] leading-snug">
          Control de caja
        </h2>
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold border ${
            isAbierta
              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
              : 'bg-[var(--neutral-subtle)] text-[var(--neutral-muted)] border-[var(--neutral-border)]'
          }`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              isAbierta ? 'bg-emerald-500' : 'bg-[var(--neutral-muted)]'
            }`}
          />
          <span>{isAbierta ? 'Caja abierta' : 'Caja cerrada'}</span>
        </span>
      </div>

      {/* Card Container with Static Info & Action Button */}
      <div className="rounded-[var(--radius-card)] border border-[var(--neutral-border-subtle)] bg-[var(--neutral-card)] p-5 shadow-2xs transition-all space-y-4">
        {/* Static Info Box */}
        <div className="space-y-3 text-xs">
          {/* User in Charge */}
          <div className="flex items-center gap-2.5 p-3 rounded-lg bg-[var(--neutral-subtle)]/60 border border-[var(--neutral-border-subtle)]">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[var(--neutral-subtle)] text-[var(--neutral-emphasis)]">
              <UserCheck className="h-4 w-4 stroke-[1.5]" />
            </div>
            <div className="min-w-0">
              <span className="text-[11px] text-[var(--neutral-muted)] block leading-none mb-1">
                Responsable a cargo
              </span>
              <span className="font-semibold text-[var(--neutral-emphasis)] text-xs truncate block">
                {userInCharge}
              </span>
            </div>
          </div>

          {/* Last Opening / Closing Times */}
          <div className="grid grid-cols-2 gap-3 p-3 rounded-lg bg-[var(--neutral-subtle)]/40 border border-[var(--neutral-border-subtle)]">
            <div className="space-y-0.5">
              <div className="flex items-center gap-1 text-[11px] text-[var(--neutral-muted)]">
                <Clock className="h-3 w-3 stroke-[1.5]" />
                <span>Última apertura</span>
              </div>
              <span className="font-mono font-medium text-[var(--neutral-emphasis)] text-xs block">
                {openingTime}
              </span>
            </div>

            <div className="space-y-0.5">
              <div className="flex items-center gap-1 text-[11px] text-[var(--neutral-muted)]">
                <Clock className="h-3 w-3 stroke-[1.5]" />
                <span>Último cierre</span>
              </div>
              <span className="font-mono font-medium text-[var(--neutral-emphasis)] text-xs block">
                {closingTime}
              </span>
            </div>
          </div>
        </div>

        {/* Abrir / Cerrar Caja Action Button */}
        <div className="pt-1">
          <button
            type="button"
            onClick={() => setIsConfirmOpen(true)}
            className={`flex h-9 w-full items-center justify-center gap-2 rounded-[var(--radius-btn)] border text-xs font-medium transition-all cursor-pointer select-none active:scale-[0.98] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--sidebar-ring)] ${
              isAbierta
                ? 'border-[var(--neutral-border-subtle)] bg-[var(--neutral-card)] text-[var(--neutral-body)] hover:text-[var(--neutral-emphasis)] hover:bg-[var(--neutral-subtle)]'
                : 'bg-[var(--neutral-brand)] text-white hover:bg-[var(--neutral-brand-hover)] border-transparent'
            }`}
          >
            {isAbierta ? (
              <>
                <Lock className="h-3.5 w-3.5 stroke-[1.5]" />
                <span>Cerrar caja</span>
              </>
            ) : (
              <>
                <Unlock className="h-3.5 w-3.5 stroke-[1.5]" />
                <span>Abrir caja</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Confirmation Modal: Minimal but with complete context */}
      <CashRegisterConfirmDialog
        open={isConfirmOpen}
        onOpenChange={setIsConfirmOpen}
        onConfirm={handleConfirmToggle}
        isAbierta={isAbierta}
        userInCharge={userInCharge}
        openingTime={openingTime}
      />
    </section>
  )
}
