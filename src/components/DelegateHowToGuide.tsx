import { useState } from 'react'
import { ChevronDown, ChevronUp, BookOpen } from 'lucide-react'

const DELEGATE_STEPS = [
  { step: 1, title: 'Set your conference & country', body: 'In 🌍 Country & Stance, enter conference name, your country assignment, your email (optional), and a brief stance overview.' },
  { step: 2, title: 'Committee matrix', body: 'In 📊 Committee Matrix, set how many committees and which ones. Use the tabs to add entries per committee: first name and delegation. Each delegation shows a flag emoji.' },
  { step: 3, title: 'Prep template', body: 'In 📝 Prep Template, open the MUN Prep Template (Google Doc) and make a copy. Use it to structure research, country stance, position paper, and speeches.' },
  { step: 4, title: 'Trusted & nation sources', body: 'In 🔗 Trusted & Nation Sources, add links and sources you use for research and country policy.' },
  { step: 5, title: 'Checklist', body: 'In ✅ Checklist, tick off research, position paper, speeches, and materials. The checklist follows the sections of the MUN Prep Template.' },
  { step: 6, title: 'Chair report & resources', body: 'In 📚 Chair Report & Resources, add handbook, position paper guidelines, and any uploaded resources from your chair.' },
  { step: 7, title: 'Conference countdown', body: 'Set your ⏱️ Conference Countdown date to see time left until the conference.' },
  { step: 8, title: 'Save to account', body: 'Sign in and use "Save to account" to store your conferences and data across devices. You can add multiple conferences and switch between them.' },
]

export default function DelegateHowToGuide() {
  const [expanded, setExpanded] = useState(false)

  return (
    <section className="mt-10 pt-6 border-t border-[var(--border)]" aria-labelledby="delegate-howto-heading">
      <button
        type="button"
        onClick={() => setExpanded((e) => !e)}
        className="flex items-center gap-2 w-full text-left group"
        aria-expanded={expanded}
      >
        <BookOpen className="w-5 h-5 text-[var(--accent)] shrink-0" />
        <h2 id="delegate-howto-heading" className="font-semibold text-lg text-[var(--text)] group-hover:text-[var(--accent)] transition-colors">
          How to use this system (Delegate)
        </h2>
        {expanded ? <ChevronUp className="w-5 h-5 text-[var(--text-muted)] ml-auto" /> : <ChevronDown className="w-5 h-5 text-[var(--text-muted)] ml-auto" />}
      </button>
      {expanded && (
        <div className="mt-4 space-y-4 text-sm text-[var(--text-muted)]">
          <p className="text-[var(--text)]">Step-by-step guide for preparing as a delegate:</p>
          <ol className="space-y-3 list-none pl-0">
            {DELEGATE_STEPS.map(({ step, title, body }) => (
              <li key={step} className="flex gap-3">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-[var(--accent-soft)] text-[var(--accent)] font-semibold flex items-center justify-center text-xs">
                  {step}
                </span>
                <div>
                  <p className="font-medium text-[var(--text)]">{title}</p>
                  <p className="mt-0.5">{body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      )}
    </section>
  )
}
