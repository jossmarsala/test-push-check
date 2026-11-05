export type ProductCategory = 'Todos' | 'Anillos' | 'Aros' | 'Cadenas' | 'Pulseras'
export type ProductCategoryKey = 'Anillos' | 'Aros' | 'Cadenas' | 'Pulseras'

export type ProductViewMode = 'grid' | 'list'

export interface ProductVariation {
  id: string
  name: string
  stock: number
  priceAdjustment?: number
}

export interface StockMovement {
  id: string
  date: string
  type: 'ingreso' | 'egreso' | 'ajuste'
  quantity: number
  reason: string
}

export interface PriceMovement {
  id: string
  date: string
  oldPrice: number
  newPrice: number
  difference: number
  percentageChange?: number
  reason: string
}

export interface ProductItem {
  id: string
  name: string
  code: string
  category: ProductCategoryKey
  price: number
  costPrice?: number
  stock: number
  minStockAlert?: number
  metalPurity?: string
  weightGrams?: number
  imageUrl?: string
  description?: string
  lastMovement?: string
  history?: StockMovement[]
  priceHistory?: PriceMovement[]
  isRemoteVisible?: boolean
  variations?: ProductVariation[]
}

export interface NewProductFormData {
  name: string
  code: string
  category: ProductCategoryKey
  price: number
  stock: number
  metalPurity?: string
  weightGrams?: number
  description?: string
  variations?: ProductVariation[]
  imageUrl?: string
}

export interface BulkPriceUpdateFormData {
  category: ProductCategory
  percentage: number
  isIncrease: boolean
  applyToAll: boolean
  metalPreset?: string
}
