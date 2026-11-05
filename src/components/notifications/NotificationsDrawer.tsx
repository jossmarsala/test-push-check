import React, { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  AlertTriangle,
  ChevronRight,
  X,
  CheckCheck,
  Bell,
  Clock,
  Sparkles,
  Wallet,
} from 'lucide-react'
import { useNotifications, type NotificationItem } from '@/context/NotificationsContext'
import { cn } from '@/lib/utils'

export const NotificationsDrawer: React.FC = () => {
  const {
    isOpen,
    closeNotifications,
    notifications,
    unreadCount,
    markAllAsRead,
    markAsRead,
  } = useNotifications()

  const navigate = useNavigate()
  const drawerRef = useRef<HTMLDivElement>(null)

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        closeNotifications()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, closeNotifications])

  // Prevent background scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  const handleAlertClick = (alert: NotificationItem) => {
    markAsRead(alert.id)
    closeNotifications()
    navigate(alert.link)
  }

  // Choose icon based on alert type or tag
  const renderAlertIcon = (alert: NotificationItem) => {
    if (alert.tag.toLowerCase().includes('caja')) {
      return <Wallet className="h-5 w-5 stroke-[1.75]" />
    }
    if (alert.tag.toLowerCase().includes('taller') || alert.tag.toLowerCase().includes('entrega')) {
      return <Sparkles className="h-5 w-5 stroke-[1.75]" />
    }
    return <AlertTriangle className="h-5 w-5 stroke-[1.75]" />
  }

  return (
    <>
      {/* Backdrop overlay */}
      <div
        className={cn(
          'fixed inset-0 z-50 bg-black/40 backdrop-blur-xs transition-opacity duration-300',
          isOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        )}
        onClick={closeNotifications}
        aria-hidden={!isOpen}
      />

      {/* Slide-over panel from the right */}
      <aside
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Panel de notificaciones y alertas"
        className={cn(
          'fixed inset-y-0 right-0 z-50 flex h-full w-full max-w-md flex-col bg-[var(--neutral-surface)] border-l border-[var(--neutral-border-subtle)] shadow-2xl transition-transform duration-300 ease-out',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--neutral-border-subtle)] bg-[var(--neutral-card)] select-none">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--neutral-subtle)] border border-[var(--neutral-border-subtle)] text-[var(--neutral-emphasis)]">
              <Bell className="h-4 w-4 stroke-[1.75]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-semibold tracking-tight text-[var(--neutral-emphasis)]">
                  Notificaciones
                </h2>
                {unreadCount > 0 && (
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-[var(--dashboard-badge-dark-bg)] text-[var(--dashboard-badge-dark-fg)]">
                    {unreadCount} {unreadCount === 1 ? 'nueva' : 'nuevas'}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-[var(--neutral-muted)] mt-0.5">
                Alertas operativas del sistema
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllAsRead}
                title="Marcar todas como leídas"
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-[var(--radius-btn)] text-[11px] font-medium text-[var(--neutral-muted)] hover:text-[var(--neutral-emphasis)] hover:bg-[var(--neutral-subtle)] transition-colors cursor-pointer"
              >
                <CheckCheck className="h-3.5 w-3.5 stroke-[1.75]" />
                <span className="hidden sm:inline">Marcar leídas</span>
              </button>
            )}

            <button
              type="button"
              onClick={closeNotifications}
              aria-label="Cerrar panel de notificaciones"
              className="flex h-8 w-8 items-center justify-center rounded-[var(--radius-btn)] border border-[var(--neutral-border-subtle)] bg-[var(--neutral-surface)] text-[var(--neutral-muted)] hover:text-[var(--neutral-emphasis)] hover:bg-[var(--neutral-subtle)] transition-all cursor-pointer"
            >
              <X className="h-4 w-4 stroke-[1.75]" />
            </button>
          </div>
        </div>

        {/* Scrollable Alerts List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center px-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--neutral-subtle)] text-[var(--neutral-muted)] mb-3">
                <Bell className="h-5 w-5 stroke-[1.5]" />
              </div>
              <p className="text-sm font-semibold text-[var(--neutral-emphasis)]">
                Sin notificaciones
              </p>
              <p className="text-xs text-[var(--neutral-muted)] mt-1">
                Todas las operaciones y pedidos se encuentran al día.
              </p>
            </div>
          ) : (
            notifications.map((alert) => (
              <div
                key={alert.id}
                onClick={() => handleAlertClick(alert)}
                className={cn(
                  'group relative flex flex-col justify-between p-4 sm:p-5 min-h-[140px] rounded-[var(--radius-card)] border border-[var(--neutral-border-subtle)] bg-[var(--neutral-card)] hover:border-[var(--neutral-border)] hover:bg-[var(--neutral-subtle)]/50 transition-all cursor-pointer select-none shadow-2xs',
                  !alert.read && 'ring-1 ring-[var(--sidebar-ring)]/20'
                )}
              >
                <div>
                  {/* Top Bar inside Card: Tag & Timestamp */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={cn(
                          'inline-block h-1.5 w-1.5 rounded-full',
                          !alert.read
                            ? 'bg-[var(--dashboard-notification-dot)]'
                            : 'bg-[var(--neutral-emphasis)] opacity-40'
                        )}
                      />
                      <span className="text-[11px] font-medium text-[var(--neutral-muted)]">
                        {alert.tag}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-[11px] text-[var(--neutral-muted)]">
                      <Clock className="h-3 w-3 stroke-[1.5]" />
                      <span>{alert.time}</span>
                    </div>
                  </div>

                  {/* Body with Icon & Texts */}
                  <div className="flex items-start gap-3.5">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--radius-input)] bg-[var(--neutral-subtle)] border border-[var(--neutral-border-subtle)] text-[var(--neutral-muted)] group-hover:text-[var(--neutral-emphasis)] group-hover:border-[var(--neutral-border)] transition-all">
                      {renderAlertIcon(alert)}
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
                <div className="mt-3.5 flex items-center justify-end text-xs font-medium">
                  <span className="inline-flex items-center gap-0.5 text-[var(--neutral-muted)] group-hover:text-[var(--neutral-emphasis)] group-hover:translate-x-0.5 transition-all">
                    <span>Ir</span>
                    <ChevronRight className="h-3.5 w-3.5 stroke-[1.5]" />
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[var(--neutral-border-subtle)] bg-[var(--neutral-card)] flex items-center justify-between text-xs text-[var(--neutral-muted)] select-none">
          <span>{notifications.length} alertas en total</span>
          <button
            type="button"
            onClick={() => {
              closeNotifications()
              navigate('/dashboard')
            }}
            className="font-medium text-[var(--neutral-emphasis)] hover:underline cursor-pointer"
          >
            Ver resumen completo
          </button>
        </div>
      </aside>
    </>
  )
}
