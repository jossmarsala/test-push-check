import React from "react";
import { PlusCircle } from "lucide-react";
import {
  PageHeader,
  HeaderActionButton,
  NotificationBellButton,
} from "@/components/ui/page-header";

interface ExpensesHeaderProps {
  onAddExpenseClick?: () => void;
  onNotificationsClick?: () => void;
}

export const ExpensesHeader: React.FC<ExpensesHeaderProps> = ({
  onAddExpenseClick,
  onNotificationsClick,
}) => {
  return (
    <PageHeader title="Gastos">
      {onAddExpenseClick && (
        <HeaderActionButton
          onClick={onAddExpenseClick}
          label="Nuevo gasto"
          icon={PlusCircle}
          iconPosition="right"
          variant="primary"
        />
      )}

      {onNotificationsClick && (
        <NotificationBellButton
          onClick={onNotificationsClick}
          label="Notificaciones de gastos"
        />
      )}
    </PageHeader>
  );
};
