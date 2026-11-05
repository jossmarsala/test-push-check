export type CashPeriod = 'antes_ayer' | 'ayer' | 'hoy'

export type CashMovementType = 'ingreso' | 'egreso'

export type CashMovementCategory = 'Venta' | 'Gasto' | 'Pedido' | 'Ajuste'

export type CashPaymentMethod = 'Efectivo' | 'Transferencia' | 'Tarjeta' | 'Mercado Pago'

export interface CashMovement {
  id: string
  orden: number
  hora: string
  fecha: string
  concepto: string
  total: number
  tipo: CashMovementType
  categoria: CashMovementCategory
  pago: CashPaymentMethod
  comprobante?: string
  responsable: string
}

export interface CashRegisterState {
  estado: 'abierta' | 'cerrada'
  horaApertura: string
  horaCierre?: string
  responsableApertura: string
  responsableCierre?: string
  fondoInicial: number
  dineroEsperado: number
  dineroContado?: number
  diferencia?: number
  observaciones?: string
}

export interface CashKpiOverview {
  ingresosTotales: number
  ingresosDetalle: string
  egresosTotales: number
  egresosDetalle: string
  efectivoEsperado: number
  efectivoMeta: number
  ingresosEfectivo: number
  egresosEfectivo: number
  transferenciasTotal: number
  tarjetasTotal: number
}
