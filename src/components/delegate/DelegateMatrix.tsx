import { useState } from 'react'
import { useDelegate } from '../../context/DelegateContext'
import { Plus, Trash2 } from 'lucide-react'
import InfoPopover from '../InfoPopover'
import { COMMITTEE_OPTIONS, OTHER_COMMITTEE_VALUE } from '../../constants/committees'
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
    setCommitteeCount,
    setCommittees,
    committeeMatrixEntries,
    addCommitteeMatrixEntry,
    removeCommitteeMatrixEntry,
  } = useDelegate()
  const [firstName, setFirstName] = useState('')
  const [delegationSelect, setDelegationSelect] = useState('')
  const [delegationCustom, setDelegationCustom] = useState('')
  const [customCommitteeNames, setCustomCommitteeNames] = useState<Record<number, string>>({})
  const [activeTabIndex, setActiveTabIndex] = useState(0)

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

  const tabCommittees = effectiveCommittees.filter(Boolean)
  const safeTabIndex = Math.min(Math.max(0, activeTabIndex), Math.max(0, tabCommittees.length - 1))
  const activeCommittee = tabCommittees[safeTabIndex] ?? ''
  const entriesForCommittee = (comm: string) =>
    committeeMatrixEntries.map((entry, i) => ({ entry, i })).filter(({ entry }) => entry.committee === comm)

  const delegationOptionsForCommittee = getDelegationsForCommittee(activeCommittee)

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
              {tabCommittees.map((comm, idx) => (
                <button
                  key={comm}
                  type="button"
                  onClick={() => setActiveTabIndex(idx)}
                  className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                    idx === safeTabIndex
                      ? 'border-[var(--accent)] text-[var(--accent)] bg-[var(--accent-soft)]/30'
                      : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--bg-elevated)]'
                  }`}
                >
                  {displayCommitteeLabel(comm)}
                </button>
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