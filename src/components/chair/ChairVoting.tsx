import { useChair } from '../../context/ChairContext'
import { Check, X, Minus } from 'lucide-react'
import type { Delegate, RollCallStatus } from '../../types'
import InfoPopover from '../InfoPopover'

function getRollCallStatus(d: Delegate): RollCallStatus {
  if (d.rollCallStatus) return d.rollCallStatus
  return d.present ? 'present' : 'absent'
}

export default function ChairVoting() {
  const {
    voteInProgress,
    resolutionVoteInProgress,
    amendmentVoteInProgress,
    delegates,
    delegateVotes,
    recordVote,
    endVote,
    endResolutionVote,
    endAmendmentVote,
    getDelegationEmoji,
  } = useChair()

  const activeVote = voteInProgress ?? resolutionVoteInProgress ?? amendmentVoteInProgress
  const isResolution = !!resolutionVoteInProgress
  const isAmendment = !!amendmentVoteInProgress
  const voteTitle = resolutionVoteInProgress?.title ?? amendmentVoteInProgress?.text ?? voteInProgress?.text
  const onEndVote = isAmendment ? endAmendmentVote : isResolution ? endResolutionVote : endVote

  if (!activeVote) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="font-semibold text-2xl text-[var(--text)] mb-1">🗳️ Voting</h2>
          <p className="text-[var(--text-muted)] text-sm">Manual voting: chairs record each delegate&apos;s vote. Start a vote from Motions & Points.</p>
        </div>
        <div className="card-block p-8 text-center text-[var(--text-muted)]">
          No active vote. Go to <strong>Motions &amp; Points</strong>, <strong>Resolutions</strong>, or <strong>Amendments</strong> and click &quot;Vote&quot;. Then return here to record each delegate&apos;s Yes, No, or Abstain.
        </div>
      </div>
    )
  }

  const yes = Object.values(delegateVotes).filter((v) => v === 'yes').length
  const no = Object.values(delegateVotes).filter((v) => v === 'no').length
  const abstain = Object.values(delegateVotes).filter((v) => v === 'abstain').length
  const votingDelegates = delegates.filter((d) => getRollCallStatus(d) !== 'absent' && !d.votingRightsRevoked)
  const total = votingDelegates.length
  const recorded = Object.keys(delegateVotes).length

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-2">
        <div>
          <h2 className="font-semibold text-2xl text-[var(--text)] mb-1 flex items-center gap-1.5">
            🗳️ Active Voting
            <InfoPopover title="Manual voting">
              Not digital—chairs manually mark each delegate&apos;s vote. Start a vote from Motions &amp; Points, then record Yes, No, or Abstain for each delegate as they vote on the floor. &quot;Present and voting&quot; cannot abstain. Absent delegates have no vote. End vote to record the result.
            </InfoPopover>
          </h2>
          <p className="text-[var(--text-muted)] text-sm">Manually mark each delegate&apos;s vote as they vote on the floor.</p>
        </div>
      </div>

      <div className="accent-highlight-wave rounded-xl border-2 border-[var(--accent)] bg-[var(--accent-soft)]/30 p-4">
        <p className="text-sm font-medium text-[var(--text)] mb-2">{isAmendment ? '📝 Amendment:' : isResolution ? '📜 Resolution:' : '📜 Motion:'}</p>
        <p className="text-[var(--text)]">{voteTitle}</p>
        <p className="text-xs text-[var(--text-muted)] mt-1">
          {isResolution ? '2/3 majority required' : isAmendment ? 'Simple majority required' : 'Simple majority (or 2/3 for close debate, etc.)'}
        </p>
        <div className="mt-4 flex flex-wrap gap-4 text-sm">
          <span className="text-[var(--success)]">Yes: {yes}</span>
          <span className="text-[var(--danger)]">No: {no}</span>
          <span className="text-[var(--text-muted)]">Abstain: {abstain}</span>
          <span className="text-[var(--text-muted)]">Recorded: {recorded} / {total}</span>
        </div>
        <button
          onClick={onEndVote}
          className="mt-4 px-4 py-2 rounded-lg bg-[var(--accent)] text-white text-sm font-medium hover:opacity-90"
        >
          End vote & record result
        </button>
      </div>

      <div className="card-block overflow-hidden">
        <div className="px-4 py-3 border-b border-[var(--border)]">
          <h3 className="text-sm font-medium text-[var(--text)]">👥 Delegate votes</h3>
        </div>
        <ul className="divide-y divide-[var(--border)] max-h-96 overflow-auto">
          {[...delegates].sort((a, b) => a.country.localeCompare(b.country, undefined, { sensitivity: 'base' })).map((d) => {
            const vote = delegateVotes[d.id]
            const rc = getRollCallStatus(d)
            const isAbsent = rc === 'absent'
            const votingRevoked = !!d.votingRightsRevoked
            const cannotVote = isAbsent || votingRevoked
            const canAbstain = rc === 'present' && !votingRevoked
            return (
              <li
                key={d.id}
                className={`px-4 py-3 flex items-center justify-between ${cannotVote ? 'opacity-60' : ''}`}
              >
                <span className="text-sm text-[var(--text)] flex items-center gap-2">
                  <span className="shrink-0">{getDelegationEmoji(d.country) || '🏳️'}</span>
                  <strong className="text-[var(--accent)]">{d.country}</strong>
                  {d.name && <span className="text-[var(--text-muted)]">{d.name}</span>}
                  {isAbsent && (
                    <span className="ml-2 text-xs text-[var(--text-muted)]">(Absent)</span>
                  )}
                  {votingRevoked && (
                    <span className="ml-2 text-xs text-[var(--danger)]">(Voting revoked)</span>
                  )}
                </span>
                {cannotVote ? (
                  <span className="text-xs text-[var(--text-muted)]">—</span>
                ) : (
                  <div className="flex gap-1">
                    <button
                      onClick={() => recordVote(d.id, 'yes')}
                      className={`p-2 rounded-lg transition-colors ${
                        vote === 'yes' ? 'bg-[var(--success)]/30 text-[var(--success)]' : 'bg-[var(--bg-elevated)] text-[var(--text-muted)] hover:text-[var(--success)]'
                      }`}
                      title="Yes"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => recordVote(d.id, 'no')}
                      className={`p-2 rounded-lg transition-colors ${
                        vote === 'no' ? 'bg-[var(--danger)]/30 text-[var(--danger)]' : 'bg-[var(--bg-elevated)] text-[var(--text-muted)] hover:text-[var(--danger)]'
                      }`}
                      title="No"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    {canAbstain && (
                      <button
                        onClick={() => recordVote(d.id, 'abstain')}
                        className={`p-2 rounded-lg transition-colors ${
                          vote === 'abstain' ? 'bg-[var(--text-muted)]/30 text-[var(--text)]' : 'bg-[var(--bg-elevated)] text-[var(--text-muted)] hover:text-[var(--text)]'
                        }`}
                        title="Abstain (present only)"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                )}
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
