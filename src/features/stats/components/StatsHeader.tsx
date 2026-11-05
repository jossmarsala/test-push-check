import React from 'react'
import { FileDown } from 'lucide-react'
import {
  PageHeader,
  HeaderActionButton,
  NotificationBellButton,
} from '@/components/ui/page-header'

interface StatsHeaderProps {
  onExportReportClick: () => void;
  onNotificationsClick?: () => void;
}

export const StatsHeader: React.FC<StatsHeaderProps> = ({
  onExportReportClick,
  onNotificationsClick,
}) => {
  return (
    <PageHeader title="Estadísticas y balance">
      <HeaderActionButton
        onClick={onExportReportClick}
        label="Exportar informe"
        icon={FileDown}
        variant="secondary"
      />
      <NotificationBellButton
        onClick={onNotificationsClick}
        label="Ver notificaciones"
      />
    </PageHeader>
  )
}
