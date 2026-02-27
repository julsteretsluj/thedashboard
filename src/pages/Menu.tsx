import { NavLink } from 'react-router-dom'
import Breadcrumbs from '../components/Breadcrumbs'

const navItems = [
  { to: '/', label: '🌐 Dashboard' },
  { to: '/chair', label: 'Chair' },
  { to: '/delegate', label: 'Delegate' },
  { to: '/globe', label: 'Globe' },
  { to: '/about', label: 'About' },
  { to: '/guide/chair', label: 'Chair guide' },
  { to: '/guide/delegate', label: 'Delegate guide' },
]

export default function MenuPage() {
  return (
    <div className="max-w-[680px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <Breadcrumbs
        items={[
          { label: 'Dashboard', href: '/' },
          { label: 'Menu' },
        ]}
        className="mb-4"
      />
      <div className="card-block p-4 sm:p-6">
        <h1 className="text-xl sm:text-2xl font-semibold text-[var(--text)] mb-1">Menu</h1>
        <p className="text-sm text-[var(--text-muted)] mb-4">
          Quick links to all navigation sections.
        </p>
        <nav className="flex flex-col gap-2">
          {navItems.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-[var(--brand)] text-white'
                    : 'text-[var(--text)] bg-[var(--bg-elevated)] border border-[var(--border)] hover:bg-[var(--bg-card)]'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  )
}
