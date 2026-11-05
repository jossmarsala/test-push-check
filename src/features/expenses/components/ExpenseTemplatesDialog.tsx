import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sparkles,
  Plus,
  Trash2,
  Pencil,
  Check,
  Building2,
  Copy,
} from "lucide-react";
import { useToast } from "@/context/ToastContext";
import {
  EXPENSE_CATEGORIES,
  EXPENSE_PAYMENT_METHODS,
  type ExpenseCategory,
  type ExpensePaymentMethod,
  type ExpenseTemplate,
} from "../types/expenses.types";

interface ExpenseTemplatesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  templates: ExpenseTemplate[];
  onSaveTemplates: (templates: ExpenseTemplate[]) => void;
  initialEditTemplate?: ExpenseTemplate | null;
  currentFormValues?: {
    descripcion: string;
    monto: string;
    categoria: ExpenseCategory;
    medioPago: ExpensePaymentMethod;
    proveedor: string;
  };
}

interface InnerTemplatesContentProps {
  onClose: () => void;
  templates: ExpenseTemplate[];
  onSaveTemplates: (templates: ExpenseTemplate[]) => void;
  initialEditTemplate?: ExpenseTemplate | null;
  currentFormValues?: {
    descripcion: string;
    monto: string;
    categoria: ExpenseCategory;
    medioPago: ExpensePaymentMethod;
    proveedor: string;
  };
}

const InnerTemplatesContent: React.FC<InnerTemplatesContentProps> = ({
  onClose,
  templates,
  onSaveTemplates,
  initialEditTemplate = null,
  currentFormValues,
}) => {
  const { showToast } = useToast();

  // Form mode: true = adding or editing; false = viewing list
  const [isFormMode, setIsFormMode] = useState(() =>
    Boolean(initialEditTemplate),
  );
  const [editingId, setEditingId] = useState<string | null>(
    () => initialEditTemplate?.id || null,
  );

  // Form fields
  const [formName, setFormName] = useState(
    () => initialEditTemplate?.name || "",
  );
  const [formDesc, setFormDesc] = useState(
    () => initialEditTemplate?.desc || "",
  );
  const [formAmount, setFormAmount] = useState(() =>
    initialEditTemplate ? initialEditTemplate.amount.toString() : "",
  );
  const [formCategory, setFormCategory] = useState<ExpenseCategory>(
    () => initialEditTemplate?.cat || "Servicios",
  );
  const [formPayment, setFormPayment] = useState<ExpensePaymentMethod>(
    () => initialEditTemplate?.payment || "Transferencia",
  );
  const [formSupplier, setFormSupplier] = useState(
    () => initialEditTemplate?.supplier || "",
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const startCreateNew = () => {
    setEditingId(null);
    setFormName("");
    setFormDesc("");
    setFormAmount("");
    setFormCategory("Servicios");
    setFormPayment("Transferencia");
    setFormSupplier("");
    setErrorMsg(null);
    setIsFormMode(true);
  };

  const startEdit = (tpl: ExpenseTemplate) => {
    setEditingId(tpl.id);
    setFormName(tpl.name);
    setFormDesc(tpl.desc);
    setFormAmount(tpl.amount.toString());
    setFormCategory(tpl.cat);
    setFormPayment(tpl.payment);
    setFormSupplier(tpl.supplier || "");
    setErrorMsg(null);
    setIsFormMode(true);
  };

  const handleCopyCurrentForm = () => {
    if (!currentFormValues) return;
    if (currentFormValues.descripcion) {
      setFormName(currentFormValues.descripcion.slice(0, 30));
      setFormDesc(currentFormValues.descripcion);
    }
    if (currentFormValues.monto) {
      setFormAmount(currentFormValues.monto);
    }
    if (currentFormValues.categoria) {
      setFormCategory(currentFormValues.categoria);
    }
    if (currentFormValues.medioPago) {
      setFormPayment(currentFormValues.medioPago);
    }
    if (currentFormValues.proveedor) {
      setFormSupplier(currentFormValues.proveedor);
    }
    showToast("Datos del formulario cargados en la plantilla.");
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      setErrorMsg("Ingresa un nombre para la plantilla.");
      return;
    }

    const parsedAmount = parseFloat(formAmount.replace(/[^0-9.]/g, "")) || 0;
    if (parsedAmount <= 0) {
      setErrorMsg("Ingresa un monto válido mayor a 0.");
      return;
    }

    const newTemplate: ExpenseTemplate = {
      id: editingId || `tpl-${Date.now()}`,
      name: formName.trim(),
      desc: formDesc.trim() || formName.trim(),
      amount: parsedAmount,
      cat: formCategory,
      payment: formPayment,
      supplier: formSupplier.trim() || undefined,
    };

    let updatedTemplates: ExpenseTemplate[];
    if (editingId) {
      updatedTemplates = templates.map((t) =>
        t.id === editingId ? newTemplate : t,
      );
      showToast(
        `Plantilla "${newTemplate.name}" actualizada con éxito.`,
        "success",
      );
    } else {
      updatedTemplates = [...templates, newTemplate];
      showToast(
        `Plantilla "${newTemplate.name}" agregada con éxito.`,
        "success",
      );
    }

    onSaveTemplates(updatedTemplates);
    setIsFormMode(false);
    setEditingId(null);
    setErrorMsg(null);
  };

  const handleDelete = (id: string, name: string) => {
    const updated = templates.filter((t) => t.id !== id);
    onSaveTemplates(updated);
    showToast(`Plantilla "${name}" eliminada.`);
  };

  const hasCurrentFormValues = Boolean(
    currentFormValues?.descripcion || currentFormValues?.monto,
  );

  return (
    <>
      <DialogHeader className="space-y-1">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <DialogTitle className="text-base font-bold text-[var(--neutral-emphasis)]">
              {isFormMode
                ? editingId
                  ? "Editar plantilla de gasto"
                  : "Nueva plantilla de gasto"
                : "Plantillas de gastos"}
            </DialogTitle>
            <DialogDescription className="text-xs text-[var(--neutral-muted)]">
              {isFormMode
                ? "Configura los datos predefinidos para autocompletar el gasto."
                : "Administra tus plantillas para registrar gastos frecuentes en 1 clic."}
            </DialogDescription>
          </div>
        </div>
      </DialogHeader>

      {isFormMode ? (
        /* Create / Edit Template Form */
        <form onSubmit={handleSaveForm} className="space-y-4 pt-2">
          {hasCurrentFormValues && !editingId && (
            <div className="flex items-center justify-between p-2.5 rounded-lg border border-[var(--neutral-border-subtle)] bg-[var(--neutral-subtle)]/70 text-xs">
              <span className="text-[var(--neutral-muted)]">
                ¿Deseas usar los datos que ya escribiste en el formulario?
              </span>
              <button
                type="button"
                onClick={handleCopyCurrentForm}
                className="inline-flex items-center gap-1 font-semibold text-[var(--brand-primary)] hover:underline cursor-pointer"
              >
                <Copy className="h-3 w-3" />
                <span>Cargar datos</span>
              </button>
            </div>
          )}

          {errorMsg && (
            <div className="p-2.5 rounded-md bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-medium">
              {errorMsg}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-medium text-[var(--neutral-emphasis)] mb-1">
                Nombre de la plantilla *
              </label>
              <input
                type="text"
                required
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="Ej.: Alquiler Taller, Luz, Contador..."
                className="h-9 w-full rounded-[var(--radius-input)] border border-[var(--neutral-border)] bg-[var(--neutral-surface)] px-3 text-xs sm:text-sm text-[var(--neutral-emphasis)] placeholder:text-[var(--neutral-placeholder)] focus:border-[var(--sidebar-ring)] focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[var(--neutral-emphasis)] mb-1">
                Monto habitual ($) *
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
                  value={formAmount}
                  onChange={(e) => setFormAmount(e.target.value)}
                  placeholder="0.00"
                  className="h-9 w-full rounded-[var(--radius-input)] border border-[var(--neutral-border)] bg-[var(--neutral-surface)] pl-7 pr-3 text-xs sm:text-sm font-bold font-mono text-[var(--neutral-emphasis)] placeholder:text-[var(--neutral-placeholder)] focus:border-[var(--sidebar-ring)] focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[var(--neutral-emphasis)] mb-1">
              Descripción / Concepto
            </label>
            <input
              type="text"
              value={formDesc}
              onChange={(e) => setFormDesc(e.target.value)}
              placeholder="Ej.: Alquiler mensual del taller y salón de ventas"
              className="h-9 w-full rounded-[var(--radius-input)] border border-[var(--neutral-border)] bg-[var(--neutral-surface)] px-3 text-xs sm:text-sm text-[var(--neutral-emphasis)] placeholder:text-[var(--neutral-placeholder)] focus:border-[var(--sidebar-ring)] focus:outline-hidden"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-medium text-[var(--neutral-emphasis)] mb-1">
                Categoría *
              </label>
              <Select
                value={formCategory}
                onValueChange={(val) => setFormCategory(val as ExpenseCategory)}
              >
                <SelectTrigger className="h-9 w-full rounded-[var(--radius-input)] border border-[var(--neutral-border)] bg-[var(--neutral-surface)] px-3 text-xs sm:text-sm font-medium text-[var(--neutral-emphasis)] focus-visible:border-[var(--sidebar-ring)] cursor-pointer">
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
              <label className="block text-xs font-medium text-[var(--neutral-emphasis)] mb-1">
                Medio de pago *
              </label>
              <Select
                value={formPayment}
                onValueChange={(val) =>
                  setFormPayment(val as ExpensePaymentMethod)
                }
              >
                <SelectTrigger className="h-9 w-full rounded-[var(--radius-input)] border border-[var(--neutral-border)] bg-[var(--neutral-surface)] px-3 text-xs sm:text-sm font-medium text-[var(--neutral-emphasis)] focus-visible:border-[var(--sidebar-ring)] cursor-pointer">
                  <SelectValue placeholder="Seleccionar medio" />
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

          <div>
            <label className="block text-xs font-medium text-[var(--neutral-emphasis)] mb-1 flex items-center gap-1">
              <Building2 className="h-3 w-3 text-[var(--neutral-muted)]" />
              <span>Proveedor / Beneficiario habitual (opcional)</span>
            </label>
            <input
              type="text"
              value={formSupplier}
              onChange={(e) => setFormSupplier(e.target.value)}
              placeholder="Ej.: Edenor, Inmobiliaria Belgrano, Estudio Contable..."
              className="h-9 w-full rounded-[var(--radius-input)] border border-[var(--neutral-border)] bg-[var(--neutral-surface)] px-3 text-xs sm:text-sm text-[var(--neutral-emphasis)] placeholder:text-[var(--neutral-placeholder)] focus:border-[var(--sidebar-ring)] focus:outline-hidden"
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[var(--neutral-border-subtle)]">
            <button
              type="button"
              onClick={() => {
                if (templates.length > 0) {
                  setIsFormMode(false);
                  setEditingId(null);
                  setErrorMsg(null);
                } else {
                  onClose();
                }
              }}
              className="px-3.5 py-1.5 rounded-lg border border-[var(--neutral-border)] bg-[var(--neutral-surface)] hover:bg-[var(--neutral-subtle)] text-xs font-medium text-[var(--neutral-emphasis)] transition-all cursor-pointer"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[var(--ventas-action-card-bg)] text-[var(--ventas-action-card-fg)] text-xs font-semibold hover:opacity-90 transition-all cursor-pointer shadow-xs"
            >
              <Check className="h-3.5 w-3.5" />
              <span>{editingId ? "Guardar cambios" : "Crear plantilla"}</span>
            </button>
          </div>
        </form>
      ) : (
        /* Templates List View */
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[var(--neutral-muted)]">
              {templates.length}{" "}
              {templates.length === 1
                ? "plantilla disponible"
                : "plantillas disponibles"}
            </span>
            {templates.length > 0 && (
              <button
                type="button"
                onClick={startCreateNew}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--ventas-action-card-bg)] text-[var(--ventas-action-card-fg)] text-xs font-semibold hover:opacity-90 transition-all cursor-pointer shadow-2xs"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Nueva plantilla</span>
              </button>
            )}
          </div>

          {templates.length === 0 ? (
            <div className="text-center py-8 rounded-lg border border-dashed border-[var(--neutral-border)] space-y-3">
              <p className="text-xs text-[var(--neutral-muted)]">
                No tienes plantillas configuradas.
              </p>
              <button
                type="button"
                onClick={startCreateNew}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--ventas-action-card-bg)] text-[var(--ventas-action-card-fg)] text-xs font-semibold hover:opacity-90 transition-all cursor-pointer shadow-2xs"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Crear plantilla</span>
              </button>
            </div>
          ) : (
            <div className="max-h-[340px] overflow-y-auto space-y-2 pr-1">
              {templates.map((tpl) => (
                <div
                  key={tpl.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-[var(--neutral-border-subtle)] bg-[var(--neutral-subtle)]/50 hover:bg-[var(--neutral-subtle)] transition-all group"
                >
                  <div className="min-w-0 pr-3">
                    <div className="flex items-center gap-2">
                      <strong className="text-xs font-semibold text-[var(--neutral-emphasis)] truncate">
                        {tpl.name}
                      </strong>
                      <span className="text-xs font-bold font-mono text-[var(--brand-primary)]">
                        ${tpl.amount.toLocaleString("es-AR")}
                      </span>
                    </div>
                    <p className="text-[11px] text-[var(--neutral-muted)] truncate mt-0.5">
                      {tpl.desc}
                    </p>
                    <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                      <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-medium bg-[var(--neutral-surface)] border border-[var(--neutral-border-subtle)] text-[var(--neutral-emphasis)]">
                        {tpl.cat}
                      </span>
                      <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-medium bg-[var(--neutral-surface)] border border-[var(--neutral-border-subtle)] text-[var(--neutral-muted)]">
                        {tpl.payment}
                      </span>
                      {tpl.supplier && (
                        <span className="inline-block px-1.5 py-0.5 rounded text-[10px] text-[var(--neutral-muted)]">
                          • {tpl.supplier}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => startEdit(tpl)}
                      className="p-1.5 rounded-md text-[var(--neutral-muted)] hover:text-[var(--neutral-emphasis)] hover:bg-[var(--neutral-surface)] transition-all cursor-pointer"
                      title="Editar plantilla"
                      aria-label="Editar plantilla"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(tpl.id, tpl.name)}
                      className="p-1.5 rounded-md text-[var(--neutral-muted)] hover:text-rose-600 hover:bg-rose-500/10 transition-all cursor-pointer"
                      title="Eliminar plantilla"
                      aria-label="Eliminar plantilla"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center justify-end pt-3 border-t border-[var(--neutral-border-subtle)]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg border border-[var(--neutral-border)] bg-[var(--neutral-surface)] hover:bg-[var(--neutral-subtle)] text-xs font-semibold text-[var(--neutral-emphasis)] transition-all cursor-pointer"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export const ExpenseTemplatesDialog: React.FC<ExpenseTemplatesDialogProps> = ({
  open,
  onOpenChange,
  templates,
  onSaveTemplates,
  initialEditTemplate = null,
  currentFormValues,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[var(--dialog-sm-max-width)] sm:max-w-xl rounded-[var(--radius-card-lg)] border-[var(--dashboard-card-border)] bg-[var(--neutral-surface)] p-5 sm:p-6 shadow-xl">
        {open && (
          <InnerTemplatesContent
            key={initialEditTemplate?.id || "list"}
            onClose={() => onOpenChange(false)}
            templates={templates}
            onSaveTemplates={onSaveTemplates}
            initialEditTemplate={initialEditTemplate}
            currentFormValues={currentFormValues}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};
