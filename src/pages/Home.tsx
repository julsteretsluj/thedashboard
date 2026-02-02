import { Link } from 'react-router-dom'
import { Gavel, User, Calendar } from 'lucide-react'

export default function Home() {
  return (
    <div className="max-w-[1000px] mx-auto px-4 sm:px-6 py-12 sm:py-16 text-center">
      <h1 className="font-serif text-3xl sm:text-4xl text-[var(--text)] mb-3">
        SEAMUNs Dashboard <span className="text-[var(--brand)]">◇</span>
      </h1>
      <p className="text-[var(--text-muted)] text-base sm:text-lg mb-10 max-w-xl mx-auto">
        Part of <a href="https://seamuns.site" target="_blank" rel="noopener noreferrer" className="text-[var(--brand)] hover:underline">SEAMUNs</a> — run committee sessions and prepare for conferences. Choose your role below.
      </p>
      <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
        <Link
          to="/chair"
          className="group block p-6 sm:p-8 rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--bg-card)] shadow-[var(--shadow-card)] hover:border-[var(--brand)] hover:bg-[var(--brand-soft)] transition-all text-left"
        >
          <div className="w-11 h-11 rounded-xl bg-[var(--brand-soft)] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
            <Gavel className="w-5 h-5 text-[var(--brand)]" />
          </div>
          <h2 className="font-serif text-xl text-[var(--text)] mb-2">⚖️ Chair Room</h2>
          <p className="text-[var(--text-muted)] text-sm">
            🖥️ Digital Room · 👥 Delegates · 📜 Motions & Points · 🗳️ Voting · 🎤 Speakers · ⚠️ Crisis · 📁 Archive
          </p>
        </Link>
        <Link
          to="/delegate"
          className="group block p-6 sm:p-8 rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--bg-card)] shadow-[var(--shadow-card)] hover:border-[var(--gold)] hover:bg-[var(--gold-soft)] transition-all text-left"
        >
          <div className="w-11 h-11 rounded-xl bg-[var(--gold-soft)] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
            <User className="w-5 h-5 text-[var(--gold)]" />
          </div>
          <h2 className="font-serif text-xl text-[var(--text)] mb-2">📄 Delegate Dashboard</h2>
          <p className="text-[var(--text-muted)] text-sm">
            🌍 Country · 📊 Matrix · 📝 Prep · ✅ Checklist · ⏱️ Countdown
          </p>
        </Link>
      </div>
      <p className="mt-10 text-[var(--text-muted)] text-sm flex items-center justify-center gap-2">
        <Calendar className="w-4 h-4 flex-shrink-0" />
        <span>📋 Per-conference setup for chairs and delegates</span>
      </p>
    </div>
  )
}
