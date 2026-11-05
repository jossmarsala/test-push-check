import {
  LayoutGrid,
  ClipboardCheck,
  ShoppingCart,
  CircleDollarSign,
  GastosNavIcon,
  VentasNavIcon,
  EstadisticasNavIcon,
} from '@/components/navigation/NavIcons'
import type { NavItem } from '@/types/navigation.types'
import type { UserRole } from '@/types/auth.types'

export const DEFAULT_SIDEBAR_NAV_ITEMS: NavItem[] = [
  { id: 'resumen', label: 'Resumen', to: '/dashboard', icon: LayoutGrid, allowedRoles: ['admin'] },
  { id: 'pedidos', label: 'Pedidos', to: '/pedidos', icon: ClipboardCheck, allowedRoles: ['admin', 'goldsmith'] },
  { id: 'ventas', label: 'Ventas', to: '/ventas', icon: VentasNavIcon, allowedRoles: ['admin', 'seller'] },
  { id: 'productos', label: 'Productos', to: '/productos', icon: ShoppingCart, allowedRoles: ['admin', 'seller'] },
  { id: 'caja', label: 'Caja y movimientos', to: '/caja', icon: CircleDollarSign, allowedRoles: ['admin', 'seller'] },
  { id: 'gastos', label: 'Gastos', to: '/gastos', icon: GastosNavIcon, allowedRoles: ['admin'] },
  { id: 'estadisticas', label: 'Estadísticas', to: '/estadisticas', icon: EstadisticasNavIcon, allowedRoles: ['admin'] },
]

export const getDefaultRouteForRole = (role?: UserRole | null): string => {
  switch (role) {
    case 'seller':
      return '/ventas'
    case 'goldsmith':
      return '/pedidos'
    case 'admin':
    default:
      return '/dashboard'
  }
}
