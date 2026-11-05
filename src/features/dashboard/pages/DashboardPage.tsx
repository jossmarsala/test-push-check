import React, { useState } from "react";
import { useToast } from "@/context/ToastContext";
import { useSales } from "@/context/SalesContext";
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
  const { sales, createSale } = useSales();

  const [isNewSaleOpen, setIsNewSaleOpen] = useState(false);
  const [isNewOrderOpen, setIsNewOrderOpen] = useState(false);
  const [isNewExpenseOpen, setIsNewExpenseOpen] = useState(false);

  const handleCreateSale = (formData: NewSaleFormData) => {
    const newSale = createSale(formData);
    showToast(
      `Venta registrada con éxito por $${newSale.total.toLocaleString("es-AR")}.`,
    );
    setIsNewSaleOpen(false);
  };

  const handleCreateOrder = (data: RegistrarPedidoFormData) => {
    showToast(`Pedido para ${data.clienteNombre} registrado con éxito.`);
    setIsNewOrderOpen(false);
  };

  const handleCreateExpense = (formData: NewExpenseFormData) => {
    showToast(
      `Gasto de $${formData.monto.toLocaleString("es-AR")} registrado con éxito.`,
    );
    setIsNewExpenseOpen(false);
  };

  return (
    <div className="w-full max-w-[1200px] mx-auto space-y-4 sm:space-y-4.5 animate-fade-in">
      {/* Top Header Row with Title and Quick Actions */}
      <DashboardHeader title="Resumen" />

      {/* Speed Dial / Quick Actions */}
      <DashboardQuickActions
        onNewSale={() => setIsNewSaleOpen(true)}
        onNewOrder={() => setIsNewOrderOpen(true)}
        onNewExpense={() => setIsNewExpenseOpen(true)}
      />

      {/* Alertas Block */}
      <DashboardAlertsBlock />

      {/* Main 2-Column Responsive Operations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-4.5 items-stretch">
        {/* Left Column: Ventas de hoy & Flujo de caja */}
        <div className="flex flex-col gap-4 sm:gap-4.5 h-full">
          <RecentSalesCard sales={sales} maxItems={4} className="flex-1 min-h-0" />
          <CashFlowCard />
        </div>

        {/* Right Column: Pedidos en taller & Control de caja */}
        <div className="flex flex-col gap-4 sm:gap-4.5 h-full">
          <PendingOrdersCard className="flex-1 min-h-0" />
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
