import React, { useState, useMemo, useEffect } from 'react'
import { useSearchParams, useLocation } from 'react-router-dom'
import { useToast } from '@/context/ToastContext'
import { PedidosHeader } from '../components/PedidosHeader'
import { PedidosFilters } from '../components/PedidosFilters'
import { PedidosTable } from '../components/PedidosTable'
import { KanbanBoard } from '../components/KanbanBoard'
import { NewOrderDialog } from '../components/NewOrderDialog'
import { RescheduleDialog } from '../components/RescheduleDialog'
import { PaymentDialog } from '../components/PaymentDialog'
import { WhatsAppTemplateModal } from '../components/WhatsAppTemplateModal'
import { PedidoDetailDialog } from '../components/PedidoDetailDialog'
import { WarrantyReentryDialog } from '../components/WarrantyReentryDialog'
import type {
  Pedido,
  PedidoTabCategory,
  PedidoKanbanStage,
  RegistrarPedidoFormData,
  RegistrarGarantiaFormData,
  ConfirmPaymentDetails,
  PagoRegistro,
} from '../types/workshop.types'

const STAGE_LABELS: Record<PedidoKanbanStage, string> = {
  en_espera: 'En espera',
  en_taller: 'En taller',
  listo_para_entrega: 'Listo para entrega',
  entregado: 'Entregado',
}

// Mock dataset with individual payments, images of initial piece state, and new kanban stages
const INITIAL_PEDIDOS: Pedido[] = [
  {
    id: '1',
    cliente: 'María Pérez',
    pieza: 'Anillo de plata 925',
    trabajo: 'Reparación',
    estado: 'Pendiente',
    pagos: [
      {
        id: 'p-1',
        monto: 5000,
        metodo: 'Transferencia',
        fecha: '10-03-2026',
      },
    ],
    categoria: 'todos',
    fechaEntrega: '15-03-2026',
    fechaInicio: '10-03-2026',
    pagoTotal: 15000,
    señaAdelanto: 5000,
    metal: 'Plata 925',
    pesoInicialGramos: 4.2,
    mermaEstimadaGramos: 0.35,
    pesoFinalGramos: 3.85,
    kanbanStage: 'en_espera',
    contacto: '11 4455-8899',
    orfebre: 'Esteban Ruiz',
    notas: 'Ajuste de garra central y limpieza profunda.',
    imagenes: [
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=500&auto=format&fit=crop&q=80',
    ],
  },
  {
    id: '2',
    cliente: 'Juan Gómez',
    pieza: 'Cadena de oro 18k',
    trabajo: 'Confección',
    estado: 'Pendiente',
    pagos: [
      {
        id: 'p-2',
        monto: 20000,
        metodo: 'Efectivo',
        fecha: '12-03-2026',
      },
    ],
    categoria: 'en_taller',
    fechaEntrega: '18-03-2026',
    fechaInicio: '12-03-2026',
    pagoTotal: 45000,
    señaAdelanto: 20000,
    metal: 'Oro 18k',
    pesoInicialGramos: 12.5,
    mermaEstimadaGramos: 0.8,
    pesoFinalGramos: 11.7,
    kanbanStage: 'en_taller',
    contacto: '11 3322-1144',
    orfebre: 'Lucía Benítez',
    notas: 'Eslabón barbado 50cm con cierre mosquetón.',
    imagenes: [
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&auto=format&fit=crop&q=80',
    ],
  },
  {
    id: '3',
    cliente: 'Carlos Ruiz',
    pieza: 'Aros de perla y oro',
    trabajo: 'Reparación',
    estado: 'Pendiente',
    pagos: [],
    categoria: 'hoy',
    fechaEntrega: '12-03-2026',
    fechaInicio: '08-03-2026',
    pagoTotal: 12000,
    señaAdelanto: 0,
    metal: 'Oro 18k',
    pesoInicialGramos: 2.8,
    mermaEstimadaGramos: 0.2,
    pesoFinalGramos: 2.6,
    kanbanStage: 'en_taller',
    contacto: 'carlos.ruiz@joyeria.com',
    orfebre: 'Esteban Ruiz',
    notas: 'Pegar perla de cultivo derecha y cambiar perno de seguridad.',
    imagenes: [
      'https://images.unsplash.com/photo-1630019852942-f89202989a59?w=500&auto=format&fit=crop&q=80',
    ],
  },
  {
    id: '4',
    cliente: 'Lucía Martín',
    pieza: 'Anillo solitario de oro',
    trabajo: 'Confección',
    estado: 'Pendiente',
    pagos: [
      {
        id: 'p-4',
        monto: 15000,
        metodo: 'Transferencia',
        fecha: '08-03-2026',
      },
    ],
    categoria: 'atrasados',
    fechaEntrega: '10-03-2026',
    fechaInicio: '02-03-2026',
    pagoTotal: 38000,
    señaAdelanto: 15000,
    metal: 'Oro 18k',
    pesoInicialGramos: 5.1,
    mermaEstimadaGramos: 0.4,
    pesoFinalGramos: 4.7,
    kanbanStage: 'en_taller',
    contacto: '11 5566-2233',
    orfebre: 'Pablo Pérez',
    notas: 'Engaste de circón suizo de 6mm en 4 grifas.',
    imagenes: [
      'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=500&auto=format&fit=crop&q=80',
    ],
  },
  {
    id: '5',
    cliente: 'Marta Sánchez',
    pieza: 'Cadena de plata 925',
    trabajo: 'Reparación',
    estado: 'Cancelado',
    pagos: [
      {
        id: 'p-5',
        monto: 18000,
        metodo: 'Mercado Pago',
        fecha: '09-03-2026',
      },
    ],
    categoria: 'entregados',
    fechaEntrega: '09-03-2026',
    fechaInicio: '05-03-2026',
    pagoTotal: 18000,
    señaAdelanto: 18000,
    pagado: true,
    metal: 'Plata 925',
    pesoInicialGramos: 8.4,
    mermaEstimadaGramos: 0.5,
    pesoFinalGramos: 7.9,
    kanbanStage: 'entregado',
    contacto: '11 7744-1122',
    orfebre: 'Lucía Benítez',
    notas: 'Soldadura de 2 eslabones y baño de rodio final.',
    imagenes: [
      'https://images.unsplash.com/photo-1611591475879-da60a3c792f0?w=500&auto=format&fit=crop&q=80',
    ],
  },
  {
    id: '6',
    cliente: 'Ignacio Vega',
    pieza: 'Anillo con circón',
    trabajo: 'Garantía',
    estado: 'Pendiente',
    pagos: [],
    categoria: 'garantias',
    fechaEntrega: '14-03-2026',
    fechaInicio: '10-03-2026',
    pagoTotal: 0,
    señaAdelanto: 0,
    pagado: true,
    metal: 'Plata 925',
    kanbanStage: 'en_espera',
    contacto: '11 9988-3322',
    orfebre: 'Esteban Ruiz',
    notas: 'Garantía Ref #PED-0001: Ajuste de engaste por caída de piedra.',
    esGarantia: true,
    pedidoOriginalId: '1',
    motivoGarantia: 'Se desprendió la piedra engarzada colocada en la reparación previa.',
    imagenes: [
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=500&auto=format&fit=crop&q=80',
    ],
  },
]

export const WorkshopOrdersPage: React.FC = () => {
  const [pedidos, setPedidos] = useState<Pedido[]>(INITIAL_PEDIDOS)
  const [activeTab, setActiveTab] = useState<PedidoTabCategory>('todos')
  const [searchQuery, setSearchQuery] = useState('')
  // Default to kanban view
  const [viewMode, setViewMode] = useState<'table' | 'kanban'>('kanban')

  const { showToast } = useToast()

  // Modals state
  const [isNewOrderOpen, setIsNewOrderOpen] = useState(false)
  const [reschedulePedido, setReschedulePedido] = useState<Pedido | null>(null)
  const [paymentPedido, setPaymentPedido] = useState<Pedido | null>(null)
  const [whatsAppPedido, setWhatsAppPedido] = useState<Pedido | null>(null)
  const [detailPedidoId, setDetailPedidoId] = useState<string | null>(null)
  const [warrantyTargetPedido, setWarrantyTargetPedido] = useState<Pedido | null>(null)

  const [searchParams, setSearchParams] = useSearchParams()
  const location = useLocation()

  useEffect(() => {
    if (searchParams.get('action') === 'new' || searchParams.get('nuevo') === 'true' || location.state?.openNewOrder) {
      setIsNewOrderOpen(true)
      if (searchParams.has('action') || searchParams.has('nuevo')) {
        const newParams = new URLSearchParams(searchParams)
        newParams.delete('action')
        newParams.delete('nuevo')
        setSearchParams(newParams, { replace: true })
      }
    }
  }, [searchParams, location.state, setSearchParams])

  // Current active detail pedido from state to ensure real-time updates
  const activeDetailPedido = useMemo(() => {
    if (!detailPedidoId) return null
    return pedidos.find((p) => p.id === detailPedidoId) || null
  }, [pedidos, detailPedidoId])

  // Filtered dataset based on active tab and search query
  const filteredPedidos = useMemo(() => {
    return pedidos.filter((item) => {
      // Tab matching
      if (activeTab === 'garantias') {
        if (!item.esGarantia && item.trabajo !== 'Garantía') return false
      } else if (activeTab !== 'todos' && item.categoria !== activeTab) {
        return false
      }

      // Search matching (cliente, contacto, pieza, trabajo, estado, métodos de pago)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim()
        const matchesClient = item.cliente.toLowerCase().includes(query)
        const matchesContact = item.contacto?.toLowerCase().includes(query) ?? false
        const matchesPiece = item.pieza.toLowerCase().includes(query)
        const matchesJob = item.trabajo.toLowerCase().includes(query)
        const matchesStatus = item.estado.toLowerCase().includes(query)
        const matchesPaymentMethods = item.pagos?.some((p) =>
          p.metodo.toLowerCase().includes(query)
        ) ?? false

        return (
          matchesClient ||
          matchesContact ||
          matchesPiece ||
          matchesJob ||
          matchesStatus ||
          matchesPaymentMethods
        )
      }

      return true
    })
  }, [pedidos, activeTab, searchQuery])

  // Handlers for interactive modal operations
  const handleCreateOrder = (formData: RegistrarPedidoFormData) => {
    const pagoTotalNum = formData.pagoTotal
      ? parseFloat(formData.pagoTotal.replace(/[^0-9.]/g, ''))
      : undefined
    const senaNum = formData.señaAdelanto
      ? parseFloat(formData.señaAdelanto.replace(/[^0-9.]/g, ''))
      : 0

    const initialPagos: PagoRegistro[] = []
    if (senaNum > 0) {
      initialPagos.push({
        id: `pago-${Date.now()}`,
        monto: senaNum,
        metodo: formData.metodoSena || 'Transferencia',
        fecha: formData.fechaInicio || new Date().toISOString().split('T')[0],
      })
    }

    const isCancelado = pagoTotalNum !== undefined && pagoTotalNum > 0 && senaNum >= pagoTotalNum

    const newPedido: Pedido = {
      id: Date.now().toString(),
      cliente: formData.clienteNombre,
      pieza: formData.tiposTrabajo.join(', ') || 'Pieza de joyería',
      trabajo: formData.tiposTrabajo[0] || 'Reparación',
      estado: isCancelado ? 'Cancelado' : 'Pendiente',
      pagos: initialPagos,
      orfebre: formData.orfebreNombre,
      contacto: formData.contacto,
      notas: formData.notas,
      categoria: 'todos',
      fechaEntrega: formData.fechaEntrega,
      fechaInicio: formData.fechaInicio,
      pagoTotal: pagoTotalNum,
      señaAdelanto: senaNum,
      pagado: isCancelado,
      kanbanStage: 'en_espera',
      imagenes: formData.imagePreviews || [],
    }

    setPedidos((prev) => [newPedido, ...prev])
    showToast(`Pedido registrado con éxito para ${formData.clienteNombre}.`)
  }

  const handleCreateWarrantyOrder = (data: RegistrarGarantiaFormData) => {
    const today = new Date().toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })

    const newWarrantyOrder: Pedido = {
      id: (pedidos.length + 1).toString(),
      cliente: data.clienteNombre,
      pieza: data.pieza,
      trabajo: 'Garantía',
      estado: 'Pendiente',
      pagos: [],
      orfebre: data.orfebreNombre,
      contacto: data.contacto,
      notas: `Garantía Ref #PED-${data.pedidoOriginalId.padStart(4, '0')}: ${data.motivoFalla}${data.notas ? ' • ' + data.notas : ''}`,
      fechaInicio: today,
      fechaEntrega: data.fechaEntrega,
      categoria: 'en_taller',
      pagoTotal: 0,
      señaAdelanto: 0,
      pagado: true,
      kanbanStage: 'en_espera',
      imagenes: data.imagePreviews || [],
      esGarantia: true,
      pedidoOriginalId: data.pedidoOriginalId,
      motivoGarantia: data.motivoFalla,
    }

    setPedidos((prev) => [newWarrantyOrder, ...prev])
    showToast(`Reingreso por garantía registrado para ${data.clienteNombre}.`)
  }

  const handleStageChange = (pedidoId: string, nextStage: PedidoKanbanStage) => {
    setPedidos((prev) =>
      prev.map((item) =>
        item.id === pedidoId ? { ...item, kanbanStage: nextStage } : item
      )
    )
    showToast(`Etapa de taller actualizada a: ${STAGE_LABELS[nextStage]}.`)
  }

  const handleConfirmReschedule = (pedidoId: string, newDate: string) => {
    setPedidos((prev) =>
      prev.map((item) =>
        item.id === pedidoId ? { ...item, fechaEntrega: newDate } : item
      )
    )
    showToast(`Fecha de entrega reprogramada a ${newDate}.`)
  }

  const handleConfirmPayment = (
    pedidoId: string,
    details: ConfirmPaymentDetails
  ) => {
    let toastMsg = ''
    setPedidos((prev) =>
      prev.map((item) => {
        if (item.id !== pedidoId) return item

        const baseTotal =
          details.nuevoPagoTotal !== undefined
            ? details.nuevoPagoTotal
            : (item.pagoTotal ?? 15000)

        const currentPagos = item.pagos || []
        const currentAbonado = currentPagos.reduce((sum, p) => sum + p.monto, 0)
        const abonado = details.montoAbonado || 0

        const updatedPagos: PagoRegistro[] =
          abonado > 0
            ? [
                ...currentPagos,
                {
                  id: `pago-${Date.now()}`,
                  monto: abonado,
                  metodo: details.metodo,
                  fecha: details.fechaPago || new Date().toISOString().split('T')[0],
                },
              ]
            : currentPagos

        const newTotalAbonado = currentAbonado + abonado
        // Automatically save as cancelado when total sum is paid!
        const isCancelado = baseTotal > 0 && newTotalAbonado >= baseTotal

        if (isCancelado) {
          toastMsg = `Pedido cancelado (100% saldado) con pago de $${abonado.toLocaleString('es-AR')} vía ${details.metodo}.`
        } else if (abonado > 0) {
          const saldoRestante = Math.max(0, baseTotal - newTotalAbonado)
          toastMsg = `Pago de $${abonado.toLocaleString('es-AR')} registrado vía ${details.metodo}. Saldo pendiente: $${saldoRestante.toLocaleString('es-AR')}.`
        } else {
          toastMsg = 'Importe total actualizado con éxito.'
        }

        return {
          ...item,
          pagoTotal: baseTotal,
          señaAdelanto: newTotalAbonado,
          pagos: updatedPagos,
          pagado: isCancelado,
          estado: isCancelado ? 'Cancelado' : 'Pendiente',
        }
      })
    )

    if (toastMsg) {
      showToast(toastMsg)
    }
  }

  return (
    <div className="w-full max-w-[1200px] mx-auto space-y-6 animate-fade-in">
      {/* Header: Title, "Registrar nuevo" & Notifications */}
      <PedidosHeader
        onRegisterNewClick={() => setIsNewOrderOpen(true)}
        onNotificationsClick={() => showToast('Tienes 3 avisos de taller pendientes.')}
      />

      {/* Filter Tabs & Search Bar & View Mode Toggle */}
      <PedidosFilters
        activeTab={activeTab}
        onTabChange={setActiveTab}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {/* Main Content: Kanban Board (default) or Table */}
      {viewMode === 'kanban' ? (
        <KanbanBoard
          pedidos={filteredPedidos}
          onStageChange={handleStageChange}
          onViewDetail={(pedido) => setDetailPedidoId(pedido.id)}
          onOpenWhatsApp={(pedido) => setWhatsAppPedido(pedido)}
        />
      ) : (
        <PedidosTable
          pedidos={filteredPedidos}
          onReprogramar={(pedido) => setReschedulePedido(pedido)}
          onRegistrarPago={(pedido) => setPaymentPedido(pedido)}
          onViewDetail={(pedido) => setDetailPedidoId(pedido.id)}
          onOpenWhatsApp={(pedido) => setWhatsAppPedido(pedido)}
          onReingresoGarantia={(pedido) => setWarrantyTargetPedido(pedido)}
          onResetFilters={() => {
            setSearchQuery('')
            setActiveTab('todos')
          }}
        />
      )}

      {/* Ventana de Detalle del Pedido con toda la información y botón de imprimir */}
      <PedidoDetailDialog
        open={!!activeDetailPedido}
        onOpenChange={(open) => !open && setDetailPedidoId(null)}
        pedido={activeDetailPedido}
        onRegistrarPago={(pedido) => {
          setDetailPedidoId(null)
          setPaymentPedido(pedido)
        }}
        onOpenWhatsApp={(pedido) => setWhatsAppPedido(pedido)}
        onReingresoGarantia={(pedido) => setWarrantyTargetPedido(pedido)}
      />

      {/* Modals for Refined/Enhanced Operations */}
      <NewOrderDialog
        open={isNewOrderOpen}
        onOpenChange={setIsNewOrderOpen}
        onSubmit={handleCreateOrder}
      />

      {/* Reingreso por Garantía Modal (Sin costo adicional) */}
      <WarrantyReentryDialog
        open={!!warrantyTargetPedido}
        onOpenChange={(open) => !open && setWarrantyTargetPedido(null)}
        pedido={warrantyTargetPedido}
        onSubmit={handleCreateWarrantyOrder}
      />

      <RescheduleDialog
        open={!!reschedulePedido}
        onOpenChange={(open) => !open && setReschedulePedido(null)}
        pedido={reschedulePedido}
        onConfirm={handleConfirmReschedule}
      />

      <PaymentDialog
        open={!!paymentPedido}
        onOpenChange={(open) => !open && setPaymentPedido(null)}
        pedido={paymentPedido}
        onConfirm={handleConfirmPayment}
      />


      {/* WhatsApp Pre-Templated Sender Modal */}
      <WhatsAppTemplateModal
        open={!!whatsAppPedido}
        onOpenChange={(open) => !open && setWhatsAppPedido(null)}
        pedido={whatsAppPedido}
      />
    </div>
  )
}

export default WorkshopOrdersPage
