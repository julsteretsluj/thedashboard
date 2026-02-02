import { useState } from 'react'
import { useDelegate } from '../../context/DelegateContext'
import { Plus, Trash2 } from 'lucide-react'

export default function DelegateSources() {
  const {
    trustedSources,
    nationSources,
    addTrustedSource,
    removeTrustedSource,
    addNationSource,
    removeNationSource,
  } = useDelegate()
  const [trustedInput, setTrustedInput] = useState('')
  const [nationInput, setNationInput] = useState('')

  const addTrusted = () => {
    if (!trustedInput.trim()) return
    addTrustedSource(trustedInput.trim())
    setTrustedInput('')
  }
  const addNation = () => {
    if (!nationInput.trim()) return
    addNationSource(nationInput.trim())
    setNationInput('')
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-2xl text-[var(--text)] mb-1">🔗 Trusted & Nation Sources</h2>
        <p className="text-[var(--text-muted)] text-sm">Trusted sources and nation-specific sources for research.</p>
      </div>

      <div className="card-block p-4 space-y-4">
        <h3 className="text-sm font-medium text-[var(--text)]">✓ Trusted sources</h3>
        <div className="flex gap-2">
          <input
            type="text"
            value={trustedInput}
            onChange={(e) => setTrustedInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addTrusted()}
            placeholder="URL or name"
            className="flex-1 px-3 py-2 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text)] placeholder-[var(--text-muted)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--gold)]"
          />
          <button
            onClick={addTrusted}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--gold)] text-[var(--bg-base)] text-sm font-medium hover:opacity-90"
          >
            <Plus className="w-4 h-4" /> Add
          </button>
        </div>
        <ul className="space-y-2">
          {trustedSources.map((s, i) => (
            <li key={i} className="flex items-center justify-between px-3 py-2 rounded-lg bg-[var(--bg-elevated)] text-sm text-[var(--text)]">
              {s}
              <button onClick={() => removeTrustedSource(i)} className="p-1 rounded text-[var(--text-muted)] hover:text-[var(--danger)]">
                <Trash2 className="w-4 h-4" />
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="card-block p-4 space-y-4">
        <h3 className="text-sm font-medium text-[var(--text)]">🌍 Nation-specific sources</h3>
        <div className="flex gap-2">
          <input
            type="text"
            value={nationInput}
            onChange={(e) => setNationInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addNation()}
            placeholder="URL or name"
            className="flex-1 px-3 py-2 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text)] placeholder-[var(--text-muted)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--gold)]"
          />
          <button
            onClick={addNation}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--gold)] text-[var(--bg-base)] text-sm font-medium hover:opacity-90"
          >
            <Plus className="w-4 h-4" /> Add
          </button>
        </div>
        <ul className="space-y-2">
          {nationSources.map((s, i) => (
            <li key={i} className="flex items-center justify-between px-3 py-2 rounded-lg bg-[var(--bg-elevated)] text-sm text-[var(--text)]">
              {s}
              <button onClick={() => removeNationSource(i)} className="p-1 rounded text-[var(--text-muted)] hover:text-[var(--danger)]">
                <Trash2 className="w-4 h-4" />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
