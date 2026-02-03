import { useState } from 'react'
import { useChair } from '../../context/ChairContext'
import { Plus, Trash2, User, AlertTriangle, Minus, Smile, Mail } from 'lucide-react'
import { DEFAULT_MISBEHAVIOURS, STRIKE_THRESHOLD } from './strikeMisbehaviours'
import { DELEGATION_OPTIONS, OTHER_DELEGATION_VALUE } from '../../constants/delegations'

export default function ChairDelegates() {
  const {
    delegates,
    addDelegate,
    removeDelegate,
    updateDelegate,
    committee,
    addStrike,
    removeStrike,
    getStrikeCountsByType,
    getDelegationEmoji,
    setDelegationEmoji,
  } = useChair()
  const [countrySelect, setCountrySelect] = useState<string>('')
  const [customCountry, setCustomCountry] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [showBulkAdd, setShowBulkAdd] = useState(false)
  const [editingEmailForId, setEditingEmailForId] = useState<string | null>(null)
  const [editingEmailValue, setEditingEmailValue] = useState('')
  const [strikeDelegateId, setStrikeDelegateId] = useState<string | null>(null)
  const [customMisbehaviour, setCustomMisbehaviour] = useState('')
  const [selectedStrikeType, setSelectedStrikeType] = useState('')
  const [editingEmojiFor, setEditingEmojiFor] = useState<string | null>(null)
  const [customEmojiInput, setCustomEmojiInput] = useState('')

  const countryValue = countrySelect === OTHER_DELEGATION_VALUE ? customCountry.trim() : countrySelect

  const addOne = () => {
    if (!countryValue) return
    addDelegate({
      country: countryValue,
      name: name.trim() || undefined,
      email: email.trim() || undefined,
      committee: committee || undefined,
      rollCallStatus: 'absent',
    })
    setCountrySelect('')
    setCustomCountry('')
    setName('')
    setEmail('')
  }

  const addAllMissing = () => {
    DELEGATION_OPTIONS.forEach((c) => {
      if (!delegates.some((d) => d.country === c)) {
        addDelegate({ country: c, committee: committee || undefined, rollCallStatus: 'absent' })
      }
    })
    setShowBulkAdd(false)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-semibold text-2xl text-[var(--text)] mb-1">👥 Delegates</h2>
        <p className="text-[var(--text-muted)] text-sm">Add or remove delegates. Preset UNGA flags shown; use the 😊 button to set a custom emoji for delegations (e.g. FWC).</p>
      </div>

      <div className="card-block p-4 space-y-4">
        <h3 className="text-sm font-medium text-[var(--text)]">➕ Add delegate</h3>
        <div className="flex flex-wrap gap-3 items-end">
          <label className="flex flex-col gap-1">
            <span className="text-xs text-[var(--text-muted)]">Country</span>
            <select
              value={countrySelect}
              onChange={(e) => setCountrySelect(e.target.value)}
              className="min-w-[12rem] max-w-[20rem] px-3 py-2 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            >
              <option value="">— Select country —</option>
              {DELEGATION_OPTIONS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
              <option value={OTHER_DELEGATION_VALUE}>— Other —</option>
            </select>
          </label>
          {countrySelect === OTHER_DELEGATION_VALUE && (
            <label className="flex flex-col gap-1">
              <span className="text-xs text-[var(--text-muted)]">Custom country</span>
              <input
                type="text"
                value={customCountry}
                onChange={(e) => setCustomCountry(e.target.value)}
                placeholder="e.g. Observer State"
                className="w-40 px-3 py-2 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text)] placeholder-[var(--text-muted)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
              />
            </label>
          )}
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
          <label className="flex flex-col gap-1">
            <span className="text-xs text-[var(--text-muted)]">Email (optional)</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="delegate@example.com"
              className="w-48 px-3 py-2 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text)] placeholder-[var(--text-muted)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            />
          </label>
          <button
            onClick={addOne}
            disabled={!countryValue}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--accent)] text-white text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-4 h-4" /> Add
          </button>
        </div>

        <div className="pt-2 border-t border-[var(--border)] flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowBulkAdd(true)}
            className="px-3 py-1.5 rounded-lg bg-[var(--accent-soft)] text-[var(--accent)] text-sm font-medium hover:bg-[var(--accent-soft)]/80 transition-colors"
          >
            Add all UNGA members not in list
          </button>
        </div>
      </div>

      {showBulkAdd && (
        <div className="rounded-xl border border-[var(--accent)] bg-[var(--accent-soft)] p-4 flex items-center justify-between flex-wrap gap-2">
          <p className="text-sm text-[var(--text)]">Add all 193 UNGA member states not yet in the list?</p>
          <div className="flex gap-2">
            <button onClick={() => setShowBulkAdd(false)} className="px-3 py-1.5 rounded-lg bg-[var(--bg-card)] text-sm">Cancel</button>
            <button onClick={addAllMissing} className="px-3 py-1.5 rounded-lg bg-[var(--accent)] text-white text-sm font-medium">Add all</button>
          </div>
        </div>
      )}

      <div className="card-block overflow-hidden">
        <div className="px-4 py-3 border-b border-[var(--border)] flex items-center gap-2">
          <User className="w-4 h-4 text-[var(--text-muted)]" />
          <span className="text-sm font-medium text-[var(--text)]">👥 Current delegates ({delegates.length})</span>
        </div>
        <ul className="divide-y divide-[var(--border)] max-h-[28rem] overflow-auto">
          {[...delegates].sort((a, b) => a.country.localeCompare(b.country, undefined, { sensitivity: 'base' })).map((d) => {
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
                  <span className="text-sm text-[var(--text)] flex items-center gap-2 min-w-0">
                    <span className="text-base shrink-0" title="Delegation flag/emoji">
                      {getDelegationEmoji(d.country) || '🏳️'}
                    </span>
                    <strong className="text-[var(--accent)] truncate">{d.country}</strong>
                    {d.name && <span className="text-[var(--text-muted)] ml-1 shrink-0">— {d.name}</span>}
                    {d.email && (
                      <span className="text-xs text-[var(--text-muted)] ml-1 shrink-0 truncate" title={d.email}>
                        · {d.email}
                      </span>
                    )}
                    {totalStrikes > 0 && (
                      <span className="ml-2 inline-flex items-center gap-1 text-xs" title="Strikes">
                        <AlertTriangle className={`w-3.5 h-3.5 ${hasRed ? 'text-[var(--danger)]' : 'text-[var(--accent)]'}`} />
                        {totalStrikes}
                      </span>
                    )}
                  </span>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => {
                        setEditingEmailForId(editingEmailForId === d.id ? null : d.id)
                        setEditingEmailValue(d.email ?? '')
                      }}
                      className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--accent)] hover:bg-[var(--accent-soft)] transition-colors"
                      title="Edit delegate email"
                    >
                      <Mail className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        setEditingEmojiFor(editingEmojiFor === d.country ? null : d.country)
                        setCustomEmojiInput(getDelegationEmoji(d.country))
                      }}
                      className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--accent)] hover:bg-[var(--accent-soft)] transition-colors"
                      title="Set custom emoji/flag for this delegation"
                    >
                      <Smile className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setStrikeDelegateId(showStrikeForm ? null : d.id)}
                      className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--accent)] hover:bg-[var(--accent-soft)] transition-colors"
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
                {editingEmojiFor === d.country && (
                  <div className="pt-2 border-t border-[var(--border)] flex flex-wrap gap-2 items-center">
                    <label className="text-xs text-[var(--text-muted)]">Custom emoji for this delegation:</label>
                    <input
                      type="text"
                      value={customEmojiInput}
                      onChange={(e) => setCustomEmojiInput(e.target.value)}
                      placeholder="e.g. 🏴 or paste any emoji"
                      className="w-24 px-2 py-1.5 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text)] text-sm"
                    />
                    <button
                      onClick={() => {
                        setDelegationEmoji(d.country, customEmojiInput.trim() || null)
                        setEditingEmojiFor(null)
                        setCustomEmojiInput('')
                      }}
                      className="px-2 py-1.5 rounded-lg bg-[var(--accent)] text-white text-xs font-medium"
                    >
                      Apply
                    </button>
                    <button
                      onClick={() => {
                        setDelegationEmoji(d.country, null)
                        setEditingEmojiFor(null)
                        setCustomEmojiInput('')
                      }}
                      className="px-2 py-1.5 rounded-lg bg-[var(--bg-elevated)] text-[var(--text-muted)] text-xs"
                    >
                      Clear (use preset)
                    </button>
                    <button
                      onClick={() => { setEditingEmojiFor(null); setCustomEmojiInput('') }}
                      className="px-2 py-1.5 rounded-lg text-[var(--text-muted)] text-xs"
                    >
                      Cancel
                    </button>
                  </div>
                )}
                {editingEmailForId === d.id && (
                  <div className="pt-2 border-t border-[var(--border)] flex flex-wrap gap-2 items-center">
                    <label className="text-xs text-[var(--text-muted)]">Delegate email:</label>
                    <input
                      type="email"
                      value={editingEmailValue}
                      onChange={(e) => setEditingEmailValue(e.target.value)}
                      placeholder="delegate@example.com"
                      className="flex-1 min-w-[12rem] px-2 py-1.5 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text)] text-sm"
                    />
                    <button
                      onClick={() => {
                        updateDelegate(d.id, { email: editingEmailValue.trim() || undefined })
                        setEditingEmailForId(null)
                        setEditingEmailValue('')
                      }}
                      className="px-2 py-1.5 rounded-lg bg-[var(--accent)] text-white text-xs font-medium"
                    >
                      Apply
                    </button>
                    <button
                      onClick={() => {
                        updateDelegate(d.id, { email: undefined })
                        setEditingEmailForId(null)
                        setEditingEmailValue('')
                      }}
                      className="px-2 py-1.5 rounded-lg bg-[var(--bg-elevated)] text-[var(--text-muted)] text-xs"
                    >
                      Clear
                    </button>
                    <button
                      onClick={() => { setEditingEmailForId(null); setEditingEmailValue('') }}
                      className="px-2 py-1.5 rounded-lg text-[var(--text-muted)] text-xs"
                    >
                      Cancel
                    </button>
                  </div>
                )}
                {Object.keys(counts).length > 0 && (
                  <div className="flex flex-wrap gap-2 text-xs">
                    {Object.entries(counts).map(([type, count]) => (
                      <span
                        key={type}
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md ${
                          count >= STRIKE_THRESHOLD
                            ? 'bg-[var(--danger)]/20 text-[var(--danger)]'
                            : 'bg-[var(--accent-soft)] text-[var(--accent)]'
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
                      className="px-3 py-2 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
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
                      className="w-36 px-3 py-2 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text)] placeholder-[var(--text-muted)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
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
                      className="px-3 py-2 rounded-lg bg-[var(--accent)] text-white text-sm font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
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
