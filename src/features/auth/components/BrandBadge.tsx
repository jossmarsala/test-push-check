import React from 'react'

interface BrandBadgeProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export const BrandBadge: React.FC<BrandBadgeProps> = ({
  className = '',
  size = 'md',
}) => {
  const sizeClasses = {
    sm: 'h-8 w-8 text-xs rounded-md',
    md: 'h-11 w-11 text-base rounded-card-md',
    lg: 'h-14 w-14 text-lg rounded-xl',
  }

  return (
    <div
      className={`inline-flex items-center justify-center bg-neutral-brand text-white font-semibold shadow-xs select-none ${sizeClasses[size]} ${className}`}
      aria-label="Aguamarina Logo"
    >
      <span>Ag</span>
    </div>
  )
}

