import { useState } from 'react'
import { ChevronDown, ChevronUp, BookOpen } from 'lucide-react'

const CHAIR_STEPS = [
  { step: 1, title: 'Set committee & topics', body: 'Open Settings (⚙️) or go to 📌 Committee & Topic. Enter committee name, optional universe for fictional committees, up to 3 topics, and your chair name/email.' },
  { step: 2, title: 'Prep checklist', body: 'Use ✅ Prep checklist to tick off rules, topic research, room setup, materials, and team coordination before the conference.' },
  { step: 3, title: 'Add delegates', body: 'Go to 👥 Delegates. Select country from the dropdown (all UNGA members) or add custom. Optionally add name and email. Use the 😊 icon to set a custom flag/emoji for delegations like FWC.' },
  { step: 4, title: 'Roll call', body: 'In ✅ Roll Call, mark each delegate as Absent, Present (may abstain), or Present and voting (must vote). Click to cycle. Mark roll call complete when done.' },
  { step: 5, title: 'Digital Room', body: '🖥️ Digital Room shows all delegates with their roll-call status. Click a delegate to give a compliment or concern reminder.' },
  { step: 6, title: 'Flow checklist', body: 'Use 📋 Flow checklist during the session: roll call → open floor → recognize motions → vote → engage or GSL → repeat.' },
  { step: 7, title: 'Motions & voting', body: 'In 📜 Motions & Points, add motions or points. Start a vote from a motion; in 🗳️ Voting manually record each delegate\'s vote (Yes/No/Abstain) as they vote on the floor. Present and voting delegates cannot abstain.' },
  { step: 8, title: 'Speakers', body: 'In 🎤 Speakers, add delegates to the mod speakers list, set speaking time, and start/stop the active speaker with the timer.' },
  { step: 9, title: 'Crisis & archive', body: 'Use ⚠️ Crisis for crisis elements. Use 📁 Archive to store position papers, chair reports, and prep docs.' },
]

export default function ChairHowToGuide() {
  const [expanded, setExpanded] = useState(false)

  return (
    <section className="mt-10 pt-6 border-t border-[var(--border)]" aria-labelledby="chair-howto-heading">
      <button
        type="button"
        onClick={() => setExpanded((e) => !e)}
        className="flex items-center gap-2 w-full text-left group"
        aria-expanded={expanded}
      >
        <BookOpen className="w-5 h-5 text-[var(--accent)] shrink-0" />
        <h2 id="chair-howto-heading" className="font-semibold text-lg text-[var(--text)] group-hover:text-[var(--accent)] transition-colors">
          How to use this system (Chair)
        </h2>
        {expanded ? <ChevronUp className="w-5 h-5 text-[var(--text-muted)] ml-auto" /> : <ChevronDown className="w-5 h-5 text-[var(--text-muted)] ml-auto" />}
      </button>
      {expanded && (
        <div className="mt-4 space-y-4 text-sm text-[var(--text-muted)]">
          <p className="text-[var(--text)]">Step-by-step guide for running committee in the Chair Room:</p>
          <ol className="space-y-3 list-none pl-0">
            {CHAIR_STEPS.map(({ step, title, body }) => (
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
