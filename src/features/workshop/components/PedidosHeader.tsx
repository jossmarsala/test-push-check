import React from "react";
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
  return (
    <PageHeader title="Pedidos">
      <HeaderActionButton
        onClick={onRegisterNewClick}
        label="Registrar pedido"
        icon={PlusCircle}
        iconPosition="right"
        variant="primary"
      />

      <NotificationBellButton
        onClick={onNotificationsClick}
        label="Notificaciones de pedidos"
      />
    </PageHeader>
  );
};
