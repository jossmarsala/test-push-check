import React from 'react'
import {
  PageHeader,
  NotificationBellButton,
} from '@/components/ui/page-header'

interface DashboardHeaderProps {
  title?: string
  subtitle?: string
  onNotificationsClick?: () => void
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  title = 'Resumen',
  subtitle,
  onNotificationsClick,
}) => {
  return (
    <PageHeader title={title} subtitle={subtitle}>
      <NotificationBellButton
        onClick={onNotificationsClick}
      />
    </PageHeader>
  )
}
