import { useState } from 'react'
import { useChair } from '../../context/ChairContext'
import { Plus, Trash2, User, AlertTriangle, Minus } from 'lucide-react'
import { DEFAULT_MISBEHAVIOURS, STRIKE_THRESHOLD } from './strikeMisbehaviours'

const TRADITIONAL = [
  'USA', 'UK', 'France', 'China', 'Russia', 'Germany', 'Japan', 'India', 'Brazil', 'Canada',
  'Australia', 'Italy', 'South Korea', 'Mexico', 'Indonesia', 'South Africa', 'Egypt', 'Nigeria', 'Kenya', 'Saudi Arabia',
]

export default function ChairDelegates() {
  const {
    delegates,
    addDelegate,
    removeDelegate,
    committee,
    addStrike,
    removeStrike,
    getStrikeCountsByType,
  } = useChair()
  const [country, setCountry] = useState('')
  const [name, setName] = useState('')
  const [useTraditional, setUseTraditional] = useState(true)
  const [addingBulk, setAddingBulk] = useState(false)
  const [strikeDelegateId, setStrikeDelegateId] = useState<string | null>(null)
  const [customMisbehaviour, setCustomMisbehaviour] = useState('')
  const [selectedStrikeType, setSelectedStrikeType] = useState('')

  const addOne = () => {
    if (!country.trim()) return
    addDelegate({
      country: country.trim(),
      name: name.trim() || undefined,
      committee: committee || undefined,
      present: false,
    })
    setCountry('')
    setName('')
  }

  const addTraditional = () => {
    TRADITIONAL.forEach((c) => {
      if (!delegates.some((d) => d.country === c)) {
        addDelegate({ country: c, committee: committee || undefined, present: false })
      }
    })
    setAddingBulk(false)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-2xl text-[var(--text)] mb-1">👥 Delegates</h2>
        <p className="text-[var(--text-muted)] text-sm">Add or remove delegates. Use traditional allocation or custom.</p>
      </div>

      <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-4 space-y-4">
        <h3 className="text-sm font-medium text-[var(--text)]">➕ Add delegate</h3>
        <div className="flex flex-wrap gap-3 items-end">
          <label className="flex flex-col gap-1">
            <span className="text-xs text-[var(--text-muted)]">Country</span>
            <input
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder="e.g. France"
              className="w-40 px-3 py-2 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text)] placeholder-[var(--text-muted)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-xs text-[var(--text-muted)]">Name (optional)</span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Delegate name"
              className="w-40 px-3 py-2 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text)] placeholder-[var(--text-muted)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            />
          </label>
          <button
            onClick={addOne}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--accent)] text-white text-sm font-medium hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4" /> ➕ Add
          </button>
        </div>

        <div className="pt-2 border-t border-[var(--border)]">
          <button
            onClick={() => setUseTraditional(!useTraditional)}
            className="text-sm text-[var(--accent)] hover:underline"
          >
            {useTraditional ? 'Hide' : 'Show'} traditional allocation
          </button>
          {useTraditional && (
            <div className="mt-3 flex flex-wrap gap-2">
              {TRADITIONAL.map((c) => (
                <button
                  key={c}
                  onClick={() => {
                    setCountry(c)
                    setName('')
                  }}
                  className="px-3 py-1.5 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text)] text-sm hover:border-[var(--accent)] transition-colors"
                >
                  {c}
                </button>
              ))}
              <button
                onClick={() => setAddingBulk(true)}
                className="px-3 py-1.5 rounded-lg bg-[var(--accent-soft)] text-[var(--accent)] text-sm font-medium"
              >
                Add all missing
              </button>
            </div>
          )}
        </div>
      </div>

      {addingBulk && (
        <div className="rounded-xl border border-[var(--gold)] bg-[var(--gold-soft)] p-4 flex items-center justify-between">
          <p className="text-sm text-[var(--text)]">Add all traditional countries not yet in the list?</p>
          <div className="flex gap-2">
            <button onClick={() => setAddingBulk(false)} className="px-3 py-1.5 rounded-lg bg-[var(--bg-card)] text-sm">Cancel</button>
            <button onClick={addTraditional} className="px-3 py-1.5 rounded-lg bg-[var(--gold)] text-[var(--bg-base)] text-sm font-medium">Add all</button>
          </div>
        </div>
      )}

      <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] overflow-hidden">
        <div className="px-4 py-3 border-b border-[var(--border)] flex items-center gap-2">
          <User className="w-4 h-4 text-[var(--text-muted)]" />
          <span className="text-sm font-medium text-[var(--text)]">👥 Current delegates ({delegates.length})</span>
        </div>
        <ul className="divide-y divide-[var(--border)] max-h-[28rem] overflow-auto">
          {delegates.map((d) => {
            const counts = getStrikeCountsByType(d.id)
            const hasRed = Object.values(counts).some((c) => c >= STRIKE_THRESHOLD)
            const totalStrikes = Object.values(counts).reduce((a, b) => a + b, 0)
            const showStrikeForm = strikeDelegateId === d.id
            return (
              <li
                key={d.id}
                className={`px-4 py-3 flex flex-col gap-2 ${hasRed ? 'bg-[var(--danger)]/10 border-l-4 border-[var(--danger)]' : ''}`}
              >
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="text-sm text-[var(--text)]">
                    <strong className="text-[var(--accent)]">{d.country}</strong>
                    {d.name && <span className="text-[var(--text-muted)] ml-2">— {d.name}</span>}
                    {totalStrikes > 0 && (
                      <span className="ml-2 inline-flex items-center gap-1 text-xs" title="Strikes">
                        <AlertTriangle className={`w-3.5 h-3.5 ${hasRed ? 'text-[var(--danger)]' : 'text-[var(--gold)]'}`} />
                        {totalStrikes}
                      </span>
                    )}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setStrikeDelegateId(showStrikeForm ? null : d.id)}
                      className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--gold)] hover:bg-[var(--gold-soft)] transition-colors"
                      title="Add strike"
                    >
                      <AlertTriangle className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => removeDelegate(d.id)}
                      className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--danger)] hover:bg-[var(--bg-elevated)] transition-colors"
                      title="Remove delegate"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                {Object.keys(counts).length > 0 && (
                  <div className="flex flex-wrap gap-2 text-xs">
                    {Object.entries(counts).map(([type, count]) => (
                      <span
                        key={type}
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full ${
                          count >= STRIKE_THRESHOLD
                            ? 'bg-[var(--danger)]/20 text-[var(--danger)]'
                            : 'bg-[var(--gold-soft)] text-[var(--gold)]'
                        }`}
                      >
                        {type}: {count}
                        <button
                          onClick={() => removeStrike(d.id, type)}
                          className="p-0.5 rounded hover:bg-black/10"
                          title="Remove one strike"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
                {showStrikeForm && (
                  <div className="pt-2 border-t border-[var(--border)] flex flex-wrap gap-2 items-end">
                    <select
                      value={selectedStrikeType}
                      onChange={(e) => {
                        const v = e.target.value
                        setSelectedStrikeType(v)
                        if (v) {
                          addStrike(d.id, v)
                          setStrikeDelegateId(null)
                          setSelectedStrikeType('')
                          setCustomMisbehaviour('')
                        }
                      }}
                      className="px-3 py-2 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--gold)]"
                    >
                      <option value="">⚠️ Select misbehaviour</option>
                      {DEFAULT_MISBEHAVIOURS.map((m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                    </select>
                    <input
                      type="text"
                      value={customMisbehaviour}
                      onChange={(e) => setCustomMisbehaviour(e.target.value)}
                      placeholder="Or type custom"
                      className="w-36 px-3 py-2 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text)] placeholder-[var(--text-muted)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--gold)]"
                    />
                    <button
                      onClick={() => {
                        const type = customMisbehaviour.trim()
                        if (type) {
                          addStrike(d.id, type)
                          setStrikeDelegateId(null)
                          setCustomMisbehaviour('')
                          setSelectedStrikeType('')
                        }
                      }}
                      disabled={!customMisbehaviour.trim()}
                      className="px-3 py-2 rounded-lg bg-[var(--gold)] text-[var(--bg-base)] text-sm font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Add strike (custom)
                    </button>
                    <button
                      onClick={() => {
                        setStrikeDelegateId(null)
                        setCustomMisbehaviour('')
                        setSelectedStrikeType('')
                      }}
                      className="px-3 py-2 rounded-lg bg-[var(--bg-elevated)] text-[var(--text-muted)] text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
