import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import type { UserRole } from '@/types/auth.types'
import { getDefaultRouteForRole } from '@/config/navigation.config'

interface RoleGuardProps {
  allowedRoles: UserRole[]
  fallbackPath?: string
}

export const RoleGuard: React.FC<RoleGuardProps> = ({
  allowedRoles,
  fallbackPath,
}) => {
  const { role, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="flex h-64 w-full items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    )
  }

  if (!role || !allowedRoles.includes(role)) {
    const target = fallbackPath || getDefaultRouteForRole(role)
    return <Navigate to={target} replace />
  }

  return <Outlet />
}

