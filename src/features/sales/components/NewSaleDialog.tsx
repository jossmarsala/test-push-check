import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Plus,
  Trash2,
  Banknote,
  CreditCard,
  ArrowLeftRight,
  Split,
  Percent,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type {
  NewSaleFormData,
  PaymentMethod,
  SaleItem,
  PaymentSplit,
} from "../types/sales.types";

interface NewSaleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (formData: NewSaleFormData) => void;
}

interface QuickProductOption {
  name: string;
  category: "Anillos" | "Aros" | "Cadenas" | "Pulseras";
  price: number;
}

const QUICK_CATALOG: QuickProductOption[] = [
  { name: "Anillo de plata 925", category: "Anillos", price: 1500 },
  { name: "Aros de plata", category: "Aros", price: 1298 },
  { name: "Aros de perla cultivada", category: "Aros", price: 4600 },
  { name: "Cadena de acero quirúrgico", category: "Cadenas", price: 1846 },
  { name: "Cadena de plata legitima", category: "Cadenas", price: 3000 },
  { name: "Pulsera de cuero y plata", category: "Pulseras", price: 4151 },
  { name: "Anillo de oro 18k", category: "Anillos", price: 6025 },
  { name: "Dije de plata tallado", category: "Cadenas", price: 5000 },
];

interface InnerNewSaleFormProps {
  onSubmit: (formData: NewSaleFormData) => void;
  onCancel: () => void;
}

const InnerNewSaleForm: React.FC<InnerNewSaleFormProps> = ({
  onSubmit,
  onCancel,
}) => {
  const [cliente, setCliente] = useState("Consumidor final");
  const [clienteContacto, setClienteContacto] = useState("");
  const [pago, setPago] = useState<PaymentMethod>("Efectivo");
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [notas, setNotas] = useState("");

  // Multi-Payment split state
  const [isSplitPayment, setIsSplitPayment] = useState(false);
  const [splitMethod1, setSplitMethod1] =
    useState<Exclude<PaymentMethod, "Dividido">>("Efectivo");
  const [splitAmount1, setSplitAmount1] = useState<string>("");
  const [splitMethod2, setSplitMethod2] =
    useState<Exclude<PaymentMethod, "Dividido">>("Transferencia");

  // Cart items
  const [items, setItems] = useState<SaleItem[]>([
    {
      id: "i-1",
      name: "Anillo de plata 925",
      category: "Anillos",
      quantity: 1,
      unitPrice: 1500,
    },
  ]);

  // Catalog item selector helper
  const [selectedCatalogIndex, setSelectedCatalogIndex] = useState<number>(0);

  const handleAddItemFromCatalog = () => {
    const selected = QUICK_CATALOG[selectedCatalogIndex];
    if (!selected) return;

    setItems((prev) => [
      ...prev,
      {
        id: `i-${Date.now()}`,
        name: selected.name,
        category: selected.category,
        quantity: 1,
        unitPrice: selected.price,
      },
    ]);
  };

  const handleRemoveItem = (id: string) => {
    if (items.length <= 1) return;
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    setItems((prev) =>
      prev.map((i) => {
        if (i.id !== id) return i;
        const newQty = Math.max(1, i.quantity + delta);
        return { ...i, quantity: newQty };
      }),
    );
  };

  const rawTotal = items.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0,
  );
  const discountAmount = Math.round((rawTotal * discountPercent) / 100);
  const total = Math.max(0, rawTotal - discountAmount);

  // Calculate split remaining
  const parsedSplit1 = parseFloat(splitAmount1.replace(/[^0-9.]/g, "")) || 0;
  const splitAmount2 = Math.max(0, total - parsedSplit1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cliente.trim() || items.length === 0) return;

    let splitList: PaymentSplit[] | undefined = undefined;
    if (isSplitPayment) {
      splitList = [
        { method: splitMethod1, amount: parsedSplit1 },
        { method: splitMethod2, amount: splitAmount2 },
      ];
    }

    const discountTag =
      discountPercent > 0
        ? `Descuento: ${discountPercent}% OFF (-$${discountAmount.toLocaleString("es-AR")})`
        : "";

    const finalNotes = [notas.trim(), discountTag].filter(Boolean).join(" • ");

    onSubmit({
      cliente: cliente.trim(),
      clienteContacto: clienteContacto.trim() || undefined,
      items,
      pago: isSplitPayment ? "Dividido" : pago,
      splitPayments: splitList,
      discountPercent: discountPercent > 0 ? discountPercent : undefined,
      notas: finalNotes || undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-2 w-full min-w-0">
      {/* Customer Info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 min-w-0">
        <div>
          <label className="block text-xs font-medium text-[var(--neutral-emphasis)] mb-1">
            Nombre del cliente *
          </label>
          <input
            type="text"
            required
            value={cliente}
            onChange={(e) => setCliente(e.target.value)}
            placeholder="Ej.: María L."
            className="h-9.5 w-full rounded-[var(--dashboard-input-radius)] border border-[var(--neutral-border)] bg-[var(--neutral-surface)] px-3 text-xs text-[var(--neutral-emphasis)] placeholder:text-[var(--neutral-placeholder)] focus:border-[var(--sidebar-ring)] focus:outline-hidden"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-[var(--neutral-emphasis)] mb-1">
            Contacto (teléfono)
          </label>
          <input
            type="text"
            value={clienteContacto}
            onChange={(e) => setClienteContacto(e.target.value)}
            placeholder="Ej.: 11 2345-6789"
            className="h-9.5 w-full rounded-[var(--dashboard-input-radius)] border border-[var(--neutral-border)] bg-[var(--neutral-surface)] px-3 text-xs text-[var(--neutral-emphasis)] placeholder:text-[var(--neutral-placeholder)] focus:border-[var(--sidebar-ring)] focus:outline-hidden"
          />
        </div>
      </div>

      {/* Add Item From Catalog Helper */}
      <div className="rounded-[var(--dashboard-input-radius)] border border-[var(--neutral-border-subtle)] bg-[var(--neutral-subtle)]/70 p-3">
        <label className="block text-xs font-semibold text-[var(--neutral-emphasis)] mb-1.5">
          Agregar artículo al ticket
        </label>
        <div className="flex flex-col sm:flex-row gap-2 min-w-0">
          <div className="flex-1 min-w-0">
            <Select
              value={selectedCatalogIndex.toString()}
              onValueChange={(val) =>
                setSelectedCatalogIndex(parseInt(val, 10))
              }
            >
              <SelectTrigger
                size="sm"
                className="h-9.5 w-full rounded-[var(--dashboard-input-radius)] border border-[var(--neutral-border)] bg-[var(--neutral-surface)] px-3 text-xs text-[var(--neutral-emphasis)] shadow-2xs"
              >
                <SelectValue placeholder="Seleccionar producto del catálogo..." />
              </SelectTrigger>
              <SelectContent>
                {QUICK_CATALOG.map((item, idx) => (
                  <SelectItem key={item.name} value={idx.toString()}>
                    <span className="font-medium">{item.name}</span>
                    <span className="text-[var(--neutral-muted)] font-mono ml-1.5">
                      (${item.price.toLocaleString("es-AR")})
                    </span>
                    <span className="text-[10px] text-[var(--neutral-muted)] ml-auto pl-2">
                      {item.category}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <button
            type="button"
            onClick={handleAddItemFromCatalog}
            className="inline-flex h-9.5 items-center justify-center gap-1.5 rounded-[var(--radius-btn)] bg-[var(--neutral-brand)] px-4 text-xs font-medium text-white hover:bg-[var(--neutral-brand-hover)] active:scale-[0.98] transition-all cursor-pointer shadow-2xs shrink-0"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Agregar</span>
          </button>
        </div>
      </div>

      {/* Cart Items List */}
      <div className="space-y-2">
        <label className="block text-xs font-semibold text-[var(--neutral-muted)] uppercase tracking-wider">
          Detalle de artículos ({items.length})
        </label>
        <div className="max-h-44 overflow-y-auto rounded-[var(--dashboard-input-radius)] border border-[var(--neutral-border-subtle)] bg-[var(--neutral-surface)] divide-y divide-[var(--neutral-border-subtle)]">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-2.5 text-xs gap-3 min-w-0"
            >
              <div className="flex-1 min-w-0">
                <span className="font-semibold text-[var(--neutral-emphasis)] block truncate">
                  {item.name}
                </span>
                <span className="text-[10px] text-[var(--neutral-muted)] block truncate">
                  ${item.unitPrice.toLocaleString("es-AR")} c/u •{" "}
                  {item.category}
                </span>
              </div>

              {/* Quantity */}
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => handleUpdateQuantity(item.id, -1)}
                  disabled={item.quantity <= 1}
                  className="h-6 w-6 rounded-md border border-[var(--neutral-border)] text-[var(--neutral-body)] hover:bg-[var(--neutral-subtle)] disabled:opacity-30 inline-flex items-center justify-center cursor-pointer"
                >
                  -
                </button>
                <span className="w-5 text-center font-medium font-mono">
                  {item.quantity}
                </span>
                <button
                  type="button"
                  onClick={() => handleUpdateQuantity(item.id, 1)}
                  className="h-6 w-6 rounded-md border border-[var(--neutral-border)] text-[var(--neutral-body)] hover:bg-[var(--neutral-subtle)] inline-flex items-center justify-center cursor-pointer"
                >
                  +
                </button>
              </div>

              {/* Subtotal */}
              <div className="w-20 sm:w-24 text-right font-bold text-xs font-mono text-[var(--neutral-emphasis)] shrink-0">
                ${(item.unitPrice * item.quantity).toLocaleString("es-AR")}
              </div>

              {/* Delete button */}
              <button
                type="button"
                onClick={() => handleRemoveItem(item.id)}
                disabled={items.length <= 1}
                className="h-7 w-7 text-[var(--neutral-muted)] hover:text-[var(--destructive)] disabled:opacity-20 inline-flex items-center justify-center cursor-pointer shrink-0"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Method Selector */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="block text-xs font-medium text-[var(--neutral-emphasis)]">
            Medio de pago *
          </label>
          <button
            type="button"
            onClick={() => setIsSplitPayment(!isSplitPayment)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all border cursor-pointer ${
              isSplitPayment
                ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30"
                : "bg-[var(--neutral-subtle)] text-[var(--neutral-muted)] border-[var(--neutral-border)]"
            }`}
          >
            <Split className="h-3 w-3" />
            <span>
              {isSplitPayment
                ? "✓ Pago dividido activo"
                : "Dividir pago (Multi-medio)"}
            </span>
          </button>
        </div>

        {!isSplitPayment ? (
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setPago("Efectivo")}
              className={`inline-flex h-9.5 items-center justify-center gap-1.5 rounded-[var(--dashboard-btn-radius)] border text-xs font-medium transition-all cursor-pointer min-w-0 px-2 ${
                pago === "Efectivo"
                  ? "border-[var(--neutral-emphasis)] bg-[var(--ventas-badge-bg)] text-[var(--ventas-badge-fg)] font-semibold shadow-2xs"
                  : "border-[var(--neutral-border)] bg-[var(--neutral-surface)] text-[var(--neutral-muted)] hover:text-[var(--neutral-emphasis)]"
              }`}
            >
              <Banknote className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">Efectivo</span>
            </button>

            <button
              type="button"
              onClick={() => setPago("Transferencia")}
              className={`inline-flex h-9.5 items-center justify-center gap-1.5 rounded-[var(--dashboard-btn-radius)] border text-xs font-medium transition-all cursor-pointer min-w-0 px-2 ${
                pago === "Transferencia"
                  ? "border-[var(--neutral-emphasis)] bg-[var(--ventas-badge-bg)] text-[var(--ventas-badge-fg)] font-semibold shadow-2xs"
                  : "border-[var(--neutral-border)] bg-[var(--neutral-surface)] text-[var(--neutral-muted)] hover:text-[var(--neutral-emphasis)]"
              }`}
            >
              <ArrowLeftRight className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">Transferencia</span>
            </button>

            <button
              type="button"
              onClick={() => setPago("Mercado Pago")}
              className={`inline-flex h-9.5 items-center justify-center gap-1.5 rounded-[var(--dashboard-btn-radius)] border text-xs font-medium transition-all cursor-pointer min-w-0 px-2 ${
                pago === "Mercado Pago"
                  ? "border-[var(--neutral-emphasis)] bg-[var(--ventas-badge-bg)] text-[var(--ventas-badge-fg)] font-semibold shadow-2xs"
                  : "border-[var(--neutral-border)] bg-[var(--neutral-surface)] text-[var(--neutral-muted)] hover:text-[var(--neutral-emphasis)]"
              }`}
            >
              <CreditCard className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">Mercado Pago</span>
            </button>
          </div>
        ) : (
          <div className="p-3 rounded-lg border border-amber-300 dark:border-amber-900/60 bg-amber-50/20 dark:bg-amber-950/10 space-y-2 text-xs">
            <span className="text-[11px] font-semibold text-amber-700 dark:text-amber-400 block">
              Configuración de Pago Dividido:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-[var(--neutral-muted)] uppercase block mb-1">
                  Medio 1
                </label>
                <div className="flex gap-1.5 items-center">
                  <div className="w-28 sm:w-32 shrink-0">
                    <Select
                      value={splitMethod1}
                      onValueChange={(val) =>
                        setSplitMethod1(
                          val as Exclude<PaymentMethod, "Dividido">,
                        )
                      }
                    >
                      <SelectTrigger
                        size="sm"
                        className="h-8 rounded border border-[var(--neutral-border)] bg-[var(--neutral-surface)] px-2 text-xs font-medium text-[var(--neutral-emphasis)]"
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Efectivo">Efectivo</SelectItem>
                        <SelectItem value="Transferencia">
                          Transferencia
                        </SelectItem>
                        <SelectItem value="Mercado Pago">
                          Mercado Pago
                        </SelectItem>
                        <SelectItem value="Tarjeta">Tarjeta</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <input
                    type="number"
                    value={splitAmount1}
                    onChange={(e) => setSplitAmount1(e.target.value)}
                    placeholder="Monto 1"
                    className="h-8 w-full rounded border border-[var(--neutral-border)] px-2 font-mono text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] text-[var(--neutral-muted)] uppercase block mb-1">
                  Medio 2 (Restante)
                </label>
                <div className="flex gap-1.5 items-center">
                  <div className="w-28 sm:w-32 shrink-0">
                    <Select
                      value={splitMethod2}
                      onValueChange={(val) =>
                        setSplitMethod2(
                          val as Exclude<PaymentMethod, "Dividido">,
                        )
                      }
                    >
                      <SelectTrigger
                        size="sm"
                        className="h-8 rounded border border-[var(--neutral-border)] bg-[var(--neutral-surface)] px-2 text-xs font-medium text-[var(--neutral-emphasis)]"
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Transferencia">
                          Transferencia
                        </SelectItem>
                        <SelectItem value="Efectivo">Efectivo</SelectItem>
                        <SelectItem value="Mercado Pago">
                          Mercado Pago
                        </SelectItem>
                        <SelectItem value="Tarjeta">Tarjeta</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="h-8 px-2 rounded bg-[var(--neutral-subtle)] border border-[var(--neutral-border-subtle)] font-mono text-xs font-bold text-[var(--neutral-emphasis)] flex items-center justify-end flex-1">
                    ${splitAmount2.toLocaleString("es-AR")}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Discount / Promotion Selector with percentage discount */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-2.5 rounded-[var(--dashboard-input-radius)] bg-[var(--neutral-subtle)] border border-[var(--neutral-border-subtle)] gap-2 min-w-0">
        <div className="flex items-center gap-2 shrink-0">
          <Percent className="h-4 w-4 text-[var(--neutral-muted)] shrink-0" />
          <span className="text-xs font-medium text-[var(--neutral-emphasis)] whitespace-nowrap">
            Descuento (%):
          </span>
          {discountPercent > 0 && (
            <span className="text-[11px] font-mono font-semibold text-emerald-600 dark:text-emerald-400">
              (-${discountAmount.toLocaleString("es-AR")})
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap justify-end">
          <div className="relative flex items-center shrink-0">
            <input
              type="number"
              min={0}
              max={100}
              value={discountPercent === 0 ? "" : discountPercent}
              onChange={(e) => {
                const val =
                  e.target.value === ""
                    ? 0
                    : Math.min(
                        100,
                        Math.max(0, parseInt(e.target.value, 10) || 0),
                      );
                setDiscountPercent(val);
              }}
              placeholder="0"
              className="h-7 w-14 rounded border border-[var(--neutral-border)] bg-[var(--neutral-surface)] pl-2 pr-4 text-xs font-mono text-right font-medium text-[var(--neutral-emphasis)] focus:border-[var(--sidebar-ring)] focus:outline-hidden"
            />
            <span className="pointer-events-none absolute right-1.5 text-xs font-medium text-[var(--neutral-muted)]">
              %
            </span>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            {[0, 5, 10, 15, 20].map((pct) => (
              <button
                key={pct}
                type="button"
                onClick={() => setDiscountPercent(pct)}
                className={`h-7 px-2 text-xs font-medium rounded-md border transition-all cursor-pointer shrink-0 ${
                  discountPercent === pct
                    ? "border-emerald-500 bg-emerald-500 text-white font-semibold"
                    : "border-[var(--neutral-border)] bg-[var(--neutral-surface)] text-[var(--neutral-muted)] hover:text-[var(--neutral-emphasis)]"
                }`}
              >
                {pct === 0 ? "Sin desc." : `${pct}%`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Observations */}
      <div>
        <label className="block text-xs font-medium text-[var(--neutral-emphasis)] mb-1">
          Notas u observaciones
        </label>
        <input
          type="text"
          value={notas}
          onChange={(e) => setNotas(e.target.value)}
          placeholder="Ej.: Empaque de regalo, comprobante #..."
          className="h-9 w-full rounded-[var(--dashboard-input-radius)] border border-[var(--neutral-border)] bg-[var(--neutral-surface)] px-3 text-xs text-[var(--neutral-emphasis)] placeholder:text-[var(--neutral-placeholder)] focus:border-[var(--sidebar-ring)] focus:outline-hidden"
        />
      </div>

      {/* Total & Action Buttons */}
      <div className="flex items-center justify-between pt-3 border-t border-[var(--neutral-border-subtle)] gap-3 min-w-0">
        <div className="min-w-0">
          <span className="text-xs text-[var(--neutral-muted)] block">
            Total a cobrar:
          </span>
          <span className="text-xl font-bold tracking-tight text-[var(--neutral-emphasis)] truncate block">
            ${total.toLocaleString("es-AR")}
          </span>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex h-9.5 items-center justify-center rounded-[var(--radius-btn)] border border-[var(--neutral-border)] bg-[var(--neutral-surface)] px-4 text-xs font-medium text-[var(--neutral-muted)] hover:text-[var(--neutral-emphasis)] hover:bg-[var(--neutral-subtle)] transition-all cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="inline-flex h-9.5 items-center justify-center rounded-[var(--radius-btn)] bg-[var(--neutral-brand)] px-5 text-xs font-medium text-white hover:bg-[var(--neutral-brand-hover)] active:scale-[0.98] transition-all cursor-pointer shadow-xs"
          >
            Confirmar Venta
          </button>
        </div>
      </div>
    </form>
  );
};

export const NewSaleDialog: React.FC<NewSaleDialogProps> = ({
  open,
  onOpenChange,
  onSubmit,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[560px] max-h-[92vh] overflow-y-auto rounded-[var(--radius-card-lg)] border-[var(--dashboard-card-border)] bg-[var(--neutral-surface)] p-6 shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-base font-bold text-[var(--neutral-emphasis)]">
            Registrar nueva venta
          </DialogTitle>
          <DialogDescription className="text-xs text-[var(--neutral-muted)]">
            Ingresa los productos vendidos, cliente y medio de pago para emitir
            el ticket.
          </DialogDescription>
        </DialogHeader>

        <InnerNewSaleForm
          key={open ? "open-sale" : "closed-sale"}
          onSubmit={(data) => {
            onSubmit(data);
            onOpenChange(false);
          }}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
};
