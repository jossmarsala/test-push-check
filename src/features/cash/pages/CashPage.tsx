import React, { useState } from 'react'
import { useToast } from '@/context/ToastContext'
import { useAuth } from '@/hooks/useAuth'
import { CashHeader } from '../components/CashHeader'
import { CashPeriodTabs } from '../components/CashPeriodTabs'
import { CashKpiRow } from '../components/CashKpiRow'
import { CashBreakdownRow } from '../components/CashBreakdownRow'
import { CashMovementsTable } from '../components/CashMovementsTable'
import { CashRegisterCard } from '../components/CashRegisterCard'
import { CashMovementDetailModal } from '../components/CashMovementDetailModal'
import { CashManualMovementModal } from '../components/CashManualMovementModal'
import { ZReportModal } from '../components/ZReportModal'
import {
  INITIAL_CASH_KPIS,
  INITIAL_CASH_REGISTER,
  INITIAL_MOVEMENTS,
} from '../data/mockCashData'
import type {
  CashKpiOverview,
  CashMovement,
  CashPeriod,
  CashRegisterState,
  CashMovementType,
  CashPaymentMethod,
} from '../types/cash.types'

export const CashPage: React.FC = () => {
  const [activePeriod, setActivePeriod] = useState<CashPeriod>('hoy')
  const [kpis, setKpis] = useState<CashKpiOverview>(INITIAL_CASH_KPIS)
  const [registerState, setRegisterState] = useState<CashRegisterState>(INITIAL_CASH_REGISTER)
  const [movements, setMovements] = useState<CashMovement[]>(INITIAL_MOVEMENTS)

  const { showToast } = useToast()
  const { profile } = useAuth()

  // Dialogs
  const [selectedMovement, setSelectedMovement] = useState<CashMovement | null>(null)
  const [isManualMovementOpen, setIsManualMovementOpen] = useState(false)
  const [isZReportOpen, setIsZReportOpen] = useState(false)

  const handleCloseRegister = (
    countedMoney: number,
    observations: string,
    responsableCierre?: string
  ) => {
    const diff = countedMoney - registerState.dineroEsperado
    const defaultUser = profile
      ? [profile.first_name, profile.last_name].filter(Boolean).join(' ') || profile.email
      : 'Juana Pérez (Administradora)'
    const closingUser = responsableCierre?.trim() || defaultUser

    setRegisterState((prev) => ({
      ...prev,
      estado: 'cerrada',
      horaCierre: new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }),
      responsableCierre: closingUser,
      dineroContado: countedMoney,
      diferencia: diff,
      observaciones: observations,
    }))
    showToast(
      diff === 0
        ? `Caja cerrada con éxito por ${closingUser}. Cuadre exacto sin diferencias.`
        : `Caja cerrada por ${closingUser}. Se registró una diferencia de ${diff > 0 ? '+' : ''}$${diff.toLocaleString('es-AR')}.`
    )
    setIsZReportOpen(true)
  }

  const handleReopenRegister = () => {
    setRegisterState((prev) => ({
      ...prev,
      estado: 'abierta',
      horaApertura: new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }),
      horaCierre: undefined,
      responsableCierre: undefined,
    }))
    showToast('Turno de caja reabierto con éxito.')
  }

  const handleRegisterManualMovement = (data: {
    tipo: CashMovementType
    concepto: string
    total: number
    pago: CashPaymentMethod
    responsable: string
  }) => {
    const newMovement: CashMovement = {
      id: `m-${Date.now()}`,
      orden: movements.length + 1,
      hora: new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }),
      fecha: new Date().toLocaleDateString('es-AR'),
      concepto: data.concepto,
      total: data.total,
      tipo: data.tipo,
      categoria: 'Ajuste',
      pago: data.pago,
      responsable: data.responsable,
    }

    setMovements((prev) => [newMovement, ...prev])

    // Update expected cash if in cash
    if (data.pago === 'Efectivo') {
      const delta = data.tipo === 'ingreso' ? data.total : -data.total
      setRegisterState((prev) => ({
        ...prev,
        dineroEsperado: Math.max(0, prev.dineroEsperado + delta),
      }))
      setKpis((prev) => ({
        ...prev,
        ingresosTotales: data.tipo === 'ingreso' ? prev.ingresosTotales + data.total : prev.ingresosTotales,
        egresosTotales: data.tipo === 'egreso' ? prev.egresosTotales + data.total : prev.egresosTotales,
        efectivoEsperado: Math.max(0, prev.efectivoEsperado + delta),
        ingresosEfectivo: data.tipo === 'ingreso' ? prev.ingresosEfectivo + data.total : prev.ingresosEfectivo,
        egresosEfectivo: data.tipo === 'egreso' ? prev.egresosEfectivo + data.total : prev.egresosEfectivo,
      }))
    }

    showToast(
      data.tipo === 'ingreso'
        ? `Ingreso manual de $${data.total.toLocaleString('es-AR')} asentado en caja.`
        : `Retiro manual de $${data.total.toLocaleString('es-AR')} asentado en caja.`
    )
  }

  return (
    <div className="w-full max-w-[1200px] mx-auto space-y-6 animate-fade-in">
      {/* Header: Title, Action Buttons & Notification Bell */}
      <CashHeader
        onManualMovementClick={() => setIsManualMovementOpen(true)}
        onZReportClick={() => setIsZReportOpen(true)}
      />

      {/* Period Selector Tabs: Hoy, Ayer, Antes de ayer */}
      <CashPeriodTabs
        activePeriod={activePeriod}
        onPeriodChange={setActivePeriod}
      />

      {/* Top Row: 3 KPI Cards (Ingresos totales, Egresos totales, Efectivo esperado) */}
      <CashKpiRow kpis={kpis} />

      {/* Middle Row: 3 Breakdown Cards (Estado de caja, Efectivo, Otros medios) */}
      <CashBreakdownRow kpis={kpis} registerState={registerState} />

      {/* Bottom Row: 2 Columns (Movimientos Table & Gestionar caja Card) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Movimientos Table (lg:col-span-7) */}
        <div className="lg:col-span-7">
          <CashMovementsTable
            movements={movements}
            onViewMovement={(m) => setSelectedMovement(m)}
          />
        </div>

        {/* Right Column: Gestionar caja Card (lg:col-span-5) */}
        <div className="lg:col-span-5">
          <CashRegisterCard
            registerState={registerState}
            onCloseRegister={handleCloseRegister}
            onReopenRegister={handleReopenRegister}
          />
        </div>
      </div>

      {/* Modals */}
      <CashMovementDetailModal
        open={!!selectedMovement}
        onOpenChange={(open) => !open && setSelectedMovement(null)}
        movement={selectedMovement}
      />

      {/* Cash In / Cash Out Manual Movement Modal */}
      <CashManualMovementModal
        open={isManualMovementOpen}
        onOpenChange={setIsManualMovementOpen}
        onRegisterMovement={handleRegisterManualMovement}
      />

      {/* Reporte de Cierre Modal */}
      <ZReportModal
        open={isZReportOpen}
        onOpenChange={setIsZReportOpen}
        registerState={registerState}
        kpis={kpis}
      />
    </div>
  )
}

export const CashExpensesPage = CashPage
export default CashPage
