import React, { useState } from 'react'
import { ArrowLeft, Eye, EyeOff, LoaderCircle as Loader2 } from '@animateicons/react/lucide'
import { BrandBadge } from './BrandBadge'
import { UserAccountPreview } from './UserAccountPreview'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import type { UserAccountPreviewData } from '../types/auth-form.types'

interface LoginStepPasswordProps {
  userPreview: UserAccountPreviewData
  isLoading?: boolean
  errorMessage?: string | null
  onBack: () => void
  onSubmit: (password: string) => void
  onForgotPassword?: () => void
}

export const LoginStepPassword: React.FC<LoginStepPasswordProps> = ({
  userPreview,
  isLoading = false,
  errorMessage = null,
  onBack,
  onSubmit,
  onForgotPassword,
}) => {
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [localError, setLocalError] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLocalError(null)

    if (!password) {
      setLocalError('Por favor ingresa tu contraseña.')
      return
    }

    onSubmit(password)
  }

  const displayedError = errorMessage || localError

  return (
    <div className="w-full">
      {/* Top Meta Header: Volver & Step Count */}
      <div className="flex items-center justify-between mb-6">
        <button
          type="button"
          onClick={onBack}
          disabled={isLoading}
          className="group flex items-center gap-1.5 text-sm font-medium text-neutral-body hover:text-neutral-emphasis transition-colors cursor-pointer select-none disabled:opacity-50"
        >
          <ArrowLeft className="h-4 w-4 stroke-[2.2] transition-transform group-hover:-translate-x-0.5" />
          <span>Volver</span>
        </button>

        <span className="text-sm font-normal text-neutral-muted select-none">
          Paso 2 de 2
        </span>
      </div>

      {/* Brand Badge */}
      <div className="flex flex-col items-center text-center">
        <BrandBadge size="md" className="mb-6" />

        {/* User Account Card */}
        <UserAccountPreview user={userPreview} className="mb-6" />
      </div>

      {/* Password Input Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {displayedError && (
          <div
            className="rounded-xl bg-destructive/10 p-3 text-xs text-destructive border border-destructive/20 transition-all text-left"
            role="alert"
          >
            {displayedError}
          </div>
        )}

        <div className="space-y-1.5 text-left">
          <label
            htmlFor="password-input"
            className="text-sm font-medium text-neutral-body block"
          >
            Contraseña
          </label>
          <div className="relative">
            <Input
              id="password-input"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              autoFocus
              required
              placeholder="Ingresa tu contraseña"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                if (localError) setLocalError(null)
              }}
              disabled={isLoading}
              className="h-12 w-full rounded-xl border-neutral-border bg-neutral-surface pl-4 pr-11 text-base text-neutral-emphasis placeholder:text-neutral-placeholder focus-visible:border-neutral-muted focus-visible:ring-1 focus-visible:ring-neutral-muted shadow-2xs transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
              aria-label={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-muted hover:text-neutral-emphasis transition-colors p-1 rounded-md cursor-pointer"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5 stroke-[1.8]" />
              ) : (
                <Eye className="h-5 w-5 stroke-[1.8]" />
              )}
            </button>
          </div>
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="h-12 w-full rounded-xl bg-neutral-brand hover:bg-neutral-brand-hover active:bg-neutral-brand-active text-white font-medium text-base shadow-xs transition-colors flex items-center justify-center cursor-pointer mt-5"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              <span>Iniciando sesión...</span>
            </>
          ) : (
            <span>Ingresar</span>
          )}
        </Button>

        {/* Footer: Forgot Password Link */}
        <div className="pt-3 text-center">
          <p className="text-sm text-neutral-muted">
            ¿Olvidaste tu contraseña?{' '}
            <button
              type="button"
              onClick={onForgotPassword}
              className="font-semibold text-neutral-body underline underline-offset-4 hover:text-neutral-emphasis transition-colors cursor-pointer"
            >
              Restablecerla
            </button>
          </p>
        </div>
      </form>
    </div>
  )
}

