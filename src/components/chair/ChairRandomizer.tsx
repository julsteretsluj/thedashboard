import { useState, useMemo } from 'react'
import { useChair } from '../../context/ChairContext'
import { Shuffle } from 'lucide-react'

export default function ChairRandomizer() {
  const {
    delegates,
    addToSpeakers,
    getDelegationEmoji,
    rollCallComplete,
  } = useChair()
  const [pickedDelegateId, setPickedDelegateId] = useState<string | null>(null)
  const [randomizerMode, setRandomizerMode] = useState<'all' | 'selected'>('all')
  const [selectedForRandomizer, setSelectedForRandomizer] = useState<Set<string>>(new Set())

  const eligibleForRandom = useMemo(() => {
    return delegates.filter((d) => {
      if (d.speakingRightsRevoked) return false
      if (rollCallComplete) {
        const status = d.rollCallStatus ?? (d.present ? 'present' : 'absent')
        return status === 'present' || status === 'present-and-voting'
      }
      return true
    })
  }, [delegates, rollCallComplete])

  const randomizerPool = useMemo(() => {
    if (randomizerMode === 'all') return eligibleForRandom
    return eligibleForRandom.filter((d) => selectedForRandomizer.has(d.id))
  }, [randomizerMode, eligibleForRandom, selectedForRandomizer])

  const toggleInRandomizer = (id: string) => {
    setSelectedForRandomizer((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const selectAllForRandomizer = () => {
    setSelectedForRandomizer(new Set(eligibleForRandom.map((d) => d.id)))
  }

  const clearRandomizerSelection = () => {
    setSelectedForRandomizer(new Set())
  }

  const pickRandom = () => {
    if (randomizerPool.length === 0) {
      setPickedDelegateId(null)
      return
    }
    const idx = Math.floor(Math.random() * randomizerPool.length)
    setPickedDelegateId(randomizerPool[idx].id)
  }

  const addPickedToSpeakers = () => {
    const d = delegates.find((x) => x.id === pickedDelegateId)
    if (!d) return
    addToSpeakers(d.id, d.country, d.name || d.country)
    setPickedDelegateId(null)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-semibold text-2xl text-[var(--text)] mb-1">🎲 Random delegate picker</h2>
        <p className="text-[var(--text-muted)] text-sm">Pick a random delegate for cold call or consultation. Include all or select specific delegates.</p>
      </div>

      <div className="card-block p-4 space-y-3">
        <h3 className="text-sm font-medium text-[var(--text)]">Pool</h3>
        <div className="flex flex-wrap gap-3">
          <fieldset className="flex flex-wrap gap-2">
            <legend className="sr-only">Randomizer pool</legend>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="randomizer-mode"
                checked={randomizerMode === 'all'}
                onChange={() => setRandomizerMode('all')}
                className="rounded-full border-[var(--border)]"
              />
              <span className="text-sm text-[var(--text)]">Include all</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="randomizer-mode"
                checked={randomizerMode === 'selected'}
                onChange={() => setRandomizerMode('selected')}
                className="rounded-full border-[var(--border)]"
              />
              <span className="text-sm text-[var(--text)]">Select delegates</span>
            </label>
          </fieldset>
        </div>
        {randomizerMode === 'selected' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs text-[var(--text-muted)]">
                {randomizerPool.length} selected for random pick
              </span>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={selectAllForRandomizer}
                  className="text-xs px-2 py-1 rounded bg-[var(--bg-elevated)] text-[var(--text)] hover:bg-[var(--border)]"
                >
                  Select all
                </button>
                <button
                  type="button"
                  onClick={clearRandomizerSelection}
                  className="text-xs px-2 py-1 rounded bg-[var(--bg-elevated)] text-[var(--text-muted)] hover:bg-[var(--border)]"
                >
                  Clear
                </button>
              </div>
            </div>
            <ul className="max-h-48 overflow-auto rounded-lg border border-[var(--border)] divide-y divide-[var(--border)]">
              {eligibleForRandom.map((d) => (
                <li key={d.id} className="px-3 py-2 flex items-center gap-2 hover:bg-[var(--bg-elevated)]">
                  <input
                    type="checkbox"
                    id={`randomizer-${d.id}`}
                    checked={selectedForRandomizer.has(d.id)}
                    onChange={() => toggleInRandomizer(d.id)}
                    className="rounded border-[var(--border)]"
                  />
                  <label
                    htmlFor={`randomizer-${d.id}`}
                    className="flex-1 text-sm text-[var(--text)] cursor-pointer flex items-center gap-2"
                  >
                    <span>{getDelegationEmoji(d.country) || '🏳️'}</span>
                    {d.country} {d.name ? `— ${d.name}` : ''}
                  </label>
                </li>
              ))}
            </ul>
          </div>
        )}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={pickRandom}
            disabled={randomizerPool.length === 0}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--accent-soft)] text-[var(--accent)] text-sm font-medium hover:bg-[var(--accent-soft)]/80 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Shuffle className="w-4 h-4" /> Pick random
          </button>
          {pickedDelegateId && (() => {
            const d = delegates.find((x) => x.id === pickedDelegateId)
            if (!d) return null
            return (
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border)]">
                <span className="text-sm font-medium text-[var(--text)] flex items-center gap-2">
                  <span>{getDelegationEmoji(d.country) || '🏳️'}</span>
                  {d.country} {d.name ? `— ${d.name}` : ''}
                </span>
                <button
                  onClick={addPickedToSpeakers}
                  className="px-2 py-1 rounded-lg text-xs font-medium bg-[var(--accent)] text-white hover:opacity-90"
                >
                  Add to speakers
                </button>
              </div>
            )
          })()}
        </div>
        {eligibleForRandom.length === 0 && (
          <p className="text-xs text-[var(--text-muted)]">
            No eligible delegates. Add delegates and complete roll call to pick from present delegates.
          </p>
        )}
        {eligibleForRandom.length > 0 && randomizerMode === 'selected' && randomizerPool.length === 0 && (
          <p className="text-xs text-[var(--text-muted)]">
            Select at least one delegate above to enable random pick.
          </p>
        )}
      </div>
    </div>
  )
}
