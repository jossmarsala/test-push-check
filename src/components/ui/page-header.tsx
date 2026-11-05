import React from 'react'
import { cn } from '@/lib/utils'
import {
  NotificationBellButton,
  HeaderNotificationButton,
  type NotificationBellButtonProps,
  type HeaderNotificationButtonProps,
} from './NotificationBellButton'

export {
  NotificationBellButton,
  HeaderNotificationButton,
  type NotificationBellButtonProps,
  type HeaderNotificationButtonProps,
}

export interface PageHeaderProps {
  title: React.ReactNode
  subtitle?: React.ReactNode
  children?: React.ReactNode
  className?: string
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  children,
  className,
}) => {
  return (
    <header
      className={cn(
        'flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between',
        className
      )}
    >
      <div className="flex flex-col">
        <h1 className="font-bold tracking-tight text-[var(--neutral-emphasis)] text-2xl sm:text-[28px] leading-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-1 text-sm text-[var(--neutral-muted)] font-normal">
            {subtitle}
          </p>
        )}
      </div>

      {children && (
        <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap">
          {children}
        </div>
      )}
    </header>
  )
}



export interface HeaderIconButtonProps {
  onClick?: () => void
  label: string
  icon: React.ComponentType<{ className?: string }>
  className?: string
}

export const HeaderIconButton: React.FC<HeaderIconButtonProps> = ({
  onClick,
  label,
  icon: Icon,
  className,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={cn(
        'flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-btn)] border border-[var(--neutral-border-subtle)] bg-[var(--neutral-surface)] text-[var(--neutral-muted)] hover:text-[var(--neutral-emphasis)] hover:bg-[var(--neutral-subtle)] hover:border-[var(--neutral-border)] active:scale-[0.98] transition-all cursor-pointer shadow-2xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--sidebar-ring)]',
        className
      )}
    >
      <Icon className="h-4 w-4 stroke-[1.75]" />
    </button>
  )
}

export interface HeaderActionButtonProps {
  onClick?: () => void
  label: string
  icon?: React.ComponentType<{ className?: string }>
  iconPosition?: 'left' | 'right'
  variant?: 'primary' | 'secondary'
  className?: string
}

export const HeaderActionButton: React.FC<HeaderActionButtonProps> = ({
  onClick,
  label,
  icon: Icon,
  iconPosition = 'left',
  variant = 'secondary',
  className,
}) => {
  if (variant === 'primary') {
    return (
      <button
        type="button"
        onClick={onClick}
        className={cn(
          'group inline-flex h-10 items-center justify-center gap-2 rounded-[var(--radius-btn)] bg-[var(--neutral-brand)] px-4 text-xs sm:text-sm font-medium text-white shadow-xs hover:bg-[var(--neutral-brand-hover)] active:scale-[0.98] transition-all cursor-pointer select-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--sidebar-ring)]',
          className
        )}
      >
        {iconPosition === 'left' && Icon && (
          <Icon className="h-4 w-4 stroke-[1.75]" />
        )}
        <span>{label}</span>
        {iconPosition === 'right' && Icon && (
          <Icon className="h-4 w-4 stroke-[1.75]" />
        )}
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'group inline-flex h-10 items-center justify-center gap-2 rounded-[var(--radius-btn)] border border-[var(--neutral-border-subtle)] bg-[var(--neutral-surface)] px-3.5 text-xs sm:text-sm font-medium text-[var(--neutral-emphasis)] hover:bg-[var(--neutral-subtle)] hover:border-[var(--neutral-border)] active:scale-[0.98] transition-all shadow-2xs cursor-pointer select-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--sidebar-ring)]',
        className
      )}
    >
      {iconPosition === 'left' && Icon && (
        <Icon className="h-4 w-4 stroke-[1.75] text-[var(--neutral-muted)] group-hover:text-[var(--neutral-emphasis)] transition-colors" />
      )}
      <span>{label}</span>
      {iconPosition === 'right' && Icon && (
        <Icon className="h-4 w-4 stroke-[1.75] text-[var(--neutral-muted)] group-hover:text-[var(--neutral-emphasis)] transition-colors" />
      )}
    </button>
  )
}

