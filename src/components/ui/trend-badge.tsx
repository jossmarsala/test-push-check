import React from 'react'
import { ArrowDown, ArrowUp } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface TrendBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  value: number | string
  isPositive?: boolean
  showArrow?: boolean
  prefix?: string
  suffix?: string
}

export const TrendBadge: React.FC<TrendBadgeProps> = ({
  value,
  isPositive = true,
  showArrow = true,
  prefix = '',
  suffix = '%',
  className,
  ...props
}) => {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold select-none',
        isPositive
          ? 'bg-[var(--ventas-trend-up-bg)] text-[var(--ventas-trend-up-fg)]'
          : 'bg-[var(--ventas-trend-down-bg)] text-[var(--ventas-trend-down-fg)]',
        className
      )}
      {...props}
    >
      {showArrow &&
        (isPositive ? (
          <ArrowUp className="h-3 w-3 stroke-[2]" />
        ) : (
          <ArrowDown className="h-3 w-3 stroke-[2]" />
        ))}
      <span>
        {prefix}
        {typeof value === 'number' ? Math.abs(value) : value}
        {suffix}
      </span>
    </span>
  )
}
