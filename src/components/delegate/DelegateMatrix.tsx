import { useState, useMemo } from 'react'
import { useDelegate } from '../../context/DelegateContext'
import { Plus, Trash2, Pin } from 'lucide-react'
import InfoPopover from '../InfoPopover'
import { COMMITTEE_OPTIONS, OTHER_COMMITTEE_VALUE } from '../../constants/committees'
import { MUN07_IV_ALLOCATION_COMMITTEES } from '../../constants/mun07Allocations'
import { OTHER_DELEGATION_VALUE } from '../../constants/delegations'
import { getDelegationsForCommittee } from '../../constants/committeeAllocations'
import { getPresetDelegationFlag } from '../../constants/delegationFlags'

function getCommitteeLabel(value: string): string {
  if (value === OTHER_COMMITTEE_VALUE) return 'Other'
  const opt = COMMITTEE_OPTIONS.find((o) => o.value === value)
  return opt ? opt.label : value
}

export default function DelegateMatrix() {
  const {
    committeeCount,
    committees,
    presetId: currentPresetId,
    presetAllocationCommittees: currentPresetAllocationCommittees,
    setPresetAllocationCommittees,
    setCommitteeCount,
    setCommittees,
    committeeMatrixEntries,
    addCommitteeMatrixEntry,
    removeCommitteeMatrixEntry,
    pinnedCommittees = [],
    togglePinnedCommittee,
  } = useDelegate()
  const [firstName, setFirstName] = useState('')
  const [delegationSelect, setDelegationSelect] = useState('')
  const [delegationCustom, setDelegationCustom] = useState('')
  const [customCommitteeNames, setCustomCommitteeNames] = useState<Record<number, string>>({})
  const [activeCommitteeValue, setActiveCommitteeValue] = useState<string | null>(null)

  const committeeCountNum = Math.max(0, Math.min(20, committeeCount))
  const effectiveCommittees =
    committees.length > 0
      ? committees
      : Array.from({ length: committeeCountNum }, (_, i) => customCommitteeNames[i] ?? '')

  const handleCommitteeCountChange = (n: number) => {
    const num = Math.max(0, Math.min(20, n))
    setCommitteeCount(num)
    if (num < committees.length) {
      setCommittees(committees.slice(0, num))
    } else if (num > committees.length) {
      setCommittees([...committees, ...Array(num - committees.length).fill('')])
    }
  }

  const handleCommitteeChange = (index: number, value: string) => {
    const list = [...effectiveCommittees]
    list[index] = value === OTHER_COMMITTEE_VALUE ? OTHER_COMMITTEE_VALUE : value
    setCommittees(list)
  }

  const handleCustomCommitteeName = (index: number, name: string) => {
    setCustomCommitteeNames((prev) => ({ ...prev, [index]: name }))
    const list = [...committees]
    if (list.length <= index) return
    list[index] = name
    setCommittees(list)
  }

  const displayCommitteeLabel = (value: string) => {
    if (value === OTHER_COMMITTEE_VALUE) return 'Other'
    return getCommitteeLabel(value)
  }

  const tabCommittees = useMemo(() => {
    const list = effectiveCommittees.filter(Boolean)
    const pinned = pinnedCommittees.filter((p) => list.includes(p))
    const unpinned = list.filter((c) => !pinned.includes(c))
    return [...pinned, ...unpinned]
  }, [effectiveCommittees, pinnedCommittees])
  const activeCommittee =
    activeCommitteeValue && tabCommittees.includes(activeCommitteeValue)
      ? activeCommitteeValue
      : tabCommittees[0] ?? ''
  const entriesForCommittee = (comm: string) =>
    committeeMatrixEntries.map((entry, i) => ({ entry, i })).filter(({ entry }) => entry.committee === comm)

  const delegationOptionsForCommittee = getDelegationsForCommittee(activeCommittee, currentPresetId, currentPresetAllocationCommittees)

  const addForTab = (comm: string) => {
    const delegation = delegationSelect === OTHER_DELEGATION_VALUE ? delegationCustom.trim() : delegationSelect
    if (!comm || !firstName.trim()) return
    addCommitteeMatrixEntry({
      committee: comm,
      firstName: firstName.trim(),
      delegation: delegation || '',
    })
    setFirstName('')
    setDelegationSelect('')
    setDelegationCustom('')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-2">
        <div>
          <h2 className="font-semibold text-2xl text-[var(--text)] mb-1 flex items-center gap-1.5">
            📊 Committee Matrix
            <InfoPopover title="Committee Matrix">
              Set how many committees and which ones for this conference. Use one tab per committee to add entries: first name and delegation. Each delegation shows a flag emoji. Use this to track who is in which committee.
            </InfoPopover>
          </h2>
          <p className="text-[var(--text-muted)] text-sm">Set how many committees for this conference, which committees, then add delegates (first name + delegation).</p>
        </div>
      </div>

      {/* Conference committees setup */}
      <div className="card-block p-4 space-y-4">
        <h3 className="text-sm font-medium text-[var(--text)]">🏛️ Conference committees</h3>
        <p className="text-xs text-[var(--text-muted)]">When registering this conference: how many committees, and which ones?</p>
        <label className="flex flex-col gap-1">
          <span className="text-xs text-[var(--text-muted)]">How many committees?</span>
          <input
            type="number"
            min={0}
            max={20}
            value={committeeCountNum}
            onChange={(e) => handleCommitteeCountChange(parseInt(e.target.value, 10) || 0)}
            className="w-24 px-3 py-2 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            aria-label="Number of committees"
          />
        </label>
        {committeeCountNum > 0 && (
          <div className="space-y-2">
            <span className="text-xs text-[var(--text-muted)] block">Which committees?</span>
            {Array.from({ length: committeeCountNum }, (_, i) => (
              <div key={i} className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-[var(--text-muted)] w-20">Committee {i + 1}</span>
                <select
                  value={
                    effectiveCommittees[i] && COMMITTEE_OPTIONS.some((o) => o.value === effectiveCommittees[i])
                      ? effectiveCommittees[i]
                      : effectiveCommittees[i]
                        ? OTHER_COMMITTEE_VALUE
                        : ''
                  }
                  onChange={(e) => handleCommitteeChange(i, e.target.value)}
                  className="min-w-[12rem] px-3 py-2 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                  aria-label={`Committee ${i + 1}`}
                >
                  <option value="">Select…</option>
                  {COMMITTEE_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                  <option value={OTHER_COMMITTEE_VALUE}>Other (custom)</option>
                </select>
                {(effectiveCommittees[i] === OTHER_COMMITTEE_VALUE ||
                  (effectiveCommittees[i] && !COMMITTEE_OPTIONS.some((o) => o.value === effectiveCommittees[i]))) && (
                  <input
                    type="text"
                    value={effectiveCommittees[i] && effectiveCommittees[i] !== OTHER_COMMITTEE_VALUE ? effectiveCommittees[i] : (customCommitteeNames[i] ?? '')}
                    onChange={(e) => handleCustomCommitteeName(i, e.target.value)}
                    placeholder="Committee name"
                    className="min-w-[10rem] px-3 py-2 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text)] placeholder-[var(--text-muted)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                  />
                )}
              </div>
            ))}
          </div>
        )}
        {currentPresetId === 'mun07-iv' && (
          <div className="pt-2 border-t border-[var(--border)] space-y-2">
            <span className="text-xs text-[var(--text-muted)] block">Import preset allocations for</span>
            <div className="flex flex-col gap-1.5">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="delegate-preset-alloc-mode"
                  checked={currentPresetAllocationCommittees == null}
                  onChange={() => setPresetAllocationCommittees(undefined)}
                />
                <span className="text-sm text-[var(--text)]">All committees (default)</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="delegate-preset-alloc-mode"
                  checked={Array.isArray(currentPresetAllocationCommittees) && currentPresetAllocationCommittees.length === 0}
                  onChange={() => setPresetAllocationCommittees([])}
                />
                <span className="text-sm text-[var(--text)]">None (use standard UN list)</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="delegate-preset-alloc-mode"
                  checked={Array.isArray(currentPresetAllocationCommittees) && currentPresetAllocationCommittees.length > 0}
                  onChange={() => setPresetAllocationCommittees([...MUN07_IV_ALLOCATION_COMMITTEES])}
                />
                <span className="text-sm text-[var(--text)]">Selected committees</span>
              </label>
              {Array.isArray(currentPresetAllocationCommittees) && currentPresetAllocationCommittees.length > 0 && (
                <div className="pl-6 pt-1 flex flex-wrap gap-x-4 gap-y-1">
                  {MUN07_IV_ALLOCATION_COMMITTEES.map((val) => (
                    <label key={val} className="flex items-center gap-1.5">
                      <input
                        type="checkbox"
                        checked={currentPresetAllocationCommittees.includes(val)}
                        onChange={(e) => {
                          const next = e.target.checked
                            ? [...currentPresetAllocationCommittees, val]
                            : currentPresetAllocationCommittees.filter((c) => c !== val)
                          setPresetAllocationCommittees(next.length > 0 ? next : [])
                        }}
                      />
                      <span className="text-sm text-[var(--text)]">{getCommitteeLabel(val)}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Matrix: one tab per committee */}
      <div className="card-block overflow-hidden">
        {tabCommittees.length === 0 ? (
          <div className="px-4 py-8 text-center text-[var(--text-muted)] text-sm">
            Set committees above, then use the tabs to add and view matrix entries per committee.
          </div>
        ) : (
          <>
            <div className="flex border-b border-[var(--border)] overflow-x-auto">
              {tabCommittees.map((comm) => (
                <div
                  key={comm}
                  className={`flex items-center gap-1 px-2 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors group/tab ${
                    comm === activeCommittee
                      ? 'border-[var(--accent)] text-[var(--accent)] bg-[var(--accent-soft)]/30'
                      : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--bg-elevated)]'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setActiveCommitteeValue(comm)}
                    className="text-left py-0.5"
                  >
                    {displayCommitteeLabel(comm)}
                  </button>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); togglePinnedCommittee(comm) }}
                    disabled={!pinnedCommittees.includes(comm) && pinnedCommittees.length >= 3}
                    className={`p-0.5 rounded transition-colors flex-shrink-0 ${
                      pinnedCommittees.includes(comm)
                        ? 'text-[var(--accent)]'
                        : 'opacity-0 group-hover/tab:opacity-60 text-[var(--text-muted)] hover:text-[var(--accent)] disabled:opacity-40 disabled:pointer-events-none'
                    }`}
                    title={pinnedCommittees.includes(comm) ? 'Unpin' : pinnedCommittees.length >= 3 ? 'Max 3 pins' : 'Pin committee'}
                    aria-label={pinnedCommittees.includes(comm) ? `Unpin ${displayCommitteeLabel(comm)}` : `Pin ${displayCommitteeLabel(comm)}`}
                  >
                    <Pin className={`w-3.5 h-3.5 ${pinnedCommittees.includes(comm) ? 'fill-current' : ''}`} />
                  </button>
                </div>
              ))}
            </div>
            {activeCommittee && (
              <div className="p-4 space-y-4">
                <p className="text-xs text-[var(--text-muted)]">
                  Delegation options are tailored to this committee (e.g. UNSC: 15 members; GA committees: full UNGA).
                </p>
                <div className="flex flex-wrap gap-2 items-end">
                  <span className="text-xs text-[var(--text-muted)] mr-2">➕ Add to this committee:</span>
                  <label className="flex flex-col gap-1">
                    <span className="text-xs text-[var(--text-muted)]">First name</span>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="e.g. Alex"
                      className="w-28 px-3 py-2 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text)] placeholder-[var(--text-muted)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                    />
                  </label>
                  <label className="flex flex-col gap-1">
                    <span className="text-xs text-[var(--text-muted)]">Delegation</span>
                    <select
                      value={delegationSelect}
                      onChange={(e) => setDelegationSelect(e.target.value)}
                      className="min-w-[10rem] px-3 py-2 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                      aria-label="Delegation"
                    >
                      <option value="">Select…</option>
                      {delegationOptionsForCommittee.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                      <option value={OTHER_DELEGATION_VALUE}>Other</option>
                    </select>
                    {delegationSelect === OTHER_DELEGATION_VALUE && (
                      <input
                        type="text"
                        value={delegationCustom}
                        onChange={(e) => setDelegationCustom(e.target.value)}
                        placeholder="Delegation name"
                        className="mt-1 min-w-[10rem] px-3 py-2 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text)] placeholder-[var(--text-muted)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                      />
                    )}
                  </label>
                  <button
                    onClick={() => addForTab(activeCommittee)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--accent)] text-white text-sm font-medium hover:opacity-90"
                  >
                    <Plus className="w-4 h-4" /> Add
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-[var(--border)] bg-[var(--bg-elevated)]">
                        <th className="text-left px-4 py-2 font-medium text-[var(--text-muted)]">First name</th>
                        <th className="text-left px-4 py-2 font-medium text-[var(--text-muted)]">Delegation</th>
                        <th className="w-10 px-2 py-2" aria-label="Remove" />
                      </tr>
                    </thead>
                    <tbody>
                      {entriesForCommittee(activeCommittee).length === 0 ? (
                        <tr>
                          <td colSpan={3} className="px-4 py-8 text-center text-[var(--text-muted)]">
                            No entries for this committee yet.
                          </td>
                        </tr>
                      ) : (
                        entriesForCommittee(activeCommittee).map(({ entry, i }) => (
                          <tr key={i} className="border-b border-[var(--border)]">
                            <td className="px-4 py-3 text-[var(--text)]">{entry.firstName}</td>
                            <td className="px-4 py-3 text-[var(--text)]">
                              <span className="inline-flex items-center gap-2">
                                <span className="text-base shrink-0" title={entry.delegation || undefined}>
                                  {getPresetDelegationFlag(entry.delegation || '') || '🏳️'}
                                </span>
                                {entry.delegation || '—'}
                              </span>
                            </td>
                            <td className="px-2 py-3">
                              <button
                                type="button"
                                onClick={() => removeCommitteeMatrixEntry(i)}
                                className="p-1.5 rounded text-[var(--text-muted)] hover:text-[var(--danger)] hover:bg-[var(--bg-elevated)]"
                                aria-label="Remove entry"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}