export type PaymentMethod = 'Efectivo' | 'Transferencia' | 'Mercado Pago' | 'Tarjeta' | 'Dividido'

export type SaleStatus = 'completado' | 'pendiente' | 'anulado'

export type SaleCategory = 'Todos' | 'Anillos' | 'Aros' | 'Cadenas' | 'Pulseras'

export interface PaymentSplit {
  method: Exclude<PaymentMethod, 'Dividido'>
  amount: number
}

export interface CustomerProfile {
  id: string
  name: string
  contact?: string
  ringSize?: string
  preferredStyle?: string
  notes?: string
  totalPurchases?: number
}

export interface SaleItem {
  id: string
  name: string
  category: 'Anillos' | 'Aros' | 'Cadenas' | 'Pulseras'
  quantity: number
  unitPrice: number
}

export interface SaleExchangeRecord {
  id: string
  fecha: string
  fechaCompleta: string
  hora: string
  itemDevueltoId?: string
  productoDevuelto: string
  valorDevuelto: number
  productoNuevo: string
  valorNuevo: number
  diferenciaMonto: number // valorNuevo - valorDevuelto
  diferenciaMetodoPago?: PaymentMethod
  saldoAFavorEmitido?: number
  motivo: string
  vendedor: string
  notas?: string
}

export interface RegistrarCambioFormData {
  saleId: string
  productoDevuelto: string
  valorDevuelto: number
  productoNuevo: string
  valorNuevo: number
  diferenciaMonto: number
  diferenciaMetodoPago?: PaymentMethod
  saldoAFavorEmitido?: number
  motivo: string
  notas?: string
}

export interface SaleRecord {
  id: string
  ticketNumber: string
  fecha: string
  fechaCompleta: string
  hora: string
  productosTexto: string
  items: SaleItem[]
  total: number
  cliente: string
  clienteContacto?: string
  estado: SaleStatus
  pago: PaymentMethod
  splitPayments?: PaymentSplit[]
  discountAmount?: number
  discountCode?: string
  vendedor: string
  notas?: string
  ringSize?: string
  // Control de política de cambios (máximo 1 cambio por ticket)
  cambiosRealizados?: number
  cambioHistorico?: SaleExchangeRecord[]
}

export interface NewSaleFormData {
  cliente: string
  clienteContacto?: string
  items: SaleItem[]
  pago: PaymentMethod
  splitPayments?: PaymentSplit[]
  discountPercent?: number
  discountCode?: string
  notas?: string
  ringSize?: string
}

export interface SalesKpiData {
  ventasEsteMes: number
  ventasMesPasado: number
  ventasVariacionPct: number
  ingresosTotales: number
  ingresosMesPasado: number
  ingresosVariacionPct: number
}


