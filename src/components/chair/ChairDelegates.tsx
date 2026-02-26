import { useState } from 'react'
import { useChair } from '../../context/ChairContext'
import { Plus, Trash2, User, AlertTriangle, Minus, Smile, Pencil, Trophy, Vote, Mic } from 'lucide-react'
import InfoPopover from '../InfoPopover'
import DelegateScorePopup from './DelegateScorePopup'
import { DEFAULT_MISBEHAVIOURS, STRIKE_THRESHOLD } from './strikeMisbehaviours'
import { OTHER_DELEGATION_VALUE } from '../../constants/delegations'
import { getAllocationOptionsForCommittee, getDelegationsForCommittee } from '../../constants/committeeAllocations'

export default function ChairDelegates() {
  const {
    delegates,
    addDelegate,
    removeDelegate,
    updateDelegate,
    committee,
    currentPresetId,
    currentPresetAllocationCommittees,
    addStrike,
    removeStrike,
    getStrikeCountsByType,
    getDelegationEmoji,
    setDelegationEmoji,
    setDelegateScore,
    getDelegateScore,
  } = useChair()
  const [countrySelect, setCountrySelect] = useState<string>('')
  const [customCountry, setCustomCountry] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [showBulkAdd, setShowBulkAdd] = useState(false)
  const [editingDelegateId, setEditingDelegateId] = useState<string | null>(null)
  const [editCountrySelect, setEditCountrySelect] = useState('')
  const [editCustomCountry, setEditCustomCountry] = useState('')
  const [editName, setEditName] = useState('')
  const [editEmail, setEditEmail] = useState('')
  const [strikeDelegateId, setStrikeDelegateId] = useState<string | null>(null)
  const [customMisbehaviour, setCustomMisbehaviour] = useState('')
  const [selectedStrikeType, setSelectedStrikeType] = useState('')
  const [editingEmojiFor, setEditingEmojiFor] = useState<string | null>(null)
  const [customEmojiInput, setCustomEmojiInput] = useState('')
  const [scorePopupDelegateId, setScorePopupDelegateId] = useState<string | null>(null)
  const [selectedDelegateIds, setSelectedDelegateIds] = useState<Set<string>>(new Set())

  const countryValue = countrySelect === OTHER_DELEGATION_VALUE ? customCountry.trim() : countrySelect

  const allocationOptions = getAllocationOptionsForCommittee(
    committee,
    delegates.map((d) => d.country),
    currentPresetId,
    currentPresetAllocationCommittees
  )

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
    const possible = getDelegationsForCommittee(committee, currentPresetId, currentPresetAllocationCommittees)
    possible.forEach((c) => {
      if (!delegates.some((d) => d.country === c)) {
        addDelegate({ country: c, committee: committee || undefined, rollCallStatus: 'absent' })
      }
    })
    setShowBulkAdd(false)
  }

  const sortedDelegates = [...delegates].sort((a, b) => a.country.localeCompare(b.country, undefined, { sensitivity: 'base' }))
  const toggleSelect = (id: string) => {
    setSelectedDelegateIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }
  const selectAll = () => setSelectedDelegateIds(new Set(sortedDelegates.map((d) => d.id)))
  const clearSelection = () => setSelectedDelegateIds(new Set())
  const removeSelected = () => {
    selectedDelegateIds.forEach((id) => removeDelegate(id))
    clearSelection()
  }
  const removeAll = () => {
    delegates.forEach((d) => removeDelegate(d.id))
    clearSelection()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-2">
        <div>
          <h2 className="font-semibold text-2xl text-[var(--text)] mb-1 flex items-center gap-1.5">
            👥 Delegates
            <InfoPopover title="Delegates">
              Add all countries in the room. Select from the UNGA dropdown or add custom. You can set a name and email per delegate. Icon key below each delegate: Scores (🏆), Edit (✏️), Voting (🗳️), Speaking (🎤), Emoji (😊), Strike (⚠️), Remove (🗑️). Use Voting/Speaking to revoke rights (e.g. sanctions). Use Emoji to set a custom flag for non-UN delegations (e.g. FWC).
            </InfoPopover>
          </h2>
          <p className="text-[var(--text-muted)] text-sm">
            Add or remove delegates. Country list is tailored to this committee (e.g. UNSC shows 15 members; GA committees show all UNGA). See the icon key below the delegate list.
          </p>
        </div>
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
              aria-label="Country / delegation"
            >
              <option value="">— Select country —</option>
              {allocationOptions.map((c) => (
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
        <div className="accent-highlight-wave rounded-xl border border-[var(--accent)] bg-[var(--accent-soft)] p-4 flex items-center justify-between flex-wrap gap-2">
          <p className="text-sm text-[var(--text)]">
            Add all possible participants for this committee not yet in the list?
            {getDelegationsForCommittee(committee, currentPresetId).length < 50 && (
              <span className="text-[var(--text-muted)] ml-1">
                ({getDelegationsForCommittee(committee, currentPresetId).length} for this committee)
              </span>
            )}
          </p>
          <div className="flex gap-2">
            <button onClick={() => setShowBulkAdd(false)} className="px-3 py-1.5 rounded-lg bg-[var(--bg-card)] text-sm">Cancel</button>
            <button onClick={addAllMissing} className="px-3 py-1.5 rounded-lg bg-[var(--accent)] text-white text-sm font-medium">Add all</button>
          </div>
        </div>
      )}

      <div className="card-block overflow-hidden">
        <div className="px-4 py-3 border-b border-[var(--border)] space-y-2">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-[var(--text-muted)]" />
              <span className="text-sm font-medium text-[var(--text)]">👥 Current delegates ({delegates.length})</span>
              {(() => {
                const delegatesWithStrikes = sortedDelegates.filter((d) => {
                  const counts = getStrikeCountsByType(d.id)
                  return Object.values(counts).reduce((a, b) => a + b, 0) > 0
                })
                const totalStrikes = delegatesWithStrikes.reduce((sum, d) => {
                  const counts = getStrikeCountsByType(d.id)
                  return sum + Object.values(counts).reduce((a, b) => a + b, 0)
                }, 0)
                if (delegatesWithStrikes.length === 0) return null
                return (
                  <span className="text-xs text-[var(--accent)] font-medium">
                    · <AlertTriangle className="w-3 h-3 inline align-middle" /> {delegatesWithStrikes.length} with strikes ({totalStrikes} total)
                  </span>
                )
              })()}
            </div>
            {delegates.length > 0 && (
            <>
              <label className="flex items-center gap-2 text-sm text-[var(--text-muted)] cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={selectedDelegateIds.size === delegates.length}
                  onChange={(e) => (e.target.checked ? selectAll() : clearSelection())}
                  className="rounded border-[var(--border)]"
                />
                Select all
              </label>
              <div className="flex gap-2 ml-auto">
                {selectedDelegateIds.size > 0 && (
                  <button
                    onClick={removeSelected}
                    className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-[var(--danger)]/15 text-[var(--danger)] text-xs font-medium hover:bg-[var(--danger)]/25 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Remove selected ({selectedDelegateIds.size})
                  </button>
                )}
                <button
                  onClick={removeAll}
                  className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-[var(--danger)]/15 text-[var(--danger)] text-xs font-medium hover:bg-[var(--danger)]/25 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Remove all
                </button>
              </div>
            </>
          )}
          </div>
          {delegates.length > 0 && (
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] text-[var(--text-muted)]" role="list" aria-label="Icon key">
              <span className="inline-flex items-center gap-1"><Trophy className="w-3 h-3" /> Scores</span>
              <span className="inline-flex items-center gap-1"><Pencil className="w-3 h-3" /> Edit</span>
              <span className="inline-flex items-center gap-1"><Vote className="w-3 h-3" /> Voting</span>
              <span className="inline-flex items-center gap-1"><Mic className="w-3 h-3" /> Speaking</span>
              <span className="inline-flex items-center gap-1"><Smile className="w-3 h-3" /> Emoji</span>
              <span className="inline-flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> Strike</span>
              <span className="inline-flex items-center gap-1"><Trash2 className="w-3 h-3" /> Remove</span>
            </div>
          )}
        </div>
        <ul className="divide-y divide-[var(--border)] max-h-[28rem] overflow-auto">
          {sortedDelegates.map((d) => {
            const counts = getStrikeCountsByType(d.id)
            const hasRed = Object.values(counts).some((c) => c >= STRIKE_THRESHOLD)
            const totalStrikes = Object.values(counts).reduce((a, b) => a + b, 0)
            const showStrikeForm = strikeDelegateId === d.id
            return (
              <li
                key={d.id}
                className={`px-4 py-3 flex flex-col gap-2 ${hasRed ? 'bg-[var(--danger)]/10 border-l-4 border-[var(--danger)]' : ''} ${selectedDelegateIds.has(d.id) ? 'bg-[var(--accent-soft)]/50' : ''}`}
              >
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <label className="flex items-center gap-2 min-w-0 cursor-pointer select-none shrink-0">
                    <input
                      type="checkbox"
                      checked={selectedDelegateIds.has(d.id)}
                      onChange={() => toggleSelect(d.id)}
                      className="rounded border-[var(--border)]"
                    />
                  </label>
                  <span className="text-sm text-[var(--text)] flex items-center gap-2 min-w-0 flex-1">
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
                      <span
                        className="ml-2 inline-flex items-center gap-1 text-xs"
                        title={Object.entries(counts).map(([t, c]) => `${t}: ${c}`).join(', ')}
                      >
                        <AlertTriangle className={`w-3.5 h-3.5 ${hasRed ? 'text-[var(--danger)]' : 'text-[var(--accent)]'}`} />
                        {totalStrikes}
                      </span>
                    )}
                  </span>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => setScorePopupDelegateId(scorePopupDelegateId === d.id ? null : d.id)}
                      className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--gold)] hover:bg-[var(--gold)]/10 transition-colors"
                      title="Edit scores"
                      aria-label={`Edit scores for ${d.country}`}
                    >
                      <Trophy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (editingDelegateId === d.id) {
                          setEditingDelegateId(null)
                        } else {
                          setEditingDelegateId(d.id)
                          const editOpts = getAllocationOptionsForCommittee(committee, delegates.filter((x) => x.id !== d.id).map((x) => x.country), currentPresetId)
                          setEditCountrySelect(editOpts.includes(d.country) ? d.country : OTHER_DELEGATION_VALUE)
                          setEditCustomCountry(editOpts.includes(d.country) ? '' : d.country)
                          setEditName(d.name ?? '')
                          setEditEmail(d.email ?? '')
                        }
                      }}
                      className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--accent)] hover:bg-[var(--accent-soft)] transition-colors"
                      title="Edit allocation, name, email"
                      aria-label={`Edit allocation, name, email for ${d.country}`}
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => updateDelegate(d.id, { votingRightsRevoked: !d.votingRightsRevoked })}
                      className={`p-1.5 rounded-lg transition-colors ${
                        d.votingRightsRevoked ? 'text-[var(--danger)] bg-[var(--danger)]/10 hover:bg-[var(--danger)]/20' : 'text-[var(--text-muted)] hover:text-[var(--accent)] hover:bg-[var(--accent-soft)]'
                      }`}
                      title={d.votingRightsRevoked ? 'Voting revoked — click to restore' : 'Revoke voting rights'}
                      aria-label={d.votingRightsRevoked ? `Restore voting rights for ${d.country}` : `Revoke voting rights for ${d.country}`}
                    >
                      <Vote className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => updateDelegate(d.id, { speakingRightsRevoked: !d.speakingRightsRevoked })}
                      className={`p-1.5 rounded-lg transition-colors ${
                        d.speakingRightsRevoked ? 'text-[var(--danger)] bg-[var(--danger)]/10 hover:bg-[var(--danger)]/20' : 'text-[var(--text-muted)] hover:text-[var(--accent)] hover:bg-[var(--accent-soft)]'
                      }`}
                      title={d.speakingRightsRevoked ? 'Speaking revoked — click to restore' : 'Revoke speaking rights'}
                      aria-label={d.speakingRightsRevoked ? `Restore speaking rights for ${d.country}` : `Revoke speaking rights for ${d.country}`}
                    >
                      <Mic className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        setEditingEmojiFor(editingEmojiFor === d.country ? null : d.country)
                        setCustomEmojiInput(getDelegationEmoji(d.country))
                      }}
                      className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--accent)] hover:bg-[var(--accent-soft)] transition-colors"
                      title="Set custom emoji/flag for this delegation"
                      aria-label={`Set custom emoji for ${d.country}`}
                    >
                      <Smile className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setStrikeDelegateId(showStrikeForm ? null : d.id)}
                      className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--accent)] hover:bg-[var(--accent-soft)] transition-colors"
                      title="Add strike"
                      aria-label={`Add strike for ${d.country}`}
                    >
                      <AlertTriangle className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => removeDelegate(d.id)}
                      className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--danger)] hover:bg-[var(--bg-elevated)] transition-colors"
                      title="Remove delegate"
                      aria-label={`Remove ${d.country} from delegates`}
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
                {editingDelegateId === d.id && (
                  <div className="pt-2 border-t border-[var(--border)] space-y-3">
                    <div className="flex flex-wrap gap-3 items-end">
                      <label className="flex flex-col gap-1">
                        <span className="text-xs text-[var(--text-muted)]">Allocation (country)</span>
                        <select
                          value={editCountrySelect}
                          onChange={(e) => setEditCountrySelect(e.target.value)}
                          className="min-w-[12rem] max-w-[20rem] px-3 py-2 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                        >
                          {getAllocationOptionsForCommittee(committee, delegates.filter((x) => x.id !== d.id).map((x) => x.country), currentPresetId).map((c) => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                          <option value={OTHER_DELEGATION_VALUE}>— Other —</option>
                        </select>
                      </label>
                      {editCountrySelect === OTHER_DELEGATION_VALUE && (
                        <label className="flex flex-col gap-1">
                          <span className="text-xs text-[var(--text-muted)]">Custom country</span>
                          <input
                            type="text"
                            value={editCustomCountry}
                            onChange={(e) => setEditCustomCountry(e.target.value)}
                            placeholder="e.g. Observer State"
                            className="w-40 px-3 py-2 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text)] text-sm"
                          />
                        </label>
                      )}
                      <label className="flex flex-col gap-1">
                        <span className="text-xs text-[var(--text-muted)]">Name (optional)</span>
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          placeholder="Delegate name"
                          className="w-40 px-3 py-2 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text)] text-sm"
                        />
                      </label>
                      <label className="flex flex-col gap-1">
                        <span className="text-xs text-[var(--text-muted)]">Email (optional)</span>
                        <input
                          type="email"
                          value={editEmail}
                          onChange={(e) => setEditEmail(e.target.value)}
                          placeholder="delegate@example.com"
                          className="w-48 px-3 py-2 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text)] text-sm"
                        />
                      </label>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          const newCountry = editCountrySelect === OTHER_DELEGATION_VALUE ? editCustomCountry.trim() : editCountrySelect
                          if (newCountry) {
                            updateDelegate(d.id, {
                              country: newCountry,
                              name: editName.trim() || undefined,
                              email: editEmail.trim() || undefined,
                            })
                            setEditingDelegateId(null)
                          }
                        }}
                        disabled={!(editCountrySelect === OTHER_DELEGATION_VALUE ? editCustomCountry.trim() : editCountrySelect)}
                        className="px-3 py-1.5 rounded-lg bg-[var(--accent)] text-white text-xs font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Apply
                      </button>
                      <button
                        onClick={() => setEditingDelegateId(null)}
                        className="px-3 py-1.5 rounded-lg bg-[var(--bg-elevated)] text-[var(--text-muted)] text-xs hover:text-[var(--text)]"
                      >
                        Cancel
                      </button>
                    </div>
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
                {scorePopupDelegateId === d.id && (
                  <DelegateScorePopup
                    delegate={d}
                    score={getDelegateScore(d.id)}
                    setDelegateScore={setDelegateScore}
                    onClose={() => setScorePopupDelegateId(null)}
                    getDelegationEmoji={getDelegationEmoji}
                  />
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
