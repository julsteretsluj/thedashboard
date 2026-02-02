import { useDelegate } from '../../context/DelegateContext'

export default function DelegatePrep() {
  const { country } = useDelegate()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-2xl text-[var(--text)] mb-1">📝 Prep Template</h2>
        <p className="text-[var(--text-muted)] text-sm">Use this template to structure your research and speaking prep.</p>
      </div>
      <div className="card-block p-6 space-y-4">
        <section>
          <h3 className="text-sm font-medium text-[var(--gold)] mb-2">🌍 Country</h3>
          <p className="text-sm text-[var(--text)]">{country || '—'}</p>
        </section>
        <section>
          <h3 className="text-sm font-medium text-[var(--gold)] mb-2">📚 Topic research</h3>
          <p className="text-sm text-[var(--text-muted)]">Key facts, UN resolutions, recent developments.</p>
          <textarea
            placeholder="Notes..."
            rows={4}
            className="mt-2 w-full px-3 py-2 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text)] placeholder-[var(--text-muted)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--gold)] resize-none"
          />
        </section>
        <section>
          <h3 className="text-sm font-medium text-[var(--gold)] mb-2">🎯 Country stance</h3>
          <p className="text-sm text-[var(--text-muted)]">How your country views the topic; red lines and priorities.</p>
          <textarea
            placeholder="Notes..."
            rows={4}
            className="mt-2 w-full px-3 py-2 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text)] placeholder-[var(--text-muted)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--gold)] resize-none"
          />
        </section>
        <section>
          <h3 className="text-sm font-medium text-[var(--gold)] mb-2">🎤 Opening speech (draft)</h3>
          <textarea
            placeholder="Draft opening statement..."
            rows={5}
            className="w-full px-3 py-2 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text)] placeholder-[var(--text-muted)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--gold)] resize-none"
          />
        </section>
        <section>
          <h3 className="text-sm font-medium text-[var(--gold)] mb-2">📋 Mod speeches (optional)</h3>
          <textarea
            placeholder="Talking points for moderated caucus..."
            rows={3}
            className="w-full px-3 py-2 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text)] placeholder-[var(--text-muted)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--gold)] resize-none"
          />
        </section>
      </div>
    </div>
  )
}
