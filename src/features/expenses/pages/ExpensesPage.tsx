import React, { useState, useMemo, useEffect } from 'react'
import { useSearchParams, useLocation } from 'react-router-dom'
import { useToast } from '@/context/ToastContext'
import { ExpensesHeader } from '../components/ExpensesHeader'
import { ExpensesKpiRow } from '../components/ExpensesKpiRow'
import { NewExpenseDialog } from '../components/NewExpenseDialog'
import { ExpensesFilters } from '../components/ExpensesFilters'
import { ExpensesTable } from '../components/ExpensesTable'
import { ExpenseDetailDialog } from '../components/ExpenseDetailDialog'
import { DeleteExpenseDialog } from '../components/DeleteExpenseDialog'
import { INITIAL_EXPENSES, INITIAL_EXPENSES_KPIS } from '../data/mockExpenses'
import type {
  ExpenseItem,
  ExpenseCategoryFilter,
  NewExpenseFormData,
  ExpensesKpiData,
} from '../types/expenses.types'

export const ExpensesPage: React.FC = () => {
  const [expenses, setExpenses] = useState<ExpenseItem[]>(INITIAL_EXPENSES)
  const [kpis, setKpis] = useState<ExpensesKpiData>(INITIAL_EXPENSES_KPIS)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<ExpenseCategoryFilter>('Todos')
  const [activePaymentFilter, setActivePaymentFilter] = useState('all')

  const [searchParams, setSearchParams] = useSearchParams()
  const location = useLocation()
  const { showToast } = useToast()
  // Modals state
  const [isNewExpenseOpen, setIsNewExpenseOpen] = useState(false)
  const [selectedExpenseForDetail, setSelectedExpenseForDetail] = useState<ExpenseItem | null>(null)
  const [expenseToDelete, setExpenseToDelete] = useState<ExpenseItem | null>(null)

  useEffect(() => {
    if (searchParams.get('action') === 'new' || searchParams.get('nuevo') === 'true' || location.state?.openNewExpense) {
      setIsNewExpenseOpen(true)
      if (searchParams.has('action') || searchParams.has('nuevo')) {
        const newParams = new URLSearchParams(searchParams)
        newParams.delete('action')
        newParams.delete('nuevo')
        setSearchParams(newParams, { replace: true })
      }
    }
  }, [searchParams, location.state, setSearchParams])

  // Calculate counts per category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {
      Todos: expenses.length,
      Servicios: 0,
      'Insumos y taller': 0,
      'Metales y piedras': 0,
      'Alquiler y expensas': 0,
      'Sueldos y honorarios': 0,
      Mantenimiento: 0,
      Otros: 0,
    }

    expenses.forEach((e) => {
      if (counts[e.categoria] !== undefined) {
        counts[e.categoria] += 1
      }
    })

    return counts
  }, [expenses])

  // Filtered expenses
  const filteredExpenses = useMemo(() => {
    return expenses.filter((item) => {
      // Category filter
      if (activeCategory !== 'Todos' && item.categoria !== activeCategory) {
        return false
      }

      // Payment method filter
      if (activePaymentFilter !== 'all' && item.medioPago !== activePaymentFilter) {
        return false
      }

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim()
        const matchesDesc = item.descripcion.toLowerCase().includes(query)
        const matchesProv = item.proveedor ? item.proveedor.toLowerCase().includes(query) : false
        const matchesComp = item.comprobanteNumero ? item.comprobanteNumero.toLowerCase().includes(query) : false
        const matchesFecha = item.fecha.toLowerCase().includes(query)

        return matchesDesc || matchesProv || matchesComp || matchesFecha
      }

      return true
    })
  }, [expenses, activeCategory, activePaymentFilter, searchQuery])

  // Register new expense
  const handleCreateExpense = (formData: NewExpenseFormData) => {
    const newExpense: ExpenseItem = {
      id: `e-${Date.now()}`,
      fecha: formData.fecha || 'Hoy',
      fechaCompleta: formData.fechaCompleta || new Date().toLocaleDateString('es-AR'),
      hora: formData.hora || new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }),
      descripcion: formData.descripcion,
      monto: formData.monto,
      categoria: formData.categoria,
      medioPago: formData.medioPago,
      proveedor: formData.proveedor,
      comprobanteNumero: formData.comprobanteNumero || `REC-${Math.floor(1000 + Math.random() * 9000)}`,
      comprobanteUrl: formData.comprobanteUrl,
      esRecurrente: formData.esRecurrente,
      registradoPor: 'Juana Perez',
      notas: formData.notas,
    }

    setExpenses((prev) => [newExpense, ...prev])

    // Update KPIs
    setKpis((prev) => ({
      ...prev,
      totalMes: prev.totalMes + formData.monto,
      totalHoy: prev.totalHoy + formData.monto,
      cantidadHoy: prev.cantidadHoy + 1,
    }))

    showToast(`Gasto de $${formData.monto.toLocaleString('es-AR')} registrado con éxito.`)
  }

  // Delete/void expense
  const handleDeleteExpense = (expenseId: string) => {
    const itemToRemove = expenses.find((e) => e.id === expenseId)
    setExpenses((prev) => prev.filter((e) => e.id !== expenseId))

    if (itemToRemove) {
      setKpis((prev) => ({
        ...prev,
        totalMes: Math.max(0, prev.totalMes - itemToRemove.monto),
      }))
    }

    showToast('Registro de gasto eliminado.')
  }

  return (
    <div className="w-full max-w-[1200px] mx-auto space-y-6 animate-fade-in">
      {/* Header: Title, Añadir gasto Button & Notification Bell */}
      <ExpensesHeader
        onAddExpenseClick={() => setIsNewExpenseOpen(true)}
        onNotificationsClick={() => showToast('Tienes 2 comprobantes por conciliar.')}
      />

      {/* KPI Overview Cards */}
      <ExpensesKpiRow kpis={kpis} />

      {/* Filters: Search & Category Pills & Payment Method */}
      <ExpensesFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        categoryCounts={categoryCounts}
        activePaymentFilter={activePaymentFilter}
        onPaymentFilterChange={setActivePaymentFilter}
      />

      {/* Expenses History Table */}
      <ExpensesTable
        expenses={filteredExpenses}
        onViewExpense={(item) => setSelectedExpenseForDetail(item)}
        onDeleteExpense={(item) => setExpenseToDelete(item)}
        onResetFilters={() => {
          setSearchQuery('')
          setActiveCategory('Todos')
          setActivePaymentFilter('all')
        }}
      />

      {/* New Expense Modal Popup */}
      <NewExpenseDialog
        open={isNewExpenseOpen}
        onOpenChange={setIsNewExpenseOpen}
        onSubmit={handleCreateExpense}
      />

      {/* Interactive Modals */}
      <ExpenseDetailDialog
        open={!!selectedExpenseForDetail}
        onOpenChange={(open) => !open && setSelectedExpenseForDetail(null)}
        expense={selectedExpenseForDetail}
      />

      <DeleteExpenseDialog
        open={!!expenseToDelete}
        onOpenChange={(open) => !open && setExpenseToDelete(null)}
        expense={expenseToDelete}
        onConfirmDelete={handleDeleteExpense}
      />
    </div>
  )
}

export default ExpensesPage
