import { useState, useEffect } from 'react'
import { useDelegate } from '../../context/DelegateContext'
import { Clock } from 'lucide-react'
import DateTimeFields from '../DateTimeFields'

type Diff = { days: number; hours: number; minutes: number; seconds: number } | null

export function useCountdown(isoDate: string): Diff {
  const [diff, setDiff] = useState<Diff>(null)
  useEffect(() => {
    if (!isoDate) {
      setDiff(null)
      return
    }
    const target = new Date(isoDate).getTime()
    const tick = () => {
      const now = Date.now()
      if (now >= target) {
        setDiff({ days: 0, hours: 0, minutes: 0, seconds: 0 })
        return
      }
      const s = Math.floor((target - now) / 1000)
      setDiff({
        days: Math.floor(s / 86400),
        hours: Math.floor((s % 86400) / 3600),
        minutes: Math.floor((s % 3600) / 60),
        seconds: s % 60,
      })
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [isoDate])
  return diff
}

function CountdownGrid({ diff, label }: { diff: NonNullable<Diff>; label: string }) {
  return (
    <>
      <div className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
        <Clock className="w-4 h-4 text-[var(--accent)]" />
        <span>{label}</span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="card-block p-4 text-center">
          <div className="text-2xl font-semibold text-[var(--accent)]">{diff.days}</div>
          <div className="text-xs text-[var(--text-muted)] mt-1">📅 Days</div>
        </div>
        <div className="card-block p-4 text-center">
          <div className="text-2xl font-semibold text-[var(--accent)]">{diff.hours}</div>
          <div className="text-xs text-[var(--text-muted)] mt-1">🕐 Hours</div>
        </div>
        <div className="card-block p-4 text-center">
          <div className="text-2xl font-semibold text-[var(--accent)]">{diff.minutes}</div>
          <div className="text-xs text-[var(--text-muted)] mt-1">⏱️ Minutes</div>
        </div>
        <div className="card-block p-4 text-center">
          <div className="text-2xl font-semibold text-[var(--accent)]">{diff.seconds}</div>
          <div className="text-xs text-[var(--text-muted)] mt-1">⏲️ Seconds</div>
        </div>
      </div>
    </>
  )
}

/** Compact countdown cards for use on the first delegate page (Country & Stance). */
export function CompactCountdownCards() {
  const { countdownDate, positionPaperDeadline } = useDelegate()
  const diff = useCountdown(countdownDate ?? '')
  const diffPaper = useCountdown(positionPaperDeadline ?? '')

  const formatShort = (d: NonNullable<Diff>) =>
    `${d.days}d ${d.hours}h ${d.minutes}m ${d.seconds}s`

  if (!diff && !diffPaper) {
    return (
      <p className="text-sm text-[var(--text-muted)] mb-4">
        Set conference start and/or position paper deadline below to see countdowns.
      </p>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
      {diff && (
        <div className="card-block p-3 flex items-center gap-3">
          <Clock className="w-5 h-5 text-[var(--accent)] flex-shrink-0" />
          <div>
            <div className="text-xs text-[var(--text-muted)]">Conference starts in</div>
            <div className="text-sm font-semibold text-[var(--accent)]">{formatShort(diff)}</div>
          </div>
        </div>
      )}
      {diffPaper && (
        <div className="card-block p-3 flex items-center gap-3">
          <Clock className="w-5 h-5 text-[var(--accent)] flex-shrink-0" />
          <div>
            <div className="text-xs text-[var(--text-muted)]">Position paper due in</div>
            <div className="text-sm font-semibold text-[var(--accent)]">{formatShort(diffPaper)}</div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function DelegateCountdown() {
  const {
    countdownDate,
    setCountdownDate,
    conferenceEndDate,
    setConferenceEndDate,
    positionPaperDeadline,
    setPositionPaperDeadline,
  } = useDelegate()
  const diff = useCountdown(countdownDate ?? '')
  const diffEnd = useCountdown(conferenceEndDate ?? '')
  const diffPaper = useCountdown(positionPaperDeadline ?? '')

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-semibold text-2xl text-[var(--text)] mb-1">⏱️ Conference & position paper countdown</h2>
        <p className="text-[var(--text-muted)] text-sm">Set conference start/end and position paper due date to see time remaining.</p>
      </div>

      <div className="card-block p-4 space-y-4">
        <DateTimeFields
          id="countdown-conference-start"
          label="Conference start (date & time)"
          value={countdownDate ?? ''}
          onChange={(iso) => setCountdownDate(iso)}
          dateInputClassName="max-w-[12rem]"
        />
        <DateTimeFields
          id="countdown-conference-end"
          label="Conference end (date & time)"
          value={conferenceEndDate ?? ''}
          onChange={(iso) => setConferenceEndDate(iso)}
          dateInputClassName="max-w-[12rem]"
        />
        {diff && <CountdownGrid diff={diff} label="⏳ Time until conference:" />}
        {diffEnd && <CountdownGrid diff={diffEnd} label="⏳ Time until conference ends:" />}
      </div>

      <div className="card-block p-4 space-y-4">
        <h3 className="font-medium text-lg text-[var(--text)]">📄 Position paper countdown</h3>
        <p className="text-[var(--text-muted)] text-sm">Set the position paper due date to see time remaining.</p>
        <DateTimeFields
          id="countdown-position-paper-deadline"
          label="Position paper due (date & time)"
          value={positionPaperDeadline ?? ''}
          onChange={(iso) => setPositionPaperDeadline(iso)}
          dateInputClassName="max-w-[12rem]"
        />
        {diffPaper && <CountdownGrid diff={diffPaper} label="⏳ Time until position paper due:" />}
      </div>
    </div>
  )
}
