import { useState } from 'react'
import { useChair } from '../../context/ChairContext'
import { Plus, FileText, BookOpen, Image, Mic, FileCheck } from 'lucide-react'

const archiveTypes = [
  { id: 'position', label: '📄 Position papers', icon: FileText },
  { id: 'chair-report', label: '📋 Chair reports', icon: BookOpen },
  { id: 'slides', label: '🖼️ Slides (ceremony or crisis)', icon: Image },
  { id: 'speeches', label: '🎤 Speeches', icon: Mic },
  { id: 'prep', label: '📝 Prep document', icon: FileCheck },
] as const

export default function ChairArchive() {
  const { archive, addToArchive } = useChair()
  const [type, setType] = useState<(typeof archiveTypes)[number]['id']>('position')
  const [name, setName] = useState('')
  const [content, setContent] = useState('')

  const submit = () => {
    if (!name.trim()) return
    addToArchive(type, name.trim(), content.trim() || undefined)
    setName('')
    setContent('')
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-2xl text-[var(--text)] mb-1">📁 Archive</h2>
        <p className="text-[var(--text-muted)] text-sm">Position papers, chair reports, slides, speeches, prep docs.</p>
      </div>
      <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-4 space-y-4">
        <h3 className="text-sm font-medium text-[var(--text)]">➕ Add to archive</h3>
        <div className="flex flex-wrap gap-2">
          {archiveTypes.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setType(id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                type === id ? 'bg-[var(--accent-soft)] text-[var(--accent)]' : 'bg-[var(--bg-elevated)] text-[var(--text-muted)]'
              }`}
            >
              <Icon className="w-4 h-4" /> {label}
            </button>
          ))}
        </div>
        <div className="space-y-2">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Document name"
            className="w-full px-3 py-2 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text)] placeholder-[var(--text-muted)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Optional content or link"
            rows={2}
            className="w-full px-3 py-2 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text)] placeholder-[var(--text-muted)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)] resize-none"
          />
          <button
            onClick={submit}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--accent)] text-white text-sm font-medium hover:opacity-90"
          >
            <Plus className="w-4 h-4" /> Add
          </button>
        </div>
      </div>
      <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] overflow-hidden">
        <div className="px-4 py-3 border-b border-[var(--border)]">
          <h3 className="text-sm font-medium text-[var(--text)]">📁 Archive</h3>
        </div>
        <ul className="divide-y divide-[var(--border)] max-h-96 overflow-auto">
          {archive.length === 0 ? (
            <li className="px-4 py-8 text-center text-[var(--text-muted)] text-sm">No items in archive yet.</li>
          ) : (
            archive
              .slice()
              .reverse()
              .map((item, i) => (
                <li key={i} className="px-4 py-3">
                  <span className="text-xs text-[var(--text-muted)] uppercase">{item.type}</span>
                  <p className="text-sm font-medium text-[var(--text)]">{item.name}</p>
                  {item.content && <p className="text-xs text-[var(--text-muted)] mt-1">{item.content}</p>}
                </li>
              ))
          )}
        </ul>
      </div>
    </div>
  )
}
