import { useState } from 'react'
import { useChair } from '../../context/ChairContext'
import { CheckSquare, Square, ChevronDown, ChevronUp } from 'lucide-react'

const DEFAULT_TOPIC = 'The Question of'

export default function ChairSetupChecklist() {
  const [expanded, setExpanded] = useState(true)
  const { conferences, activeConferenceId, committee, topics, delegates, chairName } = useChair()

  const current = conferences.find((c) => c.id === activeConferenceId) ?? conferences[0]
  const conferenceName = current?.name?.trim() ?? ''
  const hasConferenceName = conferenceName.length > 0 && conferenceName !== 'Default Conference'
  const hasCommittee = (committee?.trim().length ?? 0) > 0
  const hasTopics = Array.isArray(topics) && topics.some((t) => t?.trim() && t.trim() !== DEFAULT_TOPIC)
  const hasDelegates = (delegates?.length ?? 0) > 0
  const hasChairName = (chairName?.trim().length ?? 0) > 0

  const steps = [
    { id: 'conference', done: !!hasConferenceName, label: 'Set conference name' },
    { id: 'committee', done: !!hasCommittee, label: 'Set committee' },
    { id: 'topics', done: !!hasTopics, label: 'Set topic(s)' },
    { id: 'delegates', done: !!hasDelegates, label: 'Add delegates' },
    { id: 'chair', done: !!hasChairName, label: 'Add chair name (optional)' },
  ]
  const doneCount = steps.filter((s) => s.done).length

  return (
    <details open={expanded} onToggle={(e) => setExpanded((e.target as HTMLDetailsElement).open)} className="card-block overflow-hidden mb-4">
      <summary className="px-4 py-3 cursor-pointer list-none flex items-center justify-between gap-2 hover:bg-[var(--bg-elevated)]/50">
        <span className="font-medium text-[var(--text)] flex items-center gap-2">
          {doneCount === steps.length ? <CheckSquare className="w-5 h-5 fill-[var(--success)] text-[var(--success)]" /> : <Square className="w-5 h-5 text-[var(--text-muted)]" />}
          Chair setup
        </span>
        <span className="text-sm text-[var(--text-muted)]">{doneCount}/{steps.length} complete</span>
        {expanded ? <ChevronUp className="w-4 h-4 text-[var(--text-muted)]" /> : <ChevronDown className="w-4 h-4 text-[var(--text-muted)]" />}
      </summary>
      <div className="border-t border-[var(--border)] px-4 py-3">
        <ul className="space-y-1.5">
          {steps.map((step) => (
            <li key={step.id} className={`flex items-center gap-2 text-sm ${step.done ? 'text-[var(--text-muted)]' : 'text-[var(--text)]'}`}>
              {step.done ? <CheckSquare className="w-4 h-4 fill-[var(--success)] text-[var(--success)] shrink-0" /> : <Square className="w-4 h-4 text-[var(--text-muted)] shrink-0" />}
              <span className={step.done ? 'line-through' : ''}>{step.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </details>
  )
}
