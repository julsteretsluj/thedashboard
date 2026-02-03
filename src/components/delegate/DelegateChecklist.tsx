import { useDelegate } from '../../context/DelegateContext'
import type { DelegateConference } from '../../context/DelegateContext'
import { CheckSquare, Square, ExternalLink } from 'lucide-react'
import InfoPopover from '../InfoPopover'
import { MUN_PREP_TEMPLATE_URL } from '../../constants/prepTemplate'

type ChecklistKey = keyof DelegateConference['checklist']

/** Checklist groups aligned with MUN Prep Template sections (see prep doc). */
const GROUPS: { title: string; docSection: string; keys: { key: ChecklistKey; label: string }[] }[] = [
  {
    title: '📚 Topic research',
    docSection: 'Complete the Topic research section in your prep doc',
    keys: [
      { key: 'researchTopic', label: 'Topic and background (key facts, history)' },
      { key: 'researchResolutions', label: 'Existing UN resolutions and draft ideas' },
      { key: 'researchNews', label: 'Recent news and developments on the topic' },
    ],
  },
  {
    title: '🎯 Country stance',
    docSection: 'Complete the Country stance section in your prep doc',
    keys: [
      { key: 'researchCountryStance', label: 'Your country’s stance, policy, and red lines' },
      { key: 'researchAllies', label: 'Likely allies and blocs' },
    ],
  },
  {
    title: '📄 Position paper',
    docSection: 'Use the Position paper section in your prep doc',
    keys: [
      { key: 'positionPaperDraft', label: 'Draft (structure and main points)' },
      { key: 'positionPaperFinal', label: 'Finalise (edit and cite sources)' },
      { key: 'positionPaperSubmit', label: 'Submit by deadline' },
      { key: 'positionPaper', label: 'Complete and approved' },
    ],
  },
  {
    title: '🎤 Opening speech',
    docSection: 'Use the Opening speech section in your prep doc',
    keys: [
      { key: 'openingSpeechDraft', label: 'Draft opening statement' },
      { key: 'openingSpeechTimed', label: 'Time and trim to speaking limit' },
      { key: 'openingSpeech', label: 'Ready and practised' },
    ],
  },
  {
    title: '📋 Mod & unmod speeches',
    docSection: 'Use the Mod / unmod section in your prep doc',
    keys: [
      { key: 'modSpeeches', label: 'Moderated caucus talking points' },
      { key: 'modCaucusPoints', label: 'Unmoderated caucus / bloc discussion points' },
    ],
  },
  {
    title: '📋 Rules & materials',
    docSection: 'Check off before conference',
    keys: [
      { key: 'knowRules', label: 'Committee rules and parliamentary procedure' },
      { key: 'knowAgenda', label: 'Agenda, timing, and conference schedule' },
      { key: 'materialsReady', label: 'Materials ready (placard, paper, laptop, etc.)' },
    ],
  },
]

export default function DelegateChecklist() {
  const { checklist, toggleChecklist } = useDelegate()

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-2">
        <div>
          <h2 className="font-semibold text-2xl text-[var(--text)] mb-1 flex items-center gap-1.5">
            ✅ Preparation checklist
            <InfoPopover title="Preparation checklist">
              Tick off research, position paper, speeches, and materials. The checklist follows the sections of the MUN Prep Template — make a copy of the template and work through each section in your doc.
            </InfoPopover>
          </h2>
          <p className="text-[var(--text-muted)] text-sm mb-2">
            This checklist follows the sections of the MUN Prep Template. Make a copy of the template and work through each section in your doc.
          </p>
          <a
            href={MUN_PREP_TEMPLATE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--accent)] hover:underline"
          >
            <ExternalLink className="w-4 h-4" />
            Open MUN Prep Template (Google Doc)
          </a>
        </div>
      </div>
      <div className="space-y-5">
        {GROUPS.map((group) => (
          <div key={group.title} className="card-block p-4">
            <h3 className="font-medium text-[var(--text)] mb-1">{group.title}</h3>
            <p className="text-xs text-[var(--text-muted)] mb-3">{group.docSection}</p>
            <ul className="space-y-1">
              {group.keys.map(({ key, label }) => (
                <li key={key}>
                  <label
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer hover:bg-[var(--bg-elevated)] transition-colors"
                  >
                    <span className="text-[var(--accent)] flex-shrink-0">
                      {checklist[key] ? (
                        <CheckSquare className="w-5 h-5 fill-[var(--accent)]" />
                      ) : (
                        <Square className="w-5 h-5" />
                      )}
                    </span>
                    <span className={`text-sm text-[var(--text)] ${checklist[key] ? 'line-through text-[var(--text-muted)]' : ''}`}>
                      {label}
                    </span>
                    <input
                      type="checkbox"
                      checked={checklist[key]}
                      onChange={() => toggleChecklist(key)}
                      className="sr-only"
                      aria-label={label}
                    />
                  </label>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}
