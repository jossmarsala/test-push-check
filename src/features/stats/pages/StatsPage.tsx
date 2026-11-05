import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { StatsHeader } from '../components/StatsHeader'
import { StatsOverviewRow } from '../components/StatsOverviewRow'
import { StatsSalesSection } from '../components/StatsSalesSection'
import { StatsExpensesSection } from '../components/StatsExpensesSection'
import { StatsOrdersSection } from '../components/StatsOrdersSection'
import { ExportStatsReportDialog } from '../components/ExportStatsReportDialog'
import {
  INITIAL_BALANCE_STATS,
  INITIAL_SALES_BREAKDOWNS,
  INITIAL_EXPENSE_DISTRIBUTION,
  INITIAL_WORKSHOP_SUMMARY,
} from '../data/mockStatsData'

export const StatsPage: React.FC = () => {
  const navigate = useNavigate()
  const [balanceStats] = useState(INITIAL_BALANCE_STATS)
  const [salesBreakdowns] = useState(INITIAL_SALES_BREAKDOWNS)
  const [expenseDistribution] = useState(INITIAL_EXPENSE_DISTRIBUTION)
  const [workshopSummary] = useState(INITIAL_WORKSHOP_SUMMARY)

  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false)

  return (
    <div className="w-full max-w-[1200px] mx-auto space-y-6 sm:space-y-8 animate-fade-in">
      {/* 1. Header: Título y Acción de Exportar */}
      <StatsHeader
        onExportReportClick={() => setIsExportDialogOpen(true)}
      />

      {/* 2. Resumen Ejecutivo / Balance General: 4 KPIs clave */}
      <StatsOverviewRow stats={balanceStats} />

      {/* 3. Desglose Comercial: Top joyas, Categorías y Medios de Cobro */}
      <StatsSalesSection breakdowns={salesBreakdowns} />

      {/* 4. Operatividad: Estructura de Gastos y Rendimiento de Taller */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        <StatsExpensesSection
          distribution={expenseDistribution}
          totalGastosMes={balanceStats.gastosMes}
          onViewDetail={() => navigate('/gastos')}
        />

        <StatsOrdersSection
          summary={workshopSummary}
          onViewAllOrders={() => navigate('/pedidos')}
        />
      </div>

      {/* 5. Modal de Exportación / Impresión de Informe */}
      <ExportStatsReportDialog
        open={isExportDialogOpen}
        onOpenChange={setIsExportDialogOpen}
        balanceStats={balanceStats}
        workshopStats={workshopSummary}
      />
    </div>
  )
}

export default StatsPage
