import React, { useState } from "react";
import { PlusCircle } from "lucide-react";
import {
  PageHeader,
  HeaderActionButton,
  NotificationBellButton,
} from "@/components/ui/page-header";

interface PedidosHeaderProps {
  onRegisterNewClick: () => void;
  onNotificationsClick?: () => void;
}

export const PedidosHeader: React.FC<PedidosHeaderProps> = ({
  onRegisterNewClick,
  onNotificationsClick,
}) => {
  const [hasUnread] = useState(true);

  return (
    <PageHeader title="Pedidos">
      <HeaderActionButton
        onClick={onRegisterNewClick}
        label="Registrar pedido"
        icon={PlusCircle}
        iconPosition="right"
        variant="primary"
      />

      {onNotificationsClick && (
        <NotificationBellButton
          onClick={onNotificationsClick}
          hasUnread={hasUnread}
          label="Notificaciones de pedidos"
        />
      )}
    </PageHeader>
  );
};
