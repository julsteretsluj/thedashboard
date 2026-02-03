import { useChair } from '../../context/ChairContext'
import { CheckSquare, Square, RotateCcw } from 'lucide-react'

const FLOW_STEPS: { id: string; label: string }[] = [
  { id: 'rollcall', label: 'Roll call' },
  { id: 'open-floor', label: 'Open the floor (points & motions)' },
  { id: 'recognize-motions', label: 'Recognize motions' },
  { id: 'vote-motions', label: 'Vote on motion(s)' },
  { id: 'engage-or-gsl', label: 'Engage in chosen motion or move to GSL' },
  { id: 'open-floor-again', label: 'Open the floor again' },
  { id: 'recognize-motions-2', label: 'Recognize motions (repeat as needed)' },
  { id: 'vote-motions-2', label: 'Vote on motion(s)' },
  { id: 'continue-cycle', label: 'Continue cycle (engage motion / GSL → open floor)' },
]

export default function ChairFlowChecklist() {
  const { toggleFlowStep, isFlowStepDone, resetFlowChecklist } = useChair()
  const doneCount = FLOW_STEPS.filter((s) => isFlowStepDone(s.id)).length

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-semibold text-2xl text-[var(--text)] mb-1">📋 Committee flow checklist</h2>
        <p className="text-[var(--text-muted)] text-sm">
          Normal committee flow — tick steps as you go. Reset when starting a new session or cycle.
        </p>
      </div>
      <div className="card-block p-4 space-y-2">
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-xs font-medium text-[var(--text-muted)]">
            {doneCount} / {FLOW_STEPS.length} done
          </span>
          <button
            type="button"
            onClick={resetFlowChecklist}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--bg-elevated)] transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset checklist
          </button>
        </div>
        <ul className="space-y-1">
          {FLOW_STEPS.map((step) => {
            const done = isFlowStepDone(step.id)
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
                    onChange={() => toggleFlowStep(step.id)}
                    className="sr-only"
                    aria-label={step.label}
                  />
                </label>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
