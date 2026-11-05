import React, { useState } from "react";
import { Check } from "@animateicons/react/lucide";
import { Sparkles, Building2, Calendar, Pencil, Plus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  EXPENSE_CATEGORIES,
  EXPENSE_PAYMENT_METHODS,
  type ExpenseCategory,
  type ExpensePaymentMethod,
  type ExpenseTemplate,
  type NewExpenseFormData,
} from "../types/expenses.types";
import { ExpenseTemplatesDialog } from "./ExpenseTemplatesDialog";

interface NewExpenseFormCardProps {
  onSubmit: (formData: NewExpenseFormData) => void;
  onCancel?: () => void;
}

const TEMPLATES_STORAGE_KEY = "equa_expense_templates_v2";

const loadInitialTemplates = (): ExpenseTemplate[] => {
  try {
    const saved = localStorage.getItem(TEMPLATES_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn("Failed to parse saved expense templates:", err);
  }
  return [];
};

const getTodayDateString = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const getYesterdayDateString = () => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const getCurrentTimeString = () => {
  return new Date().toLocaleTimeString("es-AR", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const NewExpenseFormCard: React.FC<NewExpenseFormCardProps> = ({
  onSubmit,
  onCancel,
}) => {
  const [descripcion, setDescripcion] = useState("");
  const [monto, setMonto] = useState("");
  const [categoria, setCategoria] = useState<ExpenseCategory>("Servicios");
  const [medioPago, setMedioPago] = useState<ExpensePaymentMethod>("Efectivo");
  const [fecha, setFecha] = useState(getTodayDateString);
  const [proveedor, setProveedor] = useState("");
  const [esRecurrente, setEsRecurrente] = useState(false);

  // Templates state & dialog management
  const [templates, setTemplates] =
    useState<ExpenseTemplate[]>(loadInitialTemplates);
  const [isTemplatesDialogOpen, setIsTemplatesDialogOpen] = useState(false);
  const [templateToEdit, setTemplateToEdit] = useState<ExpenseTemplate | null>(
    null,
  );

  const handleSaveTemplates = (newTemplates: ExpenseTemplate[]) => {
    setTemplates(newTemplates);
    try {
      localStorage.setItem(TEMPLATES_STORAGE_KEY, JSON.stringify(newTemplates));
    } catch (err) {
      console.warn("Failed to save expense templates:", err);
    }
  };

  const handleApplyTemplate = (tpl: ExpenseTemplate) => {
    setDescripcion(tpl.desc);
    setMonto(tpl.amount.toString());
    setCategoria(tpl.cat);
    setMedioPago(tpl.payment);
    setProveedor(tpl.supplier || "");
    setEsRecurrente(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!descripcion.trim() || !monto) return;

    const parsedMonto = parseFloat(monto);
    if (isNaN(parsedMonto) || parsedMonto <= 0) return;

    const isToday = fecha === getTodayDateString();
    const isYesterday = fecha === getYesterdayDateString();

    let displayFecha = "Hoy";
    let displayFechaCompleta = new Date().toLocaleDateString("es-AR");

    if (fecha) {
      const [y, m, d] = fecha.split("-").map(Number);
      const dateObj = new Date(y, m - 1, d);
      if (isToday) {
        displayFecha = "Hoy";
        displayFechaCompleta = dateObj.toLocaleDateString("es-AR");
      } else if (isYesterday) {
        displayFecha = "Ayer";
        displayFechaCompleta = dateObj.toLocaleDateString("es-AR");
      } else {
        displayFecha = dateObj.toLocaleDateString("es-AR", {
          day: "numeric",
          month: "short",
        });
        displayFechaCompleta = dateObj.toLocaleDateString("es-AR");
      }
    }

    const currentHora = getCurrentTimeString();

    onSubmit({
      descripcion: descripcion.trim(),
      monto: parsedMonto,
      categoria,
      medioPago,
      proveedor: proveedor.trim() || undefined,
      esRecurrente,
      fecha: displayFecha,
      fechaCompleta: displayFechaCompleta,
      hora: currentHora,
      notas: `Registrado el ${displayFechaCompleta}${esRecurrente ? " • Gasto recurrente mensual" : ""}`,
    });
  };

  return (
    <div className="rounded-[var(--radius-card)] border border-[var(--neutral-border)] bg-[var(--neutral-card)] p-5 sm:p-6 shadow-sm">
      {/* Header title */}
      <div className="mb-3">
        <h2 className="text-base sm:text-lg font-semibold tracking-tight text-[var(--neutral-emphasis)] leading-tight">
          Registrar gasto nuevo
        </h2>
      </div>

      {/* Simpler & Editable Plantillas de gastos */}
      <div className="mb-4 p-3 rounded-lg bg-[var(--neutral-subtle)]/70 border border-[var(--neutral-border-subtle)] space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[var(--neutral-emphasis)]">
            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
            <span>Plantillas de gastos</span>
          </div>
          {templates.length > 0 && (
            <button
              type="button"
              onClick={() => {
                setTemplateToEdit(null);
                setIsTemplatesDialogOpen(true);
              }}
              className="inline-flex items-center gap-1 text-xs font-medium text-[var(--brand-primary)] hover:underline cursor-pointer"
              title="Administrar y editar plantillas de gastos"
            >
              <Pencil className="h-3 w-3" />
              <span>Editar plantillas</span>
            </button>
          )}
        </div>

        {templates.length === 0 ? (
          <div className="flex items-center justify-between py-1 text-xs gap-3 flex-wrap">
            <span className="text-[11px] text-[var(--neutral-muted)]">
              No tienes plantillas configuradas.
            </span>
            <button
              type="button"
              onClick={() => {
                setTemplateToEdit(null);
                setIsTemplatesDialogOpen(true);
              }}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md border border-dashed border-[var(--neutral-border)] hover:border-[var(--brand-primary)] text-[var(--neutral-emphasis)] text-xs font-medium transition-all shrink-0 cursor-pointer hover:bg-[var(--neutral-subtle)]"
              title="Crear plantilla"
            >
              <Plus className="h-3 w-3" />
              <span>Crear plantilla</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
            {templates.map((tpl) => (
              <button
                key={tpl.id}
                type="button"
                onClick={() => handleApplyTemplate(tpl)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-[var(--neutral-border)] bg-[var(--neutral-surface)] hover:border-[var(--brand-primary)] hover:bg-[var(--neutral-subtle)] text-left text-xs whitespace-nowrap transition-all shadow-2xs cursor-pointer group shrink-0"
                title={`Cargar ${tpl.name} ($${tpl.amount.toLocaleString("es-AR")})`}
              >
                <strong className="text-[11px] font-medium text-[var(--neutral-emphasis)]">
                  {tpl.name}
                </strong>
                <span className="text-[10px] font-bold font-mono text-[var(--neutral-muted)] group-hover:text-[var(--brand-primary)]">
                  ${tpl.amount.toLocaleString("es-AR")}
                </span>
              </button>
            ))}
            <button
              type="button"
              onClick={() => {
                setTemplateToEdit(null);
                setIsTemplatesDialogOpen(true);
              }}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md border border-dashed border-[var(--neutral-border)] hover:border-[var(--brand-primary)] text-[var(--neutral-muted)] hover:text-[var(--neutral-emphasis)] text-xs font-medium transition-all shrink-0 cursor-pointer"
              title="Crear nueva plantilla"
            >
              <Plus className="h-3 w-3" />
              <span>Nueva</span>
            </button>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Row 1: Descripción & Monto */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-[var(--neutral-emphasis)] mb-1.5">
              Descripción *
            </label>
            <input
              type="text"
              required
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Ej.: Luz taller, insumos de pulido, fornituras..."
              className="h-10 w-full rounded-[var(--radius-input)] border border-[var(--neutral-border)] bg-[var(--neutral-surface)] px-3 text-xs sm:text-sm text-[var(--neutral-emphasis)] placeholder:text-[var(--neutral-placeholder)] focus:border-[var(--sidebar-ring)] focus:outline-hidden focus:ring-1 focus:ring-[var(--sidebar-ring)] transition-all shadow-2xs"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[var(--neutral-emphasis)] mb-1.5">
              Monto ($) *
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-xs font-bold text-[var(--neutral-muted)]">
                $
              </span>
              <input
                type="number"
                step="0.01"
                min="0.01"
                required
                value={monto}
                onChange={(e) => setMonto(e.target.value)}
                placeholder="0.00"
                className="h-10 w-full rounded-[var(--radius-input)] border border-[var(--neutral-border)] bg-[var(--neutral-surface)] pl-7 pr-3 text-xs sm:text-sm font-bold font-mono text-[var(--neutral-emphasis)] placeholder:text-[var(--neutral-placeholder)] focus:border-[var(--sidebar-ring)] focus:outline-hidden focus:ring-1 focus:ring-[var(--sidebar-ring)] transition-all shadow-2xs"
              />
            </div>
          </div>
        </div>

        {/* Row 2: Categoría & Medio de pago with shadcn/ui Select */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-[var(--neutral-emphasis)] mb-1.5">
              Categoría *
            </label>
            <Select
              value={categoria}
              onValueChange={(val) => setCategoria(val as ExpenseCategory)}
            >
              <SelectTrigger className="h-10 w-full rounded-[var(--radius-input)] border border-[var(--neutral-border)] bg-[var(--neutral-surface)] px-3 text-xs sm:text-sm font-medium text-[var(--neutral-emphasis)] focus-visible:border-[var(--sidebar-ring)] focus-visible:ring-1 focus-visible:ring-[var(--sidebar-ring)] shadow-2xs cursor-pointer">
                <SelectValue placeholder="Seleccionar categoría" />
              </SelectTrigger>
              <SelectContent>
                {EXPENSE_CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-xs font-medium text-[var(--neutral-emphasis)] mb-1.5">
              Medio de pago *
            </label>
            <Select
              value={medioPago}
              onValueChange={(val) => setMedioPago(val as ExpensePaymentMethod)}
            >
              <SelectTrigger className="h-10 w-full rounded-[var(--radius-input)] border border-[var(--neutral-border)] bg-[var(--neutral-surface)] px-3 text-xs sm:text-sm font-medium text-[var(--neutral-emphasis)] focus-visible:border-[var(--sidebar-ring)] focus-visible:ring-1 focus-visible:ring-[var(--sidebar-ring)] shadow-2xs cursor-pointer">
                <SelectValue placeholder="Seleccionar medio de pago" />
              </SelectTrigger>
              <SelectContent>
                {EXPENSE_PAYMENT_METHODS.map((method) => (
                  <SelectItem key={method} value={method}>
                    {method}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Row 3: Fecha & Proveedor / Beneficiario */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="card-gasto-fecha-input"
              className="block text-xs font-medium text-[var(--neutral-emphasis)] mb-1.5 flex items-center gap-1 select-none"
            >
              <Calendar className="h-3.5 w-3.5 text-[var(--neutral-muted)]" />
              <span>Fecha *</span>
            </label>
            <input
              id="card-gasto-fecha-input"
              type="date"
              required
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              onClick={(e) => {
                try {
                  e.currentTarget.showPicker?.();
                } catch {
                  // Fallback
                }
              }}
              className="h-10 w-full rounded-[var(--radius-input)] border border-[var(--neutral-border)] bg-[var(--neutral-surface)] px-3 text-xs sm:text-sm text-[var(--neutral-emphasis)] focus:border-[var(--sidebar-ring)] focus:outline-hidden focus:ring-1 focus:ring-[var(--sidebar-ring)] transition-all shadow-2xs cursor-pointer [color-scheme:light] dark:[color-scheme:dark]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[var(--neutral-emphasis)] mb-1.5 flex items-center gap-1">
              <Building2 className="h-3.5 w-3.5 text-[var(--neutral-muted)]" />
              <span>Proveedor / Beneficiario</span>
              <span className="text-[11px] text-[var(--neutral-muted)] font-normal">
                (opcional)
              </span>
            </label>
            <input
              type="text"
              value={proveedor}
              onChange={(e) => setProveedor(e.target.value)}
              placeholder="Ej.: Mayorista de Metales Centro, AFIP, Edenor..."
              className="h-10 w-full rounded-[var(--radius-input)] border border-[var(--neutral-border)] bg-[var(--neutral-surface)] px-3 text-xs sm:text-sm text-[var(--neutral-emphasis)] placeholder:text-[var(--neutral-placeholder)] focus:border-[var(--sidebar-ring)] focus:outline-hidden focus:ring-1 focus:ring-[var(--sidebar-ring)] transition-all shadow-2xs"
            />
          </div>
        </div>

        {/* Modal Footer Actions: Cancelar & Guardar gasto */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--neutral-border-subtle)]">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="h-10 px-4 text-xs sm:text-sm font-medium text-[var(--neutral-body)] hover:text-[var(--neutral-emphasis)] hover:bg-[var(--neutral-subtle)] rounded-[var(--radius-btn)] transition-colors cursor-pointer select-none"
            >
              Cancelar
            </button>
          )}
          <button
            type="submit"
            className="inline-flex h-10 items-center justify-center gap-1.5 rounded-[var(--radius-btn)] bg-[var(--ventas-action-card-bg)] px-5 text-xs sm:text-sm font-semibold text-[var(--ventas-action-card-fg)] hover:opacity-90 active:scale-98 transition-all cursor-pointer shadow-xs select-none"
          >
            <Check className="h-4 w-4 stroke-[2]" />
            <span>Guardar gasto</span>
          </button>
        </div>
      </form>

      {/* Expense Templates Management Dialog */}
      <ExpenseTemplatesDialog
        open={isTemplatesDialogOpen}
        onOpenChange={setIsTemplatesDialogOpen}
        templates={templates}
        onSaveTemplates={handleSaveTemplates}
        initialEditTemplate={templateToEdit}
        currentFormValues={{
          descripcion,
          monto,
          categoria,
          medioPago,
          proveedor,
        }}
      />
    </div>
  );
};
