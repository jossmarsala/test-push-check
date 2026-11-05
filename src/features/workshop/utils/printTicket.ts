import type { Pedido } from '../types/workshop.types'

/**
 * Directly triggers the browser's print window with a formatted workshop envelope ticket.
 * Does not open a new modal or navigate away.
 */
export const printWorkshopTicket = (pedido: Pedido): void => {
  if (!pedido) return

  // Remove any previously injected print iframe
  const existingFrame = document.getElementById('workshop-ticket-print-iframe')
  if (existingFrame) {
    existingFrame.remove()
  }

  const iframe = document.createElement('iframe')
  iframe.id = 'workshop-ticket-print-iframe'
  iframe.style.position = 'fixed'
  iframe.style.right = '0'
  iframe.style.bottom = '0'
  iframe.style.width = '0'
  iframe.style.height = '0'
  iframe.style.border = '0'
  iframe.style.visibility = 'hidden'
  document.body.appendChild(iframe)

  const doc = iframe.contentWindow?.document
  if (!doc) return

  const total = pedido.pagoTotal ?? 0
  const totalAbonado =
    pedido.pagos && pedido.pagos.length > 0
      ? pedido.pagos.reduce((sum, p) => sum + p.monto, 0)
      : (pedido.señaAdelanto ?? 0)
  const saldoPendiente = Math.max(0, total - totalAbonado)

  const ticketHtml = `
    <!DOCTYPE html>
    <html lang="es">
      <head>
        <meta charset="utf-8" />
        <title>Ticket Taller - #PED-${pedido.id.padStart(4, '0')}</title>
        <style>
          @page {
            size: 80mm auto;
            margin: 4mm;
          }
          @media print {
            body {
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
          }
          * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            font-size: 11px;
            color: #111;
            line-height: 1.35;
            background: #fff;
            padding: 8px;
            width: 100%;
            max-width: 80mm;
            margin: 0 auto;
          }
          .ticket-header {
            text-align: center;
            border-bottom: 1.5px dashed #222;
            padding-bottom: 8px;
            margin-bottom: 8px;
          }
          .brand-title {
            font-size: 13px;
            font-weight: 800;
            letter-spacing: 0.05em;
            text-transform: uppercase;
          }
          .ticket-subtitle {
            font-size: 9px;
            text-transform: uppercase;
            letter-spacing: 0.08em;
            color: #666;
            margin-top: 1px;
          }
          .ticket-badge {
            display: inline-block;
            font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
            font-weight: 700;
            font-size: 13px;
            margin-top: 4px;
            padding: 2px 8px;
            background: #f0f0f0;
            border-radius: 4px;
            border: 1px solid #ddd;
          }
          .warranty-pill {
            display: inline-block;
            font-size: 9px;
            font-weight: 700;
            text-transform: uppercase;
            color: #b45309;
            background: #fef3c7;
            padding: 2px 6px;
            border-radius: 4px;
            margin-top: 4px;
          }
          .section {
            padding: 6px 0;
            border-bottom: 1px dashed #ccc;
          }
          .row {
            display: flex;
            justify-content: space-between;
            align-items: baseline;
            margin-bottom: 3px;
          }
          .row:last-child {
            margin-bottom: 0;
          }
          .label {
            font-size: 10px;
            color: #666;
            text-transform: uppercase;
            font-weight: 600;
          }
          .value {
            font-weight: 600;
            text-align: right;
            max-width: 60%;
            word-break: break-word;
          }
          .piece-card {
            background: #f9fafb;
            border: 1px solid #e5e7eb;
            border-radius: 6px;
            padding: 7px;
            margin: 6px 0;
          }
          .piece-title {
            font-size: 12px;
            font-weight: 700;
            color: #111;
          }
          .piece-work {
            display: inline-block;
            font-size: 9px;
            font-weight: 700;
            text-transform: uppercase;
            background: #fff;
            border: 1px solid #d1d5db;
            padding: 1px 5px;
            border-radius: 3px;
            margin-top: 3px;
          }
          .piece-notes {
            font-size: 10px;
            font-style: italic;
            color: #4b5563;
            margin-top: 5px;
            line-height: 1.3;
          }
          .weights-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 4px;
            text-align: center;
            margin-top: 5px;
            background: #f9fafb;
            border: 1px solid #e5e7eb;
            border-radius: 4px;
            padding: 4px;
          }
          .weight-box span {
            display: block;
          }
          .weight-title {
            font-size: 8px;
            text-transform: uppercase;
            color: #6b7280;
          }
          .weight-val {
            font-family: ui-monospace, monospace;
            font-weight: 700;
            font-size: 10px;
            margin-top: 1px;
          }
          .financial-row {
            display: flex;
            justify-content: space-between;
            font-size: 11px;
            margin-bottom: 3px;
          }
          .financial-row:last-child {
            margin-bottom: 0;
          }
          .amount-val {
            font-family: ui-monospace, monospace;
            font-size: 12px;
            font-weight: 700;
          }
          .balance-due {
            font-size: 13px;
            font-weight: 800;
            color: #000;
          }
          .footer {
            text-align: center;
            font-size: 8px;
            color: #9ca3af;
            margin-top: 8px;
            padding-top: 6px;
            letter-spacing: 0.04em;
          }
        </style>
      </head>
      <body>
        <div class="ticket-header">
          <div class="brand-title">EQUA JOYAS & TALLER</div>
          <div class="ticket-subtitle">Control de Banco de Trabajo</div>
          <div class="ticket-badge">#PED-${pedido.id.padStart(4, '0')}</div>
          ${pedido.esGarantia ? '<div class="warranty-pill">Garantía sin cargo</div>' : ''}
        </div>

        <div class="section">
          <div class="row">
            <span class="label">Cliente:</span>
            <span class="value">${pedido.cliente}</span>
          </div>
          ${pedido.contacto ? `
          <div class="row">
            <span class="label">Contacto:</span>
            <span class="value" style="font-family: monospace;">${pedido.contacto}</span>
          </div>` : ''}
          <div class="row">
            <span class="label">Entrega:</span>
            <span class="value">${pedido.fechaEntrega || 'A coordinar'}</span>
          </div>
          <div class="row">
            <span class="label">Orfebre:</span>
            <span class="value">${pedido.orfebre || 'Taller central'}</span>
          </div>
        </div>

        <div class="piece-card">
          <div class="piece-title">${pedido.pieza}</div>
          <div class="piece-work">${pedido.trabajo}</div>
          ${pedido.notas ? `<div class="piece-notes">"${pedido.notas}"</div>` : ''}
        </div>

        <div class="section">
          <div class="row">
            <span class="label">Metal:</span>
            <span class="value">${pedido.metal || 'Plata 925'}</span>
          </div>
          <div class="weights-grid">
            <div class="weight-box">
              <span class="weight-title">Inicial</span>
              <span class="weight-val">${pedido.pesoInicialGramos ? `${pedido.pesoInicialGramos}g` : '-'}</span>
            </div>
            <div class="weight-box">
              <span class="weight-title">Merma</span>
              <span class="weight-val">${pedido.mermaEstimadaGramos ? `${pedido.mermaEstimadaGramos}g` : '-'}</span>
            </div>
            <div class="weight-box">
              <span class="weight-title">Final</span>
              <span class="weight-val">${pedido.pesoFinalGramos ? `${pedido.pesoFinalGramos}g` : '-'}</span>
            </div>
          </div>
        </div>

        <div class="section">
          <div class="financial-row">
            <span>Importe Total:</span>
            <span class="amount-val">$${total.toLocaleString('es-AR')}</span>
          </div>
          <div class="financial-row">
            <span>Abonado / Seña:</span>
            <span class="amount-val">$${totalAbonado.toLocaleString('es-AR')}</span>
          </div>
          <div class="financial-row" style="margin-top: 4px; padding-top: 4px; border-top: 1px dotted #ccc;">
            <span style="font-weight: 700;">Saldo a cobrar:</span>
            <span class="amount-val balance-due">$${saldoPendiente.toLocaleString('es-AR')}</span>
          </div>
        </div>

        <div class="footer">
          Ticket para sobre de taller • Aguamarina Joyas
        </div>
      </body>
    </html>
  `

  doc.open()
  doc.write(ticketHtml)
  doc.close()

  // Allow browser time to parse DOM before opening native print window
  setTimeout(() => {
    try {
      iframe.contentWindow?.focus()
      iframe.contentWindow?.print()
    } catch {
      // Fallback to window.print() if iframe print is restricted
      window.print()
    }
  }, 100)
}
