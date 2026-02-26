import { X } from 'lucide-react'
import type { Delegate } from '../../types'
import type { DelegateScore } from '../../types'
import {
  DELEGATE_CRITERIA,
  POSITION_PAPER_CRITERIA,
  FULL_RUBRIC,
  SCORE_OPTIONS,
  scoreSum,
} from '../../constants/delegateScoring'

interface DelegateScorePopupProps {
  delegate: Delegate
  score: DelegateScore
  setDelegateScore: (delegateId: string, patch: Partial<DelegateScore>) => void
  onClose: () => void
  getDelegationEmoji: (country: string) => string
}

export default function DelegateScorePopup({
  delegate,
  score,
  setDelegateScore,
  onClose,
  getDelegationEmoji,
}: DelegateScorePopupProps) {
  const delegateTotal = scoreSum(score, DELEGATE_CRITERIA)
  const paperTotal = scoreSum(score, POSITION_PAPER_CRITERIA)

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />
      <div
        className="fixed inset-4 sm:inset-8 md:inset-12 lg:inset-16 z-50 overflow-auto rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] shadow-xl flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-labelledby="score-popup-title"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between gap-4 px-4 py-3 border-b border-[var(--border)] bg-[var(--bg-card)] shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-2xl shrink-0">{getDelegationEmoji(delegate.country) || '🏳️'}</span>
            <h2 id="score-popup-title" className="font-semibold text-[var(--text)] truncate">
              Edit scores — {delegate.country}
              {delegate.name && <span className="text-[var(--text-muted)] font-normal"> ({delegate.name})</span>}
            </h2>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-sm text-[var(--text-muted)]">
              D: {delegateTotal}/48 · PP: {paperTotal}/40
            </span>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--bg-elevated)] transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-4 space-y-6">
          <section>
            <h3 className="text-sm font-semibold text-[var(--brand)] mb-3">Delegate criteria (48 pts)</h3>
            <div className="space-y-4">
              {DELEGATE_CRITERIA.map(({ key, label }, i) => {
                const rubric = FULL_RUBRIC.delegate[i]
                const value = score[key] as number | undefined
                return (
                  <div
                    key={key}
                    className="rounded-lg border border-[var(--border)] p-3 bg-[var(--bg-elevated)]/50"
                  >
                    <div className="flex items-center justify-between gap-4 mb-2">
                      <h4 className="font-medium text-[var(--text)] text-sm">{label}</h4>
                      <select
                        value={value ?? ''}
                        onChange={(e) => {
                          const v = e.target.value ? parseInt(e.target.value, 10) : undefined
                          setDelegateScore(delegate.id, { [key]: v })
                        }}
                        className="px-3 py-1.5 rounded-lg bg-[var(--bg-base)] border border-[var(--border)] text-[var(--text)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                      >
                        <option value="">—</option>
                        {SCORE_OPTIONS.map((n) => (
                          <option key={n} value={n}>{n}</option>
                        ))}
                      </select>
                    </div>
                    {rubric && (
                      <dl className="grid gap-1.5 text-xs">
                        <div><dt className="text-[var(--text-muted)] font-medium">Beginning (1–2)</dt><dd className="text-[var(--text)]">{rubric.beginning}</dd></div>
                        <div><dt className="text-[var(--text-muted)] font-medium">Developing (3–4)</dt><dd className="text-[var(--text)]">{rubric.developing}</dd></div>
                        <div><dt className="text-[var(--text-muted)] font-medium">Proficient (5–6)</dt><dd className="text-[var(--text)]">{rubric.proficient}</dd></div>
                        <div><dt className="text-[var(--text-muted)] font-medium">Exemplary (7–8)</dt><dd className="text-[var(--text)]">{rubric.exemplary}</dd></div>
                      </dl>
                    )}
                  </div>
                )
              })}
            </div>
          </section>

          <section>
            <h3 className="text-sm font-semibold text-[var(--brand)] mb-3">Position paper (40 pts)</h3>
            <div className="space-y-4">
              {POSITION_PAPER_CRITERIA.map(({ key, label }, i) => {
                const rubric = FULL_RUBRIC.positionPaper[i]
                const value = score[key] as number | undefined
                return (
                  <div
                    key={key}
                    className="rounded-lg border border-[var(--border)] p-3 bg-[var(--bg-elevated)]/50"
                  >
                    <div className="flex items-center justify-between gap-4 mb-2">
                      <h4 className="font-medium text-[var(--text)] text-sm">{label}</h4>
                      <select
                        value={value ?? ''}
                        onChange={(e) => {
                          const v = e.target.value ? parseInt(e.target.value, 10) : undefined
                          setDelegateScore(delegate.id, { [key]: v })
                        }}
                        className="px-3 py-1.5 rounded-lg bg-[var(--bg-base)] border border-[var(--border)] text-[var(--text)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                      >
                        <option value="">—</option>
                        {SCORE_OPTIONS.map((n) => (
                          <option key={n} value={n}>{n}</option>
                        ))}
                      </select>
                    </div>
                    {rubric && (
                      <dl className="grid gap-1.5 text-xs">
                        <div><dt className="text-[var(--text-muted)] font-medium">Beginning (1–2)</dt><dd className="text-[var(--text)]">{rubric.beginning}</dd></div>
                        <div><dt className="text-[var(--text-muted)] font-medium">Developing (3–4)</dt><dd className="text-[var(--text)]">{rubric.developing}</dd></div>
                        <div><dt className="text-[var(--text-muted)] font-medium">Proficient (5–6)</dt><dd className="text-[var(--text)]">{rubric.proficient}</dd></div>
                        <div><dt className="text-[var(--text-muted)] font-medium">Exemplary (7–8)</dt><dd className="text-[var(--text)]">{rubric.exemplary}</dd></div>
                      </dl>
                    )}
                  </div>
                )
              })}
            </div>
          </section>
        </div>
      </div>
    </>
  )
}
