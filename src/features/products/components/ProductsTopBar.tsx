import React from "react";
import { Search, CirclePlus, SquarePen } from "lucide-react";
import { NotificationBellButton } from "@/components/ui/NotificationBellButton";

interface ProductsTopBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onAddProductClick: () => void;
  onUpdatePricesClick: () => void;
  onNotificationsClick?: () => void;
}

export const ProductsTopBar: React.FC<ProductsTopBarProps> = ({
  searchQuery,
  onSearchChange,
  onAddProductClick,
  onUpdatePricesClick,
  onNotificationsClick,
}) => {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      {/* Search Input */}
      <div className="relative w-full sm:w-80 md:w-96">
        <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-[var(--neutral-muted)]">
          <Search className="h-4 w-4 stroke-[1.75]" />
        </span>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Buscar por nombre o código"
          className="h-10 w-full rounded-[var(--radius-input)] border border-[var(--neutral-border-subtle)] bg-[var(--neutral-surface)] pl-10 pr-4 text-xs font-normal text-[var(--neutral-emphasis)] placeholder:text-[var(--neutral-placeholder)] focus:border-[var(--sidebar-ring)] focus:outline-hidden focus:ring-1 focus:ring-[var(--sidebar-ring)] transition-all shadow-2xs"
        />
      </div>

      {/* Action Buttons: "Agregar producto", "Actualizar precios" and Notification bell */}
      <div className="flex items-center gap-2.5 flex-wrap">
        {/* Agregar producto Button */}
        <button
          type="button"
          onClick={onAddProductClick}
          className="group inline-flex h-10 items-center justify-center gap-2 rounded-[var(--radius-btn)] border border-[var(--neutral-border-subtle)] bg-[var(--neutral-surface)] px-4 text-xs font-medium text-[var(--neutral-emphasis)] hover:bg-[var(--neutral-subtle)] active:scale-[0.98] transition-all shadow-2xs cursor-pointer select-none"
        >
          <CirclePlus className="h-4 w-4 stroke-[1.75] text-[var(--neutral-muted)] group-hover:text-[var(--neutral-emphasis)] transition-colors" />
          <span>Agregar producto</span>
        </button>

        {/* Actualización masiva precios Button */}
        <button
          type="button"
          onClick={onUpdatePricesClick}
          className="group inline-flex h-10 items-center justify-center gap-2 rounded-[var(--radius-btn)] border border-[var(--neutral-border-subtle)] bg-[var(--neutral-surface)] px-4 text-xs font-medium text-[var(--neutral-emphasis)] hover:bg-[var(--neutral-subtle)] active:scale-[0.98] transition-all shadow-2xs cursor-pointer select-none"
        >
          <SquarePen className="h-4 w-4 stroke-[1.75] text-[var(--neutral-muted)] group-hover:text-[var(--neutral-emphasis)] transition-colors" />
          <span>Actualización masiva precios</span>
        </button>

        {/* Notification Bell Button */}
        {onNotificationsClick && (
          <NotificationBellButton
            onClick={onNotificationsClick}
            label="Notificaciones de productos"
          />
        )}
      </div>
    </div>
  );
};
