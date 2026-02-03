import { useState, useEffect } from 'react'
import { useChair } from '../../context/ChairContext'
import { Plus, Trash2, Mic, Clock } from 'lucide-react'

export default function ChairSpeakers() {
  const {
    delegates,
    speakers,
    activeSpeaker,
    speakerDuration,
    setSpeakerDuration,
    addToSpeakers,
    removeFromSpeakers,
    setActiveSpeaker,
    getDelegationEmoji,
  } = useChair()
  const [selectedDelegate, setSelectedDelegate] = useState('')
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    if (!activeSpeaker?.startTime) return
    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - activeSpeaker.startTime!) / 1000))
    }, 1000)
    return () => clearInterval(interval)
  }, [activeSpeaker?.startTime, activeSpeaker?.id])

  const addSpeaker = () => {
    const d = delegates.find((x) => x.id === selectedDelegate)
    if (!d) return
    addToSpeakers(d.id, d.country, d.name || d.country)
    setSelectedDelegate('')
  }

  const remaining = activeSpeaker ? Math.max(0, speakerDuration - elapsed) : 0

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-semibold text-2xl text-[var(--text)] mb-1">🎤 Speakers</h2>
        <p className="text-[var(--text-muted)] text-sm">Mod Speakers List, Active Speaker (Timed), Consultation Speakers.</p>
      </div>

      <div className="rounded-xl border-2 border-[var(--accent)]/50 bg-[var(--accent-soft)]/30 p-4">
          <h3 className="text-sm font-medium text-[var(--accent)] mb-2 flex items-center gap-2">
          <Mic className="w-4 h-4" /> ● Active speaker
        </h3>
        {activeSpeaker ? (
          <div className="flex flex-wrap items-center gap-4">
            <span className="text-lg font-semibold text-[var(--text)] flex items-center gap-2">
              <span>{getDelegationEmoji(activeSpeaker.country) || '🏳️'}</span>
              {activeSpeaker.country} — {activeSpeaker.name}
            </span>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-[var(--text-muted)]" />
              <span className={remaining === 0 ? 'text-[var(--danger)]' : 'text-[var(--text)]'}>
                {Math.floor(remaining / 60)}:{String(remaining % 60).padStart(2, '0')} remaining
              </span>
            </div>
            <button
              onClick={() => setActiveSpeaker(null)}
              className="px-3 py-1.5 rounded-lg bg-[var(--bg-card)] text-sm text-[var(--text)] hover:bg-[var(--border)]"
            >
              End speech
            </button>
          </div>
        ) : (
          <p className="text-sm text-[var(--text-muted)]">No active speaker. Start one from the list below.</p>
        )}
      </div>

      <div className="card-block p-4 space-y-3">
        <h3 className="text-sm font-medium text-[var(--text)]">⏱️ Speaker duration (seconds)</h3>
        <input
          type="number"
          min={30}
          max={300}
          value={speakerDuration}
          onChange={(e) => setSpeakerDuration(Number(e.target.value) || 60)}
          className="w-24 px-3 py-2 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
        />
      </div>

      <div className="card-block p-4 space-y-3">
        <h3 className="text-sm font-medium text-[var(--text)]">➕ Add to speakers list</h3>
        <div className="flex flex-wrap gap-2">
          <select
            value={selectedDelegate}
            onChange={(e) => setSelectedDelegate(e.target.value)}
            className="px-3 py-2 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
          >
            <option value="">Select delegate</option>
            {[...delegates].sort((a, b) => a.country.localeCompare(b.country, undefined, { sensitivity: 'base' })).map((d) => (
              <option key={d.id} value={d.id}>
                {d.country} {d.name ? `— ${d.name}` : ''}
              </option>
            ))}
          </select>
          <button
            onClick={addSpeaker}
            disabled={!selectedDelegate}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--accent)] text-white text-sm font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-4 h-4" /> Add
          </button>
        </div>
      </div>

      <div className="card-block overflow-hidden">
        <div className="px-4 py-3 border-b border-[var(--border)]">
          <h3 className="text-sm font-medium text-[var(--text)]">📋 Mod speakers list</h3>
        </div>
        <ul className="divide-y divide-[var(--border)] max-h-80 overflow-auto">
          {speakers.map((s, i) => (
            <li key={s.id} className="px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-xs text-[var(--text-muted)] w-6">{i + 1}.</span>
                <span className="text-sm text-[var(--text)] flex items-center gap-2">
                  <span className="shrink-0">{getDelegationEmoji(s.country) || '🏳️'}</span>
                  <strong className="text-[var(--accent)]">{s.country}</strong> — {s.name}
                </span>
                {s.speaking && (
                  <span className="px-2 py-0.5 rounded bg-[var(--accent-soft)] text-[var(--accent)] text-xs font-medium">
                    Speaking
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {!s.speaking && (
                  <button
                    onClick={() => setActiveSpeaker(s)}
                    className="px-2 py-1 rounded-lg bg-[var(--accent)] text-white text-xs font-medium hover:opacity-90"
                  >
                    Start
                  </button>
                )}
                <button
                  onClick={() => removeFromSpeakers(s.id)}
                  className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--danger)] hover:bg-[var(--bg-elevated)]"
                  title="Remove"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
