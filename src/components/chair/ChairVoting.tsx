import { useChair } from '../../context/ChairContext'
import { Check, X, Minus } from 'lucide-react'

export default function ChairVoting() {
  const {
    voteInProgress,
    delegates,
    delegateVotes,
    recordVote,
    endVote,
  } = useChair()

  if (!voteInProgress) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="font-serif text-2xl text-[var(--text)] mb-1">🗳️ Voting</h2>
          <p className="text-[var(--text-muted)] text-sm">Start a vote from a motion in Motions & Points.</p>
        </div>
        <div className="card-block p-8 text-center text-[var(--text-muted)]">
          🗳️ No active vote. Go to Motions & Points and click &quot;Vote&quot; on a motion.
        </div>
      </div>
    )
  }

  const yes = Object.values(delegateVotes).filter((v) => v === 'yes').length
  const no = Object.values(delegateVotes).filter((v) => v === 'no').length
  const abstain = Object.values(delegateVotes).filter((v) => v === 'abstain').length
  const total = delegates.length
  const recorded = Object.keys(delegateVotes).length

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-2xl text-[var(--text)] mb-1">🗳️ Active Voting</h2>
        <p className="text-[var(--text-muted)] text-sm">Record each delegate&apos;s vote.</p>
      </div>

      <div className="rounded-xl border-2 border-[var(--accent)] bg-[var(--accent-soft)]/30 p-4">
        <p className="text-sm font-medium text-[var(--text)] mb-2">📜 Motion:</p>
        <p className="text-[var(--text)]">{voteInProgress.text}</p>
        <div className="mt-4 flex flex-wrap gap-4 text-sm">
          <span className="text-[var(--success)]">Yes: {yes}</span>
          <span className="text-[var(--danger)]">No: {no}</span>
          <span className="text-[var(--text-muted)]">Abstain: {abstain}</span>
          <span className="text-[var(--text-muted)]">Recorded: {recorded} / {total}</span>
        </div>
        <button
          onClick={endVote}
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
          {delegates.map((d) => {
            const vote = delegateVotes[d.id]
            return (
              <li key={d.id} className="px-4 py-3 flex items-center justify-between">
                <span className="text-sm text-[var(--text)]">
                  <strong className="text-[var(--accent)]">{d.country}</strong>
                  {d.name && <span className="text-[var(--text-muted)] ml-2">{d.name}</span>}
                </span>
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
                  <button
                    onClick={() => recordVote(d.id, 'abstain')}
                    className={`p-2 rounded-lg transition-colors ${
                      vote === 'abstain' ? 'bg-[var(--text-muted)]/30 text-[var(--text)]' : 'bg-[var(--bg-elevated)] text-[var(--text-muted)] hover:text-[var(--text)]'
                    }`}
                    title="Abstain"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
