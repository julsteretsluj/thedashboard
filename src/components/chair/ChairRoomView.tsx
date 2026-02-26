import { useState, useRef, useEffect } from 'react'
import { useChair } from '../../context/ChairContext'
import { AlertTriangle, ThumbsUp, MessageCircle, ChevronDown, Trophy } from 'lucide-react'
import InfoPopover from '../InfoPopover'
import DelegateScorePopup from './DelegateScorePopup'
import type { Delegate, RollCallStatus } from '../../types'
import { STRIKE_THRESHOLD } from './strikeMisbehaviours'

function getRollCallStatus(d: Delegate): RollCallStatus {
  if (d.rollCallStatus) return d.rollCallStatus
  return d.present ? 'present' : 'absent'
}

export default function ChairRoomView() {
  const {
    delegates,
    committee,
    topics,
    universe,
    getStrikeCountsByType,
    addDelegateFeedback,
    getFeedbackCountsByType,
    getDelegationEmoji,
    setDelegateScore,
    getDelegateScore,
  } = useChair()
  const [openDelegateId, setOpenDelegateId] = useState<string | null>(null)
  const [scorePopupDelegateId, setScorePopupDelegateId] = useState<string | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!openDelegateId) return
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenDelegateId(null)
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [openDelegateId])

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-2">
        <div>
          <h2 className="font-semibold text-2xl text-[var(--text)] mb-1 flex items-center gap-1.5">
            🖥️ Digital Room View
            <InfoPopover title="Digital Room">
              Shows all delegates with their roll-call status (Absent, Present, P&amp;V). Click a delegate card to give a compliment or concern reminder. Delegates are listed alphabetically by country.
            </InfoPopover>
          </h2>
          <p className="text-[var(--text-muted)] text-sm">
            {committee}
            {universe ? ` — ${universe} — ` : ` — `}
            {(topics ?? []).filter(Boolean).join(' · ') || '(no topics set)'}
          </p>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            Click a delegate to give a compliment or concern reminder.
          </p>
        </div>
      </div>
      <div className="card-block p-6 min-h-[320px]">
        {delegates.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-[var(--text-muted)]">
            <p className="text-sm">👥 No delegates in the room yet.</p>
            <p className="text-xs mt-1">Add delegates from the Delegates section.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {[...delegates].sort((a, b) => a.country.localeCompare(b.country, undefined, { sensitivity: 'base' })).map((d) => {
              const counts = getStrikeCountsByType(d.id)
              const totalStrikes = Object.values(counts).reduce((a, b) => a + b, 0)
              const hasRed = Object.values(counts).some((c) => c >= STRIKE_THRESHOLD)
              const feedback = getFeedbackCountsByType(d.id)
              const compliments = feedback.compliment ?? 0
              const concerns = feedback.concern ?? 0
              const isOpen = openDelegateId === d.id

              return (
                <div
                  key={d.id}
                  ref={isOpen ? dropdownRef : undefined}
                  className="relative"
                >
                  <button
                    type="button"
                    onClick={() => setOpenDelegateId(isOpen ? null : d.id)}
                    className={`w-full rounded-lg border p-3 text-center transition-colors text-left ${
                      hasRed
                        ? 'border-[var(--danger)] bg-[var(--danger)]/10 hover:bg-[var(--danger)]/15'
                        : 'border-[var(--border)] bg-[var(--bg-elevated)] hover:bg-[var(--bg-card)] hover:border-[var(--accent)]/50'
                    } ${isOpen ? 'ring-2 ring-[var(--accent)]' : ''}`}
                    aria-expanded={isOpen}
                    aria-haspopup="menu"
                    aria-label={`${d.country} — give compliment or concern`}
                  >
                    <div className="text-xs font-medium text-[var(--accent)] uppercase tracking-wide flex items-center justify-center gap-1">
                      <span>{getDelegationEmoji(d.country) || '🏳️'}</span>
                      <span>{d.country}</span>
                    </div>
                    <div className="text-sm text-[var(--text)] mt-1 font-medium">
                      {d.name || '—'}
                    </div>
                    {d.committee && (
                      <div className="text-xs text-[var(--text-muted)] mt-0.5">{d.committee}</div>
                    )}
                    <div className="mt-2 flex items-center justify-center gap-2 flex-wrap">
                      {(() => {
                        const rc = getRollCallStatus(d)
                        const titles: Record<RollCallStatus, string> = {
                          absent: 'Absent',
                          present: 'Present (may abstain)',
                          'present-and-voting': 'Present and voting',
                        }
                        return (
                          <span
                            className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-medium ${
                              rc === 'absent'
                                ? 'bg-[var(--text-muted)]/20 text-[var(--text-muted)]'
                                : rc === 'present'
                                  ? 'bg-[var(--success)]/20 text-[var(--success)]'
                                  : 'bg-[var(--accent)]/20 text-[var(--accent)]'
                            }`}
                            title={titles[rc]}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                              rc === 'absent' ? 'bg-[var(--text-muted)]' : rc === 'present' ? 'bg-[var(--success)]' : 'bg-[var(--accent)]'
                            }`} />
                            {rc === 'present-and-voting' ? 'P&V' : rc === 'present' ? 'Present' : 'Absent'}
                          </span>
                        )
                      })()}
                      {totalStrikes > 0 && (
                        <span
                          className={`inline-flex items-center gap-0.5 text-xs ${
                            hasRed ? 'text-[var(--danger)]' : 'text-[var(--accent)]'
                          }`}
                          title={Object.entries(counts)
                            .map(([t, c]) => `${t}: ${c}`)
                            .join(', ')}
                        >
                          <AlertTriangle className="w-3 h-3" />
                          {totalStrikes}
                        </span>
                      )}
                      {compliments > 0 && (
                        <span className="inline-flex items-center gap-0.5 text-xs text-[var(--success)]" title="Compliments">
                          <ThumbsUp className="w-3 h-3" />
                          {compliments}
                        </span>
                      )}
                      {concerns > 0 && (
                        <span className="inline-flex items-center gap-0.5 text-xs text-[var(--danger)]" title="Concern reminders">
                          <MessageCircle className="w-3 h-3" />
                          {concerns}
                        </span>
                      )}
                      <ChevronDown
                        className={`w-3 h-3 text-[var(--text-muted)] flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                        aria-hidden
                      />
                    </div>
                  </button>
                  {isOpen && (
                    <div
                      className="absolute left-0 right-0 top-full mt-1 z-10 rounded-lg border border-[var(--border)] bg-[var(--bg-card)] shadow-lg py-1 min-w-[10rem]"
                      role="menu"
                      aria-label="Delegate actions"
                    >
                      <button
                        type="button"
                        role="menuitem"
                        onClick={() => {
                          addDelegateFeedback(d.id, 'compliment')
                          setOpenDelegateId(null)
                        }}
                        className="flex items-center gap-2 w-full px-3 py-2 text-left text-sm text-[var(--text)] hover:bg-[var(--bg-elevated)] transition-colors"
                      >
                        <ThumbsUp className="w-4 h-4 text-[var(--success)]" />
                        Give compliment
                      </button>
                      <button
                        type="button"
                        role="menuitem"
                        onClick={() => {
                          addDelegateFeedback(d.id, 'concern')
                          setOpenDelegateId(null)
                        }}
                        className="flex items-center gap-2 w-full px-3 py-2 text-left text-sm text-[var(--text)] hover:bg-[var(--bg-elevated)] transition-colors"
                      >
                        <MessageCircle className="w-4 h-4 text-[var(--danger)]" />
                        Give concern reminder
                      </button>
                      <button
                        type="button"
                        role="menuitem"
                        onClick={() => {
                          setScorePopupDelegateId(d.id)
                          setOpenDelegateId(null)
                        }}
                        className="flex items-center gap-2 w-full px-3 py-2 text-left text-sm text-[var(--text)] hover:bg-[var(--bg-elevated)] transition-colors"
                      >
                        <Trophy className="w-4 h-4 text-[var(--gold)]" />
                        Edit scores
                      </button>
                    </div>
                  )}
                {scorePopupDelegateId === d.id && (
                  <DelegateScorePopup
                    delegate={d}
                    score={getDelegateScore(d.id)}
                    setDelegateScore={setDelegateScore}
                    onClose={() => setScorePopupDelegateId(null)}
                    getDelegationEmoji={getDelegationEmoji}
                  />
                )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
