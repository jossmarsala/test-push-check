import React, { useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Hammer,
  ShoppingCart,
  Package,
  Wallet,
  BarChart3,
  ShieldCheck,
  LogOut,
  Menu,
  X,
  Sparkles,
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

interface NavItem {
  label: string
  to: string
  icon: React.ComponentType<{ className?: string }>
  badge?: string
}

const adminNavItems: NavItem[] = [
  { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
  { label: 'Workshop / Orders', to: '/workshop', icon: Hammer, badge: 'Taller' },
  { label: 'Ventas (POS)', to: '/ventas', icon: ShoppingCart },
  { label: 'Products (CRUD)', to: '/products', icon: Package },
  { label: 'Cash & Expenses', to: '/cash', icon: Wallet },
  { label: 'Stats & Reports', to: '/stats', icon: BarChart3 },
]

export const AdminLayout: React.FC = () => {
  const { profile, role, signOut, setDevRole } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()

  return (
    <div className="flex min-h-screen w-full bg-muted/20">
      {/* Desktop Sidebar */}
      <aside className="hidden w-64 flex-col border-r bg-card shadow-xs md:flex">
        {/* Brand Header */}
        <div className="flex h-16 items-center gap-2.5 px-6 border-b">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold shadow-xs">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h1 className="font-semibold text-base tracking-tight leading-tight">Equa BMS</h1>
            <p className="text-xs text-muted-foreground">Jewelry & Workshop ERP</p>
          </div>
        </div>

        {/* Role Badge Indicator */}
        <div className="mx-4 my-3 rounded-lg border bg-muted/40 p-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Active Role</span>
            <Badge variant="outline" className="font-mono text-xs uppercase bg-background">
              <ShieldCheck className="mr-1 h-3 w-3 text-primary" />
              {role}
            </Badge>
          </div>
          <p className="mt-1 text-xs text-muted-foreground truncate">{profile?.email}</p>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 space-y-1 px-3 py-2">
          {adminNavItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname.startsWith(item.to)
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={`flex items-center justify-between rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-xs'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="h-4 w-4 shrink-0" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] uppercase font-semibold ${
                      isActive
                        ? 'bg-primary-foreground/20 text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </NavLink>
            )
          })}
        </nav>

        {/* Footer Actions */}
        <div className="border-t p-3 space-y-2">
          {/* Dev Role Quick Preview Switcher */}
          <div className="rounded-md bg-muted/50 p-2">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground block mb-1">
              Dev Role Preview
            </span>
            <div className="grid grid-cols-3 gap-1">
              {(['admin', 'seller', 'goldsmith'] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setDevRole(r)}
                  className={`rounded px-1.5 py-0.5 text-[11px] capitalize font-medium transition-colors ${
                    role === r
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-background hover:bg-muted text-muted-foreground'
                  }`}
                >
                  {r.slice(0, 4)}
                </button>
              ))}
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-muted-foreground hover:text-destructive"
            onClick={() => signOut()}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Header */}
        <header className="flex h-16 items-center justify-between border-b bg-card px-4 md:px-8">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            <span className="text-sm font-semibold md:text-base">
              Admin Portal
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="hidden sm:inline-flex">
              Store: Equa Central
            </Badge>
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
              {profile?.first_name?.[0] || 'A'}
            </div>
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="border-b bg-card p-4 md:hidden">
            <nav className="space-y-1">
              {adminNavItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted"
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
            </nav>
            <Separator className="my-3" />
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => signOut()}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        )}

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
