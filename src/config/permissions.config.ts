import type { UserRole } from '@/types/auth.types'
import type { Permission } from '@/types/permissions.types'

/**
 * Role-Based Access Control (RBAC) Permissions Matrix
 * Extensible configuration mapping roles to atomic permissions.
 */
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  admin: [
    // Products
    'products:view',
    'products:create',
    'products:edit',
    'products:edit-price',
    'products:view-cost',
    'products:delete',
    'products:adjust-stock',
    'products:toggle-visibility',
    // Sales
    'sales:view',
    'sales:create',
    'sales:cancel',
    // Cash
    'cash:view',
    'cash:operate',
    'cash:close',
    // Orders / Workshop
    'orders:view',
    'orders:create',
    'orders:edit',
    'orders:delete',
    // Expenses
    'expenses:view',
    'expenses:manage',
    // Stats
    'stats:view',
  ],
  seller: [
    // Seller: Catalog & stock consultation, POS Sales, Daily Cash operations
    // Note: products:create, products:edit, products:edit-price, products:view-cost, products:delete are restricted
    'products:view',
    'sales:view',
    'sales:create',
    'cash:view',
    'cash:operate',
    'cash:close',
  ],
  goldsmith: [
    // Workshop: View and manage manufacturing/repair orders
    'orders:view',
    'orders:edit',
  ],
}

/**
 * Helper to check whether a specific role has a given permission.
 */
export const checkPermission = (
  role: UserRole | null | undefined,
  permission: Permission
): boolean => {
  if (!role) return false
  const permissions = ROLE_PERMISSIONS[role] || []
  return permissions.includes(permission)
}
