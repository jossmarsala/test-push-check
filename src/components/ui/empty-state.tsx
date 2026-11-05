import React from 'react'
import { cn } from '@/lib/utils'

export interface EmptyStateProps {
  title: string
  description?: string
  actionLabel?: string
  onAction?: () => void
  icon?: React.ComponentType<{ className?: string }>
  className?: string
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionLabel,
  onAction,
  icon: Icon,
  className,
}) => {
  return (
    <div
      className={cn(
        'flex min-h-[320px] flex-col items-center justify-center rounded-[var(--radius-card)] border border-dashed border-[var(--neutral-border)] bg-[var(--neutral-surface)] p-8 text-center animate-fade-in',
        className
      )}
    >
      {Icon && (
        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-[var(--neutral-subtle)] text-[var(--neutral-muted)]">
          <Icon className="h-5 w-5 stroke-[1.5]" />
        </div>
      )}
      <h4 className="text-sm font-semibold text-[var(--neutral-emphasis)]">
        {title}
      </h4>
      {description && (
        <p className="mt-1 text-xs text-[var(--neutral-muted)] max-w-sm">
          {description}
        </p>
      )}
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-4 inline-flex h-9 items-center justify-center rounded-[var(--radius-btn)] border border-[var(--neutral-border-subtle)] bg-[var(--neutral-surface)] px-4 text-xs font-medium text-[var(--neutral-emphasis)] hover:bg-[var(--neutral-subtle)] transition-all cursor-pointer shadow-2xs"
        >
          {actionLabel}
        </button>
      )}
    </div>
  )
}
