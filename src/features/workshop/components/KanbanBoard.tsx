import React from 'react'
import {
  ChevronRight,
  ChevronLeft,
  MessageCircle,
  Mail,
  Eye,
  CheckCircle2,
  Clock,
  Calendar,
} from 'lucide-react'
import type { Pedido, PedidoKanbanStage } from '../types/workshop.types'

interface KanbanBoardProps {
  pedidos: Pedido[]
  onStageChange: (pedidoId: string, nextStage: PedidoKanbanStage) => void
  onViewDetail: (pedido: Pedido) => void
  onOpenWhatsApp: (pedido: Pedido) => void
}

interface ColumnDef {
  stage: PedidoKanbanStage
  title: string
}

const COLUMNS: ColumnDef[] = [
  { stage: 'en_espera', title: 'En espera' },
  { stage: 'en_taller', title: 'En taller' },
  { stage: 'listo_para_entrega', title: 'Listo para entrega' },
  { stage: 'entregado', title: 'Entregado' },
]

const STAGE_ORDER: PedidoKanbanStage[] = ['en_espera', 'en_taller', 'listo_para_entrega', 'entregado']

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  pedidos,
  onStageChange,
  onViewDetail,
  onOpenWhatsApp,
}) => {
  // Map or fallback each pedido to a kanbanStage
  const getStage = (p: Pedido): PedidoKanbanStage => {
    if (p.kanbanStage) return p.kanbanStage
    if (p.categoria === 'entregados') return 'entregado'
    if (p.categoria === 'hoy' || p.pagado) return 'listo_para_entrega'
    if (p.categoria === 'en_taller') return 'en_taller'
    return 'en_espera'
  }

  const handleAdvance = (p: Pedido, direction: 1 | -1) => {
    const current = getStage(p)
    const idx = STAGE_ORDER.indexOf(current)
    const nextIdx = idx + direction
    if (nextIdx >= 0 && nextIdx < STAGE_ORDER.length) {
      onStageChange(p.id, STAGE_ORDER[nextIdx])
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 select-none pb-4">
      {COLUMNS.map((col) => {
        const colPedidos = pedidos.filter((p) => getStage(p) === col.stage)

        return (
          <div
            key={col.stage}
            className="flex flex-col rounded-[var(--radius-card)] border border-[var(--neutral-border-subtle)] bg-[var(--neutral-card)]/50 p-3 min-h-[460px]"
          >
            {/* Column Header */}
            <div className="flex items-center justify-between pb-3 mb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--neutral-emphasis)]">
                {col.title}
              </h3>
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--neutral-subtle)] text-[10px] font-bold font-mono text-[var(--neutral-muted)]">
                {colPedidos.length}
              </span>
            </div>

            {/* Cards container */}
            <div className="flex-1 space-y-2.5 overflow-y-auto max-h-[640px] pr-1">
              {colPedidos.length === 0 ? (
                <div className="flex h-28 items-center justify-center rounded-lg border border-dashed border-[var(--neutral-border-subtle)] text-xs text-[var(--neutral-muted)]">
                  Sin pedidos
                </div>
              ) : (
                colPedidos.map((pedido) => {
                  const currentStage = getStage(pedido)
                  const stageIdx = STAGE_ORDER.indexOf(currentStage)
                  const totalPagado =
                    pedido.pagos && pedido.pagos.length > 0
                      ? pedido.pagos.reduce((sum, p) => sum + p.monto, 0)
                      : (pedido.señaAdelanto || 0)
                  const isPagado =
                    pedido.estado === 'Cancelado' ||
                    pedido.pagado ||
                    (pedido.pagoTotal !== undefined && pedido.pagoTotal > 0 && totalPagado >= pedido.pagoTotal)

                  return (
                    <div
                      key={pedido.id}
                      className="group rounded-xl border border-[var(--neutral-border-subtle)] bg-[var(--neutral-card)] p-3.5 shadow-2xs hover:border-[var(--neutral-border)] hover:shadow-xs transition-all space-y-3"
                    >
                      {/* Top: Cliente & Contacto */}
                      <div className="min-w-0">
                        <span
                          onClick={() => onViewDetail(pedido)}
                          className="font-semibold text-xs text-[var(--neutral-emphasis)] block truncate hover:text-[var(--neutral-brand)] cursor-pointer transition-colors"
                          title={pedido.cliente}
                        >
                          {pedido.cliente}
                        </span>
                        <span className="text-[11px] text-[var(--neutral-muted)] tabular-nums block truncate">
                          {pedido.contacto || 'Sin contacto'}
                        </span>
                      </div>

                      {/* Data rows: styled like a tiny table */}
                      <div className="space-y-1.5 text-xs">
                        {/* Row: Pago */}
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[var(--neutral-muted)] text-[11px]">Pago:</span>
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium shrink-0 ${
                              isPagado
                                ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                                : 'bg-amber-500/10 text-amber-700 dark:text-amber-400'
                            }`}
                          >
                            {isPagado ? (
                              <CheckCircle2 className="h-3 w-3 stroke-[2]" />
                            ) : (
                              <Clock className="h-3 w-3 stroke-[2]" />
                            )}
                            <span>{isPagado ? 'Pagado' : 'Pendiente'}</span>
                          </span>
                        </div>

                        {/* Row: Pieza(s) */}
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-[var(--neutral-muted)] text-[11px] shrink-0">Pieza(s):</span>
                          <span
                            onClick={() => onViewDetail(pedido)}
                            className="font-medium text-[var(--neutral-emphasis)] text-right truncate cursor-pointer hover:text-[var(--neutral-brand)] transition-colors"
                            title={pedido.pieza}
                          >
                            {pedido.pieza}
                          </span>
                        </div>

                        {/* Row: Tipo trabajo */}
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[var(--neutral-muted)] text-[11px] shrink-0">Tipo trabajo:</span>
                          <span className="font-medium text-[var(--neutral-body)] text-right truncate">
                            {pedido.trabajo}
                          </span>
                        </div>

                        {/* Row: Fecha entrega */}
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[var(--neutral-muted)] text-[11px] shrink-0">Fecha entrega:</span>
                          <span className="inline-flex items-center gap-1 font-medium text-[var(--neutral-emphasis)] tabular-nums">
                            <Calendar className="h-3 w-3 text-[var(--neutral-muted)] shrink-0" />
                            <span>{pedido.fechaEntrega || 'A coordinar'}</span>
                          </span>
                        </div>
                      </div>

                      {/* Bottom row: Actions and stage movement */}
                      <div className="flex items-center justify-between pt-1">
                        {/* Quick actions: Ver detalle & WhatsApp/Mail */}
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => onViewDetail(pedido)}
                            title="Ver detalle del pedido"
                            className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] font-medium text-[var(--neutral-muted)] hover:text-[var(--neutral-emphasis)] hover:bg-[var(--neutral-subtle)] transition-colors cursor-pointer"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            <span>Ver detalle</span>
                          </button>

                          {pedido.contacto?.includes('@') ? (
                            <button
                              type="button"
                              onClick={() => onOpenWhatsApp(pedido)}
                              title="Notificar cliente por correo"
                              className="h-6 w-6 inline-flex items-center justify-center rounded-md text-blue-600 hover:bg-blue-500/10 active:scale-95 transition-all cursor-pointer"
                            >
                              <Mail className="h-3.5 w-3.5" />
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => onOpenWhatsApp(pedido)}
                              title="Notificar cliente por WhatsApp"
                              className="h-6 w-6 inline-flex items-center justify-center rounded-md text-emerald-600 hover:bg-emerald-500/10 active:scale-95 transition-all cursor-pointer"
                            >
                              <MessageCircle className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>

                        {/* Minimal stage transition arrows */}
                        <div className="flex items-center gap-0.5">
                          <button
                            type="button"
                            disabled={stageIdx === 0}
                            onClick={() => handleAdvance(pedido, -1)}
                            className="h-6 w-6 inline-flex items-center justify-center rounded text-[var(--neutral-muted)] hover:text-[var(--neutral-emphasis)] hover:bg-[var(--neutral-subtle)] disabled:opacity-20 disabled:pointer-events-none cursor-pointer transition-colors"
                            title="Mover a etapa anterior"
                          >
                            <ChevronLeft className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            disabled={stageIdx === STAGE_ORDER.length - 1}
                            onClick={() => handleAdvance(pedido, 1)}
                            className="h-6 w-6 inline-flex items-center justify-center rounded text-[var(--neutral-muted)] hover:text-[var(--neutral-emphasis)] hover:bg-[var(--neutral-subtle)] disabled:opacity-20 disabled:pointer-events-none cursor-pointer transition-colors"
                            title="Avanzar etapa"
                          >
                            <ChevronRight className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
