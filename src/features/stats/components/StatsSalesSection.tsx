import React from 'react'
import { formatCurrency } from '@/lib/utils'
import type { SalesBreakdowns } from '../types/stats.types'

interface StatsSalesSectionProps {
  breakdowns: SalesBreakdowns
}

export const StatsSalesSection: React.FC<StatsSalesSectionProps> = ({
  breakdowns,
}) => {
  return (
    <section className="space-y-3.5">
      <div className="flex items-center justify-between">
        <h2 className="text-base sm:text-lg font-semibold tracking-tight text-[var(--neutral-emphasis)] leading-snug">
          Desglose comercial
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Card 1: Joyas más vendidas */}
        <div className="rounded-[var(--radius-card)] border border-[var(--neutral-border-subtle)] bg-[var(--neutral-card)] p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-[var(--neutral-muted)] mb-3">
              <h3 className="font-semibold text-[var(--neutral-emphasis)]">
                Joyas más vendidas
              </h3>
            </div>

            <div className="space-y-2.5">
              {breakdowns.topProductos.map((item, idx) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-[var(--neutral-subtle)]/60"
                >
                  <div className="flex items-center gap-2.5 min-w-0 pr-2">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--neutral-card)] text-[10px] font-mono font-semibold text-[var(--neutral-muted)] border border-[var(--neutral-border-subtle)]">
                      {idx + 1}
                    </span>
                    <div className="min-w-0">
                      <span className="text-xs font-medium text-[var(--neutral-emphasis)] block truncate">
                        {item.name}
                      </span>
                      <span className="text-[10px] text-[var(--neutral-muted)]">
                        {item.salesCount} ventas {item.tag && `· ${item.tag}`}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-semibold text-[var(--neutral-emphasis)] tabular-nums shrink-0">
                    {formatCurrency(item.amount)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Card 2: Por categoría */}
        <div className="rounded-[var(--radius-card)] border border-[var(--neutral-border-subtle)] bg-[var(--neutral-card)] p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-[var(--neutral-muted)] mb-3">
              <h3 className="font-semibold text-[var(--neutral-emphasis)]">
                Ventas por categoría
              </h3>
            </div>

            <div className="space-y-3.5 pt-1">
              {breakdowns.porCategoria.map((item) => (
                <div key={item.name} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-[var(--neutral-emphasis)] truncate pr-2">
                      {item.name}
                    </span>
                    <div className="flex items-center gap-2 shrink-0 font-mono tabular-nums text-xs">
                      <span className="text-[var(--neutral-muted)] text-[11px]">
                        {item.percentage}%
                      </span>
                      <span className="font-semibold text-[var(--neutral-emphasis)]">
                        {formatCurrency(item.amount)}
                      </span>
                    </div>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-[var(--neutral-subtle)] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[var(--neutral-brand)] transition-all duration-300"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Card 3: Por medio de cobro */}
        <div className="rounded-[var(--radius-card)] border border-[var(--neutral-border-subtle)] bg-[var(--neutral-card)] p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-[var(--neutral-muted)] mb-3">
              <h3 className="font-semibold text-[var(--neutral-emphasis)]">
                Medios de cobro
              </h3>
            </div>

            <div className="space-y-3.5 pt-1">
              {breakdowns.porMedioPago.map((item) => (
                <div key={item.name} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-[var(--neutral-emphasis)] truncate pr-2">
                      {item.name}
                    </span>
                    <div className="flex items-center gap-2 shrink-0 font-mono tabular-nums text-xs">
                      <span className="text-[var(--neutral-muted)] text-[11px]">
                        {item.percentage}%
                      </span>
                      <span className="font-semibold text-[var(--neutral-emphasis)]">
                        {formatCurrency(item.amount)}
                      </span>
                    </div>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-[var(--neutral-subtle)] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[var(--neutral-emphasis)] opacity-80 transition-all duration-300"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
