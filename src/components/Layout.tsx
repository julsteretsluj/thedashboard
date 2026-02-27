import { Outlet, NavLink } from 'react-router-dom'
import { Menu } from 'lucide-react'
import AuthSection from './AuthSection'
import ThemeSelector from './ThemeSelector'
import Logo from './Logo'

const nav = [
  { to: '/', label: '🌐 Dashboard' },
  { to: '/chair', label: 'Chair' },
  { to: '/delegate', label: 'Delegate' },
  { to: '/globe', label: 'Globe' },
  { to: '/about', label: 'About' },
  { to: '/guide/chair', label: 'Chair guide' },
  { to: '/guide/delegate', label: 'Delegate guide' },
]

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--bg-base)]/95 backdrop-blur-sm shadow-[0_1px_0_0_var(--border)]">
        <div className="max-w-[1600px] mx-auto px-2 sm:px-4 py-1.5 sm:py-2 flex items-center justify-between gap-2 min-h-0">
          <div className="flex items-center gap-1.5 sm:gap-3 min-w-0">
            <NavLink
              to="/"
              className="font-semibold text-base sm:text-lg md:text-xl text-[var(--text)] hover:text-[var(--brand)] transition-colors flex items-center gap-1.5 sm:gap-2 whitespace-nowrap min-w-0 py-1"
            >
              <Logo className="h-5 sm:h-7 w-auto flex-shrink-0" />
              <span className="hidden sm:inline truncate">SEAMUNs Dashboard</span>
              <span className="sm:hidden truncate">SEAMUNs</span>
              <span className="text-[var(--brand)]/80 text-sm hidden sm:inline">◆</span>
            </NavLink>
            <a
              href="https://seamuns.site"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-[var(--text-muted)] hover:text-[var(--brand)] transition-colors hidden md:inline"
            >
              seamuns.site
            </a>
          </div>
          {/* Desktop nav + theme + auth */}
          <div className="hidden md:flex items-center gap-1.5">
            <ThemeSelector />
            <nav className="flex items-center gap-0.5 p-0.5 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border)] flex-nowrap">
              {nav.map(({ to, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) =>
                    `px-2.5 py-1 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
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
            {import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY && (
              <AuthSection />
            )}
          </div>
          {/* Mobile: menu button */}
          <div className="flex md:hidden items-center gap-0.5">
            <ThemeSelector />
            <NavLink
              to="/menu"
              className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--bg-card)] transition-colors"
              aria-label="Open menu"
            >
              <Menu className="w-4 h-4" />
            </NavLink>
          </div>
        </div>
      </header>
      <main className="main-content flex-1 min-w-0">
        <Outlet />
      </main>
      <footer className="border-t border-[var(--border)] py-2 sm:py-3 px-3 sm:px-4 text-center text-[10px] sm:text-xs text-[var(--text-muted)] bg-[var(--bg-elevated)]/50">
        Part of <a href="https://seamuns.site" target="_blank" rel="noopener noreferrer" className="text-[var(--brand)] hover:underline">SEAMUNs</a> — Model UN conferences across South East Asia
        <span className="block mt-1 opacity-70" title="You see this when the latest build (AL, EU, IOPC, UKPC, PC, HCC committees) is deployed">Build: committees+allocations</span>
      </footer>
    </div>
  )
}
