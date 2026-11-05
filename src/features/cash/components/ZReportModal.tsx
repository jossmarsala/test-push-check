import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Printer,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import type { CashRegisterState, CashKpiOverview } from "../types/cash.types";

interface ZReportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  registerState: CashRegisterState;
  kpis: CashKpiOverview;
}

export const ZReportModal: React.FC<ZReportModalProps> = ({
  open,
  onOpenChange,
  registerState,
  kpis,
}) => {
  const handlePrint = () => {
    window.print();
  };

  const diff =
    (registerState.dineroContado || 0) - registerState.dineroEsperado;
  const isExact = Math.abs(diff) < 0.01;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[460px] rounded-[var(--radius-card-lg)] border-[var(--dashboard-card-border)] bg-[var(--neutral-surface)] p-6">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="h-5 w-5 text-amber-500" />
              <DialogTitle className="text-sm font-bold text-[var(--neutral-emphasis)] leading-none">
                Reporte de Cierre de Caja
              </DialogTitle>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--neutral-subtle)] font-semibold text-[var(--neutral-muted)]">
              {new Date().toLocaleDateString("es-AR")}
            </span>
          </div>
          <DialogDescription className="text-xs text-[var(--neutral-muted)] mt-1">
            Comprobante fiscal interno de cierre diario, arqueo físico y balance
            por canales.
          </DialogDescription>
        </DialogHeader>

        {/* Printable Slip */}
        <div className="my-2 p-4 rounded-xl border border-dashed border-[var(--neutral-border)] bg-[var(--neutral-card)] space-y-3 font-mono text-xs">
          {/* Slip Header */}
          <div className="text-center pb-2 border-b border-[var(--neutral-border-subtle)]">
            <span className="font-bold text-sm tracking-wider uppercase text-[var(--neutral-emphasis)] block">
              JOYERÍA GESTIÓN
            </span>
            <span className="text-[10px] text-[var(--neutral-muted)]">
              COMPROBANTE DE ARQUEO • TURNO DIARIO
            </span>
          </div>

          {/* Turn metadata */}
          <div className="space-y-1 text-[11px] pb-2 border-b border-[var(--neutral-border-subtle)]">
            <div className="flex justify-between">
              <span className="text-[var(--neutral-muted)]">Apertura:</span>
              <span className="font-semibold text-[var(--neutral-emphasis)]">
                {registerState.horaApertura} hs (
                {registerState.responsableApertura})
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--neutral-muted)]">Cierre:</span>
              <span className="font-semibold text-[var(--neutral-emphasis)]">
                {registerState.horaCierre ||
                  new Date().toLocaleTimeString("es-AR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}{" "}
                hs
                {registerState.responsableCierre
                  ? ` (${registerState.responsableCierre})`
                  : ""}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--neutral-muted)]">
                Fondo inicial de cambio:
              </span>
              <span className="font-bold text-[var(--neutral-emphasis)]">
                ${registerState.fondoInicial.toLocaleString("es-AR")}
              </span>
            </div>
          </div>

          {/* Channel breakdown */}
          <div className="space-y-1.5 text-[11px] pb-2 border-b border-[var(--neutral-border-subtle)]">
            <span className="text-[10px] uppercase font-bold text-[var(--neutral-muted)] block">
              Ventas por Medio de Cobro:
            </span>
            <div className="flex justify-between">
              <span>• Efectivo en caja:</span>
              <span className="font-bold text-emerald-600">
                ${kpis.ingresosEfectivo.toLocaleString("es-AR")}
              </span>
            </div>
            <div className="flex justify-between">
              <span>• Transferencias bancarias:</span>
              <span className="font-bold text-[var(--neutral-emphasis)]">
                ${kpis.transferenciasTotal.toLocaleString("es-AR")}
              </span>
            </div>
            <div className="flex justify-between">
              <span>• Tarjetas de crédito/débito:</span>
              <span className="font-bold text-[var(--neutral-emphasis)]">
                ${kpis.tarjetasTotal.toLocaleString("es-AR")}
              </span>
            </div>
            <div className="flex justify-between">
              <span>• Egresos / Retiros en efectivo:</span>
              <span className="font-bold text-rose-600">
                -${kpis.egresosEfectivo.toLocaleString("es-AR")}
              </span>
            </div>
          </div>

          {/* Closing totals & difference */}
          <div className="space-y-1 text-xs pt-1">
            <div className="flex justify-between">
              <span className="font-medium text-[var(--neutral-muted)]">
                Efectivo esperado:
              </span>
              <span className="font-bold text-[var(--neutral-emphasis)]">
                ${registerState.dineroEsperado.toLocaleString("es-AR")}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-[var(--neutral-muted)]">
                Efectivo contado:
              </span>
              <span className="font-bold text-[var(--neutral-emphasis)]">
                $
                {(
                  registerState.dineroContado || registerState.dineroEsperado
                ).toLocaleString("es-AR")}
              </span>
            </div>
            <div className="flex justify-between pt-1 border-t border-[var(--neutral-border-subtle)] text-sm">
              <span className="font-bold">Diferencia de arqueo:</span>
              <span
                className={`font-bold flex items-center gap-1 ${isExact ? "text-emerald-600" : diff > 0 ? "text-amber-600" : "text-rose-600"}`}
              >
                {isExact ? (
                  <>
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    $0 (Exacto)
                  </>
                ) : (
                  <>
                    <AlertCircle className="h-3.5 w-3.5" />
                    {diff > 0
                      ? `+$${diff.toLocaleString("es-AR")}`
                      : `-$${Math.abs(diff).toLocaleString("es-AR")}`}
                  </>
                )}
              </span>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-[var(--neutral-border-subtle)]">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="h-9 px-4 rounded-md border border-[var(--neutral-border)] bg-[var(--neutral-surface)] text-xs text-[var(--neutral-muted)] hover:text-[var(--neutral-emphasis)] transition-all cursor-pointer"
          >
            Cerrar
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="h-9 px-4 rounded-md bg-[var(--neutral-brand)] text-xs font-medium text-white hover:bg-[var(--neutral-brand-hover)] active:scale-95 transition-all cursor-pointer shadow-xs flex items-center gap-1.5"
          >
            <Printer className="h-3.5 w-3.5" />
            <span>Imprimir Reporte de Cierre</span>
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
