import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { MessageCircle, Mail, Send, ExternalLink } from 'lucide-react'
import type { Pedido, PedidoKanbanStage } from '../types/workshop.types'

interface WhatsAppTemplateModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  pedido: Pedido | null
}

const KANBAN_STAGE_LABELS: Record<PedidoKanbanStage, string> = {
  en_espera: 'En espera',
  en_taller: 'En taller',
  listo_para_entrega: 'Listo para entrega',
  entregado: 'Entregado',
}

export const getWhatsAppMessageForPedido = (pedido: Pedido, stageOverride?: PedidoKanbanStage): string => {
  const stage = stageOverride || pedido.kanbanStage || 'en_espera'
  const total = pedido.pagoTotal || 0
  const totalAbonado =
    pedido.pagos && pedido.pagos.length > 0
      ? pedido.pagos.reduce((sum, p) => sum + p.monto, 0)
      : (pedido.señaAdelanto || 0)
  const saldoPendiente = pedido.esGarantia ? 0 : Math.max(0, total - totalAbonado)

  if (pedido.esGarantia) {
    switch (stage) {
      case 'en_espera':
        return `¡Hola ${pedido.cliente}! Te escribimos de EQUA Joyas. El reingreso por garantía de tu "${pedido.pieza}" (Ref #${pedido.pedidoOriginalId || ''}) ha sido recibido en el taller sin ningún costo adicional.`
      case 'en_taller':
        return `¡Hola ${pedido.cliente}! Te informamos que tu "${pedido.pieza}" ya se encuentra en el banco de trabajo de nuestro orfebre para su revisión y ajuste por garantía (sin cargo).`
      case 'listo_para_entrega':
        return `¡Hola ${pedido.cliente}! Te avisamos que el trabajo de garantía de tu "${pedido.pieza}" ya está completamente terminado en el taller. Podés pasar a retirarlo cuando gustes. ¡Total a abonar: $0!`
      case 'entregado':
        return `¡Hola ${pedido.cliente}! Gracias por retirar tu "${pedido.pieza}". El ajuste por garantía ha sido completado. ¡Esperamos que lo disfrutes y quedamos a tu disposición!`
      default:
        return `¡Hola ${pedido.cliente}! Te escribimos de EQUA Joyas sobre el reingreso por garantía de tu "${pedido.pieza}".`
    }
  }

  switch (stage) {
    case 'en_espera':
      return `¡Hola ${pedido.cliente}! Te escribimos de EQUA Joyas. Tu pedido de "${pedido.pieza}" (${pedido.trabajo}) ha sido recibido correctamente en el sistema y se encuentra en espera para ingresar al taller.`

    case 'en_taller':
      return `¡Hola ${pedido.cliente}! Te contamos que tu "${pedido.pieza}" ya ingresó a nuestro taller y se encuentra en proceso de ${pedido.trabajo.toLowerCase()}. Te mantendremos al tanto de cada avance.`

    case 'listo_para_entrega': {
      const saldoText =
        saldoPendiente > 0
          ? ` Saldo pendiente a abonar al retirar: $${saldoPendiente.toLocaleString('es-AR')}.`
          : ' El pedido se encuentra 100% saldado.'
      return `¡Hola ${pedido.cliente}! Te avisamos que tu "${pedido.pieza}" (${pedido.trabajo}) ya se encuentra lista y terminada en el taller. Podés pasar a retirarla en nuestros horarios de atención.${saldoText}`
    }

    case 'entregado':
      return `¡Hola ${pedido.cliente}! Muchas gracias por retirar tu "${pedido.pieza}" en EQUA Joyas. Esperamos que disfrutes el trabajo terminado. ¡Quedamos a tu entera disposición!`

    default:
      return `¡Hola ${pedido.cliente}! Te escribimos del taller EQUA Joyas sobre tu pedido de "${pedido.pieza}".`
  }
}

export const WhatsAppTemplateModal: React.FC<WhatsAppTemplateModalProps> = ({
  open,
  onOpenChange,
  pedido,
}) => {
  if (!pedido) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <WhatsAppTemplateModalInner
        key={`${pedido.id}-${pedido.kanbanStage}`}
        pedido={pedido}
        onClose={() => onOpenChange(false)}
      />
    </Dialog>
  )
}

const WhatsAppTemplateModalInner: React.FC<{
  pedido: Pedido
  onClose: () => void
}> = ({ pedido, onClose }) => {
  const currentStage: PedidoKanbanStage = pedido.kanbanStage || 'en_espera'
  const stageLabel = KANBAN_STAGE_LABELS[currentStage] || 'En espera'

  const rawContact = pedido.contacto?.trim() || ''
  const isEmail = rawContact.includes('@')
  const [channel, setChannel] = useState<'whatsapp' | 'email'>(isEmail ? 'email' : 'whatsapp')
  const [customText, setCustomText] = useState<string>(() =>
    getWhatsAppMessageForPedido(pedido, currentStage)
  )

  const handleSend = () => {
    if (channel === 'email') {
      const emailRecipient = isEmail ? rawContact : ''
      const subject = encodeURIComponent(`Actualización de tu pedido en EQUA Joyas: ${pedido.pieza}`)
      const body = encodeURIComponent(customText)
      const mailtoUrl = emailRecipient
        ? `mailto:${emailRecipient}?subject=${subject}&body=${body}`
        : `mailto:?subject=${subject}&body=${body}`
      window.open(mailtoUrl, '_blank')
    } else {
      const phoneDigits = rawContact.replace(/[^0-9]/g, '')
      const encoded = encodeURIComponent(customText)
      const waUrl = phoneDigits
        ? `https://wa.me/${phoneDigits}?text=${encoded}`
        : `https://wa.me/?text=${encoded}`
      window.open(waUrl, '_blank')
    }
    onClose()
  }

  return (
    <DialogContent className="max-w-[480px] rounded-[var(--radius-card-lg)] border-[var(--dashboard-card-border)] bg-[var(--neutral-surface)] p-6 shadow-xl">
      <DialogHeader>
        <div className="flex items-center gap-2.5">
          <div
            className={`flex h-9 w-9 items-center justify-center rounded-lg ${
              channel === 'email'
                ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
            }`}
          >
            {channel === 'email' ? (
              <Mail className="h-5 w-5" />
            ) : (
              <MessageCircle className="h-5 w-5" />
            )}
          </div>
          <div>
            <DialogTitle className="text-base font-bold text-[var(--neutral-emphasis)] leading-none">
              Notificar al cliente
            </DialogTitle>
            <DialogDescription className="text-xs text-[var(--neutral-muted)] mt-1">
              Cliente: <strong className="text-[var(--neutral-emphasis)]">{pedido.cliente}</strong> • {pedido.pieza}
            </DialogDescription>
          </div>
        </div>
      </DialogHeader>

      <div className="space-y-3.5 pt-2 text-xs">
        {/* Channel Switcher: WhatsApp or Email */}
        <div className="flex items-center justify-between pb-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--neutral-muted)]">
            Canal de envío:
          </span>
          <div className="inline-flex items-center p-0.5 rounded-lg bg-[var(--neutral-subtle)] border border-[var(--neutral-border-subtle)]">
            <button
              type="button"
              onClick={() => setChannel('whatsapp')}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all cursor-pointer ${
                channel === 'whatsapp'
                  ? 'bg-[var(--neutral-card)] text-emerald-700 dark:text-emerald-400 shadow-2xs font-semibold'
                  : 'text-[var(--neutral-muted)] hover:text-[var(--neutral-emphasis)]'
              }`}
            >
              <MessageCircle className="h-3.5 w-3.5" />
              <span>WhatsApp</span>
            </button>
            <button
              type="button"
              onClick={() => setChannel('email')}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all cursor-pointer ${
                channel === 'email'
                  ? 'bg-[var(--neutral-card)] text-blue-700 dark:text-blue-400 shadow-2xs font-semibold'
                  : 'text-[var(--neutral-muted)] hover:text-[var(--neutral-emphasis)]'
              }`}
            >
              <Mail className="h-3.5 w-3.5" />
              <span>Correo</span>
            </button>
          </div>
        </div>

        {/* Message for Current State */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-[var(--neutral-emphasis)] block">
              Mensaje según estado actual:
            </label>
            <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-[var(--neutral-subtle)] border border-[var(--neutral-border-subtle)] text-[var(--neutral-muted)]">
              {stageLabel}
            </span>
          </div>

          <textarea
            rows={5}
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            className="w-full rounded-lg border border-[var(--neutral-border)] bg-[var(--neutral-card)] p-3 text-xs text-[var(--neutral-emphasis)] focus:outline-none focus:ring-1 focus:ring-[var(--neutral-brand)] resize-none leading-relaxed"
          />
        </div>

        {/* Destination Contact details */}
        <div className="flex items-center justify-between p-2.5 rounded-lg bg-[var(--neutral-subtle)]/60 border border-[var(--neutral-border-subtle)]">
          <div className="flex items-center gap-2">
            {channel === 'email' ? (
              <Mail className="h-4 w-4 text-[var(--neutral-muted)] shrink-0" />
            ) : (
              <MessageCircle className="h-4 w-4 text-[var(--neutral-muted)] shrink-0" />
            )}
            <span className="text-[var(--neutral-muted)]">
              {channel === 'email' ? 'Destinatario de correo:' : 'Número de WhatsApp:'}
            </span>
          </div>
          <span className="font-mono font-semibold text-[var(--neutral-emphasis)] truncate max-w-[200px]">
            {rawContact || (channel === 'email' ? 'A definir al abrir correo' : 'A definir al abrir WhatsApp')}
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-[var(--neutral-border-subtle)]">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 items-center justify-center rounded-lg border border-[var(--neutral-border)] bg-[var(--neutral-surface)] px-4 text-xs font-medium text-[var(--neutral-muted)] hover:text-[var(--neutral-emphasis)] hover:bg-[var(--neutral-subtle)] transition-all cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSend}
            className={`inline-flex h-9 items-center justify-center gap-1.5 rounded-lg px-4 text-xs font-medium text-white active:scale-95 transition-all cursor-pointer shadow-xs ${
              channel === 'email'
                ? 'bg-blue-600 hover:bg-blue-700'
                : 'bg-emerald-600 hover:bg-emerald-700'
            }`}
          >
            {channel === 'email' ? (
              <>
                <Mail className="h-3.5 w-3.5" />
                <span>Abrir Correo</span>
              </>
            ) : (
              <>
                <Send className="h-3.5 w-3.5" />
                <span>Enviar por WhatsApp</span>
              </>
            )}
            <ExternalLink className="h-3 w-3 opacity-70 ml-0.5" />
          </button>
        </div>
      </div>
    </DialogContent>
  )
}
