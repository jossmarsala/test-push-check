import React, { useState } from 'react'
import { SidebarBrand } from './SidebarBrand'
import { SidebarNav } from './SidebarNav'
import { SidebarUserProfile } from './SidebarUserProfile'
import type { SidebarProps } from '@/types/navigation.types'
import { useAuth } from '@/hooks/useAuth'

export const Sidebar: React.FC<SidebarProps> = ({
  currentPath,
  isCollapsed: controlledCollapsed,
  onToggleCollapse,
  user: controlledUser,
  className = '',
  onSignOut,
}) => {
  const [internalCollapsed, setInternalCollapsed] = useState(false)
  const { profile } = useAuth()

  const isCollapsed =
    controlledCollapsed !== undefined ? controlledCollapsed : internalCollapsed

  const handleToggle = () => {
    if (onToggleCollapse) {
      onToggleCollapse()
    } else {
      setInternalCollapsed((prev) => !prev)
    }
  }

  // Map user data matching the exact Figma wireframe by default
  const formatRoleLabel = (role?: string) => {
    if (role === 'admin') return 'Administradora'
    if (role === 'seller') return 'Vendedor'
    if (role === 'goldsmith') return 'Taller'
    return role || 'Administradora'
  }

  const activeUser = controlledUser || {
    name: profile?.first_name
      ? `${profile.first_name} ${profile.last_name || ''}`.trim()
      : 'Juana Pérez',
    role: formatRoleLabel(profile?.role),
    email: profile?.email || 'juana.perez@aguamarina.com',
  }

  return (
    <aside
      className={`sticky top-0 flex h-screen flex-col justify-between border-r border-[var(--sidebar-border)] bg-[var(--sidebar)] transition-all duration-200 select-none overflow-x-hidden ${
        isCollapsed
          ? 'w-[var(--sidebar-width-collapsed)]'
          : 'w-[var(--sidebar-width)]'
      } ${className}`}
      aria-label="Panel lateral"
    >
      {/* Top Brand & Navigation */}
      <div className="flex flex-col">
        {/* Brand Header */}
        <SidebarBrand
          isCollapsed={isCollapsed}
          onToggleCollapse={handleToggle}
          brandName="Aguamarina"
          brandInitials="Ag"
        />

        {/* Navigation Items List */}
        <SidebarNav isCollapsed={isCollapsed} currentPath={currentPath} />
      </div>

      {/* Bottom User Profile */}
      <SidebarUserProfile
        user={activeUser}
        isCollapsed={isCollapsed}
        onSignOut={onSignOut}
      />
    </aside>
  )
}
