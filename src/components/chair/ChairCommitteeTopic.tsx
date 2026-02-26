import { useMemo } from 'react'
import { useChair } from '../../context/ChairContext'
import { COMMITTEE_OPTIONS, OTHER_COMMITTEE_VALUE } from '../../constants/committees'
import { MUN07_IV_ALLOCATION_COMMITTEES } from '../../constants/mun07Allocations'

function getCommitteeLabel(value: string): string {
  const opt = COMMITTEE_OPTIONS.find((o) => o.value === value)
  return opt ? opt.label : value
}

interface Props {
  onClose?: () => void
}

export default function ChairCommitteeTopic({ onClose }: Props) {
  const { committee, topics, universe, chairName, chairEmail, conferences, activeConferenceId, setConferenceName, setCommittee, setTopicAtIndex, setUniverse, setChairName, setChairEmail, currentPresetId, currentPresetAllocationCommittees, setPresetAllocationCommittees } = useChair()
  const currentConf = conferences.find((c) => c.id === activeConferenceId)

  const selectedPreset = useMemo(() => {
    const found = COMMITTEE_OPTIONS.find((o) => o.value === committee)
    return found ? committee : committee ? OTHER_COMMITTEE_VALUE : ''
  }, [committee])

  const handleCommitteeSelect = (value: string) => {
    if (value === OTHER_COMMITTEE_VALUE) setCommittee('')
    else setCommittee(value)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg text-[var(--text)]">📌 Committee & topic</h3>
        {onClose && (
          <button onClick={onClose} className="text-[var(--text-muted)] hover:text-[var(--text)] text-sm">
            Close
          </button>
        )}
      </div>
      {currentConf && (
        <label className="block">
          <span className="text-xs text-[var(--text-muted)] block mb-1">Conference name</span>
          <input
            type="text"
            value={currentConf.name}
            onChange={(e) => setConferenceName(currentConf.id, e.target.value)}
            placeholder="e.g. SEAMUN 2025"
            className="w-full px-3 py-2 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text)] placeholder-[var(--text-muted)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            aria-label="Conference name"
          />
        </label>
      )}
      <label className="block">
        <span className="text-xs text-[var(--text-muted)] block mb-1">Set committee</span>
        <select
          value={selectedPreset}
          onChange={(e) => handleCommitteeSelect(e.target.value)}
          className="w-full px-3 py-2 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
          aria-label="Committee"
        >
          <option value="">Select committee…</option>
          {COMMITTEE_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
          <option value={OTHER_COMMITTEE_VALUE}>Other (custom)</option>
        </select>
        {selectedPreset === OTHER_COMMITTEE_VALUE && (
          <input
            id="chair-committee-custom"
            name="committee-custom"
            type="text"
            value={committee}
            onChange={(e) => setCommittee(e.target.value)}
            placeholder="e.g. Custom committee name"
            className="mt-2 w-full px-3 py-2 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text)] placeholder-[var(--text-muted)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            aria-label="Custom committee name"
          />
        )}
      </label>
      <label className="block" htmlFor="chair-universe">
        <span className="text-xs text-[var(--text-muted)] block mb-1">Universe (optional, for fictional committees)</span>
        <input
          id="chair-universe"
          name="chair-universe"
          type="text"
          value={universe}
          onChange={(e) => setUniverse(e.target.value)}
          placeholder="e.g. Star Wars, Harry Potter — leave blank for real-world"
          className="w-full px-3 py-2 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text)] placeholder-[var(--text-muted)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
          aria-label="Universe (optional)"
        />
      </label>
      {currentPresetId === 'mun07-iv' && (
        <div className="block pt-2 border-t border-[var(--border)]">
          <span className="text-xs text-[var(--text-muted)] block mb-2">Import preset allocations for</span>
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="preset-alloc-mode"
                checked={currentPresetAllocationCommittees == null}
                onChange={() => setPresetAllocationCommittees(undefined)}
              />
              <span className="text-sm text-[var(--text)]">All committees (default)</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="preset-alloc-mode"
                checked={Array.isArray(currentPresetAllocationCommittees) && currentPresetAllocationCommittees.length === 0}
                onChange={() => setPresetAllocationCommittees([])}
              />
              <span className="text-sm text-[var(--text)]">None (use standard UN list)</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="preset-alloc-mode"
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
      <div className="block">
        <span className="text-xs text-[var(--text-muted)] block mb-1">Committee topics (up to 3)</span>
        {[0, 1, 2].map((i) => (
          <input
            key={i}
            id={`chair-topic-${i}`}
            name={`chair-topic-${i}`}
            type="text"
            value={topics?.[i] ?? ''}
            onChange={(e) => setTopicAtIndex(i, e.target.value)}
            placeholder={i === 0 ? 'e.g. The Question of Cybersecurity and International Peace' : `Topic ${i + 1} (optional)`}
            className="w-full px-3 py-2 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text)] placeholder-[var(--text-muted)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)] mt-2 first:mt-0"
          />
        ))}
      </div>
      <div className="pt-2 border-t border-[var(--border)]">
        <h4 className="text-sm font-medium text-[var(--text)] mb-2">👤 Chair</h4>
        <label className="block mb-2" htmlFor="chair-name">
          <span className="text-xs text-[var(--text-muted)] block mb-1">Chair name (optional)</span>
          <input
            id="chair-name"
            name="chair-name"
            type="text"
            value={chairName}
            onChange={(e) => setChairName(e.target.value)}
            placeholder="e.g. Jane Smith"
            className="w-full px-3 py-2 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text)] placeholder-[var(--text-muted)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            aria-label="Chair name"
          />
        </label>
        <label className="block" htmlFor="chair-email">
          <span className="text-xs text-[var(--text-muted)] block mb-1">Chair email (optional)</span>
          <input
            id="chair-email"
            name="chair-email"
            type="email"
            value={chairEmail}
            onChange={(e) => setChairEmail(e.target.value)}
            placeholder="e.g. chair@conference.org"
            className="w-full px-3 py-2 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text)] placeholder-[var(--text-muted)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            aria-label="Chair email"
          />
        </label>
      </div>
    </div>
  )
}
