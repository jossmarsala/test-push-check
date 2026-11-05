import React, { createContext, useContext, useState, useCallback, useRef } from 'react'
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react'

export type ToastType = 'info' | 'success' | 'warning' | 'error'

export interface ToastItem {
  id: string
  message: string
  type: ToastType
}

interface ToastContextValue {
  showToast: (message: string, type?: ToastType) => void
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined)

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toast, setToast] = useState<ToastItem | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }

    setToast({
      id: String(Date.now()),
      message,
      type,
    })

    timerRef.current = setTimeout(() => {
      setToast(null)
    }, 3200)
  }, [])

  const closeToast = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }
    setToast(null)
  }, [])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed top-5 right-5 z-50 flex items-center gap-2.5 rounded-[var(--radius-dashboard-btn)] border border-[var(--neutral-border)] bg-[var(--sidebar)] px-4 py-3 text-xs font-medium text-[var(--neutral-emphasis)] shadow-xl animate-in fade-in slide-in-from-top-2 max-w-sm"
        >
          {toast.type === 'success' && (
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
          )}
          {toast.type === 'error' && (
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-500" />
          )}
          {toast.type === 'warning' && (
            <AlertCircle className="h-4 w-4 shrink-0 text-amber-500" />
          )}
          {toast.type === 'info' && (
            <Info className="h-4 w-4 shrink-0 text-[var(--neutral-brand)]" />
          )}

          <span className="flex-1 leading-snug">{toast.message}</span>

          <button
            type="button"
            onClick={closeToast}
            aria-label="Cerrar notificación"
            className="text-[var(--neutral-muted)] hover:text-[var(--neutral-emphasis)] transition-colors cursor-pointer p-0.5 -mr-1"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </ToastContext.Provider>
  )
}

export const useToast = (): ToastContextValue => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}
