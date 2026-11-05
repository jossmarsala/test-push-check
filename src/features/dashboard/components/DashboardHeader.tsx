import React, { useState } from 'react'
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
  const [hasUnread] = useState(true)

  return (
    <PageHeader title={title} subtitle={subtitle}>
      <NotificationBellButton
        onClick={onNotificationsClick}
        hasUnread={hasUnread}
      />
    </PageHeader>
  )
}
