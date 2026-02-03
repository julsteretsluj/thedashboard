import { useMemo } from 'react'
import { useChair } from '../../context/ChairContext'
import {
  COMMITTEE_OPTIONS,
  OTHER_COMMITTEE_VALUE,
  type CommitteeValue,
} from '../../constants/committees'

interface Props {
  onClose?: () => void
}

export default function ChairCommitteeTopic({ onClose }: Props) {
  const { committee, topic, universe, chairName, chairEmail, setCommittee, setTopic, setUniverse, setChairName, setChairEmail } = useChair()

  const selectedPreset = useMemo(() => {
    const found = COMMITTEE_OPTIONS.find((o) => o.value === committee)
    return found ? (committee as CommitteeValue) : committee ? OTHER_COMMITTEE_VALUE : ''
  }, [committee])

  const handleCommitteeSelect = (value: string) => {
    if (value === OTHER_COMMITTEE_VALUE) setCommittee('')
    else setCommittee(value)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg text-[var(--text)]">📌 Committee & topic</h3>
        {onClose && (
          <button onClick={onClose} className="text-[var(--text-muted)] hover:text-[var(--text)] text-sm">
            Close
          </button>
        )}
      </div>
      <label className="block">
        <span className="text-xs text-[var(--text-muted)] block mb-1">Set committee</span>
        <select
          value={selectedPreset}
          onChange={(e) => handleCommitteeSelect(e.target.value)}
          className="w-full px-3 py-2 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
          aria-label="Committee"
        >
          <option value="">Select committee…</option>
          {COMMITTEE_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
          <option value={OTHER_COMMITTEE_VALUE}>Other (custom)</option>
        </select>
        {selectedPreset === OTHER_COMMITTEE_VALUE && (
          <input
            type="text"
            value={committee}
            onChange={(e) => setCommittee(e.target.value)}
            placeholder="e.g. Custom committee name"
            className="mt-2 w-full px-3 py-2 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text)] placeholder-[var(--text-muted)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            aria-label="Custom committee name"
          />
        )}
      </label>
      <label className="block">
        <span className="text-xs text-[var(--text-muted)] block mb-1">Universe (optional, for fictional committees)</span>
        <input
          type="text"
          value={universe}
          onChange={(e) => setUniverse(e.target.value)}
          placeholder="e.g. Star Wars, Harry Potter — leave blank for real-world"
          className="w-full px-3 py-2 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text)] placeholder-[var(--text-muted)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
          aria-label="Universe (optional)"
        />
      </label>
      <label className="block">
        <span className="text-xs text-[var(--text-muted)] block mb-1">Topic</span>
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="e.g. Cybersecurity and International Peace"
          className="w-full px-3 py-2 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text)] placeholder-[var(--text-muted)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
        />
      </label>
      <div className="pt-2 border-t border-[var(--border)]">
        <h4 className="text-sm font-medium text-[var(--text)] mb-2">👤 Chair</h4>
        <label className="block mb-2">
          <span className="text-xs text-[var(--text-muted)] block mb-1">Chair name (optional)</span>
          <input
            type="text"
            value={chairName}
            onChange={(e) => setChairName(e.target.value)}
            placeholder="e.g. Jane Smith"
            className="w-full px-3 py-2 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text)] placeholder-[var(--text-muted)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            aria-label="Chair name"
          />
        </label>
        <label className="block">
          <span className="text-xs text-[var(--text-muted)] block mb-1">Chair email (optional)</span>
          <input
            type="email"
            value={chairEmail}
            onChange={(e) => setChairEmail(e.target.value)}
            placeholder="e.g. chair@conference.org"
            className="w-full px-3 py-2 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text)] placeholder-[var(--text-muted)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            aria-label="Chair email"
          />
        </label>
      </div>
    </div>
  )
}
