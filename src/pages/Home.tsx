import { Link } from 'react-router-dom'
import { Gavel, User, Calendar } from 'lucide-react'
import Logo from '../components/Logo'
import OfficialUnLinks from '../components/OfficialUnLinks'
import Breadcrumbs from '../components/Breadcrumbs'

export default function Home() {
  return (
    <div className="max-w-[1000px] mx-auto px-3 sm:px-6 py-8 sm:py-12 md:py-16 text-center">
      <Breadcrumbs items={[{ label: 'Dashboard' }]} className="justify-center mb-4" />
      <Logo className="h-10 sm:h-12 md:h-14 w-auto mx-auto mb-4 sm:mb-5" />
      <h1 className="font-semibold text-2xl sm:text-3xl md:text-4xl text-[var(--text)] mb-2 sm:mb-3">
        SEAMUNs Dashboard <span className="text-[var(--brand)]">◇</span>
      </h1>
      <p className="text-[var(--text-muted)] text-sm sm:text-base md:text-lg mb-6 sm:mb-10 max-w-xl mx-auto">
        Part of <a href="https://seamuns.site" target="_blank" rel="noopener noreferrer" className="text-[var(--brand)] hover:underline">SEAMUNs</a> — run committee sessions and prepare for conferences. Choose your role below.
      </p>
      <div className="grid sm:grid-cols-2 gap-3 sm:gap-6">
        <Link
          to="/chair"
          className="group block p-4 sm:p-6 md:p-8 rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--bg-card)] shadow-[var(--shadow-card)] hover:border-[var(--brand)] hover:bg-[var(--brand-soft)] transition-all text-left"
        >
          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-[var(--brand-soft)] flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-105 transition-transform">
            <Gavel className="w-4 sm:w-5 h-4 sm:h-5 text-[var(--brand)]" />
          </div>
          <h2 className="font-semibold text-lg sm:text-xl text-[var(--text)] mb-1.5 sm:mb-2">⚖️ Chair Room</h2>
          <p className="text-[var(--text-muted)] text-xs sm:text-sm">
            🖥️ Digital Room · 👥 Delegates · 📜 Motions · 🗳️ Voting · 🎤 Speakers · ⚠️ Crisis · 📁 Archive
          </p>
        </Link>
        <Link
          to="/delegate"
          className="group block p-4 sm:p-6 md:p-8 rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--bg-card)] shadow-[var(--shadow-card)] hover:border-[var(--accent)] hover:bg-[var(--accent-soft)] transition-all text-left"
        >
          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-[var(--accent-soft)] flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-105 transition-transform">
            <User className="w-4 sm:w-5 h-4 sm:h-5 text-[var(--accent)]" />
          </div>
          <h2 className="font-semibold text-lg sm:text-xl text-[var(--text)] mb-1.5 sm:mb-2">📄 Delegate Dashboard</h2>
          <p className="text-[var(--text-muted)] text-xs sm:text-sm">
            🌍 Country · 📊 Matrix · 📝 Prep · ✅ Checklist · ⏱️ Countdown
          </p>
        </Link>
      </div>
      <p className="mt-6 sm:mt-10 text-[var(--text-muted)] text-xs sm:text-sm flex items-center justify-center gap-2">
        <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
        <span>📋 Per-conference setup for chairs and delegates</span>
      </p>

      <section className="mt-10 sm:mt-14 pt-8 sm:pt-12 border-t border-[var(--border)] text-left">
        <OfficialUnLinks showHeading={true} />
      </section>
    </div>
  )
}
