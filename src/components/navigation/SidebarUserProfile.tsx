import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { UserRound } from "@animateicons/react/lucide";
import { ChevronsUpDown } from "./NavIcons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { SidebarUserProfileData } from "@/types/navigation.types";
import type { UserRole } from "@/types/auth.types";
import { useAuth } from "@/hooks/useAuth";

interface SidebarUserProfileProps {
  user?: SidebarUserProfileData;
  isCollapsed?: boolean;
  onSignOut?: () => void;
}

const DEFAULT_USER: SidebarUserProfileData = {
  name: "Juana Pérez",
  role: "Administradora",
  email: "juana.perez@aguamarina.com",
};

export const SidebarUserProfile: React.FC<SidebarUserProfileProps> = ({
  user = DEFAULT_USER,
  isCollapsed = false,
  onSignOut,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut, setDevRole, role: currentRole } = useAuth();

  const handleSignOut = () => {
    if (onSignOut) {
      onSignOut();
    } else {
      signOut();
    }
  };

  const handleRoleChange = (newRole: UserRole) => {
    setDevRole(newRole);
    if (newRole === "seller") {
      const isAllowed = ["/ventas", "/productos", "/products", "/caja", "/cash"].some((p) =>
        location.pathname.startsWith(p)
      );
      if (!isAllowed) {
        navigate("/ventas");
      }
    } else if (newRole === "goldsmith") {
      const isAllowed = ["/pedidos", "/workshop"].some((p) =>
        location.pathname.startsWith(p)
      );
      if (!isAllowed) {
        navigate("/pedidos");
      }
    }
  };

  return (
    <div
      className={`w-full ${
        isCollapsed ? "px-2" : "px-[var(--sidebar-padding-x)]"
      } pb-[var(--sidebar-padding-y)]`}
    >
      {/* Separator Divider Line */}
      <div className="mb-[var(--sidebar-padding-y)] w-full border-t border-[var(--sidebar-border)]" />

      {/* User Row with Dropdown Menu Trigger */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className={`flex w-full items-center ${
              isCollapsed ? "justify-center p-1.5" : "justify-between p-1.5"
            } rounded-[var(--radius-sidebar-item)] transition-colors hover:bg-[var(--sidebar-accent)] cursor-pointer select-none outline-none focus-visible:ring-1 focus-visible:ring-[var(--sidebar-ring)]`}
            aria-label="Menú de usuario"
            title={isCollapsed ? `${user.name} (${user.role})` : undefined}
          >
            <div
              className={`flex items-center ${
                isCollapsed
                  ? "justify-center"
                  : "gap-[var(--sidebar-item-gap)] overflow-hidden"
              }`}
            >
              {/* Circular Avatar */}
              <div
                className="flex h-[var(--size-sidebar-avatar)] w-[var(--size-sidebar-avatar)] shrink-0 items-center justify-center rounded-[var(--radius-sidebar-avatar)] bg-[var(--sidebar-user-avatar-bg)] text-[var(--sidebar-user-avatar-fg)] overflow-hidden"
                aria-hidden="true"
              >
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <UserRound className="h-5 w-5 stroke-[2]" />
                )}
              </div>

              {/* User Name & Role */}
              {!isCollapsed && (
                <div className="flex flex-col text-left overflow-hidden">
                  <span className="truncate font-semibold text-[var(--neutral-emphasis)] text-xs leading-tight">
                    {user.name}
                  </span>
                  <span className="truncate font-normal text-[var(--neutral-muted)] text-[11px] leading-tight mt-0.5">
                    {user.role}
                  </span>
                </div>
              )}
            </div>

            {/* Dropdown Selector Chevron */}
            {!isCollapsed && (
              <ChevronsUpDown
                className="h-[var(--size-sidebar-chevron)] w-[var(--size-sidebar-chevron)] shrink-0 text-[var(--sidebar-chevron)]"
                aria-hidden="true"
              />
            )}
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align={isCollapsed ? "start" : "end"}
          side={isCollapsed ? "right" : "top"}
          sideOffset={8}
          className="w-56 rounded-[var(--radius-card-md)] border-[var(--sidebar-border)] bg-[var(--sidebar)] p-1.5 shadow-md"
        >
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium text-[var(--neutral-emphasis)] leading-none">
                {user.name}
              </p>
              <p className="text-xs text-[var(--neutral-muted)] leading-none truncate">
                {user.email || "juana.perez@aguamarina.com"}
              </p>
            </div>
          </DropdownMenuLabel>

          <DropdownMenuSeparator className="bg-[var(--sidebar-border)]" />

          {/* Dev Role Switcher */}
          <DropdownMenuLabel className="text-[10px] uppercase font-semibold text-[var(--neutral-muted)] tracking-wider">
            Cambiar Rol
          </DropdownMenuLabel>
          <div className="grid grid-cols-3 gap-1 px-2 py-1">
            <button
              type="button"
              onClick={() => handleRoleChange("admin")}
              className={`rounded px-1.5 py-1 text-[11px] font-medium transition-colors cursor-pointer ${
                currentRole === "admin"
                  ? "bg-[var(--sidebar-primary)] text-[var(--sidebar-primary-foreground)] shadow-xs"
                  : "bg-[var(--sidebar-accent)] text-[var(--sidebar-accent-foreground)] hover:bg-[var(--neutral-border)]"
              }`}
            >
              Admin
            </button>
            <button
              type="button"
              onClick={() => handleRoleChange("seller")}
              className={`rounded px-1.5 py-1 text-[11px] font-medium transition-colors cursor-pointer ${
                currentRole === "seller"
                  ? "bg-[var(--sidebar-primary)] text-[var(--sidebar-primary-foreground)] shadow-xs"
                  : "bg-[var(--sidebar-accent)] text-[var(--sidebar-accent-foreground)] hover:bg-[var(--neutral-border)]"
              }`}
            >
              Vendedor
            </button>
            <button
              type="button"
              onClick={() => handleRoleChange("goldsmith")}
              className={`rounded px-1.5 py-1 text-[11px] font-medium transition-colors cursor-pointer ${
                currentRole === "goldsmith"
                  ? "bg-[var(--sidebar-primary)] text-[var(--sidebar-primary-foreground)] shadow-xs"
                  : "bg-[var(--sidebar-accent)] text-[var(--sidebar-accent-foreground)] hover:bg-[var(--neutral-border)]"
              }`}
            >
              Taller
            </button>
          </div>

          <DropdownMenuSeparator className="bg-[var(--sidebar-border)]" />

          <DropdownMenuItem
            onClick={handleSignOut}
            className="text-[var(--destructive)] focus:bg-[var(--destructive)]/10 focus:text-[var(--destructive)] cursor-pointer"
          >
            Cerrar sesión
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
