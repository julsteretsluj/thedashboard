import { useState, useRef, useLayoutEffect, useCallback, useEffect } from 'react'
import { useChair } from '../../context/ChairContext'
import { ChevronDown, ChevronLeft, ChevronRight, LayoutGrid, User, Star, Flag, ThumbsUp, MessageCircle } from 'lucide-react'
import type { DelegateScore } from '../../types'
import InfoPopover from '../InfoPopover'

/** Score options 1–8 — chairs select by number to distinguish close scores */
const SCORE_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8] as const

const DELEGATE_CRITERIA = [
  { key: 'creativity' as const, label: 'Creativity' },
  { key: 'diplomacy' as const, label: 'Diplomacy' },
  { key: 'collaboration' as const, label: 'Collaboration' },
  { key: 'leadership' as const, label: 'Leadership' },
  { key: 'knowledgeResearch' as const, label: 'Knowledge' },
  { key: 'participation' as const, label: 'Participation' },
] as const

const POSITION_PAPER_CRITERIA = [
  { key: 'researchDepth' as const, label: 'Research Depth' },
  { key: 'countryStanceAlignment' as const, label: 'Country Stance' },
  { key: 'policyAccuracy' as const, label: 'Policy Accuracy' },
  { key: 'proposedSolutions' as const, label: 'Proposed Solutions' },
  { key: 'formattingStyleCitations' as const, label: 'Formatting & Citations' },
] as const

/** Full SEAMUN I rubric — all criteria with level descriptions */
const FULL_RUBRIC = {
  delegate: [
    {
      label: 'Creativity',
      beginning: 'Proposes repetitive or standard solutions; rarely thinks outside the existing framework.',
      developing: 'Offers some original ideas but struggles to adapt them to changing committee dynamics.',
      proficient: 'Frequently suggests innovative solutions and unique clauses for draft resolutions.',
      exemplary: 'Highly creative; develops "game-changing" compromises that bridge clashing blocs.',
    },
    {
      label: 'Diplomacy',
      beginning: 'Lacks professional decorum; occasionally dismissive of other delegates\' viewpoints.',
      developing: 'Respectful but unremarkable; maintains a neutral presence without building rapport.',
      proficient: 'Consistently professional; actively seeks to understand and incorporate opposing views.',
      exemplary: 'Exemplifies true statesmanship; commands respect while remaining humble and inclusive.',
    },
    {
      label: 'Collaboration',
      beginning: 'Works in isolation or refuses to compromise on minor details; disrupts group work.',
      developing: 'Contributes to a bloc but does not take an active role in drafting or merging ideas.',
      proficient: 'A strong team player; helps merge resolutions and ensures all bloc members have a voice.',
      exemplary: 'The "glue" of the committee; brings disparate groups together and facilitates consensus.',
    },
    {
      label: 'Leadership',
      beginning: 'Passive; waits for others to initiate motions or start discussions during caucuses.',
      developing: 'Shows leadership in small groups but is hesitant to lead the house or present for the bloc.',
      proficient: 'Takes clear initiative; leads unmoderated caucuses and manages the drafting process.',
      exemplary: 'Visionary leader; sets the tone for the room and inspires others through action and guidance.',
    },
    {
      label: 'Knowledge & Research',
      beginning: 'Frequently confused by the topic; relies on generalities rather than specific facts.',
      developing: 'Has a basic understanding of the agenda but misses technical or legal nuances.',
      proficient: 'Demonstrates strong command of the topic; cites relevant stats and UN past actions.',
      exemplary: 'Expert-level mastery; uses deep research to navigate technical debates and debunk false info.',
    },
    {
      label: 'Participation',
      beginning: 'Rarely speaks; frequently absent during caucusing or inactive during voting.',
      developing: 'Speaks occasionally in moderated caucuses; participates only when prompted.',
      proficient: 'Consistently active in all sessions; frequently raises motions and contributes to the floor.',
      exemplary: 'Necessary and consistent presence; engages in every aspect of the debate from start to finish.',
    },
  ],
  positionPaper: [
    {
      label: 'Research Depth',
      beginning: 'Minimal data; lacks specific UN resolutions, treaty citations, or historical context.',
      developing: 'Basic data provided; mentions well-known treaties but lacks specific localised evidence.',
      proficient: 'Strong research; includes relevant stats, past UN actions, and committee-specific history.',
      exemplary: 'Exceptional depth; identifies niche legal loopholes, specific funding gaps, or rare data points.',
    },
    {
      label: 'Country Stance Alignment',
      beginning: 'Frequently contradicts the assigned country\'s real-world geopolitical interests or voting history.',
      developing: 'Generally follows policy but lacks clarity on sensitive or controversial national stances.',
      proficient: 'Consistently accurate; clearly reflects the nation\'s strategic regional and global interests.',
      exemplary: 'Highly nuanced; addresses complex regional dynamics and clearly defines national "red lines."',
    },
    {
      label: 'Policy Accuracy',
      beginning: 'Fundamental misunderstanding of the topic\'s legal framework or the committee\'s mandate.',
      developing: 'Understands the general topic but misses technical or legal complexities within current policy.',
      proficient: 'Solid grasp of complex policy issues (e.g., specific clauses in international law).',
      exemplary: 'Expert-level accuracy; integrates technical facts to build a sophisticated policy argument.',
    },
    {
      label: 'Proposed Solutions',
      beginning: 'Vague or non-actionable (e.g., "countries should talk more"). No implementation plan.',
      developing: 'Generic solutions; lack details on funding, specific UN agencies, or feasibility.',
      proficient: 'Innovative and actionable; proposes specific mechanisms, task forces, or monitoring bodies.',
      exemplary: 'Sophisticated and holistic; solutions are original, feasible, and legally sound with clear timelines.',
    },
    {
      label: 'Formatting, Style & Citations',
      beginning: 'Significant errors in UN citation style; unprofessional tone.',
      developing: 'Standard formatting, but contains several grammatical gaps or inconsistent citation styles.',
      proficient: 'Professional UN academic formatting; clear, concise, and persuasive diplomatic language.',
      exemplary: 'Flawless UN academic style; compelling narrative and perfect citation of all sources.',
    },
  ],
}

function scoreSum(score: DelegateScore, keys: readonly { key: keyof DelegateScore }[]): number {
  return keys.reduce((sum, { key }) => sum + ((score[key] as number) ?? 0), 0)
}

function scoreToLevelKey(n: number | undefined): 'beginning' | 'developing' | 'proficient' | 'exemplary' {
  if (n == null || n < 1) return 'beginning'
  if (n <= 2) return 'beginning'
  if (n <= 4) return 'developing'
  if (n <= 6) return 'proficient'
  return 'exemplary'
}

const BANDS = [
  { key: 'beginning' as const, label: 'Beginning (1–2)', low: 1, high: 2 },
  { key: 'developing' as const, label: 'Developing (3–4)', low: 3, high: 4 },
  { key: 'proficient' as const, label: 'Proficient (5–6)', low: 5, high: 6 },
  { key: 'exemplary' as const, label: 'Exemplary (7–8)', low: 7, high: 8 },
]

function CriteriaFirstSecondPrompt({
  value,
  onChange,
  onClose,
  initialBand,
}: {
  value: number | undefined
  onChange: (v: number) => void
  onClose: () => void
  initialBand?: { low: number; high: number }
}) {
  const [step, setStep] = useState<'band' | 'number'>(initialBand ? 'number' : 'band')
  const [selectedBand, setSelectedBand] = useState<typeof BANDS[number] | null>(
    initialBand ? BANDS.find((b) => b.low === initialBand.low) ?? null : null
  )

  const band =
    selectedBand ??
    (initialBand ? (BANDS.find((b) => b.low === initialBand.low) ?? null) : null) ??
    (value != null && value >= 1 && value <= 8 ? (BANDS.find((b) => value >= b.low && value <= b.high) ?? BANDS[0]) : null)

  if (step === 'band') {
    return (
      <>
        <div className="fixed inset-0 z-10" onClick={onClose} aria-hidden />
        <div className="absolute top-full left-0 mt-0.5 z-20 min-w-[10rem] rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] shadow-lg p-2">
          <p className="text-xs font-medium text-[var(--text-muted)] mb-2">Which level?</p>
          <div className="space-y-1">
            {BANDS.map((b) => (
              <button
                key={b.key}
                type="button"
                onClick={() => {
                  setSelectedBand(b)
                  setStep('number')
                }}
                className="block w-full px-3 py-1.5 text-left text-xs rounded hover:bg-[var(--bg-card)] text-[var(--text)]"
              >
                {b.label}
              </button>
            ))}
          </div>
        </div>
      </>
    )
  }

  if (band && step === 'number') {
    return (
      <>
        <div className="fixed inset-0 z-10" onClick={onClose} aria-hidden />
        <div className="absolute top-full left-0 mt-0.5 z-20 min-w-[10rem] rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] shadow-lg p-2">
          <p className="text-xs font-medium text-[var(--text-muted)] mb-2">First or second number?</p>
          <div className="flex gap-1">
            <button
              type="button"
              onClick={() => { onChange(band.low); onClose() }}
              className="flex-1 px-3 py-2 rounded text-sm font-medium bg-[var(--bg-card)] hover:bg-[var(--brand-soft)] text-[var(--text)] border border-[var(--border)]"
            >
              First ({band.low})
            </button>
            <button
              type="button"
              onClick={() => { onChange(band.high); onClose() }}
              className="flex-1 px-3 py-2 rounded text-sm font-medium bg-[var(--bg-card)] hover:bg-[var(--brand-soft)] text-[var(--text)] border border-[var(--border)]"
            >
              Second ({band.high})
            </button>
          </div>
        </div>
      </>
    )
  }

  return null
}

function CriteriaDropdown({
  value,
  onChange,
  criterionLabel,
  criterionKey,
  openFirstSecondRef,
}: {
  value: number | undefined
  onChange: (v: number) => void
  criterionLabel: string
  criterionKey?: string
  openFirstSecondRef?: React.MutableRefObject<Record<string, { open: () => void; openForBand: (band: { low: number; high: number }) => void }>>
}) {
  const [open, setOpen] = useState(false)
  const [showFirstSecond, setShowFirstSecond] = useState(false)

  const [preselectedBand, setPreselectedBand] = useState<{ low: number; high: number } | undefined>(undefined)

  const openFirstSecond = useCallback(() => {
    setPreselectedBand(undefined)
    setShowFirstSecond(true)
    setOpen(false)
  }, [])

  const openForBand = useCallback((band: { low: number; high: number }) => {
    setPreselectedBand(band)
    setShowFirstSecond(true)
    setOpen(false)
  }, [])

  useLayoutEffect(() => {
    if (openFirstSecondRef && criterionKey) {
      openFirstSecondRef.current[criterionKey] = { open: openFirstSecond, openForBand }
      return () => { delete openFirstSecondRef.current[criterionKey] }
    }
  }, [openFirstSecondRef, criterionKey, openFirstSecond, openForBand])
  const isValid = value != null && value >= 1 && value <= 8

  return (
    <div className="relative flex items-center gap-0.5">
      <button
        type="button"
        onClick={openFirstSecond}
        className="flex-1 min-w-0 px-1.5 py-1 rounded text-xs text-center truncate border border-[var(--border)] bg-[var(--bg-base)] hover:border-[var(--brand)] transition-colors cursor-pointer"
        title={`${criterionLabel}: click to set first or second number`}
      >
        <span className={isValid ? 'text-[var(--text)]' : 'text-[var(--text-muted)]'}>
          {isValid ? value : '—'}
        </span>
      </button>
      <button
        type="button"
        onClick={() => { setOpen((o) => !o); setShowFirstSecond(false) }}
        className="shrink-0 px-1 py-1 rounded border border-[var(--border)] bg-[var(--bg-base)] hover:border-[var(--brand)] transition-colors"
        title={`${criterionLabel}: pick 1-8`}
      >
        <ChevronDown className="w-3 h-3 opacity-60" />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} aria-hidden />
          <div className="absolute top-full right-0 mt-0.5 z-20 min-w-[4rem] rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] shadow-lg py-1">
            {SCORE_OPTIONS.map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => {
                  onChange(n)
                  setOpen(false)
                }}
                className={`block w-full px-3 py-1.5 text-center text-xs hover:bg-[var(--bg-card)] ${
                  value === n ? 'bg-[var(--brand-soft)] text-[var(--brand)] font-medium' : 'text-[var(--text)]'
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </>
      )}
      {showFirstSecond && (
        <CriteriaFirstSecondPrompt
          value={value}
          onChange={(v) => { onChange(v); setShowFirstSecond(false); setPreselectedBand(undefined) }}
          onClose={() => { setShowFirstSecond(false); setPreselectedBand(undefined) }}
          initialBand={preselectedBand}
        />
      )}
    </div>
  )
}

type ViewMode = 'table' | 'per-delegate'

export default function ChairDelegateTracker() {
  const { delegates, setDelegateScore, getDelegateScore, getDelegationEmoji, getFeedbackCountsByType, getDelegateFeedbackItems, addDelegateFeedback } = useChair()
  const [viewMode, setViewMode] = useState<ViewMode>('table')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [tableFeedbackFor, setTableFeedbackFor] = useState<{ delegateId: string; delegateName: string; type: 'compliment' | 'concern' } | null>(null)
  const [tableFeedbackReason, setTableFeedbackReason] = useState('')
  const tableOpenRef = useRef<Record<string, { open: () => void; openForBand: (band: { low: number; high: number }) => void }>>({})

  const scored = delegates.map((d) => {
    const s = getDelegateScore(d.id)
    const delegateTotal = scoreSum(s, DELEGATE_CRITERIA)
    const paperTotal = scoreSum(s, POSITION_PAPER_CRITERIA)
    return { delegate: d, score: s, delegateTotal, paperTotal }
  })
  const byCountry = [...scored].sort((a, b) => a.delegate.country.localeCompare(b.delegate.country))
  const byTotal = [...scored].sort((a, b) => (b.delegateTotal + b.paperTotal) - (a.delegateTotal + a.paperTotal))

  if (delegates.length === 0) {
    return (
      <div className="space-y-6">
        <h2 className="font-semibold text-2xl text-[var(--text)]">🏆 Delegate Tracker</h2>
        <p className="text-[var(--text-muted)] text-sm">
          Add delegates in the Delegates section first. Then use this tracker to score them against the SEAMUN I rubric for awards (Best Delegate, Honourable Mention, Best Position Paper).
        </p>
        <div className="card-block p-8 text-center text-[var(--text-muted)]">
          No delegates yet. Add delegates to get started.
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-2">
        <h2 className="font-semibold text-2xl text-[var(--text)] mb-1 flex items-center gap-1.5">
          🏆 Delegate Tracker
          <InfoPopover title="SEAMUN I Awards">
            Score 1–8 per criterion to distinguish close candidates. Delegate Criteria (48 pts) for in-session performance; Position Paper (40 pts) for pre-conference research. Use the rubric reference above. Top candidates need a Statement of Confirmation with on-floor evidence.
          </InfoPopover>
        </h2>
      </div>
      <p className="text-[var(--text-muted)] text-sm">
        Score 1–8 per criterion. Each band peaks at the even number: 2 = high Beginning, 4 = high Developing, 6 = high Proficient, 8 = high Exemplary. Use the rubric reference below for level descriptions.
      </p>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setViewMode('table')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            viewMode === 'table'
              ? 'bg-[var(--brand)] text-white'
              : 'bg-[var(--bg-elevated)] text-[var(--text-muted)] hover:bg-[var(--bg-card)] hover:text-[var(--text)]'
          }`}
        >
          <LayoutGrid className="w-4 h-4" />
          Table view
        </button>
        <button
          type="button"
          onClick={() => setViewMode('per-delegate')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            viewMode === 'per-delegate'
              ? 'bg-[var(--brand)] text-white'
              : 'bg-[var(--bg-elevated)] text-[var(--text-muted)] hover:bg-[var(--bg-card)] hover:text-[var(--text)]'
          }`}
        >
          <User className="w-4 h-4" />
          Per delegate
        </button>
      </div>

      <details className="card-block" open>
        <summary className="px-4 py-3 cursor-pointer list-none font-medium text-[var(--text)] [&::-webkit-details-marker]:hidden flex items-center gap-2">
          📋 Full SEAMUN I Rubric Reference
        </summary>
        <div className="border-t border-[var(--border)] p-4 space-y-8">
          <section>
            <h3 className="text-sm font-semibold text-[var(--brand)] mb-3">Delegate Criteria (48 pts total)</h3>
            <div className="space-y-4">
              {FULL_RUBRIC.delegate.map((c) => (
                <div key={c.label} className="rounded-lg border border-[var(--border)] p-3 bg-[var(--bg-elevated)]/50">
                  <h4 className="font-medium text-[var(--text)] text-sm mb-2">{c.label}</h4>
                  <dl className="grid sm:grid-cols-2 lg:grid-cols-4 gap-2 text-xs">
                    <div>
                      <dt className="text-[var(--text-muted)] font-medium">Beginning (1–2, high at 2)</dt>
                      <dd className="text-[var(--text)] mt-0.5">{c.beginning}</dd>
                    </div>
                    <div>
                      <dt className="text-[var(--text-muted)] font-medium">Developing (3–4, high at 4)</dt>
                      <dd className="text-[var(--text)] mt-0.5">{c.developing}</dd>
                    </div>
                    <div>
                      <dt className="text-[var(--text-muted)] font-medium">Proficient (5–6, high at 6)</dt>
                      <dd className="text-[var(--text)] mt-0.5">{c.proficient}</dd>
                    </div>
                    <div>
                      <dt className="text-[var(--text-muted)] font-medium">Exemplary (7–8, high at 8)</dt>
                      <dd className="text-[var(--text)] mt-0.5">{c.exemplary}</dd>
                    </div>
                  </dl>
                </div>
              ))}
            </div>
          </section>
          <section>
            <h3 className="text-sm font-semibold text-[var(--brand)] mb-3">Position Paper Criteria (40 pts total)</h3>
            <div className="space-y-4">
              {FULL_RUBRIC.positionPaper.map((c) => (
                <div key={c.label} className="rounded-lg border border-[var(--border)] p-3 bg-[var(--bg-elevated)]/50">
                  <h4 className="font-medium text-[var(--text)] text-sm mb-2">{c.label}</h4>
                  <dl className="grid sm:grid-cols-2 lg:grid-cols-4 gap-2 text-xs">
                    <div>
                      <dt className="text-[var(--text-muted)] font-medium">Beginning (1–2, high at 2)</dt>
                      <dd className="text-[var(--text)] mt-0.5">{c.beginning}</dd>
                    </div>
                    <div>
                      <dt className="text-[var(--text-muted)] font-medium">Developing (3–4, high at 4)</dt>
                      <dd className="text-[var(--text)] mt-0.5">{c.developing}</dd>
                    </div>
                    <div>
                      <dt className="text-[var(--text-muted)] font-medium">Proficient (5–6, high at 6)</dt>
                      <dd className="text-[var(--text)] mt-0.5">{c.proficient}</dd>
                    </div>
                    <div>
                      <dt className="text-[var(--text-muted)] font-medium">Exemplary (7–8, high at 8)</dt>
                      <dd className="text-[var(--text)] mt-0.5">{c.exemplary}</dd>
                    </div>
                  </dl>
                </div>
              ))}
            </div>
          </section>
        </div>
      </details>

      {viewMode === 'table' ? (
        <>
      {tableFeedbackFor && (
        <div className="card-block p-4 border-l-4 border-[var(--accent)] bg-[var(--accent-soft)]/20 mb-4">
          <p className="text-sm font-medium text-[var(--text)] mb-2">
            Add {tableFeedbackFor.type === 'compliment' ? 'compliment' : 'concern'} for {tableFeedbackFor.delegateName}
          </p>
          <div className="flex gap-2 flex-wrap items-end">
            <label className="flex-1 min-w-[200px]">
              <span className="text-xs text-[var(--text-muted)] block mb-0.5">Reason (required)</span>
              <input
                type="text"
                value={tableFeedbackReason}
                onChange={(e) => setTableFeedbackReason(e.target.value)}
                placeholder={tableFeedbackFor.type === 'compliment' ? 'e.g. Strong opening speech' : 'e.g. Reminder to use formal language'}
                className="w-full px-3 py-2 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border)] text-sm text-[var(--text)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                autoFocus
              />
            </label>
            <button
              type="button"
              onClick={() => {
                if (tableFeedbackReason.trim()) {
                  addDelegateFeedback(tableFeedbackFor.delegateId, tableFeedbackFor.type, tableFeedbackReason.trim())
                  setTableFeedbackFor(null)
                  setTableFeedbackReason('')
                }
              }}
              disabled={!tableFeedbackReason.trim()}
              className="px-4 py-2 rounded-lg bg-[var(--accent)] text-white text-sm font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Submit
            </button>
            <button
              type="button"
              onClick={() => { setTableFeedbackFor(null); setTableFeedbackReason('') }}
              className="px-4 py-2 rounded-lg bg-[var(--bg-elevated)] text-[var(--text-muted)] text-sm font-medium hover:text-[var(--text)]"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      <section>
        <h3 className="text-base font-semibold text-[var(--text)] mb-2">Best Delegate (in-session, 48 pts)</h3>
        <div className="card-block overflow-x-auto">
          <table className="w-full text-sm border-collapse min-w-[520px]">
            <thead>
              <tr className="border-b border-[var(--border)]">
                <th className="text-left px-2 py-2 font-medium text-[var(--text-muted)] sticky left-0 bg-[var(--bg-elevated)] z-10">
                  Delegate
                </th>
                {DELEGATE_CRITERIA.map(({ key, label }) => (
                  <th key={key} className="px-2 py-2 font-medium text-[var(--text-muted)] whitespace-nowrap" title={label}>
                    <button
                      type="button"
                      onClick={() => {
                        const first = byCountry[0]
                        if (first) tableOpenRef.current[`${first.delegate.id}-${key}`]?.open()
                      }}
                      className="text-left w-full py-1 px-1 -mx-1 -my-1 rounded hover:text-[var(--text)] hover:bg-[var(--bg-elevated)] cursor-pointer"
                      title="Click to set first or second number (first delegate)"
                    >
                      {label}
                    </button>
                  </th>
                ))}
                <th className="px-2 py-2 font-semibold text-[var(--brand)] text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {byCountry.map(({ delegate, score, delegateTotal }) => {
                const feedback = getFeedbackCountsByType(delegate.id)
                const feedbackItems = getDelegateFeedbackItems(delegate.id)
                const compliments = feedback.compliment ?? 0
                const concerns = feedback.concern ?? 0
                const complimentReasons = feedbackItems.filter((f) => f.type === 'compliment' || String(f.type).toLowerCase() === 'compliment').map((f) => f.reason || '—').join('; ')
                const concernReasons = feedbackItems.filter((f) => f.type !== 'compliment' && String(f.type).toLowerCase() !== 'compliment').map((f) => f.reason || '—').join('; ')
                return (
                <tr key={delegate.id} className="border-b border-[var(--border)] hover:bg-[var(--bg-elevated)]/30">
                  <td className="sticky left-0 px-2 py-2 bg-[var(--bg-card)] z-10">
                    <span className="text-lg shrink-0" title={delegate.country}>
                      {getDelegationEmoji(delegate.country)}
                    </span>
                    <span className="font-medium text-[var(--text)] ml-1">{delegate.country}</span>
                    {delegate.name && <span className="text-[var(--text-muted)] ml-1">— {delegate.name}</span>}
                    <span className="ml-1.5 inline-flex items-center gap-1">
                      {compliments > 0 && (
                        <span className="inline-flex items-center gap-0.5 text-[var(--success)]" title={complimentReasons || `${compliments} compliment${compliments !== 1 ? 's' : ''}`}>
                          <Star className="w-3.5 h-3.5 fill-current" />
                          {compliments}
                        </span>
                      )}
                      {concerns > 0 && (
                        <span className="inline-flex items-center gap-0.5 text-[var(--danger)]" title={concernReasons || `${concerns} concern${concerns !== 1 ? 's' : ''}`}>
                          <Flag className="w-3.5 h-3.5 fill-current" />
                          {concerns}
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setTableFeedbackFor({ delegateId: delegate.id, delegateName: delegate.country + (delegate.name ? ` (${delegate.name})` : ''), type: 'compliment' }); setTableFeedbackReason('') }}
                        className="p-0.5 rounded text-[var(--success)] hover:bg-[var(--success)]/20"
                        title="Add compliment"
                        aria-label="Add compliment"
                      >
                        <ThumbsUp className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setTableFeedbackFor({ delegateId: delegate.id, delegateName: delegate.country + (delegate.name ? ` (${delegate.name})` : ''), type: 'concern' }); setTableFeedbackReason('') }}
                        className="p-0.5 rounded text-[var(--danger)] hover:bg-[var(--danger)]/20"
                        title="Add concern"
                        aria-label="Add concern"
                      >
                        <MessageCircle className="w-3 h-3" />
                      </button>
                    </span>
                  </td>
                  {DELEGATE_CRITERIA.map(({ key, label }) => (
                    <td key={key} className="px-2 py-1.5">
                      <CriteriaDropdown
                        criterionLabel={label}
                        criterionKey={`${delegate.id}-${key}`}
                        openFirstSecondRef={tableOpenRef}
                        value={score[key]}
                        onChange={(v) => setDelegateScore(delegate.id, { [key]: v })}
                      />
                    </td>
                  ))}
                  <td className="px-2 py-2 text-right font-semibold text-[var(--brand)]">{delegateTotal}/48</td>
                </tr>
              )})}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h3 className="text-base font-semibold text-[var(--text)] mb-2">Best Position Paper (pre-conference, 40 pts)</h3>
        <div className="card-block overflow-x-auto">
          <table className="w-full text-sm border-collapse min-w-[520px]">
            <thead>
              <tr className="border-b border-[var(--border)]">
                <th className="text-left px-2 py-2 font-medium text-[var(--text-muted)] sticky left-0 bg-[var(--bg-elevated)] z-10">
                  Delegate
                </th>
                {POSITION_PAPER_CRITERIA.map(({ key, label }) => (
                  <th key={key} className="px-2 py-2 font-medium text-[var(--text-muted)] whitespace-nowrap" title={label}>
                    <button
                      type="button"
                      onClick={() => {
                        const first = byCountry[0]
                        if (first) tableOpenRef.current[`${first.delegate.id}-${key}`]?.open()
                      }}
                      className="text-left w-full py-1 px-1 -mx-1 -my-1 rounded hover:text-[var(--text)] hover:bg-[var(--bg-elevated)] cursor-pointer"
                      title="Click to set first or second number (first delegate)"
                    >
                      {label}
                    </button>
                  </th>
                ))}
                <th className="px-2 py-2 font-semibold text-[var(--brand)] text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {byCountry.map(({ delegate, score, paperTotal }) => {
                const feedback = getFeedbackCountsByType(delegate.id)
                const feedbackItems = getDelegateFeedbackItems(delegate.id)
                const compliments = feedback.compliment ?? 0
                const concerns = feedback.concern ?? 0
                const complimentReasons = feedbackItems.filter((f) => f.type === 'compliment' || String(f.type).toLowerCase() === 'compliment').map((f) => f.reason || '—').join('; ')
                const concernReasons = feedbackItems.filter((f) => f.type !== 'compliment' && String(f.type).toLowerCase() !== 'compliment').map((f) => f.reason || '—').join('; ')
                return (
                <tr key={delegate.id} className="border-b border-[var(--border)] hover:bg-[var(--bg-elevated)]/30">
                  <td className="sticky left-0 px-2 py-2 bg-[var(--bg-card)] z-10">
                    <span className="text-lg shrink-0" title={delegate.country}>
                      {getDelegationEmoji(delegate.country)}
                    </span>
                    <span className="font-medium text-[var(--text)] ml-1">{delegate.country}</span>
                    {delegate.name && <span className="text-[var(--text-muted)] ml-1">— {delegate.name}</span>}
                    <span className="ml-1.5 inline-flex items-center gap-1">
                      {compliments > 0 && (
                        <span className="inline-flex items-center gap-0.5 text-[var(--success)]" title={complimentReasons || `${compliments} compliment${compliments !== 1 ? 's' : ''}`}>
                          <Star className="w-3.5 h-3.5 fill-current" />
                          {compliments}
                        </span>
                      )}
                      {concerns > 0 && (
                        <span className="inline-flex items-center gap-0.5 text-[var(--danger)]" title={concernReasons || `${concerns} concern${concerns !== 1 ? 's' : ''}`}>
                          <Flag className="w-3.5 h-3.5 fill-current" />
                          {concerns}
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setTableFeedbackFor({ delegateId: delegate.id, delegateName: delegate.country + (delegate.name ? ` (${delegate.name})` : ''), type: 'compliment' }); setTableFeedbackReason('') }}
                        className="p-0.5 rounded text-[var(--success)] hover:bg-[var(--success)]/20"
                        title="Add compliment"
                        aria-label="Add compliment"
                      >
                        <ThumbsUp className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setTableFeedbackFor({ delegateId: delegate.id, delegateName: delegate.country + (delegate.name ? ` (${delegate.name})` : ''), type: 'concern' }); setTableFeedbackReason('') }}
                        className="p-0.5 rounded text-[var(--danger)] hover:bg-[var(--danger)]/20"
                        title="Add concern"
                        aria-label="Add concern"
                      >
                        <MessageCircle className="w-3 h-3" />
                      </button>
                    </span>
                  </td>
                  {POSITION_PAPER_CRITERIA.map(({ key, label }) => (
                    <td key={key} className="px-2 py-1.5">
                      <CriteriaDropdown
                        criterionLabel={label}
                        criterionKey={`${delegate.id}-${key}`}
                        openFirstSecondRef={tableOpenRef}
                        value={score[key]}
                        onChange={(v) => setDelegateScore(delegate.id, { [key]: v })}
                      />
                    </td>
                  ))}
                  <td className="px-2 py-2 text-right font-semibold text-[var(--brand)]">{paperTotal}/40</td>
                </tr>
              )})}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h3 className="text-base font-semibold text-[var(--text)] mb-2">Combined Leaderboard (88 pts)</h3>
        <div className="card-block overflow-x-auto">
          <table className="w-full text-sm border-collapse min-w-[280px]">
            <thead>
              <tr className="border-b border-[var(--border)]">
                <th className="text-left px-2 py-2 font-medium text-[var(--text-muted)] w-10">#</th>
                <th className="text-left px-2 py-2 font-medium text-[var(--text-muted)]">Delegate</th>
                <th className="text-right px-2 py-2 font-medium text-[var(--text-muted)]">D</th>
                <th className="text-right px-2 py-2 font-medium text-[var(--text-muted)]">PP</th>
                <th className="text-right px-2 py-2 font-semibold text-[var(--brand)]">Total</th>
              </tr>
            </thead>
            <tbody>
              {byTotal.map(({ delegate, delegateTotal, paperTotal }, i) => {
                const feedback = getFeedbackCountsByType(delegate.id)
                const feedbackItems = getDelegateFeedbackItems(delegate.id)
                const compliments = feedback.compliment ?? 0
                const concerns = feedback.concern ?? 0
                const complimentReasons = feedbackItems.filter((f) => f.type === 'compliment' || String(f.type).toLowerCase() === 'compliment').map((f) => f.reason || '—').join('; ')
                const concernReasons = feedbackItems.filter((f) => f.type !== 'compliment' && String(f.type).toLowerCase() !== 'compliment').map((f) => f.reason || '—').join('; ')
                return (
                <tr key={delegate.id} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--bg-elevated)]/30">
                  <td className="px-2 py-2 text-[var(--text-muted)] font-medium">{i + 1}</td>
                  <td className="px-2 py-2">
                    <span className="text-lg shrink-0" title={delegate.country}>{getDelegationEmoji(delegate.country)}</span>
                    <span className="font-medium text-[var(--text)] ml-1">{delegate.country}</span>
                    {delegate.name && <span className="text-[var(--text-muted)] ml-1">— {delegate.name}</span>}
                    <span className="ml-1.5 inline-flex items-center gap-1">
                      {compliments > 0 && (
                        <span className="inline-flex items-center gap-0.5 text-[var(--success)]" title={complimentReasons || `${compliments} compliment${compliments !== 1 ? 's' : ''}`}>
                          <Star className="w-3.5 h-3.5 fill-current" />
                          {compliments}
                        </span>
                      )}
                      {concerns > 0 && (
                        <span className="inline-flex items-center gap-0.5 text-[var(--danger)]" title={concernReasons || `${concerns} concern${concerns !== 1 ? 's' : ''}`}>
                          <Flag className="w-3.5 h-3.5 fill-current" />
                          {concerns}
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setTableFeedbackFor({ delegateId: delegate.id, delegateName: delegate.country + (delegate.name ? ` (${delegate.name})` : ''), type: 'compliment' }); setTableFeedbackReason('') }}
                        className="p-0.5 rounded text-[var(--success)] hover:bg-[var(--success)]/20"
                        title="Add compliment"
                        aria-label="Add compliment"
                      >
                        <ThumbsUp className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setTableFeedbackFor({ delegateId: delegate.id, delegateName: delegate.country + (delegate.name ? ` (${delegate.name})` : ''), type: 'concern' }); setTableFeedbackReason('') }}
                        className="p-0.5 rounded text-[var(--danger)] hover:bg-[var(--danger)]/20"
                        title="Add concern"
                        aria-label="Add concern"
                      >
                        <MessageCircle className="w-3 h-3" />
                      </button>
                    </span>
                  </td>
                  <td className="px-2 py-2 text-right text-[var(--text-muted)]">{delegateTotal}/48</td>
                  <td className="px-2 py-2 text-right text-[var(--text-muted)]">{paperTotal}/40</td>
                  <td className="px-2 py-2 text-right font-semibold text-[var(--brand)]">{delegateTotal + paperTotal}/88</td>
                </tr>
              )})}
            </tbody>
          </table>
        </div>
      </section>

      <details className="card-block">
        <summary className="px-4 py-3 cursor-pointer list-none font-medium text-[var(--text)] [&::-webkit-details-marker]:hidden">
          Evidence & justification
        </summary>
        <div className="border-t border-[var(--border)] p-4 space-y-4">
          <p className="text-xs text-[var(--text-muted)]">
            Justification is <strong className="text-[var(--text)]">required</strong> for the top 5 delegates (by combined score).
          </p>
          {byTotal.slice(0, 5).map(({ delegate, score }, i) => {
            const needsJustification = !(score.justification ?? '').trim()
            return (
              <div key={delegate.id} className="space-y-2">
                <p className="text-sm font-medium text-[var(--text)]">
                  #{i + 1} {getDelegationEmoji(delegate.country)} {delegate.country}
                  {needsJustification && (
                    <span className="ml-2 text-xs font-normal text-amber-600 dark:text-amber-400">— justification required</span>
                  )}
                </p>
                <div className="grid sm:grid-cols-2 gap-3">
                  <label className="block">
                    <span className="text-xs text-[var(--text-muted)]">Evidence of excellence</span>
                    <textarea
                      value={score.evidenceOfExcellence ?? ''}
                      onChange={(e) => setDelegateScore(delegate.id, { evidenceOfExcellence: e.target.value })}
                      placeholder="e.g. Led drafting of WP 1.1, brokered compromise..."
                      rows={2}
                      className="mt-0.5 w-full px-2.5 py-1.5 rounded-lg bg-[var(--bg-base)] border border-[var(--border)] text-[var(--text)] text-sm placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--brand)] resize-y"
                    />
                  </label>
                  <label className="block">
                    <span className="text-xs text-[var(--text-muted)]">Justification (required)</span>
                    <textarea
                      value={score.justification ?? ''}
                      onChange={(e) => setDelegateScore(delegate.id, { justification: e.target.value })}
                      placeholder="Required — why this delegate outperformed the runner-up..."
                      rows={2}
                      className={`mt-0.5 w-full px-2.5 py-1.5 rounded-lg bg-[var(--bg-base)] border text-[var(--text)] text-sm placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--brand)] resize-y ${
                        needsJustification ? 'border-amber-500 dark:border-amber-400' : 'border-[var(--border)]'
                      }`}
                    />
                  </label>
                </div>
              </div>
            )
          })}
          {byTotal.length > 5 && (
            <>
              <p className="text-xs text-[var(--text-muted)] pt-2 border-t border-[var(--border)]">Others (optional)</p>
              {byTotal.slice(5).map(({ delegate, score }) => (
                <div key={delegate.id} className="space-y-2">
                  <p className="text-sm font-medium text-[var(--text)]">
                    {getDelegationEmoji(delegate.country)} {delegate.country}
                  </p>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <label className="block">
                      <span className="text-xs text-[var(--text-muted)]">Evidence of excellence</span>
                      <textarea
                        value={score.evidenceOfExcellence ?? ''}
                        onChange={(e) => setDelegateScore(delegate.id, { evidenceOfExcellence: e.target.value })}
                        placeholder="e.g. Led drafting of WP 1.1, brokered compromise..."
                        rows={2}
                        className="mt-0.5 w-full px-2.5 py-1.5 rounded-lg bg-[var(--bg-base)] border border-[var(--border)] text-[var(--text)] text-sm placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--brand)] resize-y"
                      />
                    </label>
                    <label className="block">
                      <span className="text-xs text-[var(--text-muted)]">Justification</span>
                      <textarea
                        value={score.justification ?? ''}
                        onChange={(e) => setDelegateScore(delegate.id, { justification: e.target.value })}
                        placeholder="Optional for delegates outside top 5"
                        rows={2}
                        className="mt-0.5 w-full px-2.5 py-1.5 rounded-lg bg-[var(--bg-base)] border border-[var(--border)] text-[var(--text)] text-sm placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--brand)] resize-y"
                      />
                    </label>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </details>
        </>
      ) : (
        <PerDelegateView
          scored={byCountry}
          selectedIndex={selectedIndex}
          onSelectIndex={setSelectedIndex}
          setDelegateScore={setDelegateScore}
          getDelegationEmoji={getDelegationEmoji}
          getFeedbackCountsByType={getFeedbackCountsByType}
          getDelegateFeedbackItems={getDelegateFeedbackItems}
          addDelegateFeedback={addDelegateFeedback}
        />
      )}
    </div>
  )
}

function PerDelegateView({
  scored,
  selectedIndex,
  onSelectIndex,
  setDelegateScore,
  getDelegationEmoji,
  getFeedbackCountsByType,
  getDelegateFeedbackItems,
  addDelegateFeedback,
}: {
  scored: { delegate: { id: string; country: string; name?: string }; score: DelegateScore; delegateTotal: number; paperTotal: number }[]
  selectedIndex: number
  onSelectIndex: (i: number) => void
  setDelegateScore: (id: string, patch: Partial<DelegateScore>) => void
  getDelegationEmoji: (c: string) => string
  getFeedbackCountsByType: (delegateId: string) => { compliment?: number; concern?: number }
  getDelegateFeedbackItems: (delegateId: string) => { type: string; reason?: string }[]
  addDelegateFeedback: (delegateId: string, type: 'compliment' | 'concern', reason: string) => void
}) {
  const [feedbackForm, setFeedbackForm] = useState<{ type: 'compliment' | 'concern' } | null>(null)
  const [feedbackReason, setFeedbackReason] = useState('')
  const openFirstSecondRef = useRef<Record<string, { open: () => void; openForBand: (band: { low: number; high: number }) => void }>>({})
  const current = scored[selectedIndex]
  useEffect(() => {
    setFeedbackForm(null)
    setFeedbackReason('')
  }, [current?.delegate.id])
  if (!current) return null

  const { delegate, score, delegateTotal, paperTotal } = current
  const total = delegateTotal + paperTotal
  const rank = [...scored]
    .sort((a, b) => (b.delegateTotal + b.paperTotal) - (a.delegateTotal + a.paperTotal))
    .findIndex((s) => s.delegate.id === delegate.id) + 1

  return (
    <div className="space-y-6">
      <div className="card-block flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onSelectIndex(Math.max(0, selectedIndex - 1))}
            disabled={selectedIndex === 0}
            className="p-1.5 rounded-lg border border-[var(--border)] bg-[var(--bg-base)] hover:bg-[var(--bg-elevated)] disabled:opacity-40 disabled:cursor-not-allowed text-[var(--text)]"
            aria-label="Previous delegate"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-lg shrink-0" title={delegate.country}>{getDelegationEmoji(delegate.country)}</span>
          <div>
            <p className="font-semibold text-[var(--text)] flex items-center gap-2">
              {delegate.country}{delegate.name ? ` — ${delegate.name}` : ''}
              {(() => {
                const feedback = getFeedbackCountsByType(delegate.id)
                const compliments = feedback.compliment ?? 0
                const concerns = feedback.concern ?? 0
                return (
                  <span className="inline-flex items-center gap-2 text-sm font-normal">
                    {compliments > 0 && (
                      <span className="inline-flex items-center gap-0.5 text-[var(--success)]" title={`${compliments} compliment${compliments !== 1 ? 's' : ''}`}>
                        <Star className="w-4 h-4 fill-current" />
                        {compliments}
                      </span>
                    )}
                    {concerns > 0 && (
                      <span className="inline-flex items-center gap-0.5 text-[var(--danger)]" title={`${concerns} concern${concerns !== 1 ? 's' : ''}`}>
                        <Flag className="w-4 h-4 fill-current" />
                        {concerns}
                      </span>
                    )}
                  </span>
                )
              })()}
            </p>
            <p className="text-xs text-[var(--text-muted)]">
              {selectedIndex + 1} of {scored.length} · #{rank} · D: {delegateTotal}/48 · PP: {paperTotal}/40 · Total: {total}/88
            </p>
          </div>
          <button
            type="button"
            onClick={() => onSelectIndex(Math.min(scored.length - 1, selectedIndex + 1))}
            disabled={selectedIndex === scored.length - 1}
            className="p-1.5 rounded-lg border border-[var(--border)] bg-[var(--bg-base)] hover:bg-[var(--bg-elevated)] disabled:opacity-40 disabled:cursor-not-allowed text-[var(--text)]"
            aria-label="Next delegate"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
        <select
          value={delegate.id}
          onChange={(e) => {
            const i = scored.findIndex((s) => s.delegate.id === e.target.value)
            if (i >= 0) onSelectIndex(i)
          }}
          className="px-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--bg-base)] text-[var(--text)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand)]"
        >
          {scored.map((s) => (
            <option key={s.delegate.id} value={s.delegate.id}>
              {s.delegate.country} {s.delegate.name ? `(${s.delegate.name})` : ''}
            </option>
          ))}
        </select>
      </div>

      <div className="card-block p-4 border-l-4 border-[var(--brand)] bg-[var(--brand-soft)]/20">
        <h3 className="text-sm font-semibold text-[var(--text)] mb-2 flex items-center gap-2">
          📋 Feedback — compliments & concerns
        </h3>
        {feedbackForm ? (
          <div className="space-y-2">
            <label className="block text-xs text-[var(--text-muted)]">
              Reason for {feedbackForm.type === 'compliment' ? 'compliment' : 'concern'} (required)
            </label>
            <textarea
              value={feedbackReason}
              onChange={(e) => setFeedbackReason(e.target.value)}
              placeholder={feedbackForm.type === 'compliment' ? 'e.g. Strong opening speech' : 'e.g. Reminder to use formal language'}
              rows={2}
              className="w-full px-2.5 py-1.5 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border)] text-sm text-[var(--text)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] resize-none"
              autoFocus
            />
            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={() => {
                  if (feedbackReason.trim()) {
                    addDelegateFeedback(delegate.id, feedbackForm.type, feedbackReason.trim())
                    setFeedbackForm(null)
                    setFeedbackReason('')
                  }
                }}
                disabled={!feedbackReason.trim()}
                className="px-3 py-1.5 rounded-lg bg-[var(--accent)] text-white text-xs font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Submit
              </button>
              <button
                type="button"
                onClick={() => { setFeedbackForm(null); setFeedbackReason('') }}
                className="px-3 py-1.5 rounded-lg bg-[var(--bg-elevated)] text-[var(--text-muted)] text-xs font-medium hover:text-[var(--text)]"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setFeedbackForm({ type: 'compliment' })}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[var(--success)]/20 text-[var(--success)] text-xs font-medium hover:bg-[var(--success)]/30"
            >
              <ThumbsUp className="w-3.5 h-3.5" />
              Give compliment
            </button>
            <button
              type="button"
              onClick={() => setFeedbackForm({ type: 'concern' })}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[var(--danger)]/20 text-[var(--danger)] text-xs font-medium hover:bg-[var(--danger)]/30"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              Give concern reminder
            </button>
          </div>
        )}
        {getDelegateFeedbackItems(delegate.id).length > 0 && (
          <ul className="space-y-2 text-sm mt-3 pt-3 border-t border-[var(--border)]">
            <span className="text-xs font-medium text-[var(--text-muted)] block mb-1">Reminder when grading:</span>
            {getDelegateFeedbackItems(delegate.id).map((f, i) => {
              const isCompliment = f.type === 'compliment' || String(f.type).toLowerCase() === 'compliment'
              return (
                <li key={i} className={`flex items-start gap-2 ${isCompliment ? 'text-[var(--success)]' : 'text-[var(--danger)]'}`}>
                  {isCompliment ? <ThumbsUp className="w-4 h-4 shrink-0 mt-0.5" /> : <MessageCircle className="w-4 h-4 shrink-0 mt-0.5" />}
                  <span>
                    <strong>{isCompliment ? 'Compliment' : 'Concern'}:</strong>{' '}
                    {f.reason || '(no reason recorded)'}
                  </span>
                </li>
              )
            })}
          </ul>
        )}
      </div>

      <section>
        <h3 className="text-sm font-semibold text-[var(--brand)] mb-2">Best Delegate (48 pts)</h3>
        <div className="space-y-3">
          {DELEGATE_CRITERIA.map(({ key, label }, i) => {
            const rubric = FULL_RUBRIC.delegate[i]
            const val = score[key] as number | undefined
            const levelKey = scoreToLevelKey(val)
            return (
              <div key={key} className="card-block p-3 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => openFirstSecondRef.current[key]?.open()}
                    className="flex-1 min-w-0 text-left font-medium text-[var(--text)] py-1 -my-1 px-1 -mx-1 rounded hover:text-[var(--brand)] hover:bg-[var(--bg-elevated)] cursor-pointer select-none"
                    title="Click to set first or second number"
                  >
                    {label}
                  </button>
                  <CriteriaDropdown
                    value={val}
                    onChange={(v) => setDelegateScore(delegate.id, { [key]: v })}
                    criterionLabel={label}
                    criterionKey={key}
                    openFirstSecondRef={openFirstSecondRef}
                  />
                </div>
                {rubric && (
                  <dl className="grid sm:grid-cols-2 lg:grid-cols-4 gap-2 text-xs">
                    {(['beginning', 'developing', 'proficient', 'exemplary'] as const).map((k) => {
                      const band = BANDS.find((b) => b.key === k)!
                      return (
                        <button
                          key={k}
                          type="button"
                          onClick={() => openFirstSecondRef.current[key]?.openForBand?.({ low: band.low, high: band.high })}
                          className={`text-left rounded p-2 transition-colors hover:bg-[var(--bg-elevated)] cursor-pointer ${
                            levelKey === k ? 'ring-1 ring-[var(--brand)] bg-[var(--brand-soft)]/50' : ''
                          }`}
                          title="Click to set first or second number"
                        >
                          <dt className="text-[var(--text-muted)] font-medium">
                            {k === 'beginning' && 'Beginning (1–2)'}
                            {k === 'developing' && 'Developing (3–4)'}
                            {k === 'proficient' && 'Proficient (5–6)'}
                            {k === 'exemplary' && 'Exemplary (7–8)'}
                          </dt>
                          <dd className="text-[var(--text)] mt-0.5">{rubric[k]}</dd>
                        </button>
                      )
                    })}
                  </dl>
                )}
              </div>
            )
          })}
        </div>
      </section>

      <section>
        <h3 className="text-sm font-semibold text-[var(--brand)] mb-2">Best Position Paper (40 pts)</h3>
        <div className="space-y-3">
          {POSITION_PAPER_CRITERIA.map(({ key, label }, i) => {
            const rubric = FULL_RUBRIC.positionPaper[i]
            const val = score[key] as number | undefined
            const levelKey = scoreToLevelKey(val)
            return (
              <div key={key} className="card-block p-3 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => openFirstSecondRef.current[key]?.open()}
                    className="flex-1 min-w-0 text-left font-medium text-[var(--text)] py-1 -my-1 px-1 -mx-1 rounded hover:text-[var(--brand)] hover:bg-[var(--bg-elevated)] cursor-pointer select-none"
                    title="Click to set first or second number"
                  >
                    {label}
                  </button>
                  <CriteriaDropdown
                    value={val}
                    onChange={(v) => setDelegateScore(delegate.id, { [key]: v })}
                    criterionLabel={label}
                    criterionKey={key}
                    openFirstSecondRef={openFirstSecondRef}
                  />
                </div>
                {rubric && (
                  <dl className="grid sm:grid-cols-2 lg:grid-cols-4 gap-2 text-xs">
                    {(['beginning', 'developing', 'proficient', 'exemplary'] as const).map((k) => {
                      const band = BANDS.find((b) => b.key === k)!
                      return (
                        <button
                          key={k}
                          type="button"
                          onClick={() => openFirstSecondRef.current[key]?.openForBand?.({ low: band.low, high: band.high })}
                          className={`text-left rounded p-2 transition-colors hover:bg-[var(--bg-elevated)] cursor-pointer ${
                            levelKey === k ? 'ring-1 ring-[var(--brand)] bg-[var(--brand-soft)]/50' : ''
                          }`}
                          title="Click to set first or second number"
                        >
                          <dt className="text-[var(--text-muted)] font-medium">
                            {k === 'beginning' && 'Beginning (1–2)'}
                            {k === 'developing' && 'Developing (3–4)'}
                            {k === 'proficient' && 'Proficient (5–6)'}
                            {k === 'exemplary' && 'Exemplary (7–8)'}
                          </dt>
                          <dd className="text-[var(--text)] mt-0.5">{rubric[k]}</dd>
                        </button>
                      )
                    })}
                  </dl>
                )}
              </div>
            )
          })}
        </div>
      </section>

      <details className="card-block" open={rank <= 5}>
        <summary className="px-4 py-3 cursor-pointer list-none font-medium text-[var(--text)] [&::-webkit-details-marker]:hidden">
          Evidence & justification {rank <= 5 && '(required for top 5)'}
        </summary>
        <div className="border-t border-[var(--border)] p-4 space-y-3">
          <label className="block">
            <span className="text-xs text-[var(--text-muted)]">Evidence of excellence</span>
            <textarea
              value={score.evidenceOfExcellence ?? ''}
              onChange={(e) => setDelegateScore(delegate.id, { evidenceOfExcellence: e.target.value })}
              placeholder="e.g. Led drafting of WP 1.1, brokered compromise..."
              rows={2}
              className="mt-0.5 w-full px-2.5 py-1.5 rounded-lg bg-[var(--bg-base)] border border-[var(--border)] text-[var(--text)] text-sm placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--brand)] resize-y"
            />
          </label>
          <label className="block">
            <span className="text-xs text-[var(--text-muted)]">Justification {rank <= 5 && '(required)'}</span>
            <textarea
              value={score.justification ?? ''}
              onChange={(e) => setDelegateScore(delegate.id, { justification: e.target.value })}
              placeholder={rank <= 5 ? 'Required — why this delegate outperformed the runner-up...' : 'Why this delegate outperformed the runner-up...'}
              rows={3}
              className={`mt-0.5 w-full px-2.5 py-1.5 rounded-lg bg-[var(--bg-base)] border text-[var(--text)] text-sm placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--brand)] resize-y ${
                rank <= 5 && !(score.justification ?? '').trim() ? 'border-amber-500 dark:border-amber-400' : 'border-[var(--border)]'
              }`}
            />
          </label>
        </div>
      </details>
    </div>
  )
}
