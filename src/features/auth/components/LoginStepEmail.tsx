import React, { useState } from 'react'
import { ArrowRight, LoaderCircle as Loader2 } from '@animateicons/react/lucide'
import { BrandBadge } from './BrandBadge'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface LoginStepEmailProps {
  initialEmail?: string
  isLoading?: boolean
  errorMessage?: string | null
  onSubmit: (email: string) => void
}

export const LoginStepEmail: React.FC<LoginStepEmailProps> = ({
  initialEmail = '',
  isLoading = false,
  errorMessage = null,
  onSubmit,
}) => {
  const [email, setEmail] = useState(initialEmail)
  const [localError, setLocalError] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLocalError(null)

    const trimmedEmail = email.trim()
    if (!trimmedEmail) {
      setLocalError('Por favor ingresa tu correo electrónico.')
      return
    }

    // Basic email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(trimmedEmail)) {
      setLocalError('Ingresa un correo electrónico válido (ej. nombre@dominio.com).')
      return
    }

    onSubmit(trimmedEmail)
  }

  const displayedError = errorMessage || localError

  return (
    <div className="w-full">
      {/* Top Meta Header: Step Count */}
      <div className="flex justify-end mb-6">
        <span className="text-sm font-normal text-neutral-muted select-none">
          Paso 1 de 2
        </span>
      </div>

      {/* Brand & Main Headings */}
      <div className="flex flex-col items-center text-center">
        <BrandBadge size="md" className="mb-5" />

        <h1 className="tracking-tight text-neutral-emphasis">
          Inicia sesión en Aguamarina
        </h1>

        <p className="mt-2 text-sm sm:text-base text-neutral-placeholder font-normal leading-relaxed">
          Ingresa con el e-mail asociado a tu cuenta
        </p>
      </div>

      {/* Email Input Form */}
      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        {displayedError && (
          <div
            className="rounded-xl bg-destructive/10 p-3 text-xs text-destructive border border-destructive/20 transition-all"
            role="alert"
          >
            {displayedError}
          </div>
        )}

        <div className="space-y-1.5 text-left">
          <label
            htmlFor="email-input"
            className="text-sm font-medium text-neutral-body block"
          >
            Correo electrónico
          </label>
          <Input
            id="email-input"
            type="email"
            autoComplete="email"
            autoFocus
            required
            placeholder="ejemplo@correo.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              if (localError) setLocalError(null)
            }}
            disabled={isLoading}
            className="h-12 w-full rounded-xl border-neutral-border bg-neutral-surface px-4 text-base text-neutral-emphasis placeholder:text-neutral-placeholder focus-visible:border-neutral-muted focus-visible:ring-1 focus-visible:ring-neutral-muted shadow-2xs transition-colors"
          />
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="h-12 w-full rounded-xl bg-neutral-brand hover:bg-neutral-brand-hover active:bg-neutral-brand-active text-white font-medium text-base shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer mt-5"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Verificando...</span>
            </>
          ) : (
            <>
              <span>Continuar</span>
              <ArrowRight className="h-4 w-4 stroke-[2.2]" />
            </>
          )}
        </Button>
      </form>
    </div>
  )
}

