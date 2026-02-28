import { useMemo, useState } from 'react'
import { Outlet, NavLink, useLocation } from 'react-router-dom'
import { Menu } from 'lucide-react'
import AuthSection from './AuthSection'
import ThemeSelector from './ThemeSelector'
import Logo from './Logo'
import { NAV_ITEMS } from '../constants/navigation'
import HelpTour, { HelpButton, type TourStep } from './HelpTour'

function getHelpSteps(pathname: string): TourStep[] {
  if (pathname === '/chair') {
    return [
      { target: '[data-tour="app-header"]', title: 'Chair Room quick help', body: 'Use the top navigation to move between tools and keep your flow fast during committee.' },
      { target: '[data-tour="page-content"]', title: 'Chair workspace', body: 'This page centralizes delegates, session flow, motions, voting, and tracking in one place.' },
      { target: '[data-tour="app-footer"]', title: 'Need references?', body: 'Use About and setup guides from the nav for Rules of Procedure refreshers and setup checklists.' },
    ]
  }
  if (pathname === '/delegate') {
    return [
      { target: '[data-tour="app-header"]', title: 'Delegate Dashboard help', body: 'Use the top navigation to switch between prep pages and tools without losing context.' },
      { target: '[data-tour="page-content"]', title: 'Delegate prep tools', body: 'Track country stance, research matrix, sources, resources, and checklist progress here.' },
      { target: '[data-tour="app-footer"]', title: 'Guides and support', body: 'Open the delegate guide from the nav whenever you need a structured preparation walkthrough.' },
    ]
  }
  if (pathname === '/guide/chair' || pathname === '/guide/delegate') {
    return [
      { target: '[data-tour="app-header"]', title: 'Setup guide navigation', body: 'Use nav tabs to switch between dashboard and guides as you complete setup tasks.' },
      { target: '[data-tour="page-content"]', title: 'Step-by-step flow', body: 'Work through each section in order and return later anytime; your dashboard data remains available.' },
      { target: '[data-tour="app-footer"]', title: 'Back to dashboard', body: 'When finished, head back to Chair Room or Delegate Dashboard to continue live prep.' },
    ]
  }
  if (pathname === '/about') {
    return [
      { target: '[data-tour="app-header"]', title: 'About this platform', body: 'This page explains what each tool does and where to find it in your conference workflow.' },
      { target: '[data-tour="page-content"]', title: 'Feature overview', body: 'Use this page as a quick index before sharing the app with chairs and delegates.' },
      { target: '[data-tour="app-footer"]', title: 'Need hands-on setup?', body: 'Open the Chair/Delegate guides from navigation for step-by-step setup help.' },
    ]
  }
  if (pathname === '/menu') {
    return [
      { target: '[data-tour="app-header"]', title: 'Mobile menu help', body: 'This page mirrors key navigation links for smaller screens.' },
      { target: '[data-tour="page-content"]', title: 'Open tools quickly', body: 'Tap any item to jump directly to its page; use this as your mobile command center.' },
      { target: '[data-tour="app-footer"]', title: 'Theme and account', body: 'Theme and account actions stay available in the header while using menu navigation.' },
    ]
  }
  return [
    { target: '[data-tour="app-header"]', title: 'Welcome to SEAMUNs Dashboard', body: 'Use the top navigation to move between Chair tools, Delegate prep, Globe, and guides.' },
    { target: '[data-tour="page-content"]', title: 'Your working area', body: 'Each page focuses on one part of conference prep or live committee management.' },
    { target: '[data-tour="app-footer"]', title: 'Quick reference', body: 'The footer confirms build context and links back to seamuns.site for broader conference info.' },
  ]
}

export default function Layout() {
  const { pathname } = useLocation()
  const [tourOpen, setTourOpen] = useState(false)
  const helpSteps = useMemo(() => getHelpSteps(pathname), [pathname])
  const showGlobalHelp = pathname !== '/globe'

  return (
    <div className="min-h-screen flex flex-col">
      {showGlobalHelp && (
        <>
          <div className="fixed right-3 bottom-3 sm:right-4 sm:bottom-4 z-[60]">
            <div className="rounded-full border border-[var(--border)] bg-[var(--bg-card)] shadow-lg p-0.5">
              <HelpButton onClick={() => setTourOpen(true)} />
            </div>
          </div>
          <HelpTour steps={helpSteps} isOpen={tourOpen} onClose={() => setTourOpen(false)} />
        </>
      )}
      <header data-tour="app-header" className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--bg-base)]/95 backdrop-blur-sm shadow-[0_1px_0_0_var(--border)]">
        <div className="max-w-[1600px] mx-auto px-2 sm:px-4 py-1.5 sm:py-2 flex items-center justify-between gap-2 min-h-0">
          <div className="flex items-center gap-1.5 sm:gap-3 min-w-0">
            <NavLink
              to="/"
              data-tour="brand-link"
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
              {NAV_ITEMS.map(({ to, label }) => (
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
      <main data-tour="page-content" className="main-content flex-1 min-w-0">
        <Outlet />
      </main>
      <footer data-tour="app-footer" className="border-t border-[var(--border)] py-2 sm:py-3 px-3 sm:px-4 text-center text-[10px] sm:text-xs text-[var(--text-muted)] bg-[var(--bg-elevated)]/50">
        Part of <a href="https://seamuns.site" target="_blank" rel="noopener noreferrer" className="text-[var(--brand)] hover:underline">SEAMUNs</a> — Model UN conferences across South East Asia
        <span className="block mt-1 opacity-70" title="You see this when the latest build (AL, EU, IOPC, UKPC, PC, HCC committees) is deployed">Build: committees+allocations</span>
      </footer>
    </div>
  )
}
