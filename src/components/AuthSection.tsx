import { useState, useRef, useEffect } from 'react'
import { LogIn, LogOut, User, Mail, ChevronDown } from 'lucide-react'
import { useFirebaseAuth } from '../context/FirebaseAuthContext'

export default function AuthSection() {
  const {
    login,
    loginWithEmail,
    signUpWithEmail,
    logout,
    isAuthenticated,
    user,
    isLoading,
    authError,
    clearAuthError,
  } = useFirebaseAuth()
  const [open, setOpen] = useState(false)
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [open])

  const handleOpen = () => {
    setOpen((o) => !o)
    if (!open) {
      clearAuthError()
      setEmail('')
      setPassword('')
      setDisplayName('')
    }
  }

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (mode === 'login') {
      loginWithEmail(email, password)
    } else {
      signUpWithEmail(email, password, displayName || undefined)
    }
  }

  if (isLoading && !open) {
    return (
      <span className="text-xs text-[var(--text-muted)] px-2 py-1.5">Loading…</span>
    )
  }

  if (isAuthenticated && user) {
    return (
      <div className="flex items-center gap-1.5">
        <div className="hidden sm:flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
          {user.picture ? (
            <img
              src={user.picture}
              alt={user.name ?? 'User'}
              className="w-6 h-6 rounded-lg object-cover border border-[var(--border)]"
            />
          ) : (
            <div className="w-6 h-6 rounded-lg bg-[var(--brand-soft)] flex items-center justify-center">
              <User className="w-3 h-3 text-[var(--brand)]" />
            </div>
          )}
          <span className="text-[var(--text)] max-w-[120px] truncate">{user.name ?? user.email}</span>
        </div>
        <button
          type="button"
          onClick={() => logout()}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--bg-card)] transition-colors"
        >
          <LogOut className="w-3 h-3" />
          Log out
        </button>
      </div>
    )
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={handleOpen}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-[var(--brand)] text-white hover:opacity-90 transition-opacity"
      >
        <LogIn className="w-3 h-3" />
        Log in / Sign up
        <ChevronDown className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 z-50 w-72 rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] shadow-lg p-3">
          <button
            type="button"
            onClick={() => { login(); setOpen(false); }}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-[var(--text)] bg-[var(--bg-card)] hover:bg-[var(--border)] border border-[var(--border)] transition-colors"
          >
            <Mail className="w-4 h-4 text-[var(--brand)]" />
            Continue with Gmail
          </button>
          <div className="my-3 border-t border-[var(--border)]" />
          <div className="flex gap-1 p-0.5 rounded-lg bg-[var(--bg-card)] border border-[var(--border)]">
            <button
              type="button"
              onClick={() => { setMode('login'); clearAuthError(); }}
              className={`flex-1 px-2 py-1.5 rounded-md text-xs font-medium transition-colors ${mode === 'login' ? 'bg-[var(--brand)] text-white' : 'text-[var(--text-muted)] hover:text-[var(--text)]'}`}
            >
              Log in
            </button>
            <button
              type="button"
              onClick={() => { setMode('signup'); clearAuthError(); }}
              className={`flex-1 px-2 py-1.5 rounded-md text-xs font-medium transition-colors ${mode === 'signup' ? 'bg-[var(--brand)] text-white' : 'text-[var(--text-muted)] hover:text-[var(--text)]'}`}
            >
              Sign up
            </button>
          </div>
          <form onSubmit={handleEmailSubmit} className="space-y-2 mt-2">
            {mode === 'signup' && (
              <label className="block">
                <span className="text-xs text-[var(--text-muted)]">Name (optional)</span>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Your name"
                  className="mt-0.5 w-full px-2.5 py-1.5 rounded-lg bg-[var(--bg-base)] border border-[var(--border)] text-[var(--text)] text-sm placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--brand)]"
                />
              </label>
            )}
            <label className="block">
              <span className="text-xs text-[var(--text-muted)]">Email</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                autoComplete={mode === 'login' ? 'email' : 'email'}
                className="mt-0.5 w-full px-2.5 py-1.5 rounded-lg bg-[var(--bg-base)] border border-[var(--border)] text-[var(--text)] text-sm placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--brand)]"
              />
            </label>
            <label className="block">
              <span className="text-xs text-[var(--text-muted)]">Password</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={mode === 'signup' ? 'At least 6 characters' : ''}
                required
                minLength={mode === 'signup' ? 6 : undefined}
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                className="mt-0.5 w-full px-2.5 py-1.5 rounded-lg bg-[var(--bg-base)] border border-[var(--border)] text-[var(--text)] text-sm placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--brand)]"
              />
            </label>
            {authError && (
              <p className="text-xs text-[var(--danger)]">{authError}</p>
            )}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium bg-[var(--brand)] text-white hover:opacity-90 transition-opacity disabled:opacity-60"
            >
              {isLoading ? 'Please wait…' : mode === 'login' ? 'Log in with email' : 'Create account'}
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
