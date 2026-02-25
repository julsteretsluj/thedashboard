import { type ReactNode } from 'react'
import { X, MapPin } from 'lucide-react'

interface GlassPanelProps {
  title: string
  onClose: () => void
  children: ReactNode
  location?: string | null
  className?: string
}

/**
 * Glassmorphic floating panel: frosted glass, backdrop blur, translucent.
 * Shows a destination pin at the top of each panel.
 */
export default function GlassPanel({ title, onClose, children, location, className = '' }: GlassPanelProps) {
  return (
    <div
      className={`absolute inset-4 sm:inset-6 md:inset-8 lg:inset-12 xl:inset-16 z-30 flex flex-col rounded-2xl overflow-hidden glass-panel ${className}`}
    >
      <div className="flex items-center justify-between px-4 py-3 shrink-0 border-b border-white/15 gap-3">
        <div className="flex flex-col min-w-0 gap-0.5">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 shrink-0 text-[var(--brand)]" aria-hidden />
            <h2 className="text-lg font-semibold text-[var(--text)] truncate">{title}</h2>
          </div>
          {location && (
            <p className="text-sm text-[var(--text-muted)] pl-7 truncate">{location}</p>
          )}
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-white/10 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="glass-panel-content flex-1 overflow-auto p-4 min-h-0">{children}</div>
    </div>
  )
}
