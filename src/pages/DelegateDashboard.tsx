import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
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
  ChevronLeft,
  ChevronRight,
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
import DelegateSetupChecklist from '../components/delegate/DelegateSetupChecklist'
import OfficialUnLinks from '../components/OfficialUnLinks'
import Breadcrumbs from '../components/Breadcrumbs'
import { PRESET_CONFERENCES } from '../constants/presetConferences'
import { User } from 'lucide-react'

function DelegateDashboardHeader({ activeSection }: { activeSection: string }) {
  const {
    conferences,
    activeConferenceId,
    setActiveConference,
    addConference,
    addConferenceFromPreset,
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
        <Breadcrumbs
          items={[
            { label: 'Dashboard', href: '/' },
            { label: 'Delegate Dashboard', href: '/delegate' },
            { label: sections.find((s) => s.id === activeSection)?.label ?? activeSection },
          ]}
          className="mb-1"
        />
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
          {PRESET_CONFERENCES.length > 0 && (
            <select
              value=""
              onChange={(e) => {
                const v = e.target.value
                if (v) {
                  addConferenceFromPreset(v)
                  e.target.value = ''
                }
              }}
              className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-[var(--accent-soft)] text-[var(--accent)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
              aria-label="Add from preset"
            >
              <option value="">From preset…</option>
              {PRESET_CONFERENCES.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} {p.location ? `(${p.location})` : ''}
                </option>
              ))}
            </select>
          )}
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

const DELEGATE_SECTION_IDS = ['country', 'countdown', 'matrix', 'prep', 'sources', 'resources', 'checklist', 'links'] as const

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

function DelegateDashboardContent({ active, setActive }: { active: string; setActive: (id: string) => void }) {
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
        <div className="flex items-center justify-between gap-2 mb-3 py-1">
          {(() => {
            const idx = sections.findIndex((s) => s.id === active)
            const prev = idx > 0 ? sections[idx - 1] : null
            const next = idx >= 0 && idx < sections.length - 1 ? sections[idx + 1] : null
            return (
              <>
                <button
                  type="button"
                  onClick={() => prev && setActive(prev.id)}
                  disabled={!prev}
                  className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--bg-elevated)] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                  title={prev ? `Previous: ${prev.label}` : undefined}
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  {prev?.label ?? 'Previous'}
                </button>
                <button
                  type="button"
                  onClick={() => next && setActive(next.id)}
                  disabled={!next}
                  className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--bg-elevated)] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                  title={next ? `Next: ${next.label}` : undefined}
                >
                  {next?.label ?? 'Next'}
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </>
            )
          })()}
        </div>
        <DelegateSetupChecklist />
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
  const location = useLocation()
  const navigate = useNavigate()
  const hashToSection = (): string => {
    const hash = location.hash.replace(/^#/, '')
    return hash && DELEGATE_SECTION_IDS.includes(hash as (typeof DELEGATE_SECTION_IDS)[number]) ? hash : 'country'
  }
  const [active, setActive] = useState(() => hashToSection())

  useEffect(() => {
    const fromHash = hashToSection()
    setActive((prev) => (fromHash !== prev ? fromHash : prev))
  }, [location.hash])

  useEffect(() => {
    const target = `${location.pathname}#${active}`
    if (location.pathname + (location.hash || '') !== target) {
      navigate(target, { replace: true })
    }
  }, [active, location.pathname, location.hash, navigate])

  return (
    <DelegateProvider userId={userId}>
      <DelegateDashboardHeader activeSection={active} />
      <DelegateDashboardContent active={active} setActive={setActive} />
    </DelegateProvider>
  )
}
