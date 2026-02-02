import { useState } from 'react'
import { useChair } from '../../context/ChairContext'
import { Plus, Image, Mic, FileText, Route } from 'lucide-react'

const tabs = [
  { id: 'slides', label: 'Slides', icon: Image },
  { id: 'speakers', label: 'Speakers', icon: Mic },
  { id: 'facts', label: 'Facts', icon: FileText },
  { id: 'pathways', label: 'Pathways', icon: Route },
] as const

export default function ChairCrisis() {
  const {
    crisisSlides,
    crisisSpeakers,
    crisisFacts,
    crisisPathways,
    addCrisisSlide,
    addCrisisSpeaker,
    addCrisisFact,
    addCrisisPathway,
  } = useChair()
  const [tab, setTab] = useState<(typeof tabs)[number]['id']>('slides')
  const [input, setInput] = useState('')

  const add = () => {
    if (!input.trim()) return
    if (tab === 'slides') addCrisisSlide(input.trim())
    if (tab === 'speakers') addCrisisSpeaker(input.trim())
    if (tab === 'facts') addCrisisFact(input.trim())
    if (tab === 'pathways') addCrisisPathway(input.trim())
    setInput('')
  }

  const lists = {
    slides: crisisSlides,
    speakers: crisisSpeakers,
    facts: crisisFacts,
    pathways: crisisPathways,
  }
  const list = lists[tab]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-2xl text-[var(--text)] mb-1">⚠️ Crisis Dashboard</h2>
        <p className="text-[var(--text-muted)] text-sm">Slides · Speakers · Facts · Pathways.</p>
      </div>
      <div className="flex gap-2 border-b border-[var(--border)] pb-2">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === id ? 'bg-[var(--accent-soft)] text-[var(--accent)]' : 'text-[var(--text-muted)] hover:text-[var(--text)]'
            }`}
          >
            <Icon className="w-4 h-4" /> {label}
          </button>
        ))}
      </div>
      <div className="card-block p-4 space-y-3">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && add()}
            placeholder={
              tab === 'slides'
                ? 'Slide title or URL'
                : tab === 'speakers'
                  ? 'Speaker name'
                  : tab === 'facts'
                    ? 'Fact'
                    : 'Pathway description'
            }
            className="flex-1 px-3 py-2 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text)] placeholder-[var(--text-muted)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
          />
          <button
            onClick={add}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--accent)] text-white text-sm font-medium hover:opacity-90"
          >
            <Plus className="w-4 h-4" /> Add
          </button>
        </div>
        <ul className="divide-y divide-[var(--border)] max-h-64 overflow-auto">
          {list.map((item, i) => (
            <li key={i} className="px-3 py-2 flex items-center justify-between text-sm text-[var(--text)]">
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
