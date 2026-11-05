import React from "react";
import { TrendBadge } from "@/components/ui/trend-badge";
import { formatCurrency } from "@/lib/utils";
import type { ExpensesKpiData } from "../types/expenses.types";

interface ExpensesKpiRowProps {
  kpis: ExpensesKpiData;
}

export const ExpensesKpiRow: React.FC<ExpensesKpiRowProps> = ({ kpis }) => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {/* Card 1: Total gastos este mes */}
      <div className="rounded-[var(--radius-card)] border border-[var(--neutral-border-subtle)] bg-[var(--neutral-card)] p-5 shadow-2xs flex flex-col justify-between transition-all">
        <div>
          <h4 className="text-xs font-medium text-[var(--neutral-muted)]">
            Total gastos este mes
          </h4>
          <div className="mt-2 flex items-baseline gap-3">
            <span className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--neutral-emphasis)] tabular-nums">
              {formatCurrency(kpis.totalMes)}
            </span>
            <TrendBadge
              value={kpis.variacionMesPct}
              isPositive={kpis.variacionMesPct <= 0}
            />
          </div>
        </div>

        <div className="mt-4 text-xs text-[var(--neutral-muted)]">
          Mes pasado:{" "}
          <span className="font-semibold text-[var(--neutral-body)]">
            {formatCurrency(kpis.totalMesPasado)}
          </span>
        </div>
      </div>

      {/* Card 2: Gastos registrados hoy */}
      <div className="rounded-[var(--radius-card)] border border-[var(--neutral-border-subtle)] bg-[var(--neutral-card)] p-5 shadow-2xs flex flex-col justify-between transition-all">
        <div>
          <h4 className="text-xs font-medium text-[var(--neutral-muted)]">
            Egresos de hoy
          </h4>
          <div className="mt-2 flex items-baseline gap-3">
            <span className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--neutral-emphasis)] tabular-nums">
              {formatCurrency(kpis.totalHoy)}
            </span>
          </div>
        </div>

        <div className="mt-4 text-xs text-[var(--neutral-muted)]">
          Comprobantes:{" "}
          <span className="font-semibold text-[var(--neutral-body)]">
            {kpis.cantidadHoy} {kpis.cantidadHoy === 1 ? "registrado" : "registrados"}
          </span>
        </div>
      </div>

      {/* Card 3: Mayor rubro de gasto */}
      <div className="rounded-[var(--radius-card)] border border-[var(--neutral-border-subtle)] bg-[var(--neutral-card)] p-5 shadow-2xs flex flex-col justify-between transition-all">
        <div>
          <h4 className="text-xs font-medium text-[var(--neutral-muted)]">
            Mayor rubro de gasto
          </h4>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--neutral-emphasis)] truncate">
              {kpis.categoriaPrincipal}
            </span>
          </div>
        </div>

        <div className="mt-4 text-xs text-[var(--neutral-muted)]">
          Rubro principal del mes en curso
        </div>
      </div>
    </div>
  );
};
