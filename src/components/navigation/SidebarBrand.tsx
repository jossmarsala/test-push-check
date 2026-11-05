import React from 'react'
import { ChevronLeft, ChevronRight } from './NavIcons'

interface SidebarBrandProps {
  isCollapsed?: boolean
  onToggleCollapse?: () => void
  brandName?: string
  brandInitials?: string
}

export const SidebarBrand: React.FC<SidebarBrandProps> = ({
  isCollapsed = false,
  onToggleCollapse,
  brandName = 'Aguamarina',
  brandInitials = 'Ag',
}) => {
  return (
    <div
      className={`flex h-[var(--sidebar-header-height)] items-center ${
        isCollapsed ? 'justify-center px-2' : 'justify-between px-[var(--sidebar-padding-x)]'
      }`}
    >
      {/* Brand Identity */}
      <div
        className={`flex items-center ${
          isCollapsed ? 'justify-center' : 'gap-[var(--sidebar-item-gap)] overflow-hidden'
        }`}
      >
        {/* Monogram Badge / Toggle Button when collapsed */}
        {isCollapsed && onToggleCollapse ? (
          <button
            type="button"
            onClick={onToggleCollapse}
            aria-label="Expandir barra lateral"
            title="Expandir barra lateral"
            className="group relative flex h-[var(--size-sidebar-brand)] w-[var(--size-sidebar-brand)] shrink-0 items-center justify-center rounded-[var(--radius-sidebar-brand)] bg-[var(--sidebar-primary)] text-[var(--sidebar-primary-foreground)] font-semibold select-none shadow-2xs hover:opacity-90 transition-all cursor-pointer"
          >
            <span className="text-base group-hover:hidden">{brandInitials}</span>
            <ChevronRight className="hidden h-5 w-5 stroke-[2.2] group-hover:block" />
          </button>
        ) : (
          <div
            className="flex h-[var(--size-sidebar-brand)] w-[var(--size-sidebar-brand)] shrink-0 items-center justify-center rounded-[var(--radius-sidebar-brand)] bg-[var(--sidebar-primary)] text-[var(--sidebar-primary-foreground)] font-semibold select-none shadow-2xs"
            aria-label={`${brandName} Logo`}
          >
            <span className="text-base">{brandInitials}</span>
          </div>
        )}

        {/* Brand Name Text */}
        {!isCollapsed && (
          <span className="truncate font-bold tracking-tight text-[var(--neutral-emphasis)] text-[var(--font-size-sidebar-brand)] leading-none select-none">
            {brandName}
          </span>
        )}
      </div>

      {/* Collapse Toggle Chevron */}
      {!isCollapsed && onToggleCollapse && (
        <button
          type="button"
          onClick={onToggleCollapse}
          aria-label="Contraer barra lateral"
          title="Contraer barra lateral"
          className="flex h-[var(--size-sidebar-toggle)] w-[var(--size-sidebar-toggle)] items-center justify-center rounded-[var(--radius-sm)] text-[var(--sidebar-toggle)] hover:text-[var(--neutral-emphasis)] hover:bg-[var(--sidebar-accent)] transition-colors cursor-pointer"
        >
          <ChevronLeft className="h-full w-full stroke-[2.2]" />
        </button>
      )}
    </div>
  )
}
