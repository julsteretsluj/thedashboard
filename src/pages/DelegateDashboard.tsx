import { useState, useEffect } from 'react'
import { DelegateProvider, useDelegate } from '../context/DelegateContext'
import { useSupabaseAuth } from '../context/SupabaseAuthContext'
import {
  Globe,
  FileText,
  BookOpen,
  CheckSquare,
  Clock,
  Users,
  Link as LinkIcon,
  PanelLeftClose,
  PanelLeft,
  Plus,
  Save,
  Trash2,
} from 'lucide-react'

const SIDEBAR_STORAGE_KEY = 'seamuns-dashboard-sidebar-expanded'

function getSidebarExpanded(): boolean {
  try {
    const v = localStorage.getItem(SIDEBAR_STORAGE_KEY)
    return v === null ? true : v === 'true'
  } catch {
    return true
  }
}
import DelegateCountry from '../components/delegate/DelegateCountry'
import DelegateMatrix from '../components/delegate/DelegateMatrix'
import DelegatePrep from '../components/delegate/DelegatePrep'
import DelegateSources from '../components/delegate/DelegateSources'
import DelegateResources from '../components/delegate/DelegateResources'
import DelegateChecklist from '../components/delegate/DelegateChecklist'
import DelegateCountdown from '../components/delegate/DelegateCountdown'
import DelegateHowToGuide from '../components/DelegateHowToGuide'
import OfficialUnLinks from '../components/OfficialUnLinks'
import { User } from 'lucide-react'

function DelegateDashboardHeader() {
  const {
    conferences,
    activeConferenceId,
    setActiveConference,
    addConference,
    removeConference,
    saveToAccount,
    isSaving,
    lastSaved,
    isLoaded,
  } = useDelegate()
  const { isAuthenticated } = useSupabaseAuth()
  const canRemove = conferences.length > 1

  const formatSaved = (d: Date) => {
    const n = Date.now() - d.getTime()
    if (n < 60_000) return 'Saved just now'
    if (n < 3600_000) return `Saved ${Math.floor(n / 60_000)}m ago`
    return d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })
  }

  return (
    <div className="border-b border-[var(--border)] bg-[var(--bg-elevated)] px-3 sm:px-4 py-2 sm:py-3 flex flex-wrap items-center gap-2 sm:gap-3 shadow-[0_1px_0_0_var(--border)]">
      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-[var(--accent-soft)] flex items-center justify-center flex-shrink-0">
        <User className="w-4 sm:w-5 h-4 sm:h-5 text-[var(--accent)]" />
      </div>
      <div className="min-w-0 flex-1">
        <h1 className="page-title text-[var(--text)] whitespace-nowrap truncate">📄 Delegate Dashboard</h1>
        <p className="text-xs sm:text-sm text-[var(--text-muted)] whitespace-nowrap truncate">🌍 Country · 📊 Matrix · 📝 Prep · ✅ Checklist · ⏱️ Countdown</p>
        {isLoaded && !isAuthenticated && (
          <p className="text-xs text-[var(--accent)] mt-1">
            Sign in and save to account so your data isn&apos;t lost on refresh or when switching devices.
          </p>
        )}
      </div>
      {isLoaded && (
        <div className="flex flex-wrap items-center gap-2">
          <label className="flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
            <span className="hidden sm:inline">Conference</span>
            <select
              value={activeConferenceId}
              onChange={(e) => setActiveConference(e.target.value)}
              className="min-w-[8rem] px-2.5 py-1.5 rounded-lg bg-[var(--bg-base)] border border-[var(--border)] text-[var(--text)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
              aria-label="Select conference"
            >
              {conferences.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name || 'Unnamed'}
                </option>
              ))}
            </select>
          </label>
          <button
            type="button"
            onClick={addConference}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-[var(--accent)] text-white hover:opacity-90 transition-opacity"
          >
            <Plus className="w-3.5 h-3.5" /> Add conference
          </button>
          {canRemove && (
            <button
              type="button"
              onClick={() => removeConference(activeConferenceId)}
              title="Remove this conference"
              className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs font-medium text-[var(--text-muted)] hover:text-[var(--danger)] hover:bg-[var(--bg-card)] transition-colors"
              aria-label="Remove conference"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
          {isAuthenticated && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => saveToAccount()}
                disabled={isSaving}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-[var(--brand)] text-white hover:opacity-90 transition-opacity disabled:opacity-60"
              >
                <Save className="w-3.5 h-3.5" />
                {isSaving ? 'Saving…' : 'Save to account'}
              </button>
              {lastSaved && !isSaving && (
                <span className="text-xs text-[var(--text-muted)]" title="Auto-saved to your account">
                  Auto-saved {formatSaved(lastSaved)}
                </span>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// Order: identity & timing → committees → prep → before conference → links
const sections = [
  { id: 'country', label: '🌍 Country & Stance', icon: Globe },
  { id: 'countdown', label: '⏱️ Countdown', icon: Clock },
  { id: 'matrix', label: '📊 Committee Matrix', icon: Users },
  { id: 'prep', label: '📝 Prep Template', icon: FileText },
  { id: 'sources', label: '🔗 Trusted & Nation Sources', icon: LinkIcon },
  { id: 'resources', label: '📚 Chair Report & Resources', icon: BookOpen },
  { id: 'checklist', label: '✅ Checklist', icon: CheckSquare },
  { id: 'links', label: '🔗 Official links', icon: LinkIcon },
]

function DelegateDashboardContent() {
  const [active, setActive] = useState('country')
  const [sidebarExpanded, setSidebarExpanded] = useState(getSidebarExpanded)
  const { saveToAccount, isLoaded } = useDelegate()

  useEffect(() => {
    localStorage.setItem(SIDEBAR_STORAGE_KEY, String(sidebarExpanded))
  }, [sidebarExpanded])

  useEffect(() => {
    if (isLoaded) saveToAccount()
  }, [active, isLoaded, saveToAccount])

  const toggleSidebar = () => setSidebarExpanded((v) => !v)

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-3rem)] sm:min-h-[calc(100vh-3.5rem)] lg:min-h-[calc(100vh-4rem)]">
      <aside
        className={`border-b lg:border-b-0 lg:border-r border-[var(--border)] bg-[var(--bg-elevated)] flex-shrink-0 overflow-x-auto overflow-y-hidden transition-[width] duration-200 ${
          sidebarExpanded ? 'lg:w-max lg:min-w-[11rem] lg:max-w-[14rem]' : 'lg:w-10'
        }`}
      >
        <div className="flex lg:flex-col gap-0.5 p-1 sm:p-1.5 items-stretch lg:items-stretch">
          {sections.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActive(id)}
              title={label}
              className={`flex items-center gap-1.5 px-2 py-1.5 rounded-md text-xs font-medium transition-colors text-left whitespace-nowrap min-w-0 shrink-0 ${
                sidebarExpanded ? 'w-full lg:w-max lg:min-w-0' : 'w-full lg:justify-center lg:px-1.5 lg:w-full'
              } ${
                active === id
                  ? 'bg-[var(--accent)] text-white shadow-sm'
                  : 'text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--bg-card)]'
              }`}
            >
              <Icon className="w-3.5 h-3.5 flex-shrink-0" />
              <span className={sidebarExpanded ? 'lg:whitespace-nowrap' : 'truncate lg:sr-only lg:overflow-hidden lg:w-0'}>{label}</span>
            </button>
          ))}
          <button
            type="button"
            onClick={toggleSidebar}
            title={sidebarExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
            className="hidden lg:flex items-center justify-center gap-1.5 px-1.5 py-1.5 rounded-md text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--bg-card)] transition-colors w-max"
          >
            {sidebarExpanded ? (
              <PanelLeftClose className="w-4 h-4 flex-shrink-0" />
            ) : (
              <PanelLeft className="w-4 h-4 flex-shrink-0" />
            )}
            {sidebarExpanded && <span className="text-xs font-medium whitespace-nowrap">Hide labels</span>}
          </button>
        </div>
      </aside>
      <main className="flex-1 p-2 sm:p-3 md:p-5 overflow-auto min-w-0">
        {active === 'country' && <DelegateCountry />}
        {active === 'matrix' && <DelegateMatrix />}
        {active === 'prep' && <DelegatePrep />}
        {active === 'sources' && <DelegateSources />}
        {active === 'links' && (
          <div className="card-block p-4 sm:p-6">
            <OfficialUnLinks showHeading={true} />
          </div>
        )}
        {active === 'resources' && <DelegateResources />}
        {active === 'checklist' && <DelegateChecklist />}
        {active === 'countdown' && <DelegateCountdown />}
        <DelegateHowToGuide />
      </main>
    </div>
  )
}

export default function DelegateDashboard() {
  const { user } = useSupabaseAuth()
  const userId = user?.uid ?? null

  return (
    <DelegateProvider userId={userId}>
      <DelegateDashboardHeader />
      <DelegateDashboardContent />
    </DelegateProvider>
  )
}
