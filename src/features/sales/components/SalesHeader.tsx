import React from 'react'
import { PlusCircle } from 'lucide-react'
import {
  PageHeader,
  HeaderActionButton,
  NotificationBellButton,
} from '@/components/ui/page-header'

interface SalesHeaderProps {
  onNewSaleClick?: () => void
  onNotificationsClick?: () => void
}

export const SalesHeader: React.FC<SalesHeaderProps> = ({
  onNewSaleClick,
  onNotificationsClick,
}) => {
  return (
    <PageHeader
      title="Ventas"
    >
      {onNewSaleClick && (
        <HeaderActionButton
          onClick={onNewSaleClick}
          label="Registrar venta"
          icon={PlusCircle}
          iconPosition="right"
          variant="primary"
        />
      )}

      {onNotificationsClick && (
        <NotificationBellButton
          onClick={onNotificationsClick}
          label="Ver notificaciones de ventas"
        />
      )}
    </PageHeader>
  )
}
