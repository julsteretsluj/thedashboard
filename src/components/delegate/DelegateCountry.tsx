import { useState, useEffect } from 'react'
import { useDelegate } from '../../context/DelegateContext'
import InfoPopover from '../InfoPopover'
import { CompactCountdownCards } from './DelegateCountdown'

const DURATION_DAYS_MIN = 0
const DURATION_DAYS_MAX = 31

export default function DelegateCountry() {
  const {
    name: conferenceName,
    country,
    delegateEmail,
    stanceOverview,
    countdownDate,
    conferenceEndDate,
    positionPaperDeadline,
    setName: setConferenceName,
    setCountry,
    setDelegateEmail,
    setStanceOverview,
    setCountdownDate,
    setConferenceEndDate,
    setPositionPaperDeadline,
  } = useDelegate()

  const durationDays =
    countdownDate && conferenceEndDate
      ? Math.round((new Date(conferenceEndDate).getTime() - new Date(countdownDate).getTime()) / 86400000)
      : 0

  const [durationInput, setDurationInput] = useState<string>(durationDays ? String(durationDays) : '')

  useEffect(() => {
    setDurationInput(durationDays ? String(durationDays) : '')
  }, [durationDays])

  const applyDurationDays = () => {
    const n = parseInt(durationInput, 10)
    if (Number.isNaN(n) || n < DURATION_DAYS_MIN) {
      setDurationInput(durationDays ? String(durationDays) : '')
      return
    }
    const days = Math.min(n, DURATION_DAYS_MAX)
    if (days <= 0) {
      setConferenceEndDate('')
      setDurationInput('')
      return
    }
    if (!countdownDate) {
      setDurationInput(durationDays ? String(durationDays) : '')
      return
    }
    const start = new Date(countdownDate)
    const end = new Date(start)
    end.setDate(end.getDate() + days)
    setConferenceEndDate(end.toISOString())
    setDurationInput(String(days))
  }

  return (
    <div className="space-y-6">
      <CompactCountdownCards />

      <div className="card-block p-4 space-y-4 border-2 border-[var(--accent)]/30">
        <h3 className="font-semibold text-lg text-[var(--text)] flex items-center gap-1.5">
          📅 Conference & position paper dates
        </h3>
        <p className="text-sm text-[var(--text-muted)]">
          Add dates when registering your stance. Countdowns will appear here and in the ⏱️ Conference & position paper countdown section.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <label className="block" htmlFor="stance-conference-start">
            <span className="text-xs text-[var(--text-muted)] block mb-1">Conference start (date & time)</span>
            <input
              id="stance-conference-start"
              name="conference-start"
              type="datetime-local"
              value={countdownDate ? countdownDate.slice(0, 16) : ''}
              onChange={(e) => setCountdownDate(e.target.value ? new Date(e.target.value).toISOString() : '')}
              className="w-full px-3 py-2 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            />
          </label>
          <label className="block" htmlFor="stance-conference-end">
            <span className="text-xs text-[var(--text-muted)] block mb-1">Conference end (date & time)</span>
            <input
              id="stance-conference-end"
              name="conference-end"
              type="datetime-local"
              value={conferenceEndDate ? conferenceEndDate.slice(0, 16) : ''}
              onChange={(e) => setConferenceEndDate(e.target.value ? new Date(e.target.value).toISOString() : '')}
              className="w-full px-3 py-2 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            />
          </label>
        </div>
        <label className="block" htmlFor="stance-conference-duration">
          <span className="text-xs text-[var(--text-muted)] block mb-1">Duration (days) — sets end from start</span>
          <input
            id="stance-conference-duration"
            name="conference-duration-days"
            type="number"
            min={DURATION_DAYS_MIN}
            max={DURATION_DAYS_MAX}
            value={durationInput}
            onChange={(e) => setDurationInput(e.target.value)}
            onBlur={applyDurationDays}
            onKeyDown={(e) => e.key === 'Enter' && (e.target as HTMLInputElement).blur()}
            placeholder="e.g. 2"
            className="w-24 px-3 py-2 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            aria-label="Conference duration in days"
          />
          <span className="text-xs text-[var(--text-muted)] block mt-1">
            Set conference start first. Change applies when you leave the field.
          </span>
        </label>
        <label className="block" htmlFor="stance-position-paper-deadline">
          <span className="text-xs text-[var(--text-muted)] block mb-1">Position paper deadline (date & time)</span>
          <input
            id="stance-position-paper-deadline"
            name="position-paper-deadline"
            type="datetime-local"
            value={positionPaperDeadline ? positionPaperDeadline.slice(0, 16) : ''}
            onChange={(e) =>
              setPositionPaperDeadline(e.target.value ? new Date(e.target.value).toISOString() : '')
            }
            className="w-full max-w-sm px-3 py-2 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
          />
        </label>
      </div>

      <div className="flex items-start gap-2">
        <div>
          <h2 className="font-semibold text-2xl text-[var(--text)] mb-1 flex items-center gap-1.5">
            🌍 Country Assignment
            <InfoPopover title="Country & Stance">
              Enter your conference name, country assignment, optional email (e.g. for chair contact), and a brief stance overview. This is your main profile for this conference.
            </InfoPopover>
          </h2>
          <p className="text-[var(--text-muted)] text-sm">Your country and brief stance overview for this conference.</p>
        </div>
      </div>
      <div className="card-block p-4 space-y-4">
        <label className="block" htmlFor="stance-conference-name">
          <span className="text-xs text-[var(--text-muted)] block mb-1">Conference name</span>
          <input
            id="stance-conference-name"
            name="conference-name"
            type="text"
            value={conferenceName}
            onChange={(e) => setConferenceName(e.target.value)}
            placeholder="e.g. NMUN 2025"
            className="w-full px-3 py-2 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text)] placeholder-[var(--text-muted)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
          />
        </label>
        <label className="block" htmlFor="stance-country">
          <span className="text-xs text-[var(--text-muted)] block mb-1">Country</span>
          <input
            id="stance-country"
            name="country"
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            placeholder="e.g. France, United Kingdom"
            className="w-full px-3 py-2 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text)] placeholder-[var(--text-muted)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
          />
        </label>
        <label className="block" htmlFor="stance-delegate-email">
          <span className="text-xs text-[var(--text-muted)] block mb-1">Your email (optional)</span>
          <input
            id="stance-delegate-email"
            name="delegate-email"
            type="email"
            value={delegateEmail}
            onChange={(e) => setDelegateEmail(e.target.value)}
            placeholder="e.g. you@example.com"
            className="w-full px-3 py-2 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text)] placeholder-[var(--text-muted)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            aria-label="Your email"
          />
        </label>
        <label className="block" htmlFor="stance-overview">
          <span className="text-xs text-[var(--text-muted)] block mb-1">Brief stance overview</span>
          <textarea
            id="stance-overview"
            name="stance-overview"
            value={stanceOverview}
            onChange={(e) => setStanceOverview(e.target.value)}
            placeholder="Summarize your country's position on the committee topic(s)..."
            rows={5}
            className="w-full px-3 py-2 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text)] placeholder-[var(--text-muted)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)] resize-none"
          />
        </label>
      </div>
    </div>
  )
}
