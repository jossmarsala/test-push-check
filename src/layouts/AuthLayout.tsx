import React from 'react'
import { Outlet } from 'react-router-dom'
import { Sparkles } from 'lucide-react'

export const AuthLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="flex flex-col items-center space-y-2 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md">
            <Sparkles className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Equa BMS</h1>
          <p className="text-sm text-muted-foreground">
            Business Management System for Jewelry Retail & Workshop
          </p>
        </div>
        <Outlet />
      </div>
    </div>
  )
}
