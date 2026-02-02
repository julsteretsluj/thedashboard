import { useDelegate } from '../../context/DelegateContext'

export default function DelegateCountry() {
  const { name: conferenceName, country, stanceOverview, setName: setConferenceName, setCountry, setStanceOverview } = useDelegate()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-2xl text-[var(--text)] mb-1">🌍 Country Assignment</h2>
        <p className="text-[var(--text-muted)] text-sm">Your country and brief stance overview for this conference.</p>
      </div>
      <div className="card-block p-4 space-y-4">
        <label className="block">
          <span className="text-xs text-[var(--text-muted)] block mb-1">Conference name</span>
          <input
            type="text"
            value={conferenceName}
            onChange={(e) => setConferenceName(e.target.value)}
            placeholder="e.g. NMUN 2025"
            className="w-full px-3 py-2 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text)] placeholder-[var(--text-muted)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--gold)]"
          />
        </label>
        <label className="block">
          <span className="text-xs text-[var(--text-muted)] block mb-1">Country</span>
          <input
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            placeholder="e.g. France, United Kingdom"
            className="w-full px-3 py-2 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text)] placeholder-[var(--text-muted)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--gold)]"
          />
        </label>
        <label className="block">
          <span className="text-xs text-[var(--text-muted)] block mb-1">Brief stance overview</span>
          <textarea
            value={stanceOverview}
            onChange={(e) => setStanceOverview(e.target.value)}
            placeholder="Summarize your country's position on the committee topic(s)..."
            rows={5}
            className="w-full px-3 py-2 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text)] placeholder-[var(--text-muted)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--gold)] resize-none"
          />
        </label>
      </div>
    </div>
  )
}
