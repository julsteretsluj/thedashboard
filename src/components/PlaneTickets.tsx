import { useState } from 'react'
import { Gavel, User, Check } from 'lucide-react'
import { useDelegate } from '../context/DelegateContext'

function buildTicketUrl(role: 'chair' | 'delegate', start?: string): string {
  const params = new URLSearchParams()
  params.set('role', role)
  if (start && start.trim()) params.set('start', start.trim())
  const q = params.toString()
  return `${window.location.origin}${window.location.pathname}${q ? `?${q}` : ''}`
}

function BoardingPass({
  label,
  icon: Icon,
  url,
  accent,
  copied,
  onCopy,
}: {
  label: string
  icon: typeof Gavel
  url: string
  accent: string
  copied: boolean
  onCopy: () => void
}) {
  return (
    <a
      href={url}
      className="group flex shrink-0 overflow-hidden rounded-lg border border-white/20 bg-white/95 shadow-md hover:shadow-lg transition-shadow"
      style={{ minWidth: 140 }}
      title={`${label} — open at conference start`}
    >
      <div className="flex flex-col flex-1 min-w-0">
        {/* Header */}
        <div
          className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white"
          style={{ backgroundColor: accent }}
        >
          Boarding Pass
        </div>
        {/* Body */}
        <div className="px-2.5 py-1.5 text-[10px] text-[var(--text)]">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[var(--text-muted)] uppercase">Depart</span>
            <span className="truncate font-medium">Conference</span>
          </div>
          <div className="flex items-center justify-between gap-2 mt-0.5">
            <span className="text-[var(--text-muted)] uppercase">Arrive</span>
            <span className="truncate font-semibold" style={{ color: accent }}>
              {label}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-1 pt-1 border-t border-[var(--border)]/50">
            <Icon className="w-3.5 h-3.5 shrink-0 opacity-70" style={{ color: accent }} />
            <span className="uppercase font-medium truncate">{label}</span>
          </div>
        </div>
        {/* Barcode area */}
        <div className="px-2 py-1 bg-[var(--bg-elevated)]/80 border-t border-dashed border-[var(--border)]/50">
          <div className="flex gap-px h-2">
            {[...Array(24)].map((_, i) => (
              <div
                key={i}
                className="flex-1 min-w-[2px] bg-[var(--text)] rounded-[1px]"
                style={{ opacity: 0.25 + (i % 3) * 0.25 }}
              />
            ))}
          </div>
        </div>
      </div>
      {/* Perforation + copy */}
      <div className="flex flex-col border-l border-dashed border-[var(--border)]">
        <div className="flex-1 flex items-center px-1.5">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault()
              onCopy()
            }}
            className="p-1.5 rounded text-[var(--text-muted)] hover:bg-white/50 hover:text-[var(--text)] transition-colors"
            title={`Copy ${label} link`}
            aria-label={`Copy ${label} link`}
          >
            {copied ? <Check className="w-4 h-4 text-[var(--success)]" /> : <span className="text-xs">📋</span>}
          </button>
        </div>
      </div>
    </a>
  )
}

export default function PlaneTickets({ vertical = false }: { vertical?: boolean }) {
  const { countdownDate } = useDelegate()!
  const [copied, setCopied] = useState<'chair' | 'delegate' | null>(null)

  const chairUrl = buildTicketUrl('chair', countdownDate)
  const delegateUrl = buildTicketUrl('delegate', countdownDate)

  const copy = async (url: string, which: 'chair' | 'delegate') => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(which)
      setTimeout(() => setCopied(null), 1500)
    } catch {}
  }

  return (
    <div className={`flex shrink-0 ${vertical ? 'flex-col gap-3' : 'items-center gap-2'}`}>
      {!vertical && (
        <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)] hidden sm:inline">
          Tickets
        </span>
      )}
      <div className={`flex ${vertical ? 'flex-col gap-3' : 'gap-2 overflow-x-auto'}`}>
        <BoardingPass
          label="Chair Room"
          icon={Gavel}
          url={chairUrl}
          accent="var(--brand)"
          copied={copied === 'chair'}
          onCopy={() => copy(chairUrl, 'chair')}
        />
        <BoardingPass
          label="Delegate"
          icon={User}
          url={delegateUrl}
          accent="var(--accent)"
          copied={copied === 'delegate'}
          onCopy={() => copy(delegateUrl, 'delegate')}
        />
      </div>
    </div>
  )
}
