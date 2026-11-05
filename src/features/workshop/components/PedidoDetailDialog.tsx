import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Printer,
  MessageCircle,
  Mail,
  DollarSign,
  Calendar,
  Camera,
  X,
  RotateCcw,
} from 'lucide-react'
import type { Pedido, PedidoKanbanStage } from '../types/workshop.types'
import { printWorkshopTicket } from '../utils/printTicket'

interface PedidoDetailDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  pedido: Pedido | null
  onPrintTicket?: (pedido: Pedido) => void
  onRegistrarPago?: (pedido: Pedido) => void
  onOpenWhatsApp?: (pedido: Pedido) => void
  onReingresoGarantia?: (pedido: Pedido) => void
}

const KANBAN_STAGE_LABELS: Record<PedidoKanbanStage, string> = {
  en_espera: 'En espera',
  en_taller: 'En taller',
  listo_para_entrega: 'Listo para entrega',
  entregado: 'Entregado',
}

export const PedidoDetailDialog: React.FC<PedidoDetailDialogProps> = ({
  open,
  onOpenChange,
  pedido,
  onPrintTicket,
  onRegistrarPago,
  onOpenWhatsApp,
  onReingresoGarantia,
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [failedImages, setFailedImages] = useState<Record<number, boolean>>({})

  if (!pedido) return null

  const total = pedido.pagoTotal ?? 0
  const totalAbonado =
    pedido.pagos && pedido.pagos.length > 0
      ? pedido.pagos.reduce((sum, p) => sum + p.monto, 0)
      : (pedido.señaAdelanto ?? 0)
  const saldoPendiente = Math.max(0, total - totalAbonado)
  const isCancelado = pedido.estado === 'Cancelado' || pedido.pagado || (total > 0 && totalAbonado >= total)

  const stageKey: PedidoKanbanStage = pedido.kanbanStage || 'en_espera'
  const stageLabel = KANBAN_STAGE_LABELS[stageKey] || 'En espera'

  const handleWhatsApp = () => {
    if (onOpenWhatsApp) {
      onOpenWhatsApp(pedido)
    }
  }

  const handlePrint = () => {
    printWorkshopTicket(pedido)
    if (onPrintTicket) {
      onPrintTicket(pedido)
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-[700px] sm:max-w-[720px] w-full max-h-[90vh] overflow-y-auto rounded-[var(--radius-card-lg)] border border-[var(--neutral-border-subtle)] bg-[var(--neutral-surface)] p-6 sm:p-7 shadow-xl">
          {/* Header */}
          <DialogHeader className="pb-3 border-b border-[var(--neutral-border-subtle)]/70">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <DialogTitle className="text-base sm:text-lg font-semibold text-[var(--neutral-emphasis)] leading-snug">
                  {pedido.pieza}
                </DialogTitle>
                <span className="font-mono text-xs text-[var(--neutral-muted)] bg-[var(--neutral-subtle)]/70 px-2 py-0.5 rounded">
                  #PED-{pedido.id.padStart(4, '0')}
                </span>
              </div>
              {pedido.esGarantia && (
                <span className="text-[11px] font-medium text-amber-700 dark:text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded">
                  Garantía sin cargo
                </span>
              )}
            </div>
            <DialogDescription className="sr-only">
              Detalle del pedido #PED-{pedido.id.padStart(4, '0')}
            </DialogDescription>
          </DialogHeader>

          {/* Minimal 2-Column Balanced Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 text-xs">
            {/* Left Column: Ficha del pedido, Observaciones & Fotos */}
            <div className="space-y-4">
              {/* Clean Information List */}
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--neutral-muted)] block mb-2">
                  Ficha del pedido
                </span>
                <div className="divide-y divide-[var(--neutral-border-subtle)]/60 text-xs">
                  {/* Row 1: Cliente & Contacto */}
                  <div className="flex items-center justify-between py-2">
                    <span className="text-[var(--neutral-muted)]">Cliente:</span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-[var(--neutral-emphasis)]">
                        {pedido.cliente}
                      </span>
                      {pedido.contacto && (
                        <span className="font-mono text-[11px] text-[var(--neutral-muted)]">
                          ({pedido.contacto})
                        </span>
                      )}
                      {pedido.contacto && (
                        pedido.contacto.includes('@') ? (
                          <button
                            type="button"
                            onClick={handleWhatsApp}
                            title="Notificar por correo"
                            className="p-1 rounded text-blue-600 hover:bg-blue-500/10 active:scale-95 transition-all cursor-pointer"
                          >
                            <Mail className="h-3.5 w-3.5" />
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={handleWhatsApp}
                            title="Notificar por WhatsApp"
                            className="p-1 rounded text-emerald-600 hover:bg-emerald-500/10 active:scale-95 transition-all cursor-pointer"
                          >
                            <MessageCircle className="h-3.5 w-3.5" />
                          </button>
                        )
                      )}
                    </div>
                  </div>

                  {/* Row 2: Orfebre a cargo */}
                  <div className="flex items-center justify-between py-2">
                    <span className="text-[var(--neutral-muted)]">Orfebre:</span>
                    <span className="text-[var(--neutral-emphasis)] font-medium">
                      {pedido.orfebre || 'Taller central'}
                    </span>
                  </div>

                  {/* Row 3: Tipo de trabajo */}
                  <div className="flex items-center justify-between py-2">
                    <span className="text-[var(--neutral-muted)]">Tipo de trabajo:</span>
                    <span className="text-[var(--neutral-emphasis)] font-medium">
                      {pedido.trabajo}
                    </span>
                  </div>

                  {/* Row 4: Etapa */}
                  <div className="flex items-center justify-between py-2">
                    <span className="text-[var(--neutral-muted)]">Etapa:</span>
                    <span className="text-[var(--neutral-emphasis)] font-medium">
                      {stageLabel}
                    </span>
                  </div>

                  {/* Row 5: Estado de pago */}
                  <div className="flex items-center justify-between py-2">
                    <span className="text-[var(--neutral-muted)]">Estado:</span>
                    <span className={`font-medium ${isCancelado ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : 'text-amber-600 dark:text-amber-400'}`}>
                      {isCancelado ? 'Cancelado' : 'Pendiente'}
                    </span>
                  </div>

                  {/* Row 6: Fecha de entrega */}
                  <div className="flex items-center justify-between py-2">
                    <span className="text-[var(--neutral-muted)]">Fecha de entrega:</span>
                    <span className="font-mono font-medium text-[var(--neutral-emphasis)] flex items-center gap-1.5">
                      <Calendar className="h-3 w-3 text-[var(--neutral-muted)]" />
                      <span>{pedido.fechaEntrega || 'A coordinar'}</span>
                    </span>
                  </div>

                  {/* Row 7: Observaciones */}
                  {pedido.notas && (
                    <div className="flex items-start justify-between py-2 gap-4">
                      <span className="text-[var(--neutral-muted)] shrink-0">Observaciones:</span>
                      <span className="font-medium text-[var(--neutral-emphasis)] text-right">
                        {pedido.notas}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Fotografías de recepción (Estado inicial) */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--neutral-muted)] flex items-center gap-1.5">
                    <Camera className="h-3.5 w-3.5 text-[var(--neutral-muted)]" />
                    <span>Estado inicial de la pieza</span>
                  </span>
                </div>

                {pedido.imagenes && pedido.imagenes.length > 0 ? (
                  <div className="grid grid-cols-3 gap-2">
                    {pedido.imagenes.map((imgUrl, idx) => (
                      <div
                        key={idx}
                        onClick={() => !failedImages[idx] && setSelectedImage(imgUrl)}
                        className={`group relative h-20 rounded-lg overflow-hidden border border-[var(--neutral-border-subtle)] bg-[var(--neutral-subtle)]/40 ${failedImages[idx] ? 'cursor-default' : 'cursor-pointer'}`}
                        title={failedImages[idx] ? undefined : 'Ampliar foto'}
                      >
                        {failedImages[idx] ? (
                          <div className="h-full w-full flex flex-col items-center justify-center p-2 text-center text-[var(--neutral-muted)]">
                            <Camera className="h-4 w-4 mb-0.5 opacity-60" />
                            <span className="text-[9px] font-mono">Foto {idx + 1}</span>
                          </div>
                        ) : (
                          <img
                            src={imgUrl}
                            alt={`Estado inicial ${idx + 1}`}
                            onError={() => setFailedImages((prev) => ({ ...prev, [idx]: true }))}
                            className="h-full w-full object-cover transition-opacity group-hover:opacity-85"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[11px] text-[var(--neutral-muted)] italic py-0.5">
                    Sin fotografías registradas.
                  </p>
                )}
              </div>
            </div>

            {/* Right Column: Financial Summary & Payments Breakdown */}
            <div className="space-y-4">
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--neutral-muted)] block mb-2">
                  Balance financiero
                </span>

                {/* Minimal 3-way Balance Breakdown */}
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="rounded-lg bg-[var(--neutral-subtle)]/40 border border-[var(--neutral-border-subtle)]/60 p-2.5">
                    <span className="text-[10px] text-[var(--neutral-muted)] block">Total</span>
                    <span className="font-mono font-semibold text-xs text-[var(--neutral-emphasis)]">
                      ${total.toLocaleString('es-AR')}
                    </span>
                  </div>
                  <div className="rounded-lg bg-[var(--neutral-subtle)]/40 border border-[var(--neutral-border-subtle)]/60 p-2.5">
                    <span className="text-[10px] text-[var(--neutral-muted)] block">Abonado</span>
                    <span className="font-mono font-semibold text-xs text-[var(--neutral-emphasis)]">
                      ${totalAbonado.toLocaleString('es-AR')}
                    </span>
                  </div>
                  <div className="rounded-lg bg-[var(--neutral-subtle)]/40 border border-[var(--neutral-border-subtle)]/60 p-2.5">
                    <span className="text-[10px] text-[var(--neutral-muted)] block">Saldo</span>
                    <span className={`font-mono font-semibold text-xs ${saldoPendiente === 0 ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-amber-600 dark:text-amber-400'}`}>
                      ${saldoPendiente.toLocaleString('es-AR')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Payments List */}
              <div className="space-y-2">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--neutral-muted)] block">
                  Historial de pagos
                </span>

                {pedido.pagos && pedido.pagos.length > 0 ? (
                  <div className="rounded-lg border border-[var(--neutral-border-subtle)] divide-y divide-[var(--neutral-border-subtle)]/60 overflow-hidden bg-[var(--neutral-surface)]">
                    {pedido.pagos.map((pago, index) => (
                      <div
                        key={pago.id || index}
                        className="flex items-center justify-between p-2.5 text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-[var(--neutral-emphasis)]">
                            {pago.metodo}
                          </span>
                          <span className="text-[10px] text-[var(--neutral-muted)] font-mono">
                            • {pago.fecha}
                          </span>
                        </div>
                        <span className="font-mono font-semibold text-[var(--neutral-emphasis)]">
                          +${pago.monto.toLocaleString('es-AR')}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-lg border border-dashed border-[var(--neutral-border-subtle)] p-3 text-center text-[11px] text-[var(--neutral-muted)] italic">
                    {totalAbonado > 0
                      ? `Seña inicial registrada: $${totalAbonado.toLocaleString('es-AR')}`
                      : 'Sin pagos registrados aún.'}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-4 border-t border-[var(--neutral-border-subtle)]/70 mt-4">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrint}
                className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-[var(--neutral-border)] px-3 text-xs font-medium text-[var(--neutral-body)] hover:text-[var(--neutral-emphasis)] hover:bg-[var(--neutral-subtle)] transition-colors cursor-pointer"
                title="Imprimir ticket para sobre de taller"
              >
                <Printer className="h-3.5 w-3.5 text-[var(--neutral-muted)]" />
                <span>Imprimir ticket</span>
              </button>

              {onReingresoGarantia && !pedido.esGarantia && (
                <button
                  type="button"
                  onClick={() => {
                    onOpenChange(false)
                    onReingresoGarantia(pedido)
                  }}
                  className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-[var(--neutral-border)] px-3 text-xs font-medium text-[var(--neutral-muted)] hover:text-[var(--neutral-emphasis)] hover:bg-[var(--neutral-subtle)] transition-colors cursor-pointer"
                  title="Registrar reingreso al taller por garantía"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Reingreso por garantía</span>
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              {onRegistrarPago && !isCancelado && saldoPendiente > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    onOpenChange(false)
                    onRegistrarPago(pedido)
                  }}
                  className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-[var(--neutral-brand)] text-white px-3.5 text-xs font-medium hover:bg-[var(--neutral-brand-hover)] active:scale-95 transition-all cursor-pointer shadow-2xs"
                >
                  <DollarSign className="h-3.5 w-3.5" />
                  <span>Registrar pago</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="inline-flex h-8 items-center rounded-lg border border-[var(--neutral-border)] px-3.5 text-xs font-medium text-[var(--neutral-body)] hover:text-[var(--neutral-emphasis)] hover:bg-[var(--neutral-subtle)] transition-colors cursor-pointer"
              >
                Cerrar
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Enlarged Image Lightbox Modal */}
      {selectedImage && (
        <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
          <DialogContent
            showCloseButton={false}
            className="max-w-[640px] p-2 bg-black/90 border-neutral-800 text-white flex flex-col items-center justify-center"
          >
            <DialogTitle className="sr-only">Vista previa de imagen</DialogTitle>
            <DialogDescription className="sr-only">
              Fotografía ampliada del pedido
            </DialogDescription>
            <div className="relative w-full max-h-[80vh] flex items-center justify-center overflow-hidden rounded-lg">
              <img
                src={selectedImage}
                alt="Estado inicial ampliado"
                className="max-h-[75vh] w-auto max-w-full object-contain rounded"
              />
              <button
                type="button"
                onClick={() => setSelectedImage(null)}
                className="absolute top-2 right-2 p-1.5 rounded-full bg-black/70 text-white hover:bg-black transition-colors cursor-pointer"
                title="Cerrar vista previa"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}
