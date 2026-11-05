import React from 'react'
import { FileDown } from 'lucide-react'
import { PageHeader, HeaderActionButton } from '@/components/ui/page-header'

interface StatsHeaderProps {
  onExportReportClick: () => void
}

export const StatsHeader: React.FC<StatsHeaderProps> = ({
  onExportReportClick,
}) => {
  return (
    <PageHeader title="Estadísticas y balance">
      <HeaderActionButton
        onClick={onExportReportClick}
        label="Exportar informe"
        icon={FileDown}
        variant="secondary"
      />
    </PageHeader>
  )
}
