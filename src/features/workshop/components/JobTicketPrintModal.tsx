import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Printer, QrCode, Tag, Weight, Sparkles } from "lucide-react";
import type { Pedido } from "../types/workshop.types";

interface JobTicketPrintModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pedido: Pedido | null;
}

export const JobTicketPrintModal: React.FC<JobTicketPrintModalProps> = ({
  open,
  onOpenChange,
  pedido,
}) => {
  if (!pedido) return null;

  const handlePrint = () => {
    window.print();
  };

  const saldoPendiente = Math.max(
    0,
    (pedido.pagoTotal || 0) - (pedido.señaAdelanto || 0),
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[420px] rounded-[var(--radius-card-lg)] border-[var(--dashboard-card-border)] bg-[var(--neutral-surface)] p-6">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-sm font-bold text-[var(--neutral-emphasis)] leading-none">
              Recibo de Taller / Sobre de Pieza
            </DialogTitle>
            <span className="text-[10px] font-mono font-semibold bg-[var(--neutral-subtle)] px-2 py-0.5 rounded text-[var(--neutral-muted)]">
              #PED-{pedido.id.padStart(4, "0")}
            </span>
          </div>
          <DialogDescription className="text-xs text-[var(--neutral-muted)] mt-1">
            Etiqueta imprimible para adjuntar a la bolsita hermética en el banco
            de trabajo.
          </DialogDescription>
        </DialogHeader>

        {/* The Printable Envelope Slip Card */}
        <div className="my-3 p-4 rounded-xl border border-dashed border-[var(--neutral-border)] bg-amber-50/20 dark:bg-amber-950/10 space-y-3 font-sans text-xs">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[var(--neutral-border-subtle)] pb-2.5">
            <div>
              <span className="text-[11px] font-bold tracking-wider uppercase text-[var(--neutral-emphasis)] block">
                EQUA JOYAS & TALLER
              </span>
              <span className="text-[10px] text-[var(--neutral-muted)]">
                Control de Banco de Trabajo
              </span>
            </div>
            <div className="h-10 w-10 border border-[var(--neutral-border)] bg-white dark:bg-black rounded flex items-center justify-center text-[var(--neutral-emphasis)]">
              <QrCode className="h-7 w-7 stroke-[1.5]" />
            </div>
          </div>

          {pedido.esGarantia && (
            <div className="flex items-center justify-between text-[11px] py-1 px-2 rounded bg-[var(--neutral-subtle)] border border-[var(--neutral-border-subtle)] text-[var(--neutral-muted)]">
              <span className="font-medium text-[var(--neutral-emphasis)]">
                Garantía sin cargo
              </span>
              {pedido.pedidoOriginalId && (
                <span className="font-mono text-[10px]">
                  Ref #{pedido.pedidoOriginalId.padStart(4, "0")}
                </span>
              )}
            </div>
          )}

          {/* Client & Piece info */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-[10px] uppercase font-semibold text-[var(--neutral-muted)] block">
                Cliente:
              </span>
              <span className="font-bold text-[var(--neutral-emphasis)] truncate block">
                {pedido.cliente}
              </span>
              <span className="text-[10px] text-[var(--neutral-muted)] font-mono">
                {pedido.contacto || "Sin contacto"}
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-semibold text-[var(--neutral-muted)] block">
                Entrega estimada:
              </span>
              <span className="font-semibold text-rose-600 dark:text-rose-400 font-mono block">
                {pedido.fechaEntrega || "A coordinar"}
              </span>
              <span className="text-[10px] text-[var(--neutral-muted)]">
                Orfebre: {pedido.orfebre || "Taller central"}
              </span>
            </div>
          </div>

          {/* Piece & Job */}
          <div className="p-2.5 rounded-lg bg-[var(--neutral-subtle)]/70 space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-[var(--neutral-emphasis)] flex items-center gap-1">
                <Tag className="h-3 w-3 text-amber-500" />
                {pedido.pieza}
              </span>
              <span className="text-[10px] uppercase font-bold text-[var(--neutral-body)] bg-[var(--neutral-card)] px-1.5 py-0.5 rounded border border-[var(--neutral-border-subtle)]">
                {pedido.trabajo}
              </span>
            </div>
            {pedido.notas && (
              <p className="text-[11px] text-[var(--neutral-muted)] italic leading-tight">
                "{pedido.notas}"
              </p>
            )}
          </div>

          {/* Metal & Weight Tracking Section */}
          <div className="rounded-lg border border-[var(--neutral-border-subtle)] p-2.5 bg-[var(--neutral-card)] space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-semibold text-[var(--neutral-emphasis)]">
              <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
                <Sparkles className="h-3 w-3" />
                Metal: {pedido.metal || "Plata 925"}
              </span>
              <span className="flex items-center gap-1 text-[var(--neutral-muted)]">
                <Weight className="h-3 w-3" />
                Balanza
              </span>
            </div>
            <div className="grid grid-cols-3 gap-1.5 text-center text-[10px] pt-1 border-t border-[var(--neutral-border-subtle)]">
              <div className="bg-[var(--neutral-subtle)]/60 p-1.5 rounded">
                <span className="text-[var(--neutral-muted)] block">
                  Peso Inicial
                </span>
                <span className="font-mono font-bold text-[var(--neutral-emphasis)]">
                  {pedido.pesoInicialGramos
                    ? `${pedido.pesoInicialGramos}g`
                    : "4.20g"}
                </span>
              </div>
              <div className="bg-[var(--neutral-subtle)]/60 p-1.5 rounded">
                <span className="text-[var(--neutral-muted)] block">
                  Merma Est.
                </span>
                <span className="font-mono font-bold text-amber-600 dark:text-amber-400">
                  {pedido.mermaEstimadaGramos
                    ? `${pedido.mermaEstimadaGramos}g`
                    : "0.35g"}
                </span>
              </div>
              <div className="bg-[var(--neutral-subtle)]/60 p-1.5 rounded">
                <span className="text-[var(--neutral-muted)] block">
                  Peso Final
                </span>
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                  {pedido.pesoFinalGramos
                    ? `${pedido.pesoFinalGramos}g`
                    : "3.85g"}
                </span>
              </div>
            </div>
          </div>

          {/* Financials & Balances */}
          <div className="flex items-center justify-between text-xs pt-1 border-t border-[var(--neutral-border-subtle)] font-mono">
            <div>
              <span className="text-[10px] text-[var(--neutral-muted)] block">
                {pedido.esGarantia ? "Condición:" : "Seña recibida:"}
              </span>
              <span className="font-semibold text-[var(--neutral-emphasis)]">
                {pedido.esGarantia
                  ? "Garantía"
                  : `$${(pedido.señaAdelanto || 0).toLocaleString("es-AR")}`}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-[var(--neutral-muted)] block">
                Saldo al retirar:
              </span>
              <span className="font-bold text-sm text-[var(--neutral-emphasis)]">
                {pedido.esGarantia
                  ? "$0"
                  : `$${saldoPendiente.toLocaleString("es-AR")}`}
              </span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-[var(--neutral-border-subtle)]">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="inline-flex h-9 items-center justify-center rounded-[var(--dashboard-btn-radius)] border border-[var(--neutral-border)] bg-[var(--neutral-surface)] px-4 text-xs font-medium text-[var(--neutral-muted)] hover:text-[var(--neutral-emphasis)] hover:bg-[var(--neutral-subtle)] transition-all cursor-pointer"
          >
            Cerrar
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex h-9 items-center justify-center gap-1.5 rounded-[var(--dashboard-btn-radius)] bg-[var(--pedidos-badge-bg)] px-4 text-xs font-medium text-[var(--pedidos-badge-fg)] hover:opacity-90 active:scale-95 transition-all cursor-pointer shadow-xs"
          >
            <Printer className="h-3.5 w-3.5" />
            <span>Imprimir Etiqueta</span>
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
