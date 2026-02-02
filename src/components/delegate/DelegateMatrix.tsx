import { useState } from 'react'
import { useDelegate } from '../../context/DelegateContext'
import { Plus } from 'lucide-react'

export default function DelegateMatrix() {
  const { committeeMatrix, setCommitteeMatrix } = useDelegate()
  const [committee, setCommittee] = useState('')
  const [firstName, setFirstName] = useState('')

  const add = () => {
    if (!committee.trim() || !firstName.trim()) return
    setCommitteeMatrix(committee.trim(), firstName.trim())
    setCommittee('')
    setFirstName('')
  }

  const entries = Object.entries(committeeMatrix)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-2xl text-[var(--text)] mb-1">📊 Committee matrix</h2>
        <p className="text-[var(--text-muted)] text-sm">First names only — who is in which committee.</p>
      </div>
      <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-4 space-y-3">
        <h3 className="text-sm font-medium text-[var(--text)]">➕ Add entry</h3>
        <div className="flex flex-wrap gap-2 items-end">
          <label className="flex flex-col gap-1">
            <span className="text-xs text-[var(--text-muted)]">Committee</span>
            <input
              type="text"
              value={committee}
              onChange={(e) => setCommittee(e.target.value)}
              placeholder="e.g. UNSC, GA"
              className="w-32 px-3 py-2 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text)] placeholder-[var(--text-muted)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--gold)]"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-xs text-[var(--text-muted)]">First name only</span>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="e.g. Alex"
              className="w-28 px-3 py-2 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text)] placeholder-[var(--text-muted)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--gold)]"
            />
          </label>
          <button
            onClick={add}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--gold)] text-[var(--bg-base)] text-sm font-medium hover:opacity-90"
          >
            <Plus className="w-4 h-4" /> Add
          </button>
        </div>
      </div>
      <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] overflow-hidden">
        <div className="px-4 py-3 border-b border-[var(--border)]">
          <h3 className="text-sm font-medium text-[var(--text)]">▸ Matrix</h3>
        </div>
        <ul className="divide-y divide-[var(--border)] max-h-80 overflow-auto">
          {entries.length === 0 ? (
            <li className="px-4 py-8 text-center text-[var(--text-muted)] text-sm">No entries yet.</li>
          ) : (
            entries.map(([comm, name]) => (
              <li key={comm} className="px-4 py-3 flex items-center justify-between">
                <span className="text-sm text-[var(--gold)] font-medium">{comm}</span>
                <span className="text-sm text-[var(--text)]">{name}</span>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  )
}
