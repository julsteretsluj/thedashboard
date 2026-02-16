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
  signInAnonymously,
  linkWithPopup,
  linkWithCredential,
  EmailAuthProvider,
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
  isAnonymous: boolean
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
    isAnonymous: u.isAnonymous ?? false,
  }
}

export function FirebaseAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [authError, setAuthError] = useState<string | null>(null)

  useEffect(() => {
    if (!auth) return
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(mapFirebaseUser(firebaseUser))
      } else {
        try {
          const cred = await signInAnonymously(auth!)
          setUser(mapFirebaseUser(cred.user))
        } catch {
          setUser(null)
        }
      }
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
      const current = auth.currentUser
      if (current?.isAnonymous) {
        await linkWithPopup(current, provider)
      } else {
        await signInWithPopup(auth, provider)
      }
    } catch (e) {
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
      const current = auth.currentUser
      if (current?.isAnonymous) {
        const credential = EmailAuthProvider.credential(email.trim(), password)
        await linkWithCredential(current, credential)
      } else {
        await signInWithEmailAndPassword(auth, email.trim(), password)
      }
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
        const current = auth.currentUser
        if (current?.isAnonymous) {
          const credential = EmailAuthProvider.credential(email.trim(), password)
          const linked = await linkWithCredential(current, credential)
          if (displayName?.trim() && linked.user) {
            await updateProfile(linked.user, { displayName: displayName.trim() })
          }
        } else {
          const cred = await createUserWithEmailAndPassword(auth, email.trim(), password)
          if (displayName?.trim() && cred.user) {
            await updateProfile(cred.user, { displayName: displayName.trim() })
          }
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
