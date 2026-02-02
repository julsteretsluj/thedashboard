import { useState } from 'react'
import { useChair } from '../../context/ChairContext'
import { Plus, Star, Check, X, Minus } from 'lucide-react'

export default function ChairMotions() {
  const { motions, addMotion, starMotion, setMotionStatus, startVote } = useChair()
  const [text, setText] = useState('')
  const [type, setType] = useState<'motion' | 'point'>('motion')

  const submit = () => {
    if (!text.trim()) return
    addMotion(text.trim(), type)
    setText('')
  }

  const activeMotions = motions.filter((m) => m.status === 'active')
  const pastMotions = motions.filter((m) => m.status !== 'active')

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-2xl text-[var(--text)] mb-1">📜 Motions & Points</h2>
        <p className="text-[var(--text-muted)] text-sm">Record and star motions and points.</p>
      </div>

      <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-4 space-y-3">
        <div className="flex gap-2">
          <button
            onClick={() => setType('motion')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              type === 'motion' ? 'bg-[var(--accent-soft)] text-[var(--accent)]' : 'bg-[var(--bg-elevated)] text-[var(--text-muted)]'
            }`}
          >
            📜 Motion
          </button>
          <button
            onClick={() => setType('point')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              type === 'point' ? 'bg-[var(--accent-soft)] text-[var(--accent)]' : 'bg-[var(--bg-elevated)] text-[var(--text-muted)]'
            }`}
          >
            • Point
          </button>
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && submit()}
            placeholder={type === 'motion' ? 'e.g. Motion to open the speaker list' : 'e.g. Point of order'}
            className="flex-1 px-3 py-2 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text)] placeholder-[var(--text-muted)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
          />
          <button
            onClick={submit}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--accent)] text-white text-sm font-medium hover:opacity-90"
          >
            <Plus className="w-4 h-4" /> ➕ Add
          </button>
        </div>
      </div>

      {activeMotions.length > 0 && (
        <div className="rounded-xl border border-[var(--accent)]/40 bg-[var(--accent-soft)]/30 p-4">
          <h3 className="text-sm font-medium text-[var(--accent)] mb-3">● Active</h3>
          <ul className="space-y-2">
            {activeMotions.map((m) => (
              <li key={m.id} className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => starMotion(m.id)}
                  className="p-1 rounded text-[var(--text-muted)] hover:text-[var(--gold)]"
                  title={m.starred ? 'Unstar' : 'Star'}
                >
                  <Star className={`w-4 h-4 ${m.starred ? 'fill-[var(--gold)] text-[var(--gold)]' : ''}`} />
                </button>
                <span className="text-xs text-[var(--text-muted)] uppercase">{m.type}</span>
                <span className="text-sm text-[var(--text)] flex-1">{m.text}</span>
                <div className="flex gap-1">
                  <button
                    onClick={() => setMotionStatus(m.id, 'passed')}
                    className="p-1.5 rounded-lg bg-[var(--success)]/20 text-[var(--success)] hover:bg-[var(--success)]/30"
                    title="Passed"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setMotionStatus(m.id, 'failed')}
                    className="p-1.5 rounded-lg bg-[var(--danger)]/20 text-[var(--danger)] hover:bg-[var(--danger)]/30"
                    title="Failed"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setMotionStatus(m.id, 'tabled')}
                    className="p-1.5 rounded-lg bg-[var(--text-muted)]/20 text-[var(--text-muted)]"
                    title="Tabled"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => startVote(m.id)}
                    className="px-2 py-1 rounded-lg bg-[var(--accent)] text-white text-xs font-medium"
                  >
                    Vote
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] overflow-hidden">
        <div className="px-4 py-3 border-b border-[var(--border)]">
          <h3 className="text-sm font-medium text-[var(--text)]">📋 Log</h3>
        </div>
        <ul className="divide-y divide-[var(--border)] max-h-96 overflow-auto">
          {[...pastMotions].reverse().map((m) => (
            <li key={m.id} className="px-4 py-3 flex items-start gap-2">
              <button
                onClick={() => starMotion(m.id)}
                className="p-1 rounded mt-0.5 text-[var(--text-muted)] hover:text-[var(--gold)] flex-shrink-0"
              >
                <Star className={`w-4 h-4 ${m.starred ? 'fill-[var(--gold)] text-[var(--gold)]' : ''}`} />
              </button>
              <div className="flex-1 min-w-0">
                <span className="text-xs text-[var(--text-muted)] uppercase">{m.type}</span>
                <p className="text-sm text-[var(--text)]">{m.text}</p>
                <div className="flex items-center gap-2 mt-1 text-xs text-[var(--text-muted)]">
                  <span>{new Date(m.timestamp).toLocaleString()}</span>
                  <span className="capitalize">{m.status}</span>
                  {m.votes && (
                    <span>Yes {m.votes.yes} / No {m.votes.no} / Abstain {m.votes.abstain}</span>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
