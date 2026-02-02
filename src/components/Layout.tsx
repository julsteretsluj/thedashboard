import { Outlet, NavLink } from 'react-router-dom'

const nav = [
  { to: '/', label: '🏠 Home' },
  { to: '/chair', label: '⚖️ Chair Room' },
  { to: '/delegate', label: '📄 Delegate' },
]

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--bg-base)]/90 backdrop-blur-md">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 flex items-center justify-between h-14">
          <NavLink to="/" className="font-serif text-xl text-[var(--text)] hover:text-[var(--accent)] transition-colors">
            MUN Dashboard <span className="text-[var(--accent)]/70 text-lg">◆</span>
          </NavLink>
          <nav className="flex items-center gap-1">
            {nav.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-[var(--accent-soft)] text-[var(--accent)]'
                      : 'text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--bg-card)]'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  )
}
