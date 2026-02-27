/**
 * Date and time as separate inputs: date picker + time dropdown (15-min steps).
 * Value is stored as ISO string; displayed in local date/time.
 */
const TIME_OPTIONS: string[] = []
for (let h = 0; h < 24; h++) {
  for (let m = 0; m < 60; m += 15) {
    TIME_OPTIONS.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`)
  }
}

function isoToDatePart(iso: string): string {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  const y = d.getFullYear()
  const mo = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${mo}-${day}`
}

function isoToTimePart(iso: string): string {
  if (!iso) return '09:00'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return '09:00'
  const h = d.getHours()
  const m = d.getMinutes()
  const rounded = Math.round(m / 15) * 15
  const hour = rounded === 60 ? h + 1 : h
  const min = rounded === 60 ? 0 : rounded
  return `${String(hour % 24).padStart(2, '0')}:${String(min).padStart(2, '0')}`
}

function toISO(datePart: string, timePart: string): string {
  if (!datePart) return ''
  const [hh, mm] = (timePart || '09:00').split(':').map(Number)
  const d = new Date(datePart + 'T' + String(hh).padStart(2, '0') + ':' + String(mm).padStart(2, '0') + ':00')
  return Number.isNaN(d.getTime()) ? '' : d.toISOString()
}

export interface DateTimeFieldsProps {
  id: string
  label: string
  value: string
  onChange: (isoString: string) => void
  className?: string
  dateInputClassName?: string
  timeSelectClassName?: string
}

export default function DateTimeFields({
  id,
  label,
  value,
  onChange,
  className = '',
  dateInputClassName = '',
  timeSelectClassName = '',
}: DateTimeFieldsProps) {
  const datePart = isoToDatePart(value)
  const timePart = isoToTimePart(value)
  const effectiveTime = TIME_OPTIONS.includes(timePart) ? timePart : '09:00'

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextDate = e.target.value || ''
    onChange(nextDate ? toISO(nextDate, effectiveTime) : '')
  }

  const handleTimeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nextTime = e.target.value
    onChange(datePart ? toISO(datePart, nextTime) : '')
  }

  return (
    <label className={`block ${className}`} htmlFor={id}>
      <span className="text-xs text-[var(--text-muted)] block mb-1">{label}</span>
      <div className="flex flex-wrap items-center gap-2">
        <input
          id={id}
          name={id}
          type="date"
          value={datePart}
          onChange={handleDateChange}
          className={`px-3 py-2 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)] ${dateInputClassName}`}
          aria-label={`${label} date`}
        />
        <select
          id={`${id}-time`}
          name={`${id}-time`}
          value={effectiveTime}
          onChange={handleTimeChange}
          className={`px-3 py-2 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)] min-w-[4.5rem] ${timeSelectClassName}`}
          aria-label={`${label} time`}
        >
          {TIME_OPTIONS.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>
    </label>
  )
}
