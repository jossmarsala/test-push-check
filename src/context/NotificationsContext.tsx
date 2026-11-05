import React, { createContext, useContext, useState, useCallback, useMemo } from 'react'

export interface NotificationItem {
  id: string
  title: string
  subtitle: string
  type: 'urgent' | 'warning' | 'info'
  tag: string
  link: string
  time: string
  read: boolean
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: '1',
    title: '2 Pedidos de taller con compromiso para hoy',
    subtitle: 'Anillo de oro 18k (#P-2034) y Pulsera de plata (#P-2035) tienen fecha límite programada para hoy.',
    type: 'urgent',
    tag: 'Vence hoy',
    link: '/pedidos',
    time: 'Hace 15 min',
    read: false,
  },
  {
    id: '2',
    title: '3 Productos con nivel de stock crítico',
    subtitle: 'Cadena Fígaro 45cm y Aros Argolla 12mm están por debajo del stock mínimo de seguridad.',
    type: 'warning',
    tag: 'Stock bajo',
    link: '/productos',
    time: 'Hace 45 min',
    read: false,
  },
  {
    id: '3',
    title: 'Caja del turno tarde pendiente de cierre',
    subtitle: 'La caja continúa abierta con $380.500 en efectivo acumulado pendiente de conciliación y arqueo.',
    type: 'warning',
    tag: 'Arqueo de caja',
    link: '/caja',
    time: 'Hace 2 h',
    read: false,
  },
  {
    id: '4',
    title: 'Pedido #P-2031 terminado en taller',
    subtitle: 'Gargantilla Esmeralda lista para entrega. Saldo restante de $85.000 pendiente de cobro al cliente.',
    type: 'info',
    tag: 'Entrega lista',
    link: '/pedidos',
    time: 'Hace 3 h',
    read: false,
  },
]

interface NotificationsContextValue {
  isOpen: boolean
  notifications: NotificationItem[]
  unreadCount: number
  openNotifications: () => void
  closeNotifications: () => void
  toggleNotifications: () => void
  markAllAsRead: () => void
  markAsRead: (id: string) => void
}

export const NotificationsContext = createContext<NotificationsContextValue | undefined>(undefined)

export const NotificationsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS)

  const unreadCount = useMemo(() => {
    return notifications.filter((n) => !n.read).length
  }, [notifications])

  const openNotifications = useCallback(() => setIsOpen(true), [])
  const closeNotifications = useCallback(() => setIsOpen(false), [])
  const toggleNotifications = useCallback(() => setIsOpen((prev) => !prev), [])

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }, [])

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    )
  }, [])

  const value = useMemo(
    () => ({
      isOpen,
      notifications,
      unreadCount,
      openNotifications,
      closeNotifications,
      toggleNotifications,
      markAllAsRead,
      markAsRead,
    }),
    [
      isOpen,
      notifications,
      unreadCount,
      openNotifications,
      closeNotifications,
      toggleNotifications,
      markAllAsRead,
      markAsRead,
    ]
  )

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  )
}

export const useNotifications = (): NotificationsContextValue => {
  const context = useContext(NotificationsContext)
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationsProvider')
  }
  return context
}
