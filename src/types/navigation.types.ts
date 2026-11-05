import type { ComponentType } from 'react'
import type { UserRole } from './auth.types'

export interface NavItem {
  id: string
  label: string
  to: string
  icon: ComponentType<{ className?: string }>
  allowedRoles?: UserRole[]
}

export interface SidebarUserProfileData {
  name: string
  role: string
  email?: string
  avatarUrl?: string
}

export interface SidebarProps {
  currentPath?: string
  isCollapsed?: boolean
  onToggleCollapse?: () => void
  user?: SidebarUserProfileData
  className?: string
  onSignOut?: () => void
}
