import { Link } from 'react-router-dom'
import { User, BookOpen, ChevronRight } from 'lucide-react'
import Breadcrumbs from '../components/Breadcrumbs'

const DELEGATE_SETUP_STEPS = [
  { step: 1, title: 'Sign in (optional)', body: 'Sign in to save your conference data to your account. You can add multiple conferences and switch between them across devices.' },
  { step: 2, title: 'Set conference & country', body: 'Go to Country & Stance. Enter conference name, your country assignment, your email (optional), and a brief stance overview.' },
  { step: 3, title: 'Set countdown dates', body: 'On Country & Stance or the Countdown section, set conference start/end and position paper due date. Countdowns help you stay on track.' },
  { step: 4, title: 'Committee matrix', body: 'Go to Committee Matrix. Set how many committees and which ones. Add entries per committee with your name and delegation. Each delegation shows a flag emoji.' },
  { step: 5, title: 'Chair report & resources', body: 'Add handbook, position paper guidelines, and any resources from your chair. These are usually shared before the conference.' },
  { step: 6, title: 'Prep template & sources', body: 'Use the MUN Prep Template (Google Doc) to structure research, stance, position paper, and speeches. Add trusted sources and nation-specific links.' },
  { step: 7, title: 'Checklist', body: 'Work through the Checklist: research, position paper, speeches, and materials. It follows the sections of the MUN Prep Template.' },
]

export default function DelegateSetupGuide() {
  return (
    <div className="max-w-[680px] mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <Breadcrumbs
        items={[
          { label: 'Dashboard', href: '/' },
          { label: 'Delegate guide' },
        ]}
        className="mb-6"
      />
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-[var(--accent-soft)] flex items-center justify-center">
          <User className="w-6 h-6 text-[var(--accent)]" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-[var(--text)]">
            Delegate setup guide
          </h1>
          <p className="text-[var(--text-muted)] text-sm sm:text-base mt-0.5">
            Prepare for your conference step by step
          </p>
        </div>
      </div>

      <p className="text-[var(--text-muted)] text-sm sm:text-base mb-8">
        Follow these steps in order to set up your Delegate Dashboard. Once ready, you can focus on research, position papers, and speeches.
      </p>

      <ol className="space-y-5 list-none pl-0">
        {DELEGATE_SETUP_STEPS.map(({ step, title, body }) => (
          <li key={step} className="flex gap-4">
            <span
              className="flex-shrink-0 w-9 h-9 rounded-full bg-[var(--accent-soft)] text-[var(--accent)] font-semibold flex items-center justify-center text-sm"
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
          to="/?role=delegate"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[var(--radius-btn)] bg-[var(--accent)] text-white font-medium text-sm hover:opacity-90 transition-opacity"
        >
          <BookOpen className="w-4 h-4" />
          Open Delegate Dashboard
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  )
}
