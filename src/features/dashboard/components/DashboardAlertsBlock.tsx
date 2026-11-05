import React from 'react'
import { AlertTriangle, ChevronRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface AlertItem {
  id: string
  title: string
  subtitle: string
  type: 'urgent' | 'warning' | 'info'
  link: string
  tag: string
}

const ALERTS: AlertItem[] = [
  {
    id: '1',
    title: '2 Pedidos de taller con compromiso para hoy',
    subtitle: 'Anillo de oro 18k (#P-2034) y Pulsera de plata (#P-2035) tienen fecha límite programada para hoy.',
    type: 'urgent',
    tag: 'Vence hoy',
    link: '/pedidos',
  },
  {
    id: '2',
    title: '3 Productos con nivel de stock crítico',
    subtitle: 'Cadena Fígaro 45cm y Aros Argolla 12mm están por debajo del stock mínimo de seguridad.',
    type: 'warning',
    tag: 'Stock bajo',
    link: '/productos',
  },
]

export const DashboardAlertsBlock: React.FC = () => {
  const navigate = useNavigate()

  return (
    <section className="space-y-3">
      {/* Block Header */}
      <div className="flex items-center justify-between select-none">
        <h2 className="text-base sm:text-lg font-semibold tracking-tight text-[var(--neutral-emphasis)] leading-snug">
          Alertas
        </h2>
      </div>

      {/* Alerts Grid / Container */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {ALERTS.map((alert) => (
          <div
            key={alert.id}
            onClick={() => navigate(alert.link)}
            className="group relative flex flex-col justify-between p-5 sm:p-6 min-h-[150px] rounded-[var(--radius-card)] border border-[var(--neutral-border-subtle)] bg-[var(--neutral-card)] hover:border-[var(--neutral-border)] hover:bg-[var(--neutral-subtle)]/50 transition-all cursor-pointer select-none shadow-2xs"
          >
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--neutral-emphasis)] opacity-70" />
                <span className="text-[11px] font-medium text-[var(--neutral-muted)]">
                  {alert.tag}
                </span>
              </div>
              <div className="flex items-start gap-3.5 sm:gap-4">
                <div className="flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-[var(--radius-input)] bg-[var(--neutral-subtle)] border border-[var(--neutral-border-subtle)] text-[var(--neutral-muted)] group-hover:text-[var(--neutral-emphasis)] group-hover:border-[var(--neutral-border)] transition-all">
                  <AlertTriangle className="h-5 w-5 sm:h-6 sm:w-6 stroke-[1.75]" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-xs sm:text-sm font-semibold text-[var(--neutral-emphasis)] leading-snug">
                    {alert.title}
                  </h3>
                  <p className="text-xs text-[var(--neutral-muted)] mt-1.5 leading-relaxed">
                    {alert.subtitle}
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom link prompt */}
            <div className="mt-4 flex items-center justify-end text-xs font-medium">
              <span className="inline-flex items-center gap-0.5 text-[var(--neutral-muted)] group-hover:text-[var(--neutral-emphasis)] group-hover:translate-x-0.5 transition-all">
                <span>Ir</span>
                <ChevronRight className="h-3.5 w-3.5 stroke-[1.5]" />
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
