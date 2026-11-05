import React from 'react'
import { Outlet } from 'react-router-dom'

export const AuthLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-neutral-canvas p-4 sm:p-6 antialiased">
      <Outlet />
    </div>
  )
}
