import React, { useState } from "react";
import { useToast } from "@/context/ToastContext";
import { DashboardHeader } from "../components/DashboardHeader";
import { DashboardQuickActions } from "../components/DashboardQuickActions";
import { DashboardAlertsBlock } from "../components/DashboardAlertsBlock";
import { PendingOrdersCard } from "../components/PendingOrdersCard";
import { CashFlowCard } from "../components/CashFlowCard";
import { RecentSalesCard } from "../components/RecentSalesCard";
import { CashRegisterCard } from "../components/CashRegisterCard";
import { NewSaleDialog } from "@/features/sales/components/NewSaleDialog";
import { NewOrderDialog } from "@/features/workshop/components/NewOrderDialog";
import { NewExpenseDialog } from "@/features/expenses/components/NewExpenseDialog";
import type { NewSaleFormData } from "@/features/sales/types/sales.types";
import type { RegistrarPedidoFormData } from "@/features/workshop/types/workshop.types";
import type { NewExpenseFormData } from "@/features/expenses/types/expenses.types";

export const DashboardPage: React.FC = () => {
  const { showToast } = useToast();

  const [isNewSaleOpen, setIsNewSaleOpen] = useState(false);
  const [isNewOrderOpen, setIsNewOrderOpen] = useState(false);
  const [isNewExpenseOpen, setIsNewExpenseOpen] = useState(false);

  const handleNotifications = () => {
    showToast("Tienes 2 notificaciones nuevas de taller y caja.");
  };

  const handleCreateSale = (formData: NewSaleFormData) => {
    const rawTotal = formData.items.reduce(
      (sum, item) => sum + item.unitPrice * item.quantity,
      0
    );
    const discountAmount = formData.discountPercent
      ? Math.round((rawTotal * formData.discountPercent) / 100)
      : 0;
    const totalAmount = Math.max(0, rawTotal - discountAmount);
    showToast(
      `Venta registrada con éxito por $${totalAmount.toLocaleString("es-AR")}.`
    );
    setIsNewSaleOpen(false);
  };

  const handleCreateOrder = (data: RegistrarPedidoFormData) => {
    showToast(`Pedido para ${data.clienteNombre} registrado con éxito.`);
    setIsNewOrderOpen(false);
  };

  const handleCreateExpense = (formData: NewExpenseFormData) => {
    showToast(
      `Gasto de $${formData.monto.toLocaleString("es-AR")} registrado con éxito.`
    );
    setIsNewExpenseOpen(false);
  };

  return (
    <div className="w-full max-w-[1200px] mx-auto space-y-6 animate-fade-in">
      {/* Top Header Row with Title and Quick Actions */}
      <DashboardHeader
        title="Resumen"
        onNotificationsClick={handleNotifications}
      />

      {/* Speed Dial / Quick Actions */}
      <DashboardQuickActions
        onNewSale={() => setIsNewSaleOpen(true)}
        onNewOrder={() => setIsNewOrderOpen(true)}
        onNewExpense={() => setIsNewExpenseOpen(true)}
      />

      {/* Alertas Block */}
      <DashboardAlertsBlock />

      {/* Main 2-Column Responsive Operations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-start">
        {/* Left Column: Pedidos en taller & Flujo de caja */}
        <div className="flex flex-col space-y-6 sm:space-y-8">
          <PendingOrdersCard />
          <CashFlowCard />
        </div>

        {/* Right Column: Ventas recientes & Control de caja */}
        <div className="flex flex-col space-y-6 sm:space-y-8">
          <RecentSalesCard />
          <CashRegisterCard />
        </div>
      </div>

      {/* Pop-up Modals for Direct Access */}
      <NewSaleDialog
        open={isNewSaleOpen}
        onOpenChange={setIsNewSaleOpen}
        onSubmit={handleCreateSale}
      />

      <NewOrderDialog
        open={isNewOrderOpen}
        onOpenChange={setIsNewOrderOpen}
        onSubmit={handleCreateOrder}
      />

      <NewExpenseDialog
        open={isNewExpenseOpen}
        onOpenChange={setIsNewExpenseOpen}
        onSubmit={handleCreateExpense}
      />
    </div>
  );
};

export default DashboardPage;
