import { useChair } from '../../context/ChairContext'
import { AlertTriangle } from 'lucide-react'
import { STRIKE_THRESHOLD } from './strikeMisbehaviours'

export default function ChairRoomView() {
  const { delegates, committee, topic, getStrikeCountsByType } = useChair()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-2xl text-[var(--text)] mb-1">🖥️ Digital Room View</h2>
        <p className="text-[var(--text-muted)] text-sm">
          {committee} — {topic}
        </p>
      </div>
      <div className="card-block p-6 min-h-[320px]">
        {delegates.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-[var(--text-muted)]">
            <p className="text-sm">👥 No delegates in the room yet.</p>
            <p className="text-xs mt-1">Add delegates from the Delegates section.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {delegates.map((d) => {
              const counts = getStrikeCountsByType(d.id)
              const totalStrikes = Object.values(counts).reduce((a, b) => a + b, 0)
              const hasRed = Object.values(counts).some((c) => c >= STRIKE_THRESHOLD)
              return (
                <div
                  key={d.id}
                  className={`rounded-lg border p-3 text-center ${
                    hasRed
                      ? 'border-[var(--danger)] bg-[var(--danger)]/10'
                      : 'border-[var(--border)] bg-[var(--bg-elevated)]'
                  }`}
                >
                  <div className="text-xs font-medium text-[var(--accent)] uppercase tracking-wide">
                    {d.country}
                  </div>
                  <div className="text-sm text-[var(--text)] mt-1 font-medium">
                    {d.name || '—'}
                  </div>
                  {d.committee && (
                    <div className="text-xs text-[var(--text-muted)] mt-0.5">{d.committee}</div>
                  )}
                  <div className="mt-2 flex items-center justify-center gap-2">
                    {d.present !== undefined && (
                      <span
                        className={`inline-block w-2 h-2 rounded-sm ${
                          d.present ? 'bg-[var(--success)]' : 'bg-[var(--text-muted)]'
                        }`}
                        title={d.present ? 'Present' : 'Absent'}
                      />
                    )}
                    {totalStrikes > 0 && (
                      <span
                        className={`inline-flex items-center gap-0.5 text-xs ${
                          hasRed ? 'text-[var(--danger)]' : 'text-[var(--gold)]'
                        }`}
                        title={Object.entries(counts)
                          .map(([t, c]) => `${t}: ${c}`)
                          .join(', ')}
                      >
                        <AlertTriangle className="w-3 h-3" />
                        {totalStrikes}
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
