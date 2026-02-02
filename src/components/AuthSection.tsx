import { useAuth0 } from '@auth0/auth0-react'
import { LogIn, LogOut, User } from 'lucide-react'

export default function AuthSection() {
  const { loginWithRedirect, logout, isAuthenticated, user, isLoading } = useAuth0()

  if (isLoading) {
    return (
      <span className="text-xs text-[var(--text-muted)] px-3 py-2">Loading…</span>
    )
  }

  if (isAuthenticated && user) {
    return (
      <div className="flex items-center gap-2">
        <div className="hidden sm:flex items-center gap-2 text-sm text-[var(--text-muted)]">
          {user.picture ? (
            <img
              src={user.picture}
              alt={user.name ?? 'User'}
              className="w-7 h-7 rounded-lg object-cover border border-[var(--border)]"
            />
          ) : (
            <div className="w-7 h-7 rounded-lg bg-[var(--brand-soft)] flex items-center justify-center">
              <User className="w-3.5 h-3.5 text-[var(--brand)]" />
            </div>
          )}
          <span className="text-[var(--text)] max-w-[120px] truncate">{user.name ?? user.email}</span>
        </div>
        <button
          type="button"
          onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--bg-card)] transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          Log out
        </button>
      </div>
    )
  }

  return (
    <button
      type="button"
      onClick={() => loginWithRedirect()}
      className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-[var(--brand)] text-white hover:opacity-90 transition-opacity"
    >
      <LogIn className="w-3.5 h-3.5" />
      Log in
    </button>
  )
}
