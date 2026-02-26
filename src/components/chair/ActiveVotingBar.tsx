import { useChair } from '../../context/ChairContext'
import { Vote } from 'lucide-react'

/**
 * Bar showing active vote (motion, resolution, or amendment). Visible on all chair pages when a vote is in progress.
 */
export default function ActiveVotingBar({ onVotingClick }: { onVotingClick?: () => void }) {
  const { voteInProgress, resolutionVoteInProgress, amendmentVoteInProgress, delegateVotes } = useChair()

  const activeVote = voteInProgress ?? resolutionVoteInProgress ?? amendmentVoteInProgress
  if (!activeVote) return null

  const isResolution = !!resolutionVoteInProgress
  const isAmendment = !!amendmentVoteInProgress
  const voteTitle =
    (resolutionVoteInProgress as { title?: string })?.title ??
    (amendmentVoteInProgress as { text?: string })?.text ??
    (voteInProgress as { text?: string })?.text ??
    'Vote'
  const label = isAmendment ? 'Amendment' : isResolution ? 'Resolution' : 'Motion'

  const yes = Object.values(delegateVotes).filter((v) => v === 'yes').length
  const no = Object.values(delegateVotes).filter((v) => v === 'no').length
  const abstain = Object.values(delegateVotes).filter((v) => v === 'abstain').length

  return (
    <div
      role={onVotingClick ? 'button' : undefined}
      onClick={onVotingClick}
      className={`mb-3 flex items-center gap-2 rounded-lg border-2 border-[var(--accent)]/50 bg-[var(--accent-soft)]/30 px-3 py-2 ${
        onVotingClick ? 'cursor-pointer hover:bg-[var(--accent-soft)]/50' : ''
      }`}
    >
      <Vote className="w-4 h-4 shrink-0 text-[var(--accent)]" />
      <span className="text-xs font-medium text-[var(--text-muted)] shrink-0">{label} vote:</span>
      <span className="font-medium text-[var(--text)] truncate flex-1 min-w-0" title={voteTitle}>
        {voteTitle.length > 60 ? voteTitle.slice(0, 57) + '…' : voteTitle}
      </span>
      <div className="flex items-center gap-3 text-xs shrink-0">
        <span className="text-[var(--success)]">Yes {yes}</span>
        <span className="text-[var(--danger)]">No {no}</span>
        <span className="text-[var(--text-muted)]">Abstain {abstain}</span>
      </div>
      {onVotingClick && (
        <span className="text-xs text-[var(--accent)] font-medium shrink-0">Click to record votes →</span>
      )}
    </div>
  )
}
