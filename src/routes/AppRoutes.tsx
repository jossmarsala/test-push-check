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
import { CashExpensesPage } from '@/features/cash/pages/CashExpensesPage'
import { StatsPage } from '@/features/stats/pages/StatsPage'

const UnauthorizedPage: React.FC = () => (
  <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
    <h2 className="text-2xl font-bold">Access Restricted</h2>
    <p className="mt-2 text-sm text-muted-foreground">
      Your account role does not have permission to view this view.
    </p>
  </div>
)

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
        {/* Admin Role Guard & Layout */}
        <Route element={<RoleGuard allowedRoles={['admin']} />}>
          <Route element={<AdminLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/workshop" element={<WorkshopOrdersPage />} />
            <Route path="/ventas" element={<SalesPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/cash" element={<CashExpensesPage />} />
            <Route path="/stats" element={<StatsPage />} />
          </Route>
        </Route>

        {/* Root redirect */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Route>

      {/* Fallback Catch-all */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}
