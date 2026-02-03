import { useChair } from '../../context/ChairContext'
import type { Delegate, RollCallStatus } from '../../types'
import { Check, X, Vote } from 'lucide-react'
import InfoPopover from '../InfoPopover'

function getRollCallStatus(d: Delegate): RollCallStatus {
  if (d.rollCallStatus) return d.rollCallStatus
  return d.present ? 'present' : 'absent'
}

const NEXT_STATUS: Record<RollCallStatus, RollCallStatus> = {
  absent: 'present',
  present: 'present-and-voting',
  'present-and-voting': 'absent',
}

const LABELS: Record<RollCallStatus, string> = {
  absent: 'Absent',
  present: 'Present (may abstain)',
  'present-and-voting': 'Present and voting',
}

export default function ChairRollCall() {
  const { delegates, rollCallComplete, setRollCallComplete, updateDelegate, getDelegationEmoji } = useChair()

  const setRollCallStatus = (id: string, status: RollCallStatus) => {
    updateDelegate(id, { rollCallStatus: status })
  }

  const cycleStatus = (id: string, current: RollCallStatus) => {
    setRollCallStatus(id, NEXT_STATUS[current])
  }

  const presentCount = delegates.filter((d) => getRollCallStatus(d) === 'present').length
  const presentAndVotingCount = delegates.filter((d) => getRollCallStatus(d) === 'present-and-voting').length
  const absentCount = delegates.filter((d) => getRollCallStatus(d) === 'absent').length
  const votingCount = presentCount + presentAndVotingCount

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-2">
        <div>
          <h2 className="font-semibold text-2xl text-[var(--text)] mb-1 flex items-center gap-1.5">
            ✅ Roll Call Tracker
            <InfoPopover title="Roll call">
              Mark each delegate as Absent, Present (may abstain), or Present and voting (must vote, cannot abstain). Click a delegate&apos;s status to cycle. During voting, only present delegates can vote; present-and-voting cannot choose abstain.
            </InfoPopover>
          </h2>
          <p className="text-[var(--text-muted)] text-sm">
            Present (may abstain from voting), Present and voting (must vote, cannot abstain), or Absent. Click to cycle.
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={rollCallComplete}
            onChange={(e) => setRollCallComplete(e.target.checked)}
            className="rounded border-[var(--border)] bg-[var(--bg-elevated)] text-[var(--accent)] focus:ring-[var(--accent)]"
          />
          <span className="text-sm text-[var(--text)]">Roll call complete</span>
        </label>
      </div>
      <div className="card-block p-4 flex flex-wrap gap-4 text-sm">
        <span className="text-[var(--success)]">
          Present (may abstain): <strong>{presentCount}</strong>
        </span>
        <span className="text-[var(--accent)]">
          Present and voting: <strong>{presentAndVotingCount}</strong>
        </span>
        <span className="text-[var(--text-muted)]">
          Absent: <strong>{absentCount}</strong>
        </span>
        <span className="text-[var(--text-muted)]">
          Total present: <strong>{votingCount}</strong> / {delegates.length}
        </span>
      </div>
      <div className="card-block overflow-hidden">
        <div className="px-4 py-3 border-b border-[var(--border)]">
          <h3 className="text-sm font-medium text-[var(--text)]">👥 Delegates</h3>
        </div>
        <ul className="divide-y divide-[var(--border)] max-h-96 overflow-auto">
          {[...delegates].sort((a, b) => a.country.localeCompare(b.country, undefined, { sensitivity: 'base' })).map((d) => {
            const status = getRollCallStatus(d)
            const isPresent = status === 'present'
            const isPresentAndVoting = status === 'present-and-voting'
            const isAbsent = status === 'absent'
            return (
              <li key={d.id} className="px-4 py-3 flex items-center justify-between gap-2">
                <span className="text-sm text-[var(--text)] min-w-0 flex items-center gap-2">
                  <span className="text-base shrink-0">{getDelegationEmoji(d.country) || '🏳️'}</span>
                  <strong className="text-[var(--accent)] truncate">{d.country}</strong>
                  {d.name && <span className="text-[var(--text-muted)] shrink-0">{d.name}</span>}
                </span>
                <button
                  onClick={() => cycleStatus(d.id, status)}
                  className={`flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg transition-colors shrink-0 ${
                    isAbsent
                      ? 'text-[var(--text-muted)] bg-[var(--bg-elevated)] hover:bg-[var(--border)]'
                      : isPresent
                        ? 'text-[var(--success)] bg-[var(--success)]/10 hover:bg-[var(--success)]/20'
                        : 'text-[var(--accent)] bg-[var(--accent-soft)] hover:bg-[var(--accent-soft)]/80'
                  }`}
                  title={LABELS[status]}
                >
                  {isAbsent && <X className="w-4 h-4" />}
                  {isPresent && <Check className="w-4 h-4" />}
                  {isPresentAndVoting && <Vote className="w-4 h-4" />}
                  {LABELS[status]}
                </button>
              </li>
            )
          })}
        </ul>
      </div>
      <p className="text-xs text-[var(--text-muted)]">
        Click a delegate&apos;s status to cycle: Absent → Present (may abstain) → Present and voting → Absent.
      </p>
    </div>
  )
}
