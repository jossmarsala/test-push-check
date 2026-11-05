import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from 'react'
import { INITIAL_SALES, INITIAL_SALES_KPIS } from '@/features/sales/data/mockSales'
import type {
  SaleRecord,
  SalesKpiData,
  NewSaleFormData,
  RegistrarCambioFormData,
  SaleExchangeRecord,
} from '@/features/sales/types/sales.types'

const SALES_STORAGE_KEY = 'aguamarina_sales_v1'
const KPIS_STORAGE_KEY = 'aguamarina_sales_kpis_v1'

interface SalesContextValue {
  sales: SaleRecord[]
  kpis: SalesKpiData
  createSale: (formData: NewSaleFormData) => SaleRecord
  confirmExchange: (data: RegistrarCambioFormData) => void
  deleteSale: (saleId: string) => void
  resetSales: () => void
}

const SalesContext = createContext<SalesContextValue | undefined>(undefined)

export const SalesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sales, setSales] = useState<SaleRecord[]>(() => {
    try {
      const saved = localStorage.getItem(SALES_STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed
        }
      }
    } catch (err) {
      console.warn('Failed to load sales from localStorage:', err)
    }
    return INITIAL_SALES
  })

  const [kpis, setKpis] = useState<SalesKpiData>(() => {
    try {
      const saved = localStorage.getItem(KPIS_STORAGE_KEY)
      if (saved) {
        return JSON.parse(saved)
      }
    } catch (err) {
      console.warn('Failed to load sales KPIs from localStorage:', err)
    }
    return INITIAL_SALES_KPIS
  })

  useEffect(() => {
    try {
      localStorage.setItem(SALES_STORAGE_KEY, JSON.stringify(sales))
    } catch (err) {
      console.warn('Failed to save sales to localStorage:', err)
    }
  }, [sales])

  useEffect(() => {
    try {
      localStorage.setItem(KPIS_STORAGE_KEY, JSON.stringify(kpis))
    } catch (err) {
      console.warn('Failed to save sales KPIs to localStorage:', err)
    }
  }, [kpis])

  const createSale = useCallback((formData: NewSaleFormData): SaleRecord => {
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
      fecha: 'Hoy',
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

    setKpis((prev) => ({
      ...prev,
      ventasEsteMes: prev.ventasEsteMes + 1,
      ingresosTotales: prev.ingresosTotales + totalAmount,
    }))

    return newSale
  }, [sales.length])

  const confirmExchange = useCallback((data: RegistrarCambioFormData) => {
    const todayFull = new Date().toLocaleDateString('es-AR')
    const nowTime = new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })

    const exchangeRecord: SaleExchangeRecord = {
      id: `ex-${Date.now()}`,
      fecha: 'Hoy',
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
  }, [])

  const deleteSale = useCallback((saleId: string) => {
    setSales((prev) => {
      const saleToRemove = prev.find((s) => s.id === saleId)
      if (saleToRemove) {
        setKpis((kpiPrev) => ({
          ...kpiPrev,
          ventasEsteMes: Math.max(0, kpiPrev.ventasEsteMes - 1),
          ingresosTotales: Math.max(0, kpiPrev.ingresosTotales - saleToRemove.total),
        }))
      }
      return prev.filter((s) => s.id !== saleId)
    })
  }, [])

  const resetSales = useCallback(() => {
    localStorage.removeItem(SALES_STORAGE_KEY)
    localStorage.removeItem(KPIS_STORAGE_KEY)
    setSales(INITIAL_SALES)
    setKpis(INITIAL_SALES_KPIS)
  }, [])

  return (
    <SalesContext.Provider
      value={{
        sales,
        kpis,
        createSale,
        confirmExchange,
        deleteSale,
        resetSales,
      }}
    >
      {children}
    </SalesContext.Provider>
  )
}

export const useSales = (): SalesContextValue => {
  const context = useContext(SalesContext)
  if (!context) {
    throw new Error('useSales must be used within a SalesProvider')
  }
  return context
}
