import { useState, useEffect } from 'react'
import { useChair } from '../../context/ChairContext'
import type { SessionRecord } from '../../context/ChairContext'
import { Play, Square, Clock, Pause, Trash2, Pencil, Check, X } from 'lucide-react'

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  return `${m}:${String(s).padStart(2, '0')}`
}

function SessionEditForm({
  record,
  presets,
  onSave,
  onCancel,
}: {
  record: SessionRecord
  presets: string[]
  onSave: (patch: Partial<Pick<SessionRecord, 'name' | 'durationSeconds'>>) => void
  onCancel: () => void
}) {
  const [name, setName] = useState(record.name || '')
  const [durationMinutes, setDurationMinutes] = useState(String(Math.round(record.durationSeconds / 60)))

  const handleSave = () => {
    const mins = parseInt(durationMinutes, 10)
    const durationSeconds = Number.isNaN(mins) || mins < 1 ? record.durationSeconds : Math.min(999, Math.max(1, mins)) * 60
    onSave({ name: name.trim() || record.name, durationSeconds })
  }

  return (
    <div className="space-y-3 pt-1">
      <div>
        <span className="text-xs text-[var(--text-muted)] block mb-1">Name</span>
        <div className="flex flex-wrap gap-2 mb-2">
          {presets.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => setName(preset)}
              className={`px-2 py-1 rounded-lg text-xs font-medium transition-colors ${
                name === preset
                  ? 'bg-[var(--accent)] text-white'
                  : 'bg-[var(--bg-elevated)] text-[var(--text-muted)] hover:text-[var(--text)] border border-[var(--border)]'
              }`}
            >
              {preset}
            </button>
          ))}
        </div>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Opening remarks"
          className="w-full px-3 py-2 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text)] placeholder-[var(--text-muted)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
        />
      </div>
      <div>
        <span className="text-xs text-[var(--text-muted)] block mb-1">Duration (minutes)</span>
        <input
          type="number"
          min={1}
          max={999}
          value={durationMinutes}
          onChange={(e) => setDurationMinutes(e.target.value)}
          className="w-24 px-3 py-2 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
        />
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={handleSave}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--success)] text-white text-xs font-medium hover:opacity-90"
        >
          <Check className="w-3.5 h-3.5" /> Save
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--bg-elevated)] text-[var(--text-muted)] text-xs font-medium hover:text-[var(--text)] border border-[var(--border)]"
        >
          <X className="w-3.5 h-3.5" /> Cancel
        </button>
      </div>
    </div>
  )
}

export default function ChairSession() {
  const {
    sessionStarted,
    sessionStartTime,
    sessionDurationMinutes,
    sessionName,
    sessionPausedAt,
    sessionTotalPausedMs,
    sessionRecords,
    setSessionDurationMinutes,
    setSessionName,
    deleteSessionFromHistory,
    updateSessionInHistory,
    startSession,
    stopSession,
    pauseSession,
    resumeSession,
  } = useChair()
  const [, setTick] = useState(0)

  const rawElapsedMs = sessionStartTime && sessionStarted
    ? Date.now() - new Date(sessionStartTime).getTime()
    : 0
  const currentPauseMs = sessionPausedAt ? Date.now() - sessionPausedAt : 0
  const effectiveElapsedMs = rawElapsedMs - sessionTotalPausedMs - currentPauseMs
  const elapsedSeconds = Math.max(0, Math.floor(effectiveElapsedMs / 1000))

  const totalSeconds = sessionDurationMinutes != null ? sessionDurationMinutes * 60 : null
  const remainingSeconds = totalSeconds != null ? Math.max(0, totalSeconds - elapsedSeconds) : null
  const isOvertime = totalSeconds != null && elapsedSeconds > totalSeconds && sessionStarted

  useEffect(() => {
    if (!sessionStarted || !sessionStartTime) return
    const id = setInterval(() => setTick((t) => t + 1), 1000)
    return () => clearInterval(id)
  }, [sessionStarted, sessionStartTime])

  const [durationInput, setDurationInput] = useState(
    sessionDurationMinutes != null ? String(sessionDurationMinutes) : ''
  )
  useEffect(() => {
    setDurationInput(sessionDurationMinutes != null ? String(sessionDurationMinutes) : '')
  }, [sessionDurationMinutes])

  const [editingId, setEditingId] = useState<string | null>(null)
  const SESSION_PRESETS = ['Moderated caucus', 'Unmoderated caucus', 'Consultation']

  const commitDuration = () => {
    const n = parseInt(durationInput, 10)
    if (Number.isNaN(n) || n < 1) {
      setSessionDurationMinutes(null)
      setDurationInput('')
    } else {
      setSessionDurationMinutes(Math.min(999, Math.max(1, n)))
      setDurationInput(String(Math.min(999, Math.max(1, n))))
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-semibold text-2xl text-[var(--text)] mb-1">▶️ Committee Session</h2>
        <p className="text-[var(--text-muted)] text-sm">
          Start, pause, or stop the session. Name it and set a duration. All sessions are saved below.
        </p>
      </div>

      <div className="card-block p-6 space-y-4">
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-3">
              <span
                className={`w-3 h-3 rounded-md ${
                  sessionStarted
                    ? sessionPausedAt
                      ? 'bg-[var(--text-muted)]'
                      : 'bg-[var(--success)] animate-pulse'
                    : 'bg-[var(--text-muted)]'
                }`}
              />
              <span className="text-sm font-medium text-[var(--text)]">
                {sessionStarted
                  ? sessionPausedAt
                    ? '⏸ Session paused'
                    : '● Session in progress'
                  : '○ Session not started'}
              </span>
            </div>

            {sessionStarted && sessionStartTime && (
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-[var(--accent)]" />
                <span
                  className={`text-2xl font-mono font-semibold ${
                    isOvertime ? 'text-[var(--danger)]' : 'text-[var(--text)]'
                  }`}
                >
                  {sessionDurationMinutes == null
                    ? formatDuration(elapsedSeconds)
                    : remainingSeconds != null
                      ? formatDuration(remainingSeconds)
                      : '0:00'}
                </span>
                <span className="text-sm text-[var(--text-muted)]">
                  {sessionDurationMinutes == null
                    ? 'elapsed'
                    : isOvertime
                      ? 'overtime'
                      : 'remaining'}
                </span>
              </div>
            )}

            <div className="flex flex-wrap gap-2 sm:ml-auto">
              {!sessionStarted ? (
                <button
                  onClick={startSession}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--success)] text-white text-sm font-medium hover:opacity-90 transition-opacity"
                >
                  <Play className="w-4 h-4" /> ▶️ Start session
                </button>
              ) : (
                <>
                  {sessionPausedAt ? (
                    <button
                      onClick={resumeSession}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--success)] text-white text-sm font-medium hover:opacity-90 transition-opacity"
                    >
                      <Play className="w-4 h-4" /> Resume
                    </button>
                  ) : (
                    <button
                      onClick={pauseSession}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--bg-elevated)] text-[var(--text)] text-sm font-medium hover:bg-[var(--border)] transition-colors border border-[var(--border)]"
                    >
                      <Pause className="w-4 h-4" /> Pause
                    </button>
                  )}
                  <button
                    onClick={stopSession}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--danger)] text-white text-sm font-medium hover:opacity-90 transition-opacity"
                  >
                    <Square className="w-4 h-4" /> ⏹️ Stop
                  </button>
                </>
              )}
            </div>
          </div>

          {sessionStarted && (
            <div className="block">
              <span className="text-xs text-[var(--text-muted)] block mb-1">Session name</span>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                {SESSION_PRESETS.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setSessionName(preset)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      sessionName === preset
                        ? 'bg-[var(--accent)] text-white'
                        : 'bg-[var(--bg-elevated)] text-[var(--text-muted)] hover:text-[var(--text)] border border-[var(--border)]'
                    }`}
                  >
                    {preset}
                  </button>
                ))}
              </div>
              <input
                type="text"
                value={sessionName}
                onChange={(e) => setSessionName(e.target.value)}
                placeholder="e.g. Opening remarks, Committee session 1"
                className="w-full max-w-md px-3 py-2 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text)] placeholder-[var(--text-muted)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                aria-label="Session name"
              />
            </div>
          )}

          {!sessionStarted && (
            <div className="pt-4 border-t border-[var(--border)] space-y-4">
              <div>
                <span className="text-xs text-[var(--text-muted)] block mb-1">Session name (optional, set before starting)</span>
                <div className="flex flex-wrap gap-2 mb-2">
                  {SESSION_PRESETS.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setSessionName(preset)}
                      className={`px-2 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        sessionName === preset
                          ? 'bg-[var(--accent)] text-white'
                          : 'bg-[var(--bg-elevated)] text-[var(--text-muted)] hover:text-[var(--text)] border border-[var(--border)]'
                      }`}
                    >
                      {preset}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  value={sessionName}
                  onChange={(e) => setSessionName(e.target.value)}
                  placeholder="e.g. Opening Speeches, Committee session 1"
                  className="w-full max-w-md px-3 py-2 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text)] placeholder-[var(--text-muted)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                  aria-label="Session name"
                />
              </div>
              <div>
                <label className="text-xs text-[var(--text-muted)] block mb-1">Session timer</label>
                <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setSessionDurationMinutes(null)
                    setDurationInput('')
                  }}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    sessionDurationMinutes == null
                      ? 'bg-[var(--accent)] text-white'
                      : 'bg-[var(--bg-elevated)] text-[var(--text-muted)] hover:text-[var(--text)]'
                  }`}
                >
                  Unlimited (counts up)
                </button>
                <span className="text-[var(--text-muted)]">or</span>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={1}
                    max={999}
                    placeholder="Minutes"
                    value={durationInput}
                    onChange={(e) => setDurationInput(e.target.value)}
                    onBlur={commitDuration}
                    onKeyDown={(e) => e.key === 'Enter' && (e.target as HTMLInputElement).blur()}
                    className="w-20 px-3 py-1.5 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                    aria-label="Session duration in minutes"
                  />
                  <span className="text-sm text-[var(--text-muted)]">minutes (countdown)</span>
                </div>
              </div>
            </div>
          )}

          {sessionStartTime && (
            <p className="text-xs text-[var(--text-muted)]">
              Started: {new Date(sessionStartTime).toLocaleString()}
            </p>
          )}
        </div>
      </div>

      <div className="card-block overflow-hidden">
        <div className="px-4 py-3 border-b border-[var(--border)]">
          <h3 className="text-sm font-medium text-[var(--text)]">📋 Session history</h3>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">Click Edit to change name or duration, or Delete to remove.</p>
        </div>
        {(!sessionRecords || sessionRecords.length === 0) ? (
          <div className="px-4 py-8 text-center text-[var(--text-muted)] text-sm">
            No sessions yet. Start a session above; each time you stop, it will be saved here.
          </div>
        ) : (
          <ul className="divide-y divide-[var(--border)] max-h-80 overflow-auto">
            {[...sessionRecords].reverse().map((r) => (
              <li key={r.id} className="px-4 py-3">
                {editingId === r.id ? (
                  <SessionEditForm
                    record={r}
                    presets={SESSION_PRESETS}
                    onSave={(patch) => {
                      updateSessionInHistory(r.id, patch)
                      setEditingId(null)
                    }}
                    onCancel={() => setEditingId(null)}
                  />
                ) : (
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-wrap items-start justify-between gap-2 min-w-0">
                      <div className="min-w-0">
                        <p className="font-medium text-[var(--text)]">{r.name || 'Unnamed session'}</p>
                        <p className="text-xs text-[var(--text-muted)]">
                          {new Date(r.startTime).toLocaleString()} — {formatDuration(r.durationSeconds)}
                        </p>
                      </div>
                      <span className="text-xs text-[var(--text-muted)] shrink-0">{formatDuration(r.durationSeconds)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setEditingId(r.id)}
                        className="flex items-center gap-1 px-3 py-2 rounded-lg text-[var(--accent)] hover:bg-[var(--accent)]/10 border border-[var(--accent)]/40 transition-colors text-sm font-medium"
                        title="Edit session"
                        aria-label={`Edit ${r.name || 'Unnamed session'}`}
                      >
                        <Pencil className="w-4 h-4" />
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteSessionFromHistory(r.id)}
                        className="flex items-center gap-1 px-3 py-2 rounded-lg text-[var(--danger)] hover:bg-[var(--danger)]/10 border border-[var(--danger)]/40 transition-colors text-sm font-medium"
                        title="Delete session"
                        aria-label={`Delete ${r.name || 'Unnamed session'}`}
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
