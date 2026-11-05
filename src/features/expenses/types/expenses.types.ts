export type ExpenseCategory =
  | 'Servicios'
  | 'Insumos y taller'
  | 'Metales y piedras'
  | 'Alquiler y expensas'
  | 'Sueldos y honorarios'
  | 'Mantenimiento'
  | 'Otros'

export const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  'Servicios',
  'Insumos y taller',
  'Metales y piedras',
  'Alquiler y expensas',
  'Sueldos y honorarios',
  'Mantenimiento',
  'Otros',
]

export type ExpenseCategoryFilter = 'Todos' | ExpenseCategory

export type ExpensePaymentMethod =
  | 'Efectivo'
  | 'Transferencia'
  | 'Mercado Pago'
  | 'Tarjeta'
  | 'Caja chica'

export const EXPENSE_PAYMENT_METHODS: ExpensePaymentMethod[] = [
  'Efectivo',
  'Transferencia',
  'Mercado Pago',
  'Tarjeta',
  'Caja chica',
]

export interface ExpenseTemplate {
  id: string
  name: string
  desc: string
  amount: number
  cat: ExpenseCategory
  payment: ExpensePaymentMethod
  supplier?: string
}

export interface ExpenseItem {
  id: string
  fecha: string
  fechaCompleta: string
  hora: string
  descripcion: string
  monto: number
  categoria: ExpenseCategory
  medioPago: ExpensePaymentMethod
  proveedor?: string
  comprobanteNumero?: string
  comprobanteUrl?: string
  esRecurrente?: boolean
  registradoPor: string
  notas?: string
}

export interface NewExpenseFormData {
  descripcion: string
  monto: number
  categoria: ExpenseCategory
  medioPago: ExpensePaymentMethod
  fecha?: string
  fechaCompleta?: string
  hora?: string
  proveedor?: string
  comprobanteNumero?: string
  comprobanteUrl?: string
  esRecurrente?: boolean
  notas?: string
}

export interface ExpensesKpiData {
  totalMes: number
  totalMesPasado: number
  variacionMesPct: number
  totalHoy: number
  cantidadHoy: number
  categoriaPrincipal: string
}
