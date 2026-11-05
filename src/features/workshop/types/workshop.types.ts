export type PedidoTrabajo = 'Reparación' | 'Confección' | 'Garantía' | 'Otro'

export type MetodoPago = 'Transferencia' | 'Efectivo' | 'Mercado Pago' | 'Tarjeta'
export type PedidoEstadoPago = MetodoPago // Backwards compatibility alias

export type PedidoEstado = 'Cancelado' | 'Pendiente'

export type PedidoTabCategory = 'todos' | 'hoy' | 'atrasados' | 'entregados' | 'en_taller' | 'garantias'

export type PedidoKanbanStage = 'en_espera' | 'en_taller' | 'listo_para_entrega' | 'entregado'

export type MetalType = 'Oro 18k' | 'Plata 925' | 'Platino' | 'Acero' | 'Oro blanco' | 'Otro'

export interface PagoRegistro {
  id: string
  monto: number
  metodo: MetodoPago
  fecha: string
}

export interface Pedido {
  id: string
  cliente: string
  pieza: string
  trabajo: PedidoTrabajo
  estado: PedidoEstado
  pagos: PagoRegistro[]
  orfebre?: string
  contacto?: string
  notas?: string
  imagenes?: string[]
  fechaInicio?: string
  fechaEntrega?: string
  categoria?: PedidoTabCategory
  pagoTotal?: number
  señaAdelanto?: number
  monto?: number
  pagado?: boolean
  // Orfebrería metal and weight metrics
  metal?: MetalType
  pesoInicialGramos?: number
  mermaEstimadaGramos?: number
  pesoFinalGramos?: number
  kanbanStage?: PedidoKanbanStage
  // Flujo específico de Garantía / Reingreso por falla
  esGarantia?: boolean
  pedidoOriginalId?: string
  motivoGarantia?: string
}

export type NewOrderFormData = RegistrarPedidoFormData

export interface ConfirmPaymentDetails {
  montoAbonado: number
  metodo: MetodoPago
  fechaPago?: string
  nuevoPagoTotal?: number
}

export interface RegistrarGarantiaFormData {
  pedidoOriginalId: string
  clienteNombre: string
  contacto: string
  pieza: string
  motivoFalla: string
  orfebreNombre: string
  fechaEntrega: string
  notas?: string
  imagenes: File[]
  imagePreviews: string[]
}

export interface RegistrarPedidoFormData {
  clienteNombre: string
  orfebreNombre: string
  contacto: string
  tiposTrabajo: PedidoTrabajo[]
  notas: string
  imagenes: File[]
  imagePreviews: string[]
  fechaInicio: string
  fechaEntrega: string
  pagoTotal: string
  señaAdelanto: string
  metodoSena?: MetodoPago
  metal?: MetalType
  pesoInicialGramos?: string
  mermaEstimadaGramos?: string
  pesoFinalGramos?: string
  esGarantia?: boolean
  pedidoOriginalId?: string
  motivoGarantia?: string
}
