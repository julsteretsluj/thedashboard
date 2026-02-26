import { useState, useEffect } from 'react'
import { useChair } from '../../context/ChairContext'
import { Play, Pause, Square, Clock } from 'lucide-react'

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  return `${m}:${String(s).padStart(2, '0')}`
}

/**
 * Bar showing active session timer. Visible on all chair pages when session is running.
 */
export default function ActiveSessionBar({ onSessionClick }: { onSessionClick?: () => void }) {
  const {
    sessionStarted,
    sessionStartTime,
    sessionDurationMinutes,
    sessionName,
    sessionPausedAt,
    sessionTotalPausedMs,
    pauseSession,
    resumeSession,
    stopSession,
  } = useChair()

  const [, setTick] = useState(0)

  const rawElapsedMs =
    sessionStartTime && sessionStarted ? Date.now() - new Date(sessionStartTime).getTime() : 0
  const currentPauseMs = sessionPausedAt ? Date.now() - sessionPausedAt : 0
  const effectiveElapsedMs = rawElapsedMs - sessionTotalPausedMs - currentPauseMs
  const elapsedSeconds = Math.max(0, Math.floor(effectiveElapsedMs / 1000))
  const totalSeconds = sessionDurationMinutes != null ? sessionDurationMinutes * 60 : null
  const remainingSeconds = totalSeconds != null ? Math.max(0, totalSeconds - elapsedSeconds) : null
  const isPaused = !!sessionPausedAt

  useEffect(() => {
    if (!sessionStarted) return
    const id = setInterval(() => setTick((t) => t + 1), 1000)
    return () => clearInterval(id)
  }, [sessionStarted, sessionPausedAt])

  if (!sessionStarted) return null

  return (
    <div
      role={onSessionClick ? 'button' : undefined}
      onClick={onSessionClick}
      className={`mb-3 flex items-center gap-2 rounded-lg border-2 border-[var(--brand)]/50 bg-[var(--brand-soft)]/30 px-3 py-2 ${
        onSessionClick ? 'cursor-pointer hover:bg-[var(--brand-soft)]/50' : ''
      }`}
    >
      <Clock className="w-4 h-4 shrink-0 text-[var(--brand)]" />
      <span className="font-medium text-[var(--text)] truncate">
        {sessionName || 'Session'} {isPaused && '(paused)'}
      </span>
      <div
        className={`flex items-center gap-1 shrink-0 ${
          remainingSeconds !== null && remainingSeconds <= 0 ? 'text-[var(--danger)] font-medium' : 'text-[var(--text-muted)]'
        }`}
      >
        <span>{formatDuration(elapsedSeconds)}</span>
        {remainingSeconds !== null && (
          <span className="text-xs">
            {remainingSeconds <= 0 ? ' — time up' : ` / ${formatDuration(remainingSeconds)} left`}
          </span>
        )}
      </div>
      <div className="ml-auto shrink-0 flex items-center gap-1">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            isPaused ? resumeSession() : pauseSession()
          }}
          className="px-2 py-1 rounded text-xs font-medium bg-[var(--bg-card)] text-[var(--text)] hover:bg-[var(--border)]"
        >
          {isPaused ? (
            <>
              <Play className="w-3 h-3 inline mr-0.5" />
              Resume
            </>
          ) : (
            <>
              <Pause className="w-3 h-3 inline mr-0.5" />
              Pause
            </>
          )}
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            stopSession()
          }}
          className="px-2 py-1 rounded text-xs font-medium bg-[var(--bg-card)] text-[var(--text)] hover:bg-[var(--danger)]/20 text-[var(--danger)]"
        >
          <Square className="w-3 h-3 inline mr-0.5" />
          End session
        </button>
      </div>
    </div>
  )
}
