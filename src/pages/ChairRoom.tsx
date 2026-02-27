import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ChairProvider, useChair } from '../context/ChairContext'
import { useSupabaseAuth } from '../context/SupabaseAuthContext'
import {
  LayoutGrid,
  Users,
  FileText,
  ScrollText,
  Vote,
  Plus,
  Trash2,
  BookOpen,
  ListOrdered,
  Play,
  Mic,
  AlertTriangle,
  Archive,
  Settings,
  Gavel,
  PanelLeftClose,
  PanelLeft,
  Link as LinkIcon,
  CheckSquare,
  ListChecks,
  Save,
  Trophy,
  ChevronLeft,
  ChevronRight,
  Shuffle,
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
import ChairRoomView from '../components/chair/ChairRoomView'
import { PRESET_CONFERENCES } from '../constants/presetConferences'
import ChairDelegates from '../components/chair/ChairDelegates'
import ChairMotions from '../components/chair/ChairMotions'
import ChairResolutions from '../components/chair/ChairResolutions'
import ChairVoting from '../components/chair/ChairVoting'
import ChairCommitteeTopic from '../components/chair/ChairCommitteeTopic'
import ChairScore from '../components/chair/ChairScore'
import ChairRollCall from '../components/chair/ChairRollCall'
import ChairSession from '../components/chair/ChairSession'
import ChairSpeakers from '../components/chair/ChairSpeakers'
import ActiveSpeakerBar from '../components/chair/ActiveSpeakerBar'
import ActiveSessionBar from '../components/chair/ActiveSessionBar'
import ActiveVotingBar from '../components/chair/ActiveVotingBar'
import ChairCrisis from '../components/chair/ChairCrisis'
import ChairArchive from '../components/chair/ChairArchive'
import ChairDelegateTracker from '../components/chair/ChairDelegateTracker'
import ChairFlowChecklist from '../components/chair/ChairFlowChecklist'
import ChairPrepChecklist from '../components/chair/ChairPrepChecklist'
import ChairHowToGuide from '../components/ChairHowToGuide'
import ChairSetupChecklist from '../components/chair/ChairSetupChecklist'
import ChairRandomizer from '../components/chair/ChairRandomizer'
import OfficialUnLinks from '../components/OfficialUnLinks'
import Breadcrumbs from '../components/Breadcrumbs'

// Order: setup → session flow → tracking → reference
const SECTION_IDS = ['committee', 'prep', 'flow', 'delegates', 'room', 'rollcall', 'session', 'speakers', 'randomizer', 'motions', 'resolutions', 'voting', 'score', 'crisis', 'tracker', 'archive', 'links'] as const

const sections = [
  { id: 'committee', label: '📌 Committee & Topic', icon: BookOpen },
  { id: 'prep', label: '✅ Prep checklist', icon: ListChecks },
  { id: 'flow', label: '📋 Flow checklist', icon: CheckSquare },
  { id: 'delegates', label: '👥 Delegates', icon: Users },
  { id: 'room', label: '🖥️ Digital Room', icon: LayoutGrid },
  { id: 'rollcall', label: '✅ Roll Call', icon: ListOrdered },
  { id: 'session', label: '▶️ Session', icon: Play },
  { id: 'speakers', label: '🎤 Speakers', icon: Mic },
  { id: 'randomizer', label: '🎲 Random picker', icon: Shuffle },
  { id: 'motions', label: '📜 Motions & Points', icon: FileText },
  { id: 'resolutions', label: '📄 Resolutions', icon: ScrollText },
  { id: 'voting', label: '🗳️ Voting', icon: Vote },
  { id: 'score', label: '📊 Point and motion tracker', icon: ListOrdered },
  { id: 'crisis', label: '⚠️ Crisis', icon: AlertTriangle },
  { id: 'tracker', label: '🏆 Delegate Tracker', icon: Trophy },
  { id: 'archive', label: '📁 Archive', icon: Archive },
  { id: 'links', label: '🔗 Official links', icon: LinkIcon },
]

function ChairRoomContent({ active, setActive }: { active: string; setActive: (id: string) => void }) {
  const goToSpeakers = () => setActive('speakers')
  const goToSession = () => setActive('session')
  const goToVoting = () => setActive('voting')
  const [showSettings, setShowSettings] = useState(false)
  const [sidebarExpanded, setSidebarExpanded] = useState(getSidebarExpanded)
  const { saveToAccount, isLoaded } = useChair()

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
        className={`hidden lg:block border-b lg:border-b-0 lg:border-r border-[var(--border)] bg-[var(--bg-elevated)] flex-shrink-0 overflow-x-auto overflow-y-hidden transition-[width] duration-200 ${
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
            onClick={() => setShowSettings(!showSettings)}
            title="Settings"
            className={`flex items-center gap-1.5 px-2 py-1.5 rounded-md text-xs text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--bg-card)] mt-auto shrink-0 ${
              sidebarExpanded ? 'w-full lg:w-max lg:min-w-0' : 'w-full lg:justify-center lg:px-1.5 lg:w-full'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span className={sidebarExpanded ? 'lg:whitespace-nowrap' : 'truncate lg:sr-only lg:overflow-hidden lg:w-0'}>⚙️ Settings</span>
          </button>
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
      <main className="flex-1 flex flex-col overflow-auto min-w-0">
        <div className="p-2 sm:p-3 md:p-5 flex-1 overflow-auto">
        <div className="lg:hidden mb-3 flex items-center gap-2">
          <select
            value={active}
            onChange={(e) => setActive(e.target.value)}
            className="flex-1 min-w-0 px-3 py-2 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border)] text-sm text-[var(--text)]"
            aria-label="Select Chair Room section"
          >
            {sections.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => setShowSettings((v) => !v)}
            className="px-3 py-2 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border)] text-xs text-[var(--text-muted)] hover:text-[var(--text)]"
          >
            Settings
          </button>
        </div>
        <ActiveSessionBar onSessionClick={goToSession} />
        <ActiveVotingBar onVotingClick={goToVoting} />
        <ActiveSpeakerBar onSpeakersClick={goToSpeakers} />
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
                  <span className="hidden sm:inline">{prev?.label ?? 'Previous'}</span>
                  <span className="sm:hidden">Prev</span>
                </button>
                <button
                  type="button"
                  onClick={() => next && setActive(next.id)}
                  disabled={!next}
                  className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--bg-elevated)] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                  title={next ? `Next: ${next.label}` : undefined}
                >
                  <span className="hidden sm:inline">{next?.label ?? 'Next'}</span>
                  <span className="sm:hidden">Next</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </>
            )
          })()}
        </div>
        <ChairSetupChecklist />
        {showSettings && (
          <div className="mb-6 p-4 card-block">
            <ChairCommitteeTopic onClose={() => setShowSettings(false)} />
          </div>
        )}
        {active === 'prep' && <ChairPrepChecklist />}
        {active === 'flow' && <ChairFlowChecklist />}
        {active === 'room' && <ChairRoomView />}
        {active === 'delegates' && <ChairDelegates />}
        {active === 'motions' && <ChairMotions />}
        {active === 'resolutions' && <ChairResolutions />}
        {active === 'voting' && <ChairVoting />}
        {active === 'committee' && <ChairCommitteeTopic />}
        {active === 'score' && <ChairScore />}
        {active === 'rollcall' && <ChairRollCall />}
        {active === 'session' && <ChairSession />}
        {active === 'speakers' && <ChairSpeakers />}
        {active === 'randomizer' && <ChairRandomizer />}
        {active === 'crisis' && <ChairCrisis />}
        {active === 'tracker' && <ChairDelegateTracker />}
        {active === 'archive' && <ChairArchive />}
        {active === 'links' && (
          <div className="card-block p-4 sm:p-6">
            <OfficialUnLinks showHeading={true} />
          </div>
        )}
        <ChairHowToGuide />
        </div>
      </main>
    </div>
  )
}

function ChairRoomHeader({ activeSection }: { activeSection: string }) {
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
  } = useChair()
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
        <Gavel className="w-4 sm:w-5 h-4 sm:h-5 text-[var(--accent)]" />
      </div>
      <div className="min-w-0 flex-1">
        <Breadcrumbs
          items={[
            { label: 'Dashboard', href: '/' },
            { label: 'Chair Room', href: '/chair' },
            { label: sections.find((s) => s.id === activeSection)?.label ?? activeSection },
          ]}
          className="mb-1"
        />
        <h1 className="page-title text-[var(--text)] truncate">⚖️ Chair Room</h1>
        <p className="text-xs sm:text-sm text-[var(--text-muted)] truncate">🖥️ Digital Room · 📜 Motions · 🗳️ Voting · 🎤 Speakers</p>
        {isLoaded && !isAuthenticated && (
          <p className="text-xs text-[var(--text-muted)] mt-1">
            Sign in to save conferences to your account and sync across devices.
          </p>
        )}
        {isLoaded && isAuthenticated && (
          <p className="text-xs text-[var(--text-muted)] mt-1">
            Data is saved to your account.
          </p>
        )}
      </div>
      {isLoaded && (
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <label className="flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
            <span className="hidden sm:inline">Conference</span>
            <select
              value={activeConferenceId}
              onChange={(e) => setActiveConference(e.target.value)}
            className="w-full sm:w-auto min-w-[8rem] px-2.5 py-1.5 rounded-lg bg-[var(--bg-base)] border border-[var(--border)] text-[var(--text)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
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
            className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-[var(--accent)] text-white hover:opacity-90 transition-opacity"
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
              className="w-full sm:w-auto px-2.5 py-1.5 rounded-lg text-xs font-medium bg-[var(--accent-soft)] text-[var(--accent)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
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
            <>
              <button
                type="button"
                onClick={() => saveToAccount()}
                disabled={isSaving}
                className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-[var(--brand)] text-white hover:opacity-90 transition-opacity disabled:opacity-60"
              >
                <Save className="w-3.5 h-3.5" />
                {isSaving ? 'Saving…' : 'Save to account'}
              </button>
                  {lastSaved && !isSaving && (
                <span className="text-xs text-[var(--text-muted)]" title="Auto-saved to your account">
                  Auto-saved {formatSaved(lastSaved)}
                </span>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}

export default function ChairRoom() {
  const { user } = useSupabaseAuth()
  const userId = user?.uid ?? null
  const location = useLocation()
  const navigate = useNavigate()
  const hashToSection = (): string => {
    const hash = location.hash.replace(/^#/, '')
    return hash && SECTION_IDS.includes(hash as (typeof SECTION_IDS)[number]) ? hash : 'committee'
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
    <ChairProvider userId={userId}>
      <ChairRoomHeader activeSection={active} />
      <ChairRoomContent active={active} setActive={setActive} />
    </ChairProvider>
  )
}
