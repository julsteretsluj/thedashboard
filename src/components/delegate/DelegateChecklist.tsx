import { useDelegate } from '../../context/DelegateContext'
import { CheckSquare, Square } from 'lucide-react'

  const items: { key: keyof ReturnType<typeof useDelegate>['checklist']; label: string }[] = [
  { key: 'positionPaper', label: '📄 Position paper' },
  { key: 'researchTopic', label: '📚 Research on topic' },
  { key: 'researchCountryStance', label: '🎯 Research on country stance' },
  { key: 'openingSpeech', label: '🎤 Opening speech' },
  { key: 'modSpeeches', label: '📋 Mod speeches (optional)' },
]

export default function DelegateChecklist() {
  const { checklist, toggleChecklist } = useDelegate()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-2xl text-[var(--text)] mb-1">✅ Checklist</h2>
        <p className="text-[var(--text-muted)] text-sm">Track your prep: position paper, research, speeches.</p>
      </div>
      <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-4 space-y-2">
        {items.map(({ key, label }) => (
          <label
            key={key}
            className="flex items-center gap-3 px-3 py-3 rounded-lg cursor-pointer hover:bg-[var(--bg-elevated)] transition-colors"
          >
            <span className="text-[var(--gold)]">
              {checklist[key] ? <CheckSquare className="w-5 h-5 fill-[var(--gold)]" /> : <Square className="w-5 h-5" />}
            </span>
            <span className="text-sm text-[var(--text)]">{label}</span>
            <input
              type="checkbox"
              checked={checklist[key]}
              onChange={() => toggleChecklist(key)}
              className="sr-only"
            />
          </label>
        ))}
      </div>
    </div>
  )
}
