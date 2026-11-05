import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
  Eye,
} from 'lucide-react'
import { PedidoDetailDialog } from '@/features/workshop/components/PedidoDetailDialog'
import { WhatsAppTemplateModal } from '@/features/workshop/components/WhatsAppTemplateModal'
import { PaymentDialog } from '@/features/workshop/components/PaymentDialog'
import { useToast } from '@/context/ToastContext'
import type {
  Pedido,
  PedidoTrabajo,
  PedidoEstado,
  MetodoPago,
  ConfirmPaymentDetails,
  PagoRegistro,
} from '@/features/workshop/types/workshop.types'
import type { PendingOrder } from '../types/dashboard.types'

export type DashboardOrder = PendingOrder & Partial<Pedido>

const MOCK_PENDING_ORDERS: DashboardOrder[] = [
  {
    id: '1',
    orderCode: '#P-2034',
    startDate: '12-03-2026',
    fechaInicio: '12-03-2026',
    deadlineDate: '15-03-2026',
    fechaEntrega: '15-03-2026',
    daysRemaining: 0,
    isDone: false,
    cliente: 'María Pérez',
    pieza: 'Anillo de oro 18k con zafiro',
    trabajo: 'Reparación',
    orfebre: 'Esteban Ruiz',
    contacto: '+54 9 11 4455-8899',
    notas: 'Ajuste de medida a 16mm y pulido final de la corona.',
    metal: 'Oro 18k',
    pagoTotal: 38000,
    señaAdelanto: 18000,
    estadoPago: 'Transferencia',
    estado: 'Pendiente',
    kanbanStage: 'en_taller',
    pesoInicialGramos: 4.8,
    mermaEstimadaGramos: 0.15,
    pesoFinalGramos: 4.65,
    imageUrl: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=500&auto=format&fit=crop&q=80',
    imagenes: [
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=500&auto=format&fit=crop&q=80',
    ],
    pagos: [
      {
        id: 'p-1',
        monto: 18000,
        metodo: 'Transferencia',
        fecha: '12-03-2026',
      },
    ],
  },
  {
    id: '2',
    orderCode: '#P-2035',
    startDate: '13-03-2026',
    fechaInicio: '13-03-2026',
    deadlineDate: '18-03-2026',
    fechaEntrega: '18-03-2026',
    daysRemaining: 2,
    isDone: false,
    cliente: 'Juan Gómez',
    pieza: 'Pulsera de plata 925 eslabón cruzado',
    trabajo: 'Confección',
    orfebre: 'Lucía Benítez',
    contacto: '+54 9 11 3322-1144',
    notas: 'Broche marinero reforzado, grabado interior iniciales J.G.',
    metal: 'Plata 925',
    pagoTotal: 25000,
    señaAdelanto: 10000,
    estadoPago: 'Efectivo',
    estado: 'Pendiente',
    kanbanStage: 'en_taller',
    pesoInicialGramos: 14.2,
    mermaEstimadaGramos: 0.4,
    pesoFinalGramos: 13.8,
    imageUrl: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&auto=format&fit=crop&q=80',
    imagenes: [
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&auto=format&fit=crop&q=80',
    ],
    pagos: [
      {
        id: 'p-2',
        monto: 10000,
        metodo: 'Efectivo',
        fecha: '13-03-2026',
      },
    ],
  },
  {
    id: '3',
    orderCode: '#P-2036',
    startDate: '14-03-2026',
    fechaInicio: '14-03-2026',
    deadlineDate: '22-03-2026',
    fechaEntrega: '22-03-2026',
    daysRemaining: 6,
    isDone: false,
    cliente: 'Carlos Ruiz',
    pieza: 'Cadena de oro 18k barbada',
    trabajo: 'Reparación',
    orfebre: 'Esteban Ruiz',
    contacto: '+54 9 11 6677-2233',
    notas: 'Soldar eslabón desgastado y realizar baño de inmersión ultrasónica.',
    metal: 'Oro 18k',
    pagoTotal: 19500,
    señaAdelanto: 19500,
    estadoPago: 'Mercado Pago',
    estado: 'Pendiente',
    kanbanStage: 'en_espera',
    pesoInicialGramos: 8.5,
    mermaEstimadaGramos: 0.02,
    pesoFinalGramos: 8.48,
    imageUrl: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?w=500&auto=format&fit=crop&q=80',
    imagenes: [
      'https://images.unsplash.com/photo-1630019852942-f89202989a59?w=500&auto=format&fit=crop&q=80',
    ],
    pagos: [
      {
        id: 'p-3',
        monto: 19500,
        metodo: 'Mercado Pago',
        fecha: '14-03-2026',
      },
    ],
  },
]

interface PendingOrdersCardProps {
  orders?: DashboardOrder[]
  onViewDetail?: (order: Pedido) => void
}

export const PendingOrdersCard: React.FC<PendingOrdersCardProps> = ({
  orders = MOCK_PENDING_ORDERS,
  onViewDetail,
}) => {
  const { showToast } = useToast()
  const [localOrders, setLocalOrders] = useState<DashboardOrder[]>(orders)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [isWhatsAppOpen, setIsWhatsAppOpen] = useState(false)
  const [isPaymentOpen, setIsPaymentOpen] = useState(false)

  const total = localOrders.length
  const currentOrder = localOrders[currentIndex] || localOrders[0]

  const pedidoForDetail: Pedido = useMemo(() => {
    const o = currentOrder
    if (!o) {
      return {
        id: '1',
        cliente: 'Cliente',
        pieza: 'Joya',
        trabajo: 'Reparación',
        estado: 'Pendiente',
        pagos: [],
      }
    }

    const pagos: PagoRegistro[] =
      o.pagos && o.pagos.length > 0
        ? o.pagos
        : o.señaAdelanto
        ? [
            {
              id: `p-${o.id}-initial`,
              monto: o.señaAdelanto,
              metodo: (o.estadoPago as MetodoPago) || 'Transferencia',
              fecha: o.startDate || o.fechaInicio || '12-03-2026',
            },
          ]
        : []

    return {
      id: String(o.id || '1'),
      cliente: o.cliente || 'María Pérez',
      pieza: o.pieza || 'Anillo de oro 18k con zafiro',
      trabajo: (o.trabajo as PedidoTrabajo) || 'Reparación',
      estado: (o.estado as PedidoEstado) || (o.isDone ? 'Cancelado' : 'Pendiente'),
      pagos,
      orfebre: o.orfebre || 'Esteban Ruiz',
      contacto: o.contacto || '+54 9 11 4455-8899',
      notas: o.notas || '',
      imagenes:
        o.imagenes && o.imagenes.length > 0
          ? o.imagenes
          : o.imageUrl
          ? [o.imageUrl]
          : [],
      fechaInicio: o.fechaInicio || o.startDate || '12-03-2026',
      fechaEntrega: o.fechaEntrega || o.deadlineDate || '15-03-2026',
      categoria: o.categoria || 'todos',
      pagoTotal: o.pagoTotal ?? 38000,
      señaAdelanto: o.señaAdelanto ?? 18000,
      metal: o.metal as Pedido['metal'],
      pesoInicialGramos: o.pesoInicialGramos ?? 4.8,
      pesoFinalGramos: o.pesoFinalGramos ?? 4.65,
      mermaEstimadaGramos: o.mermaEstimadaGramos ?? 0.15,
      kanbanStage: o.kanbanStage || 'en_taller',
      esGarantia: o.esGarantia,
      pedidoOriginalId: o.pedidoOriginalId,
      motivoGarantia: o.motivoGarantia,
      pagado: o.pagado,
    }
  }, [currentOrder])

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : total - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < total - 1 ? prev + 1 : 0))
  }

  const handleOpenDetail = () => {
    if (onViewDetail) {
      onViewDetail(pedidoForDetail)
    }
    setIsDetailOpen(true)
  }

  const handleConfirmPayment = (
    id: string,
    details: ConfirmPaymentDetails
  ) => {
    setLocalOrders((prev) =>
      prev.map((order) => {
        if (String(order.id) !== String(id)) return order
        const prevPagos: PagoRegistro[] = order.pagos || [
          {
            id: `p-${order.id}-0`,
            monto: order.señaAdelanto || 0,
            metodo: (order.estadoPago as MetodoPago) || 'Transferencia',
            fecha: order.startDate || order.fechaInicio || '12-03-2026',
          },
        ]
        const newPagos: PagoRegistro[] = [
          ...prevPagos,
          {
            id: `p-${Date.now()}`,
            monto: details.montoAbonado,
            metodo: details.metodo,
            fecha: details.fechaPago || new Date().toISOString().split('T')[0],
          },
        ]
        const currentTotal = details.nuevoPagoTotal ?? order.pagoTotal ?? 0
        const totalAbonado = newPagos.reduce((acc, cur) => acc + cur.monto, 0)
        return {
          ...order,
          pagoTotal: currentTotal,
          pagos: newPagos,
          señaAdelanto: totalAbonado,
          estado: (totalAbonado >= currentTotal ? 'Cancelado' : order.estado || 'Pendiente') as PedidoEstado,
          pagado: totalAbonado >= currentTotal,
        }
      })
    )
    showToast(`Pago de $${details.montoAbonado.toLocaleString('es-AR')} registrado con éxito.`)
    setIsPaymentOpen(false)
  }

  const displayCode =
    currentOrder?.orderCode ||
    `#PED-${String(currentOrder?.id || '1').padStart(4, '0')}`
  const displayImage =
    currentOrder?.imageUrl ||
    currentOrder?.imagenes?.[0]
  const displayStartDate =
    currentOrder?.startDate ||
    currentOrder?.fechaInicio ||
    '12-03-2026'
  const displayDeadlineDate =
    currentOrder?.deadlineDate ||
    currentOrder?.fechaEntrega ||
    '15-03-2026'
  const daysRemaining = currentOrder?.daysRemaining ?? 0

  return (
    <section className="space-y-3">
      {/* Section Header with Link */}
      <div className="flex items-center justify-between select-none">
        <h2 className="text-base sm:text-lg font-semibold tracking-tight text-[var(--neutral-emphasis)] leading-snug">
          Pedidos en taller
        </h2>
        <Link
          to="/pedidos"
          className="group inline-flex items-center gap-1 text-xs font-medium text-[var(--neutral-muted)] hover:text-[var(--neutral-emphasis)] transition-colors"
        >
          <span>Ver todos</span>
          <ChevronRight className="h-3.5 w-3.5 stroke-[1.5]" />
        </Link>
      </div>

      {/* Card Container */}
      <div className="relative flex flex-col justify-between rounded-[var(--radius-card)] border border-[var(--neutral-border-subtle)] bg-[var(--neutral-card)] p-5 shadow-2xs transition-all">
        {/* Pagination Counter Top-Right */}
        <div className="absolute top-5 right-5 text-xs font-mono tabular-nums text-[var(--neutral-muted)] select-none">
          {currentIndex + 1} / {total}
        </div>

        {/* Order Details Body */}
        <div className="flex items-start gap-4 pr-12">
          {/* Order Image Thumbnail */}
          <div
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[var(--radius-input)] bg-[var(--neutral-subtle)] text-[var(--neutral-placeholder)] overflow-hidden border border-[var(--neutral-border-subtle)] select-none"
            aria-label="Foto del pedido"
          >
            {displayImage ? (
              <img
                src={displayImage}
                alt={`Pedido ${displayCode}`}
                className="h-full w-full object-cover"
              />
            ) : (
              <ImageIcon className="h-5 w-5 stroke-[1.5]" />
            )}
          </div>

          {/* Text Metadata */}
          <div className="flex flex-col space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-[var(--neutral-emphasis)] text-sm leading-tight">
                Pedido <span className="font-mono tabular-nums">{displayCode}</span>
              </h3>
              {daysRemaining <= 0 ? (
                <span className="rounded-full bg-[var(--neutral-subtle)] px-2 py-0.5 text-[10px] font-medium text-[var(--neutral-emphasis)] border border-[var(--neutral-border)]">
                  Vence hoy
                </span>
              ) : daysRemaining <= 2 ? (
                <span className="rounded-full bg-[var(--neutral-subtle)] px-2 py-0.5 text-[10px] font-medium text-[var(--neutral-muted)] border border-[var(--neutral-border-subtle)]">
                  Próximo
                </span>
              ) : null}
            </div>
            <p className="text-xs text-[var(--neutral-muted)] leading-normal">
              Recepción: <span className="font-mono tabular-nums">{displayStartDate}</span>
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-0.5">
              <span className="text-xs text-[var(--neutral-muted)]">
                Compromiso: <span className="font-mono tabular-nums">{displayDeadlineDate}</span>
              </span>
              <span className="text-xs text-[var(--neutral-muted)]">
                · {daysRemaining === 0 ? 'Vence hoy' : `${daysRemaining} días restantes`}
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Actions Row: Single "Ver detalle" + Carousel Navigation */}
        <div className="mt-5 flex items-center gap-2 pt-1">
          {/* Single "Ver detalle" Action Button */}
          <button
            type="button"
            onClick={handleOpenDetail}
            className="flex h-9 flex-1 items-center justify-center gap-2 rounded-[var(--radius-btn)] border border-[var(--neutral-border-subtle)] bg-[var(--neutral-card)] text-[var(--neutral-body)] hover:text-[var(--neutral-emphasis)] hover:bg-[var(--neutral-subtle)] px-4 text-xs font-medium transition-colors cursor-pointer select-none active:scale-[0.98] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--sidebar-ring)]"
          >
            <Eye className="h-3.5 w-3.5 stroke-[1.5]" />
            <span>Ver detalle</span>
          </button>

          {/* Carousel Left Arrow Navigation */}
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Pedido anterior"
            className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-btn)] border border-[var(--neutral-border-subtle)] bg-[var(--neutral-card)] text-[var(--neutral-muted)] hover:text-[var(--neutral-emphasis)] hover:bg-[var(--neutral-subtle)] active:scale-[0.98] transition-colors cursor-pointer select-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--sidebar-ring)]"
          >
            <ChevronLeft className="h-3.5 w-3.5 stroke-[1.5]" />
          </button>

          {/* Carousel Right Arrow Navigation */}
          <button
            type="button"
            onClick={handleNext}
            aria-label="Siguiente pedido"
            className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-btn)] border border-[var(--neutral-border-subtle)] bg-[var(--neutral-card)] text-[var(--neutral-muted)] hover:text-[var(--neutral-emphasis)] hover:bg-[var(--neutral-subtle)] active:scale-[0.98] transition-colors cursor-pointer select-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--sidebar-ring)]"
          >
            <ChevronRight className="h-3.5 w-3.5 stroke-[1.5]" />
          </button>
        </div>
      </div>

      {/* DIÁLOGO DETALLE COMPLETO DE PEDIDO (IDÉNTICO A PESTAÑA PEDIDOS) */}
      <PedidoDetailDialog
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
        pedido={pedidoForDetail}
        onPrintTicket={() => {
          showToast('Ticket de taller enviado a impresión.')
        }}
        onRegistrarPago={() => {
          setIsDetailOpen(false)
          setIsPaymentOpen(true)
        }}
        onOpenWhatsApp={() => {
          setIsWhatsAppOpen(true)
        }}
      />

      {/* MODAL PLANTILLAS WHATSAPP */}
      <WhatsAppTemplateModal
        open={isWhatsAppOpen}
        onOpenChange={setIsWhatsAppOpen}
        pedido={pedidoForDetail}
      />

      {/* MODAL REGISTRAR PAGO */}
      <PaymentDialog
        open={isPaymentOpen}
        onOpenChange={setIsPaymentOpen}
        pedido={pedidoForDetail}
        onConfirm={handleConfirmPayment}
      />
    </section>
  )
}
