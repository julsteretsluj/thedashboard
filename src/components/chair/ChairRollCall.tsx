import { useChair } from '../../context/ChairContext'
import { Check, X } from 'lucide-react'

export default function ChairRollCall() {
  const { delegates, rollCallComplete, setRollCallComplete, updateDelegate } = useChair()

  const togglePresent = (id: string, current: boolean | undefined) => {
    updateDelegate(id, { present: !current })
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-2xl text-[var(--text)] mb-1">✅ Roll call tracker</h2>
        <p className="text-[var(--text-muted)] text-sm">Track presence. Mark roll call complete when done.</p>
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
      <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] overflow-hidden">
        <div className="px-4 py-3 border-b border-[var(--border)] flex items-center justify-between">
          <h3 className="text-sm font-medium text-[var(--text)]">👥 Delegates</h3>
          <span className="text-xs text-[var(--text-muted)]">
            Present: {delegates.filter((d) => d.present).length} / {delegates.length}
          </span>
        </div>
        <ul className="divide-y divide-[var(--border)] max-h-96 overflow-auto">
          {delegates.map((d) => (
            <li key={d.id} className="px-4 py-3 flex items-center justify-between">
              <span className="text-sm text-[var(--text)]">
                <strong className="text-[var(--accent)]">{d.country}</strong>
                {d.name && <span className="text-[var(--text-muted)] ml-2">{d.name}</span>}
              </span>
              <button
                onClick={() => togglePresent(d.id, d.present)}
                className={`flex items-center gap-1 text-xs px-2 py-1 rounded-lg transition-colors ${
                  d.present ? 'text-[var(--success)] bg-[var(--success)]/10 hover:bg-[var(--success)]/20' : 'text-[var(--text-muted)] bg-[var(--bg-elevated)] hover:bg-[var(--border)]'
                }`}
              >
                {d.present ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                {d.present ? 'Present' : 'Absent'}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <p className="text-xs text-[var(--text-muted)]">
        Click Present/Absent to toggle each delegate&apos;s roll call status.
      </p>
    </div>
  )
}
