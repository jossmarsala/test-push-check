export interface BalanceStatsKpis {
  ingresosMes: number
  gastosMes: number
  utilidadNeta: number
  margenNetoPct: number
  variacionIngresosPct: number
  variacionGastosPct: number
  ventasHoy: number
  gastosHoy: number
  balanceHoy: number
}

export interface TopProductItem {
  name: string
  amount: number
  salesCount: number
  tag?: string
}

export interface BreakdownDistributionItem {
  name: string
  amount: number
  percentage: number
}

export interface SalesBreakdowns {
  topProductos: TopProductItem[]
  porCategoria: BreakdownDistributionItem[]
  porMedioPago: BreakdownDistributionItem[]
}

export interface ExpenseDistributionItem {
  label: string
  percentage: number
  amount: number
}

export interface WorkshopStatsSummary {
  enTaller: number
  listosEntrega: number
  entregadosMes: number
  cumplimientoPct: number
}
