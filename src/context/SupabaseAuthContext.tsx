import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import { supabase } from '../lib/supabase'

export interface AuthUser {
  uid: string
  name: string | null
  email: string | null
  picture: string | null
  isAnonymous: boolean
}

interface SupabaseAuthContextValue {
  user: AuthUser | null
  isAuthenticated: boolean
  isLoading: boolean
  login: () => Promise<void>
  loginWithEmail: (email: string, password: string) => Promise<void>
  signUpWithEmail: (email: string, password: string, displayName?: string) => Promise<void>
  logout: () => Promise<void>
  authError: string | null
  clearAuthError: () => void
}

const SupabaseAuthContext = createContext<SupabaseAuthContextValue | null>(null)

function formatAuthError(message: string): string {
  if (message.includes('Invalid login credentials') || message.includes('invalid_credentials'))
    return 'Invalid email or password.'
  if (message.includes('User not found')) return 'No account found for this email.'
  if (message.includes('already registered') || message.includes('already_exists'))
    return 'This email is already registered.'
  if (message.includes('Password')) return 'Password should be at least 6 characters.'
  if (message.includes('Invalid email')) return 'Please enter a valid email address.'
  if (message.includes('too many requests')) return 'Too many attempts. Try again later.'
  return message
}

function mapSupabaseUser(u: { id: string; email?: string | null; user_metadata?: Record<string, unknown>; is_anonymous?: boolean } | null): AuthUser | null {
  if (!u) return null
  const meta = (u.user_metadata ?? {}) as Record<string, unknown>
  return {
    uid: u.id,
    name: (meta.full_name ?? meta.name ?? null) as string | null,
    email: u.email ?? null,
    picture: (meta.avatar_url ?? meta.picture ?? null) as string | null,
    isAnonymous: u.is_anonymous ?? false,
  }
}

export function SupabaseAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [authError, setAuthError] = useState<string | null>(null)

  useEffect(() => {
    const client = supabase
    if (!client) {
      setIsLoading(false)
      return
    }

    const { data: { subscription } } = client.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        setUser(mapSupabaseUser(session.user))
      } else {
        try {
          const { data, error } = await client.auth.signInAnonymously()
          if (error) throw error
          setUser(data.user ? mapSupabaseUser(data.user) : null)
        } catch {
          setUser(null)
        }
      }
      setIsLoading(false)
    })

    void client.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(mapSupabaseUser(session.user))
      } else {
        void client.auth.signInAnonymously().then(({ data, error }) => {
          if (!error && data.user) setUser(mapSupabaseUser(data.user))
          else setUser(null)
        })
      }
      setIsLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const login = useCallback(async () => {
    if (!supabase) return
    setAuthError(null)
    setIsLoading(true)
    try {
      const redirectTo = typeof window !== 'undefined' ? window.location.origin : undefined
      const { data: { user: current } } = await supabase.auth.getUser()
      if (current?.is_anonymous) {
        const { error } = await supabase.auth.linkIdentity({
          provider: 'google',
          ...(redirectTo && { options: { redirectTo } }),
        })
        if (error) throw error
      } else {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          ...(redirectTo && { options: { redirectTo } }),
        })
        if (error) throw error
      }
    } catch (e) {
      setAuthError(e instanceof Error ? e.message : 'Google sign-in failed')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const loginWithEmail = useCallback(async (email: string, password: string) => {
    if (!supabase) return
    setAuthError(null)
    setIsLoading(true)
    try {
      const { data: { user: current } } = await supabase.auth.getUser()
      if (current?.is_anonymous) {
        const { error } = await supabase.auth.updateUser({ email: email.trim(), password })
        if (error) throw error
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password })
        if (error) throw error
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Sign-in failed'
      setAuthError(msg.includes('supabase') || msg.includes('Auth') ? formatAuthError(msg) : msg)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const signUpWithEmail = useCallback(
    async (email: string, password: string, displayName?: string) => {
      if (!supabase) return
      setAuthError(null)
      setIsLoading(true)
      try {
        const { data: { user: current } } = await supabase.auth.getUser()
        if (current?.is_anonymous) {
          const { error } = await supabase.auth.updateUser({
            email: email.trim(),
            password,
            data: displayName?.trim() ? { full_name: displayName.trim() } : undefined,
          })
          if (error) throw error
        } else {
          const { error } = await supabase.auth.signUp({
            email: email.trim(),
            password,
            options: { data: displayName?.trim() ? { full_name: displayName.trim() } : undefined },
          })
          if (error) throw error
        }
      } catch (e) {
        const msg = e instanceof Error ? e.message : 'Sign-up failed'
        setAuthError(formatAuthError(msg))
      } finally {
        setIsLoading(false)
      }
    },
    []
  )

  const logout = useCallback(async () => {
    if (supabase) await supabase.auth.signOut()
    setUser(null)
    setAuthError(null)
  }, [])

  const clearAuthError = useCallback(() => setAuthError(null), [])

  const value: SupabaseAuthContextValue = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    loginWithEmail,
    signUpWithEmail,
    logout,
    authError,
    clearAuthError,
  }

  return (
    <SupabaseAuthContext.Provider value={value}>
      {children}
    </SupabaseAuthContext.Provider>
  )
}

const fallbackValue: SupabaseAuthContextValue = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  login: async () => {},
  loginWithEmail: async () => {},
  signUpWithEmail: async () => {},
  logout: async () => {},
  authError: null,
  clearAuthError: () => {},
}

export function FallbackAuthProvider({ children }: { children: ReactNode }) {
  return (
    <SupabaseAuthContext.Provider value={fallbackValue}>
      {children}
    </SupabaseAuthContext.Provider>
  )
}

export function useSupabaseAuth() {
  const ctx = useContext(SupabaseAuthContext)
  return ctx ?? fallbackValue
}
