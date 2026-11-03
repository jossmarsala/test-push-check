import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/hooks/useAuth'
import type { UserRole } from '@/types/auth.types'

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { signInWithPassword, setDevRole } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const from = location.state?.from?.pathname || '/dashboard'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')
    setIsSubmitting(true)

    const { error } = await signInWithPassword(email, password)
    setIsSubmitting(false)

    if (error) {
      setErrorMsg(error.message)
    } else {
      navigate(from, { replace: true })
    }
  }

  const handleDevLogin = (role: UserRole) => {
    setDevRole(role)
    navigate('/dashboard', { replace: true })
  }

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl">Sign In</CardTitle>
        <CardDescription>Enter your credentials to access the BMS system</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {errorMsg && (
            <div className="rounded-md bg-destructive/10 p-3 text-xs text-destructive">
              {errorMsg}
            </div>
          )}
          <div className="space-y-1">
            <label className="text-xs font-medium">Email Address</label>
            <Input
              type="email"
              placeholder="admin@equabms.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium">Password</label>
            <Input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Signing in...' : 'Sign In with Supabase'}
          </Button>

          {/* Dev Quick Bypass */}
          <div className="w-full border-t pt-3">
            <span className="text-[11px] font-semibold text-muted-foreground block text-center mb-2">
              Development Quick Demo Login:
            </span>
            <div className="grid grid-cols-3 gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={() => handleDevLogin('admin')}
              >
                Admin
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={() => handleDevLogin('seller')}
              >
                Seller
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={() => handleDevLogin('goldsmith')}
              >
                Goldsmith
              </Button>
            </div>
          </div>
        </CardFooter>
      </form>
    </Card>
  )
}
