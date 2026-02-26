import { useState, useRef, useEffect, useLayoutEffect } from 'react'
import { useChair } from '../../context/ChairContext'
import { AlertTriangle, ThumbsUp, MessageCircle, ChevronDown, Trophy, Pencil, Trash2, Check, X, Vote } from 'lucide-react'
import InfoPopover from '../InfoPopover'
import DelegateScorePopup from './DelegateScorePopup'
import type { Delegate, RollCallStatus, DelegateFeedback } from '../../types'
import { STRIKE_THRESHOLD } from './strikeMisbehaviours'

function getRollCallStatus(d: Delegate): RollCallStatus {
  if (d.rollCallStatus) return d.rollCallStatus
  return d.present ? 'present' : 'absent'
}

const ROLL_CALL_LABELS: Record<RollCallStatus, string> = {
  absent: 'Absent',
  present: 'Present',
  'present-and-voting': 'P&V',
}

function DelegateEditForm({
  delegate,
  getRollCallStatus,
  getDelegationEmoji,
  updateDelegate,
  setDelegationEmoji,
}: {
  delegate: Delegate
  getRollCallStatus: (d: Delegate) => RollCallStatus
  getDelegationEmoji: (c: string) => string
  updateDelegate: (id: string, patch: Partial<Delegate>) => void
  setDelegationEmoji: (delegation: string, emoji: string | null) => void
}) {
  const [emojiInput, setEmojiInput] = useState(getDelegationEmoji(delegate.country) || '')
  useLayoutEffect(() => {
    setEmojiInput(getDelegationEmoji(delegate.country) || '')
  }, [delegate.id, delegate.country, getDelegationEmoji])
  const rc = getRollCallStatus(delegate)
  const statuses: RollCallStatus[] = ['absent', 'present', 'present-and-voting']

  return (
    <div className="border-b border-[var(--border)] px-3 py-2 space-y-2">
      <span className="text-[10px] font-medium text-[var(--text-muted)] uppercase">Edit delegate</span>
      <div className="space-y-2 text-xs">
        <div>
          <span className="text-[var(--text-muted)] block mb-0.5">Attendance</span>
          <div className="flex gap-1">
            {statuses.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => updateDelegate(delegate.id, { rollCallStatus: s })}
                className={`flex-1 px-2 py-1 rounded text-xs font-medium transition-colors ${
                  rc === s
                    ? s === 'absent'
                      ? 'bg-[var(--text-muted)]/20 text-[var(--text)] ring-1 ring-[var(--border)]'
                      : s === 'present'
                        ? 'bg-[var(--success)]/20 text-[var(--success)] ring-1 ring-[var(--success)]/50'
                        : 'bg-[var(--accent)]/20 text-[var(--accent)] ring-1 ring-[var(--accent)]/50'
                    : 'bg-[var(--bg-elevated)] text-[var(--text-muted)] hover:text-[var(--text)]'
                }`}
                title={ROLL_CALL_LABELS[s]}
              >
                {s === 'absent' && <X className="w-3 h-3 inline mr-0.5" />}
                {s === 'present' && <Check className="w-3 h-3 inline mr-0.5" />}
                {s === 'present-and-voting' && <Vote className="w-3 h-3 inline mr-0.5" />}
                {ROLL_CALL_LABELS[s]}
              </button>
            ))}
          </div>
        </div>
        <label className="block">
          <span className="text-[var(--text-muted)] block mb-0.5">Name</span>
          <input
            type="text"
            value={delegate.name ?? ''}
            onChange={(e) => updateDelegate(delegate.id, { name: e.target.value.trim() || undefined })}
            placeholder="Delegate name"
            className="w-full px-2 py-1 rounded bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text)] placeholder-[var(--text-muted)] text-xs focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
          />
        </label>
        <label className="block">
          <span className="text-[var(--text-muted)] block mb-0.5">Email</span>
          <input
            type="email"
            value={delegate.email ?? ''}
            onChange={(e) => updateDelegate(delegate.id, { email: e.target.value.trim() || undefined })}
            placeholder="delegate@example.com"
            className="w-full px-2 py-1 rounded bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text)] placeholder-[var(--text-muted)] text-xs focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
          />
        </label>
        <div>
          <span className="text-[var(--text-muted)] block mb-0.5">Emoji / flag</span>
          <div className="flex gap-1">
            <input
              type="text"
              value={emojiInput}
              onChange={(e) => setEmojiInput(e.target.value)}
              placeholder="e.g. 🏴"
              className="flex-1 px-2 py-1 rounded bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text)] placeholder-[var(--text-muted)] text-xs focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            />
            <button
              type="button"
              onClick={() => {
                setDelegationEmoji(delegate.country, emojiInput.trim() || null)
                setEmojiInput(emojiInput.trim() || '')
              }}
              className="px-2 py-1 rounded bg-[var(--accent)] text-white text-xs font-medium hover:opacity-90"
            >
              Apply
            </button>
            <button
              type="button"
              onClick={() => {
                setDelegationEmoji(delegate.country, null)
                setEmojiInput('')
              }}
              className="px-2 py-1 rounded bg-[var(--bg-elevated)] text-[var(--text-muted)] text-xs hover:text-[var(--text)]"
            >
              Clear
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function FeedbackList({
  items,
  editingFeedbackId,
  editReason,
  onStartEdit,
  onEditChange,
  onSaveEdit,
  onCancelEdit,
  onDelete,
  getFeedbackId,
}: {
  items: DelegateFeedback[]
  editingFeedbackId: string | null
  editReason: string
  onStartEdit: (id: string, reason?: string) => void
  onEditChange: (v: string) => void
  onSaveEdit: () => void
  onCancelEdit: () => void
  onDelete: (id: string) => void
  getFeedbackId: (f: DelegateFeedback) => string
}) {
  if (items.length === 0) return null
  return (
    <div className="border-b border-[var(--border)] px-3 py-2 space-y-2 max-h-32 overflow-y-auto">
      <span className="text-[10px] font-medium text-[var(--text-muted)] uppercase">Recent feedback</span>
      {items.map((f) => {
        const id = getFeedbackId(f)
        const isEditing = editingFeedbackId === id
        const isCompliment = f.type === 'compliment'
        return (
          <div key={id} className="flex items-start gap-1.5 text-xs">
            {isEditing ? (
              <div className="flex-1 min-w-0 space-y-1">
                <input
                  type="text"
                  value={editReason}
                  onChange={(e) => onEditChange(e.target.value)}
                  placeholder="Reason"
                  className="w-full px-2 py-1 rounded bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text)] placeholder-[var(--text-muted)] text-xs focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                  autoFocus
                />
                <div className="flex gap-1">
                  <button type="button" onClick={onSaveEdit} className="px-2 py-0.5 rounded bg-[var(--accent)] text-white text-xs">Save</button>
                  <button type="button" onClick={onCancelEdit} className="px-2 py-0.5 rounded bg-[var(--bg-elevated)] text-[var(--text-muted)] text-xs">Cancel</button>
                </div>
              </div>
            ) : (
              <>
                <span className={`shrink-0 mt-0.5 ${isCompliment ? 'text-[var(--success)]' : 'text-[var(--danger)]'}`}>
                  {isCompliment ? <ThumbsUp className="w-3 h-3" /> : <MessageCircle className="w-3 h-3" />}
                </span>
                <span className="flex-1 min-w-0 truncate text-[var(--text)]" title={f.reason ?? '(no reason)'}>
                  {f.reason || '(no reason)'}
                </span>
                <div className="flex shrink-0 gap-0.5">
                  <button
                    type="button"
                    onClick={() => onStartEdit(id, f.reason)}
                    className="p-0.5 rounded text-[var(--text-muted)] hover:text-[var(--accent)] hover:bg-[var(--accent-soft)]"
                    title="Edit"
                    aria-label="Edit feedback"
                  >
                    <Pencil className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(id)}
                    className="p-0.5 rounded text-[var(--text-muted)] hover:text-[var(--danger)] hover:bg-[var(--danger)]/10"
                    title="Delete"
                    aria-label="Delete feedback"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default function ChairRoomView() {
  const {
    delegates,
    committee,
    topics,
    universe,
    getStrikeCountsByType,
    addDelegateFeedback,
    removeDelegateFeedback,
    updateDelegateFeedback,
    getDelegateFeedbackItems,
    getFeedbackCountsByType,
    getDelegationEmoji,
    setDelegationEmoji,
    setDelegateScore,
    getDelegateScore,
    updateDelegate,
  } = useChair()
  const [openDelegateId, setOpenDelegateId] = useState<string | null>(null)
  const [scorePopupDelegateId, setScorePopupDelegateId] = useState<string | null>(null)
  const [feedbackForm, setFeedbackForm] = useState<{ delegateId: string; type: 'compliment' | 'concern' } | null>(null)
  const [feedbackReason, setFeedbackReason] = useState('')
  const [editingFeedbackId, setEditingFeedbackId] = useState<string | null>(null)
  const [editReason, setEditReason] = useState('')
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!openDelegateId) return
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenDelegateId(null)
        setFeedbackForm(null)
        setFeedbackReason('')
        setEditingFeedbackId(null)
        setEditReason('')
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [openDelegateId])

  useEffect(() => {
    setFeedbackForm(null)
    setFeedbackReason('')
    setEditingFeedbackId(null)
    setEditReason('')
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
          <p className="text-[10px] text-[var(--text-muted)] mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5" aria-label="Icon key">
            <span className="inline-flex items-center gap-0.5"><ThumbsUp className="w-2.5 h-2.5" /> Compliments</span>
            <span className="inline-flex items-center gap-0.5"><MessageCircle className="w-2.5 h-2.5" /> Concerns</span>
            <span className="inline-flex items-center gap-0.5"><AlertTriangle className="w-2.5 h-2.5" /> Strikes</span>
            <span className="inline-flex items-center gap-0.5"><Trophy className="w-2.5 h-2.5" /> Scores (in menu)</span>
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
                      className="absolute left-0 right-0 top-full mt-1 z-10 rounded-lg border border-[var(--border)] bg-[var(--bg-card)] shadow-lg py-1 min-w-[10rem] max-w-[20rem]"
                      role="menu"
                      aria-label="Delegate actions"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {feedbackForm?.delegateId === d.id ? (
                        <div className="px-3 py-2 space-y-2 border-b border-[var(--border)]">
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
                                  addDelegateFeedback(d.id, feedbackForm.type, feedbackReason.trim())
                                  setFeedbackForm(null)
                                  setFeedbackReason('')
                                  setOpenDelegateId(null)
                                }
                              }}
                              disabled={!feedbackReason.trim()}
                              className="flex-1 px-2 py-1.5 rounded-lg bg-[var(--accent)] text-white text-xs font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              Submit
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setFeedbackForm(null)
                                setFeedbackReason('')
                              }}
                              className="px-2 py-1.5 rounded-lg bg-[var(--bg-elevated)] text-[var(--text-muted)] text-xs font-medium hover:text-[var(--text)]"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <DelegateEditForm
                            delegate={d}
                            getRollCallStatus={getRollCallStatus}
                            getDelegationEmoji={getDelegationEmoji}
                            updateDelegate={updateDelegate}
                            setDelegationEmoji={setDelegationEmoji}
                          />
                          <FeedbackList
                            items={getDelegateFeedbackItems(d.id)}
                            editingFeedbackId={editingFeedbackId}
                            editReason={editReason}
                            onStartEdit={(id, reason) => {
                              setEditingFeedbackId(id)
                              setEditReason(reason ?? '')
                            }}
                            onEditChange={setEditReason}
                            onSaveEdit={() => {
                              if (editingFeedbackId) {
                                updateDelegateFeedback(editingFeedbackId, { reason: editReason })
                                setEditingFeedbackId(null)
                                setEditReason('')
                              }
                            }}
                            onCancelEdit={() => {
                              setEditingFeedbackId(null)
                              setEditReason('')
                            }}
                            onDelete={(id) => removeDelegateFeedback(id)}
                            getFeedbackId={(f) => f.id ?? `legacy-${f.delegateId}-${f.type}-${f.timestamp}`}
                          />
                          <button
                            type="button"
                            role="menuitem"
                            onClick={() => setFeedbackForm({ delegateId: d.id, type: 'compliment' })}
                            className="flex items-center gap-2 w-full px-3 py-2 text-left text-sm text-[var(--text)] hover:bg-[var(--bg-elevated)] transition-colors"
                          >
                            <ThumbsUp className="w-4 h-4 text-[var(--success)]" />
                            Give compliment
                          </button>
                          <button
                            type="button"
                            role="menuitem"
                            onClick={() => setFeedbackForm({ delegateId: d.id, type: 'concern' })}
                            className="flex items-center gap-2 w-full px-3 py-2 text-left text-sm text-[var(--text)] hover:bg-[var(--bg-elevated)] transition-colors"
                          >
                            <MessageCircle className="w-4 h-4 text-[var(--danger)]" />
                            Give concern reminder
                          </button>
                        </>
                      )}
                      <button
                        type="button"
                        role="menuitem"
                        onClick={() => {
                          setScorePopupDelegateId(d.id)
                          setFeedbackForm(null)
                          setFeedbackReason('')
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
