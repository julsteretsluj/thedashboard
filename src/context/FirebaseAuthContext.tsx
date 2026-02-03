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
  signOut as firebaseSignOut,
  GoogleAuthProvider,
  type User as FirebaseUser,
} from 'firebase/auth'
import { auth } from '../lib/firebase'

export interface AuthUser {
  name: string | null
  email: string | null
  picture: string | null
}

interface FirebaseAuthContextValue {
  user: AuthUser | null
  isAuthenticated: boolean
  isLoading: boolean
  login: () => Promise<void>
  logout: () => Promise<void>
}

const FirebaseAuthContext = createContext<FirebaseAuthContextValue | null>(null)

function mapFirebaseUser(u: FirebaseUser | null): AuthUser | null {
  if (!u) return null
  return {
    name: u.displayName ?? null,
    email: u.email ?? null,
    picture: u.photoURL ?? null,
  }
}

export function FirebaseAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

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
    setIsLoading(true)
    try {
      const provider = new GoogleAuthProvider()
      await signInWithPopup(auth, provider)
    } catch {
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const logout = useCallback(async () => {
    if (auth) await firebaseSignOut(auth)
    setUser(null)
  }, [])

  const value: FirebaseAuthContextValue = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
  }

  return (
    <FirebaseAuthContext.Provider value={value}>
      {children}
    </FirebaseAuthContext.Provider>
  )
}

export function useFirebaseAuth() {
  const ctx = useContext(FirebaseAuthContext)
  if (!ctx) throw new Error('useFirebaseAuth must be used within FirebaseAuthProvider')
  return ctx
}
