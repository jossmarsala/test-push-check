import React, { useContext } from "react";
import { Bell } from "lucide-react";
import { cn } from "@/lib/utils";
import { NotificationsContext } from "@/context/NotificationsContext";

export interface NotificationBellButtonProps {
  onClick?: () => void;
  hasUnread?: boolean;
  label?: string;
  className?: string;
}

export const NotificationBellButton: React.FC<NotificationBellButtonProps> = ({
  onClick,
  hasUnread,
  label = "Ver notificaciones",
  className,
}) => {
  const notificationsContext = useContext(NotificationsContext);

  const isUnread =
    hasUnread !== undefined
      ? hasUnread
      : notificationsContext
        ? notificationsContext.unreadCount > 0
        : true;

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (notificationsContext) {
      notificationsContext.toggleNotifications();
    }
    if (onClick) {
      onClick();
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={label}
      className={cn(
        "group relative flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-btn)] border border-[var(--neutral-border-subtle)] bg-[var(--neutral-surface)] text-[var(--neutral-muted)] hover:text-[var(--neutral-emphasis)] hover:bg-[var(--neutral-subtle)] hover:border-[var(--neutral-border)] active:scale-[0.98] transition-all cursor-pointer shadow-2xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--sidebar-ring)]",
        className,
      )}
    >
      <Bell className="h-4 w-4 stroke-[1.75]" />
      {isUnread && (
        <span
          className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-[var(--dashboard-notification-dot)] ring-2 ring-[var(--neutral-surface)]"
          aria-hidden="true"
        />
      )}
    </button>
  );
};

export const HeaderNotificationButton = NotificationBellButton;
export type HeaderNotificationButtonProps = NotificationBellButtonProps;
