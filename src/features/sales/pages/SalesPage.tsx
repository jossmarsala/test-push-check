import React, { useState, useMemo, useEffect } from 'react'
import { useSearchParams, useLocation } from 'react-router-dom'
import { useToast } from '@/context/ToastContext'
import { SalesHeader } from '../components/SalesHeader'
import { SalesKpiRow } from '../components/SalesKpiRow'
import { SalesFilters } from '../components/SalesFilters'
import { SalesTable } from '../components/SalesTable'
import { NewSaleDialog } from '../components/NewSaleDialog'
import { SaleDetailDialog } from '../components/SaleDetailDialog'
import { DeleteSaleDialog } from '../components/DeleteSaleDialog'
import { ProductExchangeDialog } from '../components/ProductExchangeDialog'
import { INITIAL_SALES, INITIAL_SALES_KPIS } from '../data/mockSales'
import type {
  SaleRecord,
  NewSaleFormData,
  SalesKpiData,
  RegistrarCambioFormData,
  SaleExchangeRecord,
} from '../types/sales.types'

export const SalesPage: React.FC = () => {
  const [sales, setSales] = useState<SaleRecord[]>(INITIAL_SALES)
  const [kpis, setKpis] = useState<SalesKpiData>(INITIAL_SALES_KPIS)
  const [searchQuery, setSearchQuery] = useState('')
  const [activePaymentFilter, setActivePaymentFilter] = useState('all')

  // Modals state
  const { showToast } = useToast()
  const [isNewSaleOpen, setIsNewSaleOpen] = useState(false)
  const [selectedSaleForDetail, setSelectedSaleForDetail] = useState<SaleRecord | null>(null)
  const [saleToDelete, setSaleToDelete] = useState<SaleRecord | null>(null)
  const [saleForExchange, setSaleForExchange] = useState<SaleRecord | null>(null)

  const [searchParams, setSearchParams] = useSearchParams()
  const location = useLocation()

  useEffect(() => {
    if (searchParams.get('action') === 'new' || searchParams.get('nuevo') === 'true' || location.state?.openNewSale) {
      setIsNewSaleOpen(true)
      if (searchParams.has('action') || searchParams.has('nuevo')) {
        const newParams = new URLSearchParams(searchParams)
        newParams.delete('action')
        newParams.delete('nuevo')
        setSearchParams(newParams, { replace: true })
      }
    }
  }, [searchParams, location.state, setSearchParams])

  // Filter sales based on search and payment method
  const filteredSales = useMemo(() => {
    return sales.filter((item) => {
      // Payment method filter
      if (activePaymentFilter !== 'all' && item.pago !== activePaymentFilter) {
        return false
      }

      // Search query (cliente, fecha, producto, ticketNumber)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim()
        const matchesClient = item.cliente.toLowerCase().includes(query)
        const matchesDate = item.fecha.toLowerCase().includes(query)
        const matchesFullDate = item.fechaCompleta.toLowerCase().includes(query)
        const matchesProduct = item.productosTexto.toLowerCase().includes(query)
        const matchesTicket = item.ticketNumber.toLowerCase().includes(query)

        return matchesClient || matchesDate || matchesFullDate || matchesProduct || matchesTicket
      }

      return true
    })
  }, [sales, activePaymentFilter, searchQuery])

  // Register a new sale
  const handleCreateSale = (formData: NewSaleFormData) => {
    const rawTotal = formData.items.reduce(
      (sum, item) => sum + item.unitPrice * item.quantity,
      0
    )
    const discountAmount = formData.discountPercent
      ? Math.round((rawTotal * formData.discountPercent) / 100)
      : 0
    const totalAmount = Math.max(0, rawTotal - discountAmount)
    const nextTicketNumber = `TK-${(816 + sales.length + 1).toString().padStart(5, '0')}`

    const newSale: SaleRecord = {
      id: `s-${Date.now()}`,
      ticketNumber: nextTicketNumber,
      fecha: new Date().toLocaleDateString('es-AR', { day: 'numeric', month: 'short' }),
      fechaCompleta: new Date().toLocaleDateString('es-AR'),
      hora: new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }),
      productosTexto: formData.items.map((i) => i.name).join(', '),
      items: formData.items,
      total: totalAmount,
      cliente: formData.cliente,
      clienteContacto: formData.clienteContacto,
      estado: 'completado',
      pago: formData.pago,
      splitPayments: formData.splitPayments,
      discountAmount: discountAmount > 0 ? discountAmount : undefined,
      discountCode: formData.discountCode,
      ringSize: formData.ringSize,
      vendedor: 'Juana Pérez',
      notas: formData.notas,
    }

    setSales((prev) => [newSale, ...prev])

    // Update KPIs dynamically
    setKpis((prev) => ({
      ...prev,
      ventasEsteMes: prev.ventasEsteMes + 1,
      ingresosTotales: prev.ingresosTotales + totalAmount,
    }))

    showToast(`Venta ${nextTicketNumber} registrada con éxito por $${totalAmount.toLocaleString('es-AR')}.`)
  }

  // Confirm product exchange (Enforcing max 1 exchange policy)
  const handleConfirmExchange = (data: RegistrarCambioFormData) => {
    const todayShort = new Date().toLocaleDateString('es-AR', { day: 'numeric', month: 'short' })
    const todayFull = new Date().toLocaleDateString('es-AR')
    const nowTime = new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })

    const exchangeRecord: SaleExchangeRecord = {
      id: `ex-${Date.now()}`,
      fecha: todayShort,
      fechaCompleta: todayFull,
      hora: nowTime,
      productoDevuelto: data.productoDevuelto,
      valorDevuelto: data.valorDevuelto,
      productoNuevo: data.productoNuevo,
      valorNuevo: data.valorNuevo,
      diferenciaMonto: data.diferenciaMonto,
      diferenciaMetodoPago: data.diferenciaMetodoPago,
      saldoAFavorEmitido: data.saldoAFavorEmitido,
      motivo: data.motivo,
      vendedor: 'Juana Pérez',
      notas: data.notas,
    }

    setSales((prev) =>
      prev.map((s) => {
        if (s.id !== data.saleId) return s

        const updatedTexto = `${s.productosTexto} (Cambiado: ${data.productoDevuelto} por ${data.productoNuevo})`
        const currentHistory = s.cambioHistorico || []

        return {
          ...s,
          cambiosRealizados: (s.cambiosRealizados || 0) + 1,
          cambioHistorico: [exchangeRecord, ...currentHistory],
          productosTexto: updatedTexto,
          total: data.diferenciaMonto > 0 ? s.total + data.diferenciaMonto : s.total,
        }
      })
    )

    if (data.diferenciaMonto > 0) {
      setKpis((prev) => ({
        ...prev,
        ingresosTotales: prev.ingresosTotales + data.diferenciaMonto,
      }))
    }

    const extraDiffMsg =
      data.diferenciaMonto > 0
        ? ` Diferencia: +$${data.diferenciaMonto.toLocaleString('es-AR')}.`
        : data.saldoAFavorEmitido
        ? ` Saldo a favor: $${data.saldoAFavorEmitido.toLocaleString('es-AR')}.`
        : ''

    showToast(`Cambio de producto registrado para el ticket #${data.saleId}.${extraDiffMsg}`)
  }

  // Void/Delete a sale
  const handleDeleteSale = (saleId: string) => {
    const saleToRemove = sales.find((s) => s.id === saleId)
    setSales((prev) => prev.filter((s) => s.id !== saleId))

    if (saleToRemove) {
      setKpis((prev) => ({
        ...prev,
        ventasEsteMes: Math.max(0, prev.ventasEsteMes - 1),
        ingresosTotales: Math.max(0, prev.ingresosTotales - saleToRemove.total),
      }))
    }

    showToast('Venta anulada correctamente.')
  }

  return (
    <div className="w-full max-w-[1200px] mx-auto space-y-6 animate-fade-in">
      {/* Header: Title, "Registrar venta" & Notification Bell */}
      <SalesHeader
        onNewSaleClick={() => setIsNewSaleOpen(true)}
        onNotificationsClick={() => showToast('Tienes 1 aviso de facturación pendiente.')}
      />

      {/* KPI Cards Row */}
      <SalesKpiRow
        kpis={kpis}
      />

      {/* Filters: Search & Payment Method */}
      <SalesFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activePaymentFilter={activePaymentFilter}
        onPaymentFilterChange={setActivePaymentFilter}
      />

      {/* Sales History Table */}
      <SalesTable
        sales={filteredSales}
        onViewSale={(sale) => setSelectedSaleForDetail(sale)}
        onDeleteSale={(sale) => setSaleToDelete(sale)}
        onExchangeSale={(sale) => setSaleForExchange(sale)}
        onResetFilters={() => {
          setSearchQuery('')
          setActivePaymentFilter('all')
        }}
      />

      {/* Interactive Modals */}
      <NewSaleDialog
        open={isNewSaleOpen}
        onOpenChange={setIsNewSaleOpen}
        onSubmit={handleCreateSale}
      />

      <SaleDetailDialog
        open={!!selectedSaleForDetail}
        onOpenChange={(open) => !open && setSelectedSaleForDetail(null)}
        sale={selectedSaleForDetail}
        onExchangeSale={(sale) => setSaleForExchange(sale)}
      />

      <ProductExchangeDialog
        open={!!saleForExchange}
        onOpenChange={(open) => !open && setSaleForExchange(null)}
        sale={saleForExchange}
        onSubmitExchange={handleConfirmExchange}
      />

      <DeleteSaleDialog
        open={!!saleToDelete}
        onOpenChange={(open) => !open && setSaleToDelete(null)}
        sale={saleToDelete}
        onConfirmDelete={handleDeleteSale}
      />
    </div>
  )
}

export default SalesPage
