import { useState, useEffect, useRef } from 'react'
import { useChair } from '../../context/ChairContext'
import { Plus, Trash2, Mic, Clock } from 'lucide-react'

const DURATION_MIN = 30
const DURATION_MAX = 300

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
  const [durationInput, setDurationInput] = useState<string>(String(speakerDuration))
  const startTimeRef = useRef<number | null>(null)

  let startTime: number | null = null
  const raw =
    activeSpeaker?.startTime != null && typeof activeSpeaker.startTime === 'number'
      ? activeSpeaker.startTime
      : speakers.find((s) => s.speaking && s.startTime != null)?.startTime ?? null
  if (raw != null) {
    startTime = raw < 1e12 ? raw * 1000 : raw
  }

  const effectiveDuration = Math.max(speakerDuration || 0, DURATION_MIN)
  const speakerTime = activeSpeaker
    ? Math.max(activeSpeaker.duration || speakerDuration || 0, DURATION_MIN)
    : effectiveDuration

  useEffect(() => {
    setElapsed(0)
  }, [activeSpeaker?.id])

  useEffect(() => {
    if (startTime == null) {
      startTimeRef.current = null
      setElapsed(0)
      return
    }
    startTimeRef.current = startTime
    const update = () => {
      const start = startTimeRef.current
      if (start == null) return
      const secs = Math.floor((Date.now() - start) / 1000)
      setElapsed(Math.max(0, secs))
    }
    update()
    const id = setInterval(update, 1000)
    return () => clearInterval(id)
  }, [startTime, activeSpeaker?.id])

  useEffect(() => {
    setDurationInput(String(speakerDuration))
  }, [speakerDuration])

  const commitDuration = () => {
    const n = parseInt(durationInput, 10)
    if (!Number.isNaN(n) && n >= DURATION_MIN && n <= DURATION_MAX) {
      setSpeakerDuration(n)
      setDurationInput(String(n))
    } else {
      setDurationInput(String(speakerDuration))
    }
  }

  const addSpeaker = () => {
    const d = delegates.find((x) => x.id === selectedDelegate)
    if (!d) return
    addToSpeakers(d.id, d.country, d.name || d.country)
    setSelectedDelegate('')
  }

  const remaining = activeSpeaker ? speakerTime - elapsed : 0
  const isOvertime = remaining <= 0 && activeSpeaker != null
  const displaySeconds = Math.max(0, Math.floor(isOvertime ? -remaining : remaining)) || 0

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-semibold text-2xl text-[var(--text)] mb-1">🎤 Speakers</h2>
        <p className="text-[var(--text-muted)] text-sm">Mod Speakers List, Active Speaker (Timed), Consultation Speakers.</p>
      </div>

      <div className="accent-highlight-wave rounded-xl border-2 border-[var(--accent)]/50 bg-[var(--accent-soft)]/30 p-4">
          <h3 className="text-sm font-medium text-[var(--accent)] mb-2 flex items-center gap-2">
          <Mic className="w-4 h-4" /> ● Active speaker
        </h3>
        {activeSpeaker ? (
          <div className="flex flex-wrap items-center gap-4">
            <span className="text-lg font-semibold text-[var(--text)] flex items-center gap-2">
              <span>{getDelegationEmoji(activeSpeaker.country) || '🏳️'}</span>
              {activeSpeaker.country} — {activeSpeaker.name}
            </span>
            <div className={`flex items-center gap-2 text-sm rounded-lg px-2 py-1 ${isOvertime ? 'bg-[var(--danger)]/10 text-[var(--danger)] font-medium' : 'text-[var(--text)]'}`}>
              <Clock className="w-4 h-4 shrink-0" />
              <span>
                {Math.floor(displaySeconds / 60)}:{String(displaySeconds % 60).padStart(2, '0')}
                {isOvertime ? ' overtime' : ' remaining'}
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
          min={DURATION_MIN}
          max={DURATION_MAX}
          value={durationInput}
          onChange={(e) => setDurationInput(e.target.value)}
          onBlur={commitDuration}
          onKeyDown={(e) => e.key === 'Enter' && (e.target as HTMLInputElement).blur()}
          className="w-24 px-3 py-2 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
          aria-label="Speaker duration in seconds"
        />
        <p className="text-xs text-[var(--text-muted)]">Between {DURATION_MIN} and {DURATION_MAX} seconds. Change takes effect when you leave the field.</p>
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
