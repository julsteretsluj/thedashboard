import { Link } from 'react-router-dom'
import { Gavel, User, Calendar } from 'lucide-react'

export default function Home() {
  return (
    <div className="max-w-[1000px] mx-auto px-4 sm:px-6 py-16 text-center">
      <h1 className="font-serif text-4xl sm:text-5xl text-[var(--text)] mb-4">
        MUN Dashboard <span className="text-[var(--accent)] opacity-90">◇</span>
      </h1>
      <p className="text-[var(--text-muted)] text-lg mb-12 max-w-xl mx-auto">
        Run committee sessions and prepare for conferences. Choose your role below.
      </p>
      <div className="grid sm:grid-cols-2 gap-6">
        <Link
          to="/chair"
          className="group block p-8 rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] hover:border-[var(--accent)] hover:bg-[var(--accent-soft)] transition-all text-left"
        >
          <div className="w-12 h-12 rounded-xl bg-[var(--accent-soft)] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
            <Gavel className="w-6 h-6 text-[var(--accent)]" />
          </div>
          <h2 className="font-serif text-2xl text-[var(--text)] mb-2">⚖️ Chair Room</h2>
          <p className="text-[var(--text-muted)] text-sm">
            🖥️ Digital room · 👥 delegates · 📜 motions & points · 🗳️ voting · 🎤 speakers · ⚠️ crisis · 📁 archive
          </p>
        </Link>
        <Link
          to="/delegate"
          className="group block p-8 rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] hover:border-[var(--gold)] hover:bg-[var(--gold-soft)] transition-all text-left"
        >
          <div className="w-12 h-12 rounded-xl bg-[var(--gold-soft)] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
            <User className="w-6 h-6 text-[var(--gold)]" />
          </div>
          <h2 className="font-serif text-2xl text-[var(--text)] mb-2">📄 Delegate Dashboard</h2>
          <p className="text-[var(--text-muted)] text-sm">
            🌍 Country · 📊 matrix · 📝 prep · ✅ checklist · ⏱️ countdown
          </p>
        </Link>
      </div>
      <p className="mt-12 text-[var(--text-muted)] text-sm flex items-center justify-center gap-2">
        <Calendar className="w-4 h-4" />
        <span>📋 Per-conference setup for chairs and delegates</span>
      </p>
    </div>
  )
}
