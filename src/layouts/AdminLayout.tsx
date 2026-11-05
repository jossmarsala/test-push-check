import React, { useState, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Menu, X } from '@animateicons/react/lucide'
import { Sidebar } from '@/components/navigation/Sidebar'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'

const ROUTE_TITLES: Record<string, string> = {
  '/dashboard': 'Resumen — EQUA Joyas',
  '/resumen': 'Resumen — EQUA Joyas',
  '/pedidos': 'Pedidos — EQUA Joyas',
  '/ventas': 'Ventas — EQUA Joyas',
  '/productos': 'Productos — EQUA Joyas',
  '/caja': 'Caja — EQUA Joyas',
  '/gastos': 'Gastos — EQUA Joyas',
  '/estadisticas': 'Estadísticas — EQUA Joyas',
}

export const AdminLayout: React.FC = () => {
  const { profile, signOut } = useAuth()
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [prevPath, setPrevPath] = useState(location.pathname)

  // Derive document title dynamically from the active route
  useEffect(() => {
    const currentKey = Object.keys(ROUTE_TITLES).find((route) =>
      location.pathname.startsWith(route)
    )
    document.title = currentKey ? ROUTE_TITLES[currentKey] : 'EQUA Joyas'
  }, [location.pathname])

  // Close mobile menu on route change without triggering useEffect cascading render
  if (prevPath !== location.pathname) {
    setPrevPath(location.pathname)
    setMobileMenuOpen(false)
  }

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    try {
      return localStorage.getItem('sidebar_collapsed') === 'true'
    } catch {
      return false
    }
  })

  const handleToggleSidebar = () => {
    setIsSidebarCollapsed((prev) => {
      const next = !prev
      try {
        localStorage.setItem('sidebar_collapsed', String(next))
      } catch {
        // ignore
      }
      return next
    })
  }

  const formatRoleLabel = (role?: string) => {
    if (role === 'admin') return 'Administradora'
    if (role === 'seller') return 'Vendedor'
    if (role === 'goldsmith') return 'Taller'
    return role || 'Administradora'
  }

  const activeUser = {
    name: profile?.first_name
      ? `${profile.first_name} ${profile.last_name || ''}`.trim()
      : 'Juana Pérez',
    role: formatRoleLabel(profile?.role),
    email: profile?.email || 'juana.perez@aguamarina.com',
  }

  return (
    <div className="flex min-h-screen w-full bg-[var(--neutral-canvas)]">
      {/* Desktop Wireframe-Accurate Sidebar */}
      <div className="hidden md:block">
        <Sidebar
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={handleToggleSidebar}
          user={activeUser}
          onSignOut={signOut}
        />
      </div>

      {/* Mobile Drawer Backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Floating Toggle Button */}
      <div className="fixed bottom-4 right-4 z-50 md:hidden">
        <Button
          size="icon"
          className="h-12 w-12 rounded-full shadow-lg bg-[var(--sidebar-primary)] text-[var(--sidebar-primary-foreground)] hover:opacity-90 cursor-pointer"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      {/* Mobile Offcanvas Sidebar Drawer */}
      <div
        className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-200 ease-in-out md:hidden ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <Sidebar
          isCollapsed={false}
          user={activeUser}
          onSignOut={() => {
            setMobileMenuOpen(false)
            signOut()
          }}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Page View Outlet */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
