import { LogIn, LogOut, User } from 'lucide-react'
import { useFirebaseAuth } from '../context/FirebaseAuthContext'

export default function AuthSection() {
  const { login, logout, isAuthenticated, user, isLoading } = useFirebaseAuth()

  if (isLoading) {
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
    <button
      type="button"
      onClick={() => login()}
      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-[var(--brand)] text-white hover:opacity-90 transition-opacity"
    >
      <LogIn className="w-3 h-3" />
      Log in with Gmail
    </button>
  )
}
