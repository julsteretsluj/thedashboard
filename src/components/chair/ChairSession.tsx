import { useState, useEffect } from 'react'
import { useChair } from '../../context/ChairContext'
import { Play, Square, Clock } from 'lucide-react'

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  return `${m}:${String(s).padStart(2, '0')}`
}

export default function ChairSession() {
  const {
    sessionStarted,
    sessionStartTime,
    sessionDurationMinutes,
    setSessionDurationMinutes,
    startSession,
    stopSession,
  } = useChair()
  const [, setTick] = useState(0)

  const elapsedSeconds =
    sessionStartTime && sessionStarted
      ? Math.max(0, Math.floor((Date.now() - new Date(sessionStartTime).getTime()) / 1000))
      : 0
  const totalSeconds =
    sessionDurationMinutes != null ? sessionDurationMinutes * 60 : null
  const remainingSeconds =
    totalSeconds != null ? Math.max(0, totalSeconds - elapsedSeconds) : null
  const isOvertime =
    totalSeconds != null && elapsedSeconds > totalSeconds && sessionStarted

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
        <p className="text-[var(--text-muted)] text-sm">Start or stop the committee session. Set a duration or run unlimited (counts up).</p>
      </div>

      <div className="card-block p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <span
              className={`w-3 h-3 rounded-md ${sessionStarted ? 'bg-[var(--success)] animate-pulse' : 'bg-[var(--text-muted)]'}`}
            />
            <span className="text-sm font-medium text-[var(--text)]">
              {sessionStarted ? '● Session in progress' : '○ Session not started'}
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
                {sessionDurationMinutes == null ? (
                  formatDuration(elapsedSeconds)
                ) : remainingSeconds != null ? (
                  formatDuration(remainingSeconds)
                ) : (
                  '0:00'
                )}
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

          <div className="flex gap-3 sm:ml-auto">
            {!sessionStarted ? (
              <button
                onClick={startSession}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--success)] text-white text-sm font-medium hover:opacity-90 transition-opacity"
              >
                <Play className="w-4 h-4" /> ▶️ Start session
              </button>
            ) : (
              <button
                onClick={stopSession}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--danger)] text-white text-sm font-medium hover:opacity-90 transition-opacity"
              >
                <Square className="w-4 h-4" /> ⏹️ Stop session
              </button>
            )}
          </div>
        </div>

        {!sessionStarted && (
          <div className="pt-4 border-t border-[var(--border)] space-y-2">
            <label className="text-xs text-[var(--text-muted)] block">Session timer</label>
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
  )
}
