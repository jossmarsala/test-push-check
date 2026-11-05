import React from 'react'
import {
  LayoutGrid,
  ClipboardCheck,
  ShoppingCart,
  CircleDollarSign,
  ReceiptText,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
} from '@animateicons/react/lucide'

// Custom pixel-accurate icon for "Ventas" (ribbon with % cutout matching Figma wireframe)
export const VentasNavIcon: React.FC<{ className?: string }> = ({
  className = 'h-[var(--size-sidebar-icon)] w-[var(--size-sidebar-icon)]',
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    {/* Ribbon banner with bottom notch */}
    <path d="M5 3a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v18l-7-3.5L5 21V3z" />
    {/* Percentage diagonal & dots */}
    <line x1="9" y1="15" x2="15" y2="9" />
    <circle cx="9.5" cy="9.5" r="1" fill="currentColor" />
    <circle cx="14.5" cy="14.5" r="1" fill="currentColor" />
  </svg>
)

// Custom pixel-accurate icon for "Estadísticas" (easel chart board matching Figma wireframe)
export const EstadisticasNavIcon: React.FC<{ className?: string }> = ({
  className = 'h-[var(--size-sidebar-icon)] w-[var(--size-sidebar-icon)]',
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    {/* Top rail */}
    <line x1="2" y1="3" x2="22" y2="3" />
    {/* Presentation board */}
    <path d="M21 3v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V3" />
    {/* Easel legs */}
    <path d="m7 21 5-5 5 5" />
    {/* Inner trend line */}
    <polyline points="6 12 10 9 14 11 18 7" />
  </svg>
)

export {
  LayoutGrid,
  ClipboardCheck,
  ShoppingCart,
  CircleDollarSign,
  ReceiptText,
  ReceiptText as GastosNavIcon,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
}
