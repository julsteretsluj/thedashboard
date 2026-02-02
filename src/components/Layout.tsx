import { Outlet, NavLink } from 'react-router-dom'
import AuthSection from './AuthSection'
import ThemeSelector from './ThemeSelector'
import Logo from './Logo'

const nav = [
  { to: '/', label: '🏠 Home' },
  { to: '/chair', label: '⚖️ Chair Room' },
  { to: '/delegate', label: '📄 Delegate' },
]

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--bg-base)]/95 backdrop-blur-sm shadow-[0_1px_0_0_var(--border)]">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <NavLink to="/" className="font-serif text-xl text-[var(--text)] hover:text-[var(--brand)] transition-colors flex items-center gap-2.5 whitespace-nowrap min-w-0">
              <Logo className="h-8 w-auto flex-shrink-0" />
              <span>SEAMUNs Dashboard</span>
              <span className="text-[var(--brand)]/80 text-base">◆</span>
            </NavLink>
            <a
              href="https://seamuns.site"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-[var(--text-muted)] hover:text-[var(--brand)] transition-colors hidden sm:inline"
            >
              seamuns.site
            </a>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeSelector />
            <nav className="flex items-center gap-1.5 p-1 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border)] flex-nowrap">
              {nav.map(({ to, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                      isActive
                        ? 'bg-[var(--brand)] text-white shadow-sm'
                        : 'text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--bg-card)]'
                    }`
                  }
                >
                  {label}
                </NavLink>
              ))}
            </nav>
            {import.meta.env.VITE_AUTH0_DOMAIN && import.meta.env.VITE_AUTH0_CLIENT_ID && (
              <AuthSection />
            )}
          </div>
        </div>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t border-[var(--border)] py-3 px-4 text-center text-xs text-[var(--text-muted)] bg-[var(--bg-elevated)]/50">
        Part of <a href="https://seamuns.site" target="_blank" rel="noopener noreferrer" className="text-[var(--brand)] hover:underline">SEAMUNs</a> — Model UN conferences across South East Asia
      </footer>
    </div>
  )
}
