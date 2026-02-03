import { useChair } from '../../context/ChairContext'
import { CheckSquare, Square, RotateCcw } from 'lucide-react'
import InfoPopover from '../InfoPopover'

const PREP_GROUPS: { title: string; steps: { id: string; label: string }[] }[] = [
  {
    title: '📜 Rules & procedure',
    steps: [
      { id: 'prep-rules-read', label: 'Read and understand committee rules of procedure' },
      { id: 'prep-parliamentary', label: 'Review parliamentary procedure (motions, points, voting)' },
      { id: 'prep-time-limits', label: 'Confirm speaking times and time limits' },
      { id: 'prep-quorum', label: 'Know quorum and voting requirements' },
    ],
  },
  {
    title: '📌 Committee & topic',
    steps: [
      { id: 'prep-topic-research', label: 'Research committee topic and background' },
      { id: 'prep-study-guide', label: 'Read study guide and key documents' },
      { id: 'prep-committee-set', label: 'Set committee name and topic in dashboard' },
      { id: 'prep-agenda', label: 'Prepare session agenda and flow' },
    ],
  },
  {
    title: '🖥️ Room & tech',
    steps: [
      { id: 'prep-room-setup', label: 'Set up digital room (delegates list, placards)' },
      { id: 'prep-tech-check', label: 'Tech check: platform, audio, screen share' },
      { id: 'prep-backup', label: 'Have backup plan if tech fails' },
    ],
  },
  {
    title: '📋 Materials & logistics',
    steps: [
      { id: 'prep-rollcall-list', label: 'Prepare roll call list and attendance' },
      { id: 'prep-speakers-list', label: 'Plan speakers list management' },
      { id: 'prep-motions-templates', label: 'Prepare common motions / points (if using templates)' },
      { id: 'prep-timing', label: 'Confirm session start time and breaks' },
    ],
  },
  {
    title: '⚠️ Crisis (if applicable)',
    steps: [
      { id: 'prep-crisis-brief', label: 'Review crisis elements and update slides' },
      { id: 'prep-crisis-speakers', label: 'Plan crisis speaker order / cues' },
      { id: 'prep-crisis-pathways', label: 'Prepare crisis pathways and facts' },
    ],
  },
  {
    title: '👥 Team & communication',
    steps: [
      { id: 'prep-co-chair', label: 'Coordinate with co-chair(s) on roles' },
      { id: 'prep-staff', label: 'Confirm staff / dais support and cues' },
      { id: 'prep-delegate-brief', label: 'Prepare brief for delegates (rules, timing)' },
    ],
  },
]

export default function ChairPrepChecklist() {
  const { togglePrepStep, isPrepStepDone, resetPrepChecklist } = useChair()
  const allSteps = PREP_GROUPS.flatMap((g) => g.steps)
  const doneCount = allSteps.filter((s) => isPrepStepDone(s.id)).length

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-2">
        <div>
          <h2 className="font-semibold text-2xl text-[var(--text)] mb-1 flex items-center gap-1.5">
            📋 Chair preparation checklist
            <InfoPopover title="Chair prep">
              Before the conference: review rules and procedure, research the topic, set up the digital room and tech, prepare roll call and speakers list, and coordinate with co-chairs. Reset when prepping a new session.
            </InfoPopover>
          </h2>
          <p className="text-[var(--text-muted)] text-sm">
            Before the conference: rules, topic, room, materials, and team. Reset when prepping a new session.
          </p>
        </div>
      </div>
      <div className="card-block p-4 flex items-center justify-between gap-2 mb-4">
        <span className="text-xs font-medium text-[var(--text-muted)]">
          {doneCount} / {allSteps.length} done
        </span>
        <button
          type="button"
          onClick={resetPrepChecklist}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--bg-elevated)] transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset checklist
        </button>
      </div>
      <div className="space-y-5">
        {PREP_GROUPS.map((group) => (
          <div key={group.title} className="card-block p-4">
            <h3 className="font-medium text-[var(--text)] mb-3">{group.title}</h3>
            <ul className="space-y-1">
              {group.steps.map((step) => {
                const done = isPrepStepDone(step.id)
                return (
                  <li key={step.id}>
                    <label
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors ${
                        done ? 'bg-[var(--success)]/10 text-[var(--text)]' : 'hover:bg-[var(--bg-elevated)]'
                      }`}
                    >
                      <span className="text-[var(--accent)] flex-shrink-0">
                        {done ? (
                          <CheckSquare className="w-5 h-5 fill-[var(--success)] text-[var(--success)]" />
                        ) : (
                          <Square className="w-5 h-5" />
                        )}
                      </span>
                      <span className={`text-sm ${done ? 'line-through text-[var(--text-muted)]' : 'text-[var(--text)]'}`}>
                        {step.label}
                      </span>
                      <input
                        type="checkbox"
                        checked={done}
                        onChange={() => togglePrepStep(step.id)}
                        className="sr-only"
                        aria-label={step.label}
                      />
                    </label>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}
