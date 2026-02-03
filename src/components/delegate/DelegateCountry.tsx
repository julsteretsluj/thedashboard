import { useDelegate } from '../../context/DelegateContext'
import InfoPopover from '../InfoPopover'

export default function DelegateCountry() {
  const { name: conferenceName, country, delegateEmail, stanceOverview, setName: setConferenceName, setCountry, setDelegateEmail, setStanceOverview } = useDelegate()

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-2">
        <div>
          <h2 className="font-semibold text-2xl text-[var(--text)] mb-1 flex items-center gap-1.5">
            🌍 Country Assignment
            <InfoPopover title="Country & Stance">
              Enter your conference name, country assignment, optional email (e.g. for chair contact), and a brief stance overview. This is your main profile for this conference.
            </InfoPopover>
          </h2>
          <p className="text-[var(--text-muted)] text-sm">Your country and brief stance overview for this conference.</p>
        </div>
      </div>
      <div className="card-block p-4 space-y-4">
        <label className="block">
          <span className="text-xs text-[var(--text-muted)] block mb-1">Conference name</span>
          <input
            type="text"
            value={conferenceName}
            onChange={(e) => setConferenceName(e.target.value)}
            placeholder="e.g. NMUN 2025"
            className="w-full px-3 py-2 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text)] placeholder-[var(--text-muted)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
          />
        </label>
        <label className="block">
          <span className="text-xs text-[var(--text-muted)] block mb-1">Country</span>
          <input
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            placeholder="e.g. France, United Kingdom"
            className="w-full px-3 py-2 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text)] placeholder-[var(--text-muted)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
          />
        </label>
        <label className="block">
          <span className="text-xs text-[var(--text-muted)] block mb-1">Your email (optional)</span>
          <input
            type="email"
            value={delegateEmail}
            onChange={(e) => setDelegateEmail(e.target.value)}
            placeholder="e.g. you@example.com"
            className="w-full px-3 py-2 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text)] placeholder-[var(--text-muted)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            aria-label="Your email"
          />
        </label>
        <label className="block">
          <span className="text-xs text-[var(--text-muted)] block mb-1">Brief stance overview</span>
          <textarea
            value={stanceOverview}
            onChange={(e) => setStanceOverview(e.target.value)}
            placeholder="Summarize your country's position on the committee topic(s)..."
            rows={5}
            className="w-full px-3 py-2 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text)] placeholder-[var(--text-muted)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)] resize-none"
          />
        </label>
      </div>
    </div>
  )
}
