import { useState, useEffect, useRef } from 'react'
import { useChair } from '../../context/ChairContext'
import { Clock, Mic, Trash2 } from 'lucide-react'

const DURATION_MIN = 30
const OVERTIME_CONCERN_THRESHOLD = 10 // seconds overtime before auto-adding a concern

/**
 * Always-mounted bar showing active speaker + timer.
 * Keeps the timer running when the user is on other sections.
 * Notes a concern when delegate speaks 10+ seconds overtime.
 */
export default function ActiveSpeakerBar({
  onSpeakersClick,
  compact = false,
}: {
  onSpeakersClick?: () => void
  compact?: boolean
}) {
  const {
    activeSpeaker,
    speakers,
    speakerDuration,
    setActiveSpeaker,
    removeFromSpeakers,
    getDelegationEmoji,
    addDelegateFeedback,
  } = useChair()
  const overtimeNotedRef = useRef<string | null>(null)

  const [, setTick] = useState(0)

  let startTime: number | null = null
  const raw =
    activeSpeaker?.startTime != null && typeof activeSpeaker.startTime === 'number'
      ? activeSpeaker.startTime
      : speakers.find((s) => s.speaking && s.startTime != null)?.startTime ?? null
  if (raw != null) {
    startTime = raw < 1e12 ? raw * 1000 : raw
  }

  const elapsed =
    startTime != null ? Math.max(0, Math.floor((Date.now() - startTime) / 1000)) : 0
  const speakerTime = activeSpeaker
    ? Math.max(activeSpeaker.duration || speakerDuration || 0, DURATION_MIN)
    : DURATION_MIN
  const remaining = activeSpeaker ? speakerTime - elapsed : 0
  const isOvertime = remaining <= 0 && activeSpeaker != null
  const overtimeSeconds = isOvertime ? Math.floor(-remaining) : 0
  const displaySeconds = Math.max(0, Math.floor(isOvertime ? -remaining : remaining)) || 0
  const displayStr = `${Math.floor(displaySeconds / 60)}:${String(displaySeconds % 60).padStart(2, '0')} ${isOvertime ? 'overtime' : 'remaining'}`

  const speechKey = activeSpeaker && startTime != null ? `${activeSpeaker.delegateId}-${startTime}` : null
  useEffect(() => {
    if (
      activeSpeaker &&
      speechKey &&
      overtimeSeconds >= OVERTIME_CONCERN_THRESHOLD &&
      overtimeNotedRef.current !== speechKey
    ) {
      overtimeNotedRef.current = speechKey
      addDelegateFeedback(
        activeSpeaker.delegateId,
        'concern',
        `Spoke ${overtimeSeconds}+ seconds overtime`
      )
    }
    if (!activeSpeaker) overtimeNotedRef.current = null
  }, [speechKey, activeSpeaker, overtimeSeconds, addDelegateFeedback])

  useEffect(() => {
    if (startTime == null) return
    const id = setInterval(() => setTick((t) => t + 1), 1000)
    return () => clearInterval(id)
  }, [startTime, activeSpeaker?.id])

  useEffect(() => {
    if (startTime == null) return
    const refresh = () => setTick((t) => t + 1)
    const onVisible = () => {
      if (document.visibilityState === 'visible') requestAnimationFrame(refresh)
    }
    const onFocus = () => requestAnimationFrame(refresh)
    document.addEventListener('visibilitychange', onVisible)
    window.addEventListener('focus', onFocus)
    return () => {
      document.removeEventListener('visibilitychange', onVisible)
      window.removeEventListener('focus', onFocus)
    }
  }, [startTime, activeSpeaker?.id])

  if (!activeSpeaker) return null

  return (
    <div
      role={onSpeakersClick ? 'button' : undefined}
      onClick={onSpeakersClick}
      className={`mb-3 flex items-center gap-2 rounded-lg border-2 border-[var(--accent)]/50 bg-[var(--accent-soft)]/30 px-3 py-2 ${
        onSpeakersClick ? 'cursor-pointer hover:bg-[var(--accent-soft)]/50' : ''
      } ${compact ? 'text-sm' : ''}`}
    >
      <Mic className="w-4 h-4 shrink-0 text-[var(--accent)]" />
      <span className="shrink-0" title={activeSpeaker.country}>
        {getDelegationEmoji(activeSpeaker.country) || '🏳️'}
      </span>
      <span className="font-medium text-[var(--text)] truncate">
        {activeSpeaker.country} — {activeSpeaker.name}
      </span>
      <div
        className={`flex items-center gap-1 shrink-0 ${isOvertime ? 'text-[var(--danger)] font-medium' : 'text-[var(--text-muted)]'}`}
      >
        <Clock className="w-3.5 h-3.5" />
        <span>{displayStr}</span>
      </div>
      <div className="ml-auto shrink-0 flex items-center gap-1">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            setActiveSpeaker(null)
          }}
          className="px-2 py-1 rounded text-xs font-medium bg-[var(--bg-card)] text-[var(--text)] hover:bg-[var(--border)]"
        >
          End speech
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            if (activeSpeaker) removeFromSpeakers(activeSpeaker.id)
            setActiveSpeaker(null)
          }}
          className="p-1 rounded text-[var(--text-muted)] hover:text-[var(--danger)] hover:bg-[var(--danger)]/10"
          title="End speech and remove from list"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  )
}
