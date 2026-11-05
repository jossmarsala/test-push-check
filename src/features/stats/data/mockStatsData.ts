import type {
  BalanceStatsKpis,
  SalesBreakdowns,
  ExpenseDistributionItem,
  WorkshopStatsSummary,
} from '../types/stats.types'

export const INITIAL_BALANCE_STATS: BalanceStatsKpis = {
  ingresosMes: 182900,
  gastosMes: 18900,
  utilidadNeta: 164000,
  margenNetoPct: 89.7,
  variacionIngresosPct: 8,
  variacionGastosPct: -3,
  ventasHoy: 12480,
  gastosHoy: 1240,
  balanceHoy: 11240,
}

export const INITIAL_SALES_BREAKDOWNS: SalesBreakdowns = {
  topProductos: [
    {
      name: 'Anillo Sin Fin Oro 18k',
      amount: 108450,
      salesCount: 18,
      tag: 'Oro 18k',
    },
    {
      name: 'Cadena Grumet Plata 925',
      amount: 42000,
      salesCount: 14,
      tag: 'Plata 925',
    },
    {
      name: 'Aros Argolla Circones',
      amount: 14278,
      salesCount: 11,
      tag: 'Plata 925',
    },
  ],
  porCategoria: [
    { name: 'Anillos', amount: 118885, percentage: 65 },
    { name: 'Cadenas y Dijes', amount: 45725, percentage: 25 },
    { name: 'Aros y otros', amount: 18290, percentage: 10 },
  ],
  porMedioPago: [
    { name: 'Transferencia / QR', amount: 91450, percentage: 50 },
    { name: 'Tarjeta Débito/Crédito', amount: 54870, percentage: 30 },
    { name: 'Efectivo', amount: 36580, percentage: 20 },
  ],
}

export const INITIAL_EXPENSE_DISTRIBUTION: ExpenseDistributionItem[] = [
  {
    label: 'Insumos y taller de orfebrería',
    percentage: 50,
    amount: 9450,
  },
  {
    label: 'Metales, piedras y fornituras',
    percentage: 30,
    amount: 5670,
  },
  {
    label: 'Servicios e impuestos operativos',
    percentage: 20,
    amount: 3780,
  },
]

export const INITIAL_WORKSHOP_SUMMARY: WorkshopStatsSummary = {
  enTaller: 12,
  listosEntrega: 6,
  entregadosMes: 23,
  cumplimientoPct: 96,
}
