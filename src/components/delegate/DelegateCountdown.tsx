import { useState, useEffect } from 'react'
import { useDelegate } from '../../context/DelegateContext'
import { Clock } from 'lucide-react'

type Diff = { days: number; hours: number; minutes: number; seconds: number } | null

function useCountdown(isoDate: string): Diff {
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

export default function DelegateCountdown() {
  const {
    countdownDate,
    setCountdownDate,
    positionPaperDeadline,
    setPositionPaperDeadline,
  } = useDelegate()
  const diff = useCountdown(countdownDate ?? '')
  const diffPaper = useCountdown(positionPaperDeadline ?? '')

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-semibold text-2xl text-[var(--text)] mb-1">⏱️ Conference Countdown</h2>
        <p className="text-[var(--text-muted)] text-sm">Set the conference start date and see time remaining.</p>
      </div>
      <div className="card-block p-4 space-y-4">
        <label className="block">
          <span className="text-xs text-[var(--text-muted)] block mb-1">Conference start (date & time)</span>
          <input
            type="datetime-local"
            value={countdownDate ? countdownDate.slice(0, 16) : ''}
            onChange={(e) => setCountdownDate(e.target.value ? new Date(e.target.value).toISOString() : '')}
            className="w-full max-w-xs px-3 py-2 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
          />
        </label>
        {diff && <CountdownGrid diff={diff} label="⏳ Time until conference:" />}
      </div>

      <div>
        <h2 className="font-semibold text-2xl text-[var(--text)] mb-1">📄 Position Paper Deadline</h2>
        <p className="text-[var(--text-muted)] text-sm">Set the position paper due date and see time remaining.</p>
      </div>
      <div className="card-block p-4 space-y-4">
        <label className="block">
          <span className="text-xs text-[var(--text-muted)] block mb-1">Position paper due (date & time)</span>
          <input
            type="datetime-local"
            value={positionPaperDeadline ? positionPaperDeadline.slice(0, 16) : ''}
            onChange={(e) =>
              setPositionPaperDeadline(e.target.value ? new Date(e.target.value).toISOString() : '')
            }
            className="w-full max-w-xs px-3 py-2 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
          />
        </label>
        {diffPaper && <CountdownGrid diff={diffPaper} label="⏳ Time until position paper due:" />}
      </div>
    </div>
  )
}
