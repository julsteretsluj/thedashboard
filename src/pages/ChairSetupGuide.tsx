import { Link } from 'react-router-dom'
import { Gavel, BookOpen, ChevronRight } from 'lucide-react'
import Breadcrumbs from '../components/Breadcrumbs'

const CHAIR_SETUP_STEPS = [
  { step: 1, title: 'Sign in (optional)', body: 'Sign in to save your committee data to your account. Your setup will persist across devices and sessions.' },
  { step: 2, title: 'Set committee & topics', body: 'Go to Committee & Topic. Enter committee name, optional universe (for fictional committees), up to 3 topics, and your chair name/email.' },
  { step: 3, title: 'Add delegates', body: 'Go to Delegates. Select countries from the dropdown (all UNGA members) or add custom delegations. Optionally add delegate names and emails. Use the icon to set a custom flag/emoji for special delegations.' },
  { step: 4, title: 'Prep checklist', body: 'Use the Prep checklist to tick off rules review, topic research, room setup, materials, and team coordination before the conference.' },
  { step: 5, title: 'Share the link', body: 'Use the Chair Room boarding pass to copy and share the link with delegates so they can access their dashboard with the correct conference context.' },
  { step: 6, title: 'Archive (optional)', body: 'Add position paper guidelines, chair reports, and prep docs to Archive. Delegates can access these from their Chair Report & Resources section.' },
]

export default function ChairSetupGuide() {
  return (
    <div className="max-w-[680px] mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <Breadcrumbs
        items={[
          { label: 'Dashboard', href: '/' },
          { label: 'Chair guide' },
        ]}
        className="mb-6"
      />
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-[var(--brand-soft)] flex items-center justify-center">
          <Gavel className="w-6 h-6 text-[var(--brand)]" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-[var(--text)]">
            Chair setup guide
          </h1>
          <p className="text-[var(--text-muted)] text-sm sm:text-base mt-0.5">
            Get your committee room ready before the conference
          </p>
        </div>
      </div>

      <p className="text-[var(--text-muted)] text-sm sm:text-base mb-8">
        Follow these steps in order to set up the Chair Room. Once ready, you can run roll call, motions, voting, and speakers during the session.
      </p>

      <ol className="space-y-5 list-none pl-0">
        {CHAIR_SETUP_STEPS.map(({ step, title, body }) => (
          <li key={step} className="flex gap-3 sm:gap-4">
            <span
              className="flex-shrink-0 w-9 h-9 rounded-full bg-[var(--brand-soft)] text-[var(--brand)] font-semibold flex items-center justify-center text-sm"
              aria-hidden
            >
              {step}
            </span>
            <div>
              <h2 className="font-semibold text-[var(--text)] text-lg">{title}</h2>
              <p className="text-[var(--text-muted)] text-sm sm:text-base mt-1 leading-relaxed">{body}</p>
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-10 pt-8 border-t border-[var(--border)]">
        <Link
          to="/?role=chair"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-[var(--radius-btn)] bg-[var(--brand)] text-white font-medium text-sm hover:opacity-90 transition-opacity"
        >
          <BookOpen className="w-4 h-4" />
          Open Chair Room
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  )
}
