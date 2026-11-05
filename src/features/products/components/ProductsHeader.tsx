import React from 'react'
import { PlusCircle, SquarePen } from 'lucide-react'
import {
  PageHeader,
  HeaderActionButton,
  NotificationBellButton,
} from '@/components/ui/page-header'
import { usePermissions } from '@/hooks/usePermissions'

interface ProductsHeaderProps {
  title?: string
  subtitle?: string
  onAddProductClick: () => void
  onUpdatePricesClick: () => void
  onNotificationsClick?: () => void
}

export const ProductsHeader: React.FC<ProductsHeaderProps> = ({
  title = 'Productos',
  subtitle,
  onAddProductClick,
  onUpdatePricesClick,
  onNotificationsClick,
}) => {
  const { products } = usePermissions()

  return (
    <PageHeader title={title} subtitle={subtitle}>
      {products.canCreateProduct && (
        <HeaderActionButton
          variant="primary"
          label="Agregar producto"
          icon={PlusCircle}
          iconPosition="right"
          onClick={onAddProductClick}
        />
      )}
      {products.canEditPrices && (
        <HeaderActionButton
          variant="secondary"
          label="Actualización masiva precios"
          icon={SquarePen}
          iconPosition="left"
          onClick={onUpdatePricesClick}
        />
      )}
      <NotificationBellButton
        hasUnread={false}
        onClick={onNotificationsClick}
      />
    </PageHeader>
  )
}

