import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import {
  onAuthStateChanged,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
  GoogleAuthProvider,
  type User as FirebaseUser,
} from 'firebase/auth'
import { auth } from '../lib/firebase'

export interface AuthUser {
  uid: string
  name: string | null
  email: string | null
  picture: string | null
}

interface FirebaseAuthContextValue {
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

const FirebaseAuthContext = createContext<FirebaseAuthContextValue | null>(null)

function formatAuthError(message: string): string {
  if (message.includes('auth/invalid-credential') || message.includes('auth/wrong-password'))
    return 'Invalid email or password.'
  if (message.includes('auth/user-not-found')) return 'No account found for this email.'
  if (message.includes('auth/email-already-in-use')) return 'This email is already registered.'
  if (message.includes('auth/weak-password')) return 'Password should be at least 6 characters.'
  if (message.includes('auth/invalid-email')) return 'Please enter a valid email address.'
  if (message.includes('auth/too-many-requests')) return 'Too many attempts. Try again later.'
  return message
}

function mapFirebaseUser(u: FirebaseUser | null): AuthUser | null {
  if (!u) return null
  return {
    uid: u.uid,
    name: u.displayName ?? null,
    email: u.email ?? null,
    picture: u.photoURL ?? null,
  }
}

export function FirebaseAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [authError, setAuthError] = useState<string | null>(null)

  useEffect(() => {
    if (!auth) return
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(mapFirebaseUser(firebaseUser))
      setIsLoading(false)
    })
    return () => unsubscribe()
  }, [])

  const login = useCallback(async () => {
    if (!auth) return
    setAuthError(null)
    setIsLoading(true)
    try {
      const provider = new GoogleAuthProvider()
      await signInWithPopup(auth, provider)
    } catch (e) {
      setUser(null)
      setAuthError(e instanceof Error ? e.message : 'Google sign-in failed')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const loginWithEmail = useCallback(async (email: string, password: string) => {
    if (!auth) return
    setAuthError(null)
    setIsLoading(true)
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password)
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Sign-in failed'
      setAuthError(msg.includes('auth/') ? formatAuthError(msg) : msg)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const signUpWithEmail = useCallback(
    async (email: string, password: string, displayName?: string) => {
      if (!auth) return
      setAuthError(null)
      setIsLoading(true)
      try {
        const cred = await createUserWithEmailAndPassword(auth, email.trim(), password)
        if (displayName?.trim() && cred.user) {
          await updateProfile(cred.user, { displayName: displayName.trim() })
        }
      } catch (e) {
        const msg = e instanceof Error ? e.message : 'Sign-up failed'
        setAuthError(msg.includes('auth/') ? formatAuthError(msg) : msg)
      } finally {
        setIsLoading(false)
      }
    },
    []
  )

  const logout = useCallback(async () => {
    if (auth) await firebaseSignOut(auth)
    setUser(null)
    setAuthError(null)
  }, [])

  const clearAuthError = useCallback(() => setAuthError(null), [])

  const value: FirebaseAuthContextValue = {
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
    <FirebaseAuthContext.Provider value={value}>
      {children}
    </FirebaseAuthContext.Provider>
  )
}

const fallbackValue: FirebaseAuthContextValue = {
  user: null as AuthUser | null,
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
    <FirebaseAuthContext.Provider value={fallbackValue}>
      {children}
    </FirebaseAuthContext.Provider>
  )
}

export function useFirebaseAuth() {
  const ctx = useContext(FirebaseAuthContext)
  return ctx ?? fallbackValue
}
