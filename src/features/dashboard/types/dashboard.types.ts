export interface PendingOrder {
  id: string
  orderCode: string
  startDate: string
  deadlineDate: string
  daysRemaining: number
  imageUrl?: string
  isDone?: boolean
  cliente?: string
  pieza?: string
  trabajo?: string
  orfebre?: string
  contacto?: string
  notas?: string
  metal?: string
  pagoTotal?: number
  señaAdelanto?: number
  estadoPago?: string
  pesoInicialGramos?: number
  pesoFinalGramos?: number
}

export type PaymentMethod = 'Efectivo' | 'Tarjeta' | 'Transferencia'

export interface RecentSaleItem {
  id: string
  customerName: string
  time: string
  paymentMethod: PaymentMethod
}

export interface CashFlowData {
  total: number
  expenses: number
  income: number
}

export interface CashRegisterData {
  countedAmount: string
  expectedAmount: number
  observations: string
}
