import { useChair } from '../../context/ChairContext'

interface Props {
  onClose?: () => void
}

export default function ChairCommitteeTopic({ onClose }: Props) {
  const { committee, topic, setCommittee, setTopic } = useChair()

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-serif text-lg text-[var(--text)]">📌 Committee & topic</h3>
        {onClose && (
          <button onClick={onClose} className="text-[var(--text-muted)] hover:text-[var(--text)] text-sm">
            Close
          </button>
        )}
      </div>
      <label className="block">
        <span className="text-xs text-[var(--text-muted)] block mb-1">Committee</span>
        <input
          type="text"
          value={committee}
          onChange={(e) => setCommittee(e.target.value)}
          placeholder="e.g. UNSC, GA, ECOSOC"
          className="w-full px-3 py-2 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text)] placeholder-[var(--text-muted)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
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
    </div>
  )
}
