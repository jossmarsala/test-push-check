import React from 'react'
import type { Permission } from '@/types/permissions.types'
import { usePermissions } from '@/hooks/usePermissions'

interface PermissionGateProps {
  permission: Permission
  children: React.ReactNode
  fallback?: React.ReactNode
}

/**
 * Declarative component to conditionally render UI elements based on user permissions.
 * Useful for hiding buttons, actions, tabs, and form elements across any module.
 */
export const PermissionGate: React.FC<PermissionGateProps> = ({
  permission,
  children,
  fallback = null,
}) => {
  const { hasPermission } = usePermissions()

  if (!hasPermission(permission)) {
    return <>{fallback}</>
  }

  return <>{children}</>
}
