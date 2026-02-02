import { useState } from 'react'
import { useDelegate } from '../../context/DelegateContext'
import { Plus, Trash2, Upload } from 'lucide-react'

export default function DelegateResources() {
  const { uploadedResources, addUploadedResource, removeUploadedResource } = useDelegate()
  const [name, setName] = useState('')
  const [url, setUrl] = useState('')

  const add = () => {
    if (!name.trim()) return
    addUploadedResource(name.trim(), url.trim() || undefined)
    setName('')
    setUrl('')
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-2xl text-[var(--text)] mb-1">📚 Chair report & delegate resources</h2>
        <p className="text-[var(--text-muted)] text-sm">Handbook, position paper guidelines, chair report — upload or link.</p>
      </div>
      <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-4 space-y-4">
        <h3 className="text-sm font-medium text-[var(--text)] flex items-center gap-2">
          <Upload className="w-4 h-4 text-[var(--gold)]" /> ➕ Add resource
        </h3>
        <div className="space-y-2">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Resource name (e.g. Chair report, Pos paper guidelines)"
            className="w-full px-3 py-2 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text)] placeholder-[var(--text-muted)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--gold)]"
          />
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="URL (optional)"
            className="w-full px-3 py-2 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text)] placeholder-[var(--text-muted)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--gold)]"
          />
          <button
            onClick={add}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--gold)] text-[var(--bg-base)] text-sm font-medium hover:opacity-90"
          >
            <Plus className="w-4 h-4" /> Add
          </button>
        </div>
        <ul className="divide-y divide-[var(--border)] max-h-64 overflow-auto">
          {uploadedResources.map((r, i) => (
            <li key={i} className="px-3 py-3 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[var(--text)]">{r.name}</p>
                {r.url && <p className="text-xs text-[var(--text-muted)] truncate max-w-xs">{r.url}</p>}
              </div>
              <button onClick={() => removeUploadedResource(i)} className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--danger)] hover:bg-[var(--bg-elevated)]">
                <Trash2 className="w-4 h-4" />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
