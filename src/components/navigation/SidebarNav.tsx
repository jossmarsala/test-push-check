import React from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { ChevronRight } from './NavIcons'
import type { NavItem } from '@/types/navigation.types'
import { DEFAULT_SIDEBAR_NAV_ITEMS } from '@/config/navigation.config'
import { useAuth } from '@/hooks/useAuth'

interface SidebarNavProps {
  items?: NavItem[]
  isCollapsed?: boolean
  currentPath?: string
}

export const SidebarNav: React.FC<SidebarNavProps> = ({
  items = DEFAULT_SIDEBAR_NAV_ITEMS,
  isCollapsed = false,
  currentPath,
}) => {
  const { role } = useAuth()
  const location = useLocation()
  const activePath = currentPath || location.pathname

  const visibleItems = items.filter(
    (item) => !item.allowedRoles || (role && item.allowedRoles.includes(role))
  )

  return (
    <nav
      className={`flex flex-col gap-[var(--sidebar-nav-gap)] ${
        isCollapsed ? 'px-2' : 'px-[var(--sidebar-padding-x)]'
      }`}
      aria-label="Navegación principal"
    >
      {visibleItems.map((item) => {
        const Icon = item.icon
        const isActive =
          item.to === '/dashboard' || item.to === '/resumen'
            ? activePath === '/dashboard' || activePath === '/' || activePath === '/resumen'
            : item.to === '/pedidos'
            ? activePath.startsWith('/pedidos') || activePath.startsWith('/workshop')
            : item.to === '/productos'
            ? activePath.startsWith('/productos') || activePath.startsWith('/products')
            : item.to === '/caja'
            ? activePath.startsWith('/caja') || activePath.startsWith('/cash')
            : item.to === '/estadisticas'
            ? activePath.startsWith('/estadisticas') || activePath.startsWith('/stats')
            : activePath.startsWith(item.to)

        return (
          <NavLink
            key={item.id}
            to={item.to}
            title={isCollapsed ? item.label : undefined}
            className={`group flex h-[var(--sidebar-item-height)] items-center ${
              isCollapsed
                ? 'justify-center px-0'
                : 'justify-between px-[var(--sidebar-item-padding-x)]'
            } rounded-[var(--radius-sidebar-item)] transition-colors select-none ${
              isActive
                ? 'bg-[var(--sidebar-accent)] text-[var(--sidebar-accent-foreground)] font-medium shadow-2xs'
                : 'text-[var(--sidebar-foreground)] hover:bg-[var(--sidebar-accent)] hover:text-[var(--sidebar-accent-foreground)] font-normal'
            }`}
          >
            {/* Left: Icon and Label */}
            <div
              className={`flex items-center ${
                isCollapsed
                  ? 'justify-center'
                  : 'gap-[var(--sidebar-item-gap)] overflow-hidden'
              }`}
            >
              <Icon
                className={`h-[var(--size-sidebar-icon)] w-[var(--size-sidebar-icon)] shrink-0 transition-colors ${
                  isActive
                    ? 'text-[var(--sidebar-accent-foreground)]'
                    : 'text-[var(--sidebar-foreground)] group-hover:text-[var(--sidebar-accent-foreground)]'
                }`}
              />

              {!isCollapsed && (
                <span className="truncate text-[var(--font-size-sidebar-item)] leading-tight">
                  {item.label}
                </span>
              )}
            </div>

            {/* Right: Chevron Arrow */}
            {!isCollapsed && (
              <ChevronRight
                className={`h-[var(--size-sidebar-chevron)] w-[var(--size-sidebar-chevron)] shrink-0 text-[var(--sidebar-chevron)] transition-transform group-hover:translate-x-0.5 ${
                  isActive ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'
                }`}
              />
            )}
          </NavLink>
        )
      })}
    </nav>
  )
}
