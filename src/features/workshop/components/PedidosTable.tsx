import React from 'react'
import { CalendarClock, Calendar, CheckCircle2, DollarSign, ClipboardList, MessageCircle, Mail, Eye, Clock } from 'lucide-react'
import { EmptyState } from '@/components/ui/empty-state'
import type { Pedido } from '../types/workshop.types'
import { getWhatsAppMessageForPedido } from './WhatsAppTemplateModal'

interface PedidosTableProps {
  pedidos: Pedido[]
  onReprogramar: (pedido: Pedido) => void
  onRegistrarPago: (pedido: Pedido) => void
  onViewDetail: (pedido: Pedido) => void
  onOpenWhatsApp?: (pedido: Pedido) => void
  onReingresoGarantia?: (pedido: Pedido) => void
  onResetFilters?: () => void
}

export const PedidosTable: React.FC<PedidosTableProps> = ({
  pedidos,
  onReprogramar,
  onRegistrarPago,
  onViewDetail,
  onOpenWhatsApp,
  onResetFilters,
}) => {
  const handleNotify = (pedido: Pedido) => {
    if (onOpenWhatsApp) {
      onOpenWhatsApp(pedido)
    } else {
      const rawContact = pedido.contacto?.trim() || ''
      const text = getWhatsAppMessageForPedido(pedido)
      if (rawContact.includes('@')) {
        const subject = encodeURIComponent(`Actualización de tu pedido en EQUA Joyas: ${pedido.pieza}`)
        window.open(`mailto:${rawContact}?subject=${subject}&body=${encodeURIComponent(text)}`, '_blank')
      } else {
        const phone = rawContact.replace(/[^0-9]/g, '')
        window.open(phone ? `https://wa.me/${phone}?text=${encodeURIComponent(text)}` : `https://wa.me/?text=${encodeURIComponent(text)}`, '_blank')
      }
    }
  }

  if (pedidos.length === 0) {
    return (
      <EmptyState
        icon={ClipboardList}
        title="No se encontraron pedidos"
        description="No hay órdenes de taller que coincidan con la búsqueda o el filtro de estado seleccionado."
        actionLabel={onResetFilters ? 'Restablecer filtros' : undefined}
        onAction={onResetFilters}
      />
    )
  }

  return (
    <div className="w-full overflow-hidden rounded-[var(--radius-card)] border border-[var(--neutral-border-subtle)] bg-[var(--neutral-card)] shadow-2xs transition-all">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-xs">
          {/* Table Header */}
          <thead>
            <tr className="border-b border-[var(--neutral-border-subtle)] bg-[var(--neutral-subtle)]/40 text-[11px] font-semibold uppercase tracking-wider text-[var(--neutral-muted)] select-none">
              <th scope="col" className="py-3.5 pl-5 pr-4 sm:pl-6">
                Cliente
              </th>
              <th scope="col" className="py-3.5 px-4">
                Pieza
              </th>
              <th scope="col" className="py-3.5 px-4">
                Trabajo
              </th>
              <th scope="col" className="py-3.5 px-4">
                Fechas
              </th>
              <th scope="col" className="py-3.5 px-4">
                Acciones
              </th>
              <th scope="col" className="py-3.5 pl-4 pr-5 sm:pr-6 text-right">
                Estado
              </th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-[var(--neutral-border-subtle)]">
            {pedidos.map((pedido) => {
              const totalPagado =
                pedido.pagos && pedido.pagos.length > 0
                  ? pedido.pagos.reduce((sum, p) => sum + p.monto, 0)
                  : (pedido.señaAdelanto || 0)
              const isPaid =
                pedido.estado === 'Cancelado' ||
                pedido.pagado ||
                (pedido.pagoTotal !== undefined && pedido.pagoTotal > 0 && totalPagado >= pedido.pagoTotal)

              return (
                  <tr
                    key={pedido.id}
                    className="transition-colors hover:bg-[var(--neutral-subtle)]/50"
                  >
                    {/* CLIENTE with Contact visible underneath */}
                    <td className="py-3.5 pl-5 pr-4 sm:pl-6 whitespace-nowrap">
                      <div className="flex items-center gap-2 font-semibold text-sm text-[var(--neutral-emphasis)]">
                        <span>{pedido.cliente}</span>
                        {pedido.contacto?.includes('@') ? (
                          <button
                            type="button"
                            onClick={() => handleNotify(pedido)}
                            title={`Enviar correo a ${pedido.cliente}`}
                            className="p-1 rounded-md text-blue-600 hover:bg-blue-500/10 active:scale-95 transition-all cursor-pointer"
                          >
                            <Mail className="h-3.5 w-3.5" />
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleNotify(pedido)}
                            title={`Enviar WhatsApp a ${pedido.cliente}`}
                            className="p-1 rounded-md text-emerald-600 hover:bg-emerald-500/10 active:scale-95 transition-all cursor-pointer"
                          >
                            <MessageCircle className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                      {/* Client contact visible under client name */}
                      {pedido.contacto ? (
                        <div className="text-[11px] font-normal text-[var(--neutral-muted)] font-mono mt-0.5">
                          {pedido.contacto}
                        </div>
                      ) : (
                        <div className="text-[11px] font-normal text-[var(--neutral-placeholder)] italic mt-0.5">
                          Sin contacto registrado
                        </div>
                      )}
                    </td>

                    {/* PIEZA */}
                    <td className="py-3.5 px-4 text-xs text-[var(--neutral-body)] font-normal whitespace-nowrap">
                      <div>{pedido.pieza}</div>
                      {pedido.esGarantia && pedido.pedidoOriginalId && (
                        <div className="text-[10px] text-[var(--neutral-muted)] font-mono mt-0.5">
                          Ref #{pedido.pedidoOriginalId.padStart(4, '0')}
                        </div>
                      )}
                    </td>

                    {/* TRABAJO */}
                    <td className="py-3.5 px-4 text-xs text-[var(--neutral-body)] font-normal whitespace-nowrap">
                      {pedido.trabajo}
                    </td>

                    {/* FECHAS */}
                    <td className="py-3.5 px-4 text-xs font-mono text-[var(--neutral-emphasis)] whitespace-nowrap">
                      <div className="flex items-center gap-1.5 font-medium">
                        <Calendar className="h-3.5 w-3.5 text-[var(--neutral-muted)] shrink-0" />
                        <span>{pedido.fechaEntrega || 'A coordinar'}</span>
                      </div>
                      {pedido.fechaInicio && (
                        <div className="text-[10px] text-[var(--neutral-muted)] font-mono mt-0.5">
                          Ingreso: {pedido.fechaInicio}
                        </div>
                      )}
                    </td>

                    {/* ACCIONES */}
                    <td className="py-3 px-4 text-xs select-none whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {/* BOTÓN VER DETALLE COMPLETO */}
                        <button
                          type="button"
                          onClick={() => onViewDetail(pedido)}
                          className="inline-flex items-center gap-1.5 h-8 px-2.5 rounded-lg border border-[var(--neutral-border)] bg-[var(--neutral-surface)] text-xs font-medium text-[var(--neutral-body)] hover:text-[var(--neutral-emphasis)] hover:bg-[var(--neutral-subtle)] active:scale-95 transition-all cursor-pointer shadow-2xs"
                          title="Ver ventana de detalle con toda la información"
                        >
                          <Eye className="h-3.5 w-3.5 text-[var(--neutral-muted)] stroke-[1.75]" />
                          <span>Detalle</span>
                        </button>

                        {/* BOTÓN REPROGRAMAR */}
                        <button
                          type="button"
                          onClick={() => onReprogramar(pedido)}
                          className="inline-flex items-center gap-1.5 h-8 px-2.5 rounded-lg border border-[var(--neutral-border)] bg-[var(--neutral-surface)] text-xs font-medium text-[var(--neutral-body)] hover:text-[var(--neutral-emphasis)] hover:bg-[var(--neutral-subtle)] active:scale-95 transition-all cursor-pointer shadow-2xs"
                          title="Reprogramar fecha de entrega"
                        >
                          <CalendarClock className="h-3.5 w-3.5 text-[var(--neutral-muted)] stroke-[1.75]" />
                          <span>Reprogramar</span>
                        </button>

                        {/* BOTÓN REGISTRAR PAGO / TOTAL PAGADO */}
                        {pedido.esGarantia ? (
                          <span
                            className="inline-flex items-center h-8 px-2.5 rounded-lg border border-[var(--neutral-border-subtle)] bg-[var(--neutral-subtle)]/40 text-[11px] font-mono text-[var(--neutral-muted)] select-none"
                            title="Trabajo cubierto por garantía (Sin cargo)"
                          >
                            Sin cargo
                          </span>
                        ) : isPaid ? (
                          <button
                            type="button"
                            onClick={() => onRegistrarPago(pedido)}
                            className="inline-flex items-center gap-1.5 h-8 px-2.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 active:scale-95 transition-all cursor-pointer shadow-2xs"
                            title="Pedido cancelado (100% saldado) - Clic para ver historial de pagos"
                          >
                            <CheckCircle2 className="h-3.5 w-3.5 stroke-[1.75]" />
                            <span>Cancelado</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => onRegistrarPago(pedido)}
                            className="inline-flex items-center gap-1.5 h-8 px-2.5 rounded-lg border border-transparent bg-[var(--neutral-brand)] text-xs font-medium text-white hover:bg-[var(--neutral-brand-hover)] active:scale-95 transition-all cursor-pointer shadow-2xs"
                            title="Registrar pago del pedido"
                          >
                            <DollarSign className="h-3.5 w-3.5 stroke-[1.75]" />
                            <span>Registrar pago</span>
                          </button>
                        )}
                      </div>
                    </td>

                    {/* ESTADO BADGE (Cancelado / Pendiente / Garantía) */}
                    <td className="py-3.5 pl-4 pr-5 sm:pr-6 text-right whitespace-nowrap">
                      {pedido.esGarantia ? (
                        <span className="inline-flex items-center justify-center rounded-full bg-[var(--neutral-subtle)] border border-[var(--neutral-border-subtle)] px-2.5 py-0.5 text-[11px] font-medium text-[var(--neutral-body)] select-none">
                          Garantía
                        </span>
                      ) : isPaid ? (
                        <span className="inline-flex items-center justify-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 select-none shadow-2xs">
                          <CheckCircle2 className="h-3 w-3 stroke-[2.2]" />
                          <span>Cancelado</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center justify-center gap-1 rounded-full bg-amber-500/10 border border-amber-500/25 px-2.5 py-0.5 text-[11px] font-semibold text-amber-700 dark:text-amber-400 select-none shadow-2xs">
                          <Clock className="h-3 w-3 stroke-[2.2]" />
                          <span>Pendiente</span>
                        </span>
                      )}
                    </td>
                  </tr>
                )
              })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
