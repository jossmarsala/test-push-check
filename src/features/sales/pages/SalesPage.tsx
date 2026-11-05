import React, { useState, useMemo, useEffect } from 'react'
import { useSearchParams, useLocation } from 'react-router-dom'
import { useToast } from '@/context/ToastContext'
import { useSales } from '@/context/SalesContext'
import { SalesHeader } from '../components/SalesHeader'
import { SalesKpiRow } from '../components/SalesKpiRow'
import { SalesFilters } from '../components/SalesFilters'
import { SalesTable } from '../components/SalesTable'
import { NewSaleDialog } from '../components/NewSaleDialog'
import { SaleDetailDialog } from '../components/SaleDetailDialog'
import { DeleteSaleDialog } from '../components/DeleteSaleDialog'
import { ProductExchangeDialog } from '../components/ProductExchangeDialog'
import type {
  SaleRecord,
  NewSaleFormData,
  RegistrarCambioFormData,
} from '../types/sales.types'

export const SalesPage: React.FC = () => {
  const { sales, kpis, createSale, confirmExchange, deleteSale } = useSales()
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
    const newSale = createSale(formData)
    showToast(`Venta ${newSale.ticketNumber} registrada con éxito por $${newSale.total.toLocaleString('es-AR')}.`)
  }

  // Confirm product exchange (Enforcing max 1 exchange policy)
  const handleConfirmExchange = (data: RegistrarCambioFormData) => {
    confirmExchange(data)

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
    deleteSale(saleId)
    showToast('Venta anulada correctamente.')
  }

  return (
    <div className="w-full max-w-[1200px] mx-auto space-y-6 animate-fade-in">
      {/* Header: Title, "Registrar venta" & Notification Bell */}
      <SalesHeader
        onNewSaleClick={() => setIsNewSaleOpen(true)}
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
