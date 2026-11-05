import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthGuard } from './AuthGuard'
import { RoleGuard } from './RoleGuard'
import { AdminLayout } from '@/layouts/AdminLayout'
import { AuthLayout } from '@/layouts/AuthLayout'
import { LoginPage } from '@/features/auth/pages/LoginPage'
import { DashboardPage } from '@/features/dashboard/pages/DashboardPage'
import { WorkshopOrdersPage } from '@/features/workshop/pages/WorkshopOrdersPage'
import { SalesPage } from '@/features/sales/pages/SalesPage'
import { ProductsPage } from '@/features/products/pages/ProductsPage'
import { CashPage } from '@/features/cash/pages/CashPage'
import { ExpensesPage } from '@/features/expenses/pages/ExpensesPage'
import { StatsPage } from '@/features/stats/pages/StatsPage'
import { useAuth } from '@/hooks/useAuth'
import { getDefaultRouteForRole } from '@/config/navigation.config'

const UnauthorizedPage: React.FC = () => (
  <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
    <h2 className="text-2xl font-bold text-[var(--neutral-emphasis)]">Acceso Restringido</h2>
    <p className="mt-2 text-sm text-[var(--neutral-muted)]">
      Tu rol de usuario no tiene los permisos necesarios para acceder a esta sección.
    </p>
  </div>
)

const RoleHomeRedirect: React.FC = () => {
  const { role } = useAuth()
  return <Navigate to={getDefaultRouteForRole(role)} replace />
}

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
      </Route>

      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      {/* Authenticated Routes */}
      <Route element={<AuthGuard />}>
        <Route element={<RoleGuard allowedRoles={['admin', 'seller', 'goldsmith']} />}>
          <Route element={<AdminLayout />}>
            {/* Seller & Admin accessible routes */}
            <Route element={<RoleGuard allowedRoles={['admin', 'seller']} />}>
              <Route path="/ventas" element={<SalesPage />} />
              <Route path="/productos" element={<ProductsPage />} />
              <Route path="/caja" element={<CashPage />} />
              <Route path="/cash" element={<Navigate to="/caja" replace />} />
              <Route path="/products" element={<Navigate to="/productos" replace />} />
            </Route>

            {/* Goldsmith & Admin accessible routes */}
            <Route element={<RoleGuard allowedRoles={['admin', 'goldsmith']} />}>
              <Route path="/pedidos" element={<WorkshopOrdersPage />} />
              <Route path="/workshop" element={<Navigate to="/pedidos" replace />} />
            </Route>

            {/* Admin-only routes */}
            <Route element={<RoleGuard allowedRoles={['admin']} />}>
              <Route path="/resumen" element={<DashboardPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/gastos" element={<ExpensesPage />} />
              <Route path="/estadisticas" element={<StatsPage />} />

              {/* Backwards-compatible English Redirects */}
              <Route path="/stats" element={<Navigate to="/estadisticas" replace />} />
            </Route>
          </Route>
        </Route>

        {/* Authenticated Root redirect */}
        <Route path="/" element={<RoleHomeRedirect />} />
      </Route>

      {/* Fallback Catch-all */}
      <Route path="*" element={<RoleHomeRedirect />} />
    </Routes>
  )
}

