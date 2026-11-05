import React from 'react'
import { ArrowLeftRight, FileSpreadsheet } from 'lucide-react'
import {
  PageHeader,
  HeaderActionButton,
  NotificationBellButton,
} from '@/components/ui/page-header'

interface CashHeaderProps {
  onManualMovementClick?: () => void
  onZReportClick?: () => void
  onExportReportClick?: () => void
  onNotificationsClick?: () => void
}

export const CashHeader: React.FC<CashHeaderProps> = ({
  onManualMovementClick,
  onZReportClick,
  onNotificationsClick,
}) => {
  return (
    <PageHeader
      title="Caja y movimientos"
    >
      {onManualMovementClick && (
        <HeaderActionButton
          onClick={onManualMovementClick}
          label="Registrar ingreso / retiro"
          icon={ArrowLeftRight}
          variant="secondary"
        />
      )}

      {onZReportClick && (
        <HeaderActionButton
          onClick={onZReportClick}
          label="Reporte de cierre"
          icon={FileSpreadsheet}
          variant="secondary"
        />
      )}

      {onNotificationsClick && (
        <NotificationBellButton
          onClick={onNotificationsClick}
          label="Notificaciones de caja"
        />
      )}
    </PageHeader>
  )
}
