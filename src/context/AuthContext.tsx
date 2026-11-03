import React, { createContext, useContext, useEffect, useState } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase/client'
import type { UserProfile, UserRole } from '@/types/auth.types'

interface AuthContextType {
  user: User | null
  profile: UserProfile | null
  role: UserRole
  isLoading: boolean
  isAuthenticated: boolean
  signInWithPassword: (email: string, password: string) => Promise<{ error: Error | null }>
  signOut: () => Promise<void>
  setDevRole: (role: UserRole) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const DEFAULT_DEV_PROFILE: UserProfile = {
  id: 'dev-admin-id',
  email: 'admin@equabms.com',
  role: 'admin',
  first_name: 'Admin',
  last_name: 'Store Manager',
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(DEFAULT_DEV_PROFILE)
  const [role, setRole] = useState<UserRole>('admin')
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    let isMounted = true

    async function initializeAuth() {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!isMounted) return

        if (session?.user) {
          setSession(session)
          setUser(session.user)
          await fetchUserProfile(session.user.id, session.user.email ?? '')
        } else {
          // In local dev without live Supabase session, keep default dev admin profile active
          setProfile(DEFAULT_DEV_PROFILE)
          setRole(DEFAULT_DEV_PROFILE.role)
        }
      } catch (error) {
        console.error('[Auth] Error initializing session:', error)
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    initializeAuth()

    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      if (!isMounted) return
      setSession(newSession)
      setUser(newSession?.user ?? null)

      if (newSession?.user) {
        await fetchUserProfile(newSession.user.id, newSession.user.email ?? '')
      } else {
        setProfile(null)
      }
      setIsLoading(false)
    })

    return () => {
      isMounted = false
      authListener?.subscription.unsubscribe()
    }
  }, [])

  async function fetchUserProfile(userId: string, email: string) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error || !data) {
        // Fallback profile if table not yet populated
        const fallback: UserProfile = {
          id: userId,
          email,
          role: 'admin',
        }
        setProfile(fallback)
        setRole('admin')
        return
      }

      const userProfile: UserProfile = {
        id: data.id,
        email: data.email,
        role: data.role as UserRole,
        first_name: data.first_name,
        last_name: data.last_name,
        avatar_url: data.avatar_url,
      }

      setProfile(userProfile)
      setRole(userProfile.role)
    } catch (err) {
      console.warn('[Auth] Error fetching profile, using fallback:', err)
    }
  }

  const signInWithPassword = async (email: string, password: string) => {
    setIsLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setIsLoading(false)
    return { error }
  }

  const signOut = async () => {
    setIsLoading(true)
    await supabase.auth.signOut()
    setUser(null)
    setSession(null)
    setProfile(null)
    setIsLoading(false)
  }

  const setDevRole = (newRole: UserRole) => {
    setRole(newRole)
    if (profile) {
      setProfile({ ...profile, role: newRole })
    }
  }

  const value: AuthContextType = {
    user,
    profile,
    role,
    isLoading,
    isAuthenticated: !!profile || !!session,
    signInWithPassword,
    signOut,
    setDevRole,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
