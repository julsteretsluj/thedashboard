import { useState } from 'react'
import { useDelegate } from '../../context/DelegateContext'
import { CheckSquare, Square, ChevronDown, ChevronUp } from 'lucide-react'

/**
 * Setup checklist that auto-updates based on actual delegate dashboard state.
 */
export default function DelegateSetupChecklist() {
  const [expanded, setExpanded] = useState(true)
  const {
    name,
    country,
    countdownDate,
    conferenceEndDate,
    positionPaperDeadline,
    committeeMatrixEntries,
    committees,
    trustedSources,
    nationSources,
    uploadedResources,
  } = useDelegate()

  const hasConferenceName = (name?.trim().length ?? 0) > 0 && name?.trim() !== 'New Conference'
  const hasCountry = (country?.trim().length ?? 0) > 0
  const hasCountdown =
    (countdownDate?.trim().length ?? 0) > 0 ||
    (conferenceEndDate?.trim().length ?? 0) > 0 ||
    (positionPaperDeadline?.trim().length ?? 0) > 0
  const hasMatrix =
    (committeeMatrixEntries?.length ?? 0) > 0 || (committees?.length ?? 0) > 0
  const hasSources =
    (trustedSources?.length ?? 0) > 0 ||
    (nationSources?.length ?? 0) > 0 ||
    (uploadedResources?.length ?? 0) > 0

  const steps = [
    { id: 'conference', done: !!hasConferenceName, label: 'Set conference name' },
    { id: 'country', done: !!hasCountry, label: 'Set country' },
    { id: 'countdown', done: !!hasCountdown, label: 'Set countdown date(s)' },
    { id: 'matrix', done: !!hasMatrix, label: 'Add committee matrix entries' },
    { id: 'sources', done: !!hasSources, label: 'Add trusted sources or resources (optional)' },
  ]
  const doneCount = steps.filter((s) => s.done).length
  const total = steps.length

  return (
    <details
      open={expanded}
      onToggle={(e) => setExpanded((e.target as HTMLDetailsElement).open)}
      className="card-block overflow-hidden mb-4"
    >
      <summary className="px-4 py-3 cursor-pointer list-none flex items-center justify-between gap-2 hover:bg-[var(--bg-elevated)]/50">
        <span className="font-medium text-[var(--text)] flex items-center gap-2">
          {doneCount === total ? (
            <CheckSquare className="w-5 h-5 fill-[var(--success)] text-[var(--success)]" />
          ) : (
            <Square className="w-5 h-5 text-[var(--text-muted)]" />
          )}
          Delegate setup
        </span>
        <span className="text-sm text-[var(--text-muted)]">
          {doneCount}/{total} complete
        </span>
        {expanded ? (
          <ChevronUp className="w-4 h-4 text-[var(--text-muted)]" />
        ) : (
          <ChevronDown className="w-4 h-4 text-[var(--text-muted)]" />
        )}
      </summary>
      <div className="border-t border-[var(--border)] px-4 py-3">
        <ul className="space-y-1.5">
          {steps.map((step) => (
            <li
              key={step.id}
              className={`flex items-center gap-2 text-sm ${
                step.done ? 'text-[var(--text-muted)]' : 'text-[var(--text)]'
              }`}
            >
              {step.done ? (
                <CheckSquare className="w-4 h-4 fill-[var(--success)] text-[var(--success)] shrink-0" />
              ) : (
                <Square className="w-4 h-4 text-[var(--text-muted)] shrink-0" />
              )}
              <span className={step.done ? 'line-through' : ''}>{step.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </details>
  )
}
