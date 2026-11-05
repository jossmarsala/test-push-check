import { useMemo } from 'react'
import { useAuth } from '@/hooks/useAuth'
import type { Permission, ProductModulePermissions } from '@/types/permissions.types'
import { checkPermission } from '@/config/permissions.config'

/**
 * Universal hook for checking user permissions across all tabs.
 * Scalable for any module (products, sales, cash, orders, expenses, etc.)
 */
export const usePermissions = () => {
  const { role } = useAuth()

  const hasPermission = useMemo(
    () => (permission: Permission) => checkPermission(role, permission),
    [role]
  )

  // Pre-computed permissions for the Products module
  const products: ProductModulePermissions = useMemo(
    () => ({
      canViewProducts: hasPermission('products:view'),
      canCreateProduct: hasPermission('products:create'),
      canEditProduct: hasPermission('products:edit'),
      canEditPrices: hasPermission('products:edit-price'),
      canViewCost: hasPermission('products:view-cost'),
      canDeleteProduct: hasPermission('products:delete'),
      canAdjustStock: hasPermission('products:adjust-stock'),
      canToggleVisibility: hasPermission('products:toggle-visibility'),
    }),
    [hasPermission]
  )

  return {
    role,
    hasPermission,
    can: hasPermission,
    products,
  }
}
