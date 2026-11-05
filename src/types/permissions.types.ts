export type Permission =
  // Products
  | 'products:view'
  | 'products:create'
  | 'products:edit'
  | 'products:edit-price'
  | 'products:view-cost'
  | 'products:delete'
  | 'products:adjust-stock'
  | 'products:toggle-visibility'
  // Sales
  | 'sales:view'
  | 'sales:create'
  | 'sales:cancel'
  // Cash
  | 'cash:view'
  | 'cash:operate'
  | 'cash:close'
  // Orders
  | 'orders:view'
  | 'orders:create'
  | 'orders:edit'
  | 'orders:delete'
  // Expenses
  | 'expenses:view'
  | 'expenses:manage'
  // Stats
  | 'stats:view'

export interface ProductModulePermissions {
  canViewProducts: boolean
  canCreateProduct: boolean
  canEditProduct: boolean
  canEditPrices: boolean
  canViewCost: boolean
  canDeleteProduct: boolean
  canAdjustStock: boolean
  canToggleVisibility: boolean
}
