import { useState, useRef, useEffect, type ReactNode } from 'react'
import { Info } from 'lucide-react'

interface InfoPopoverProps {
  title: string
  children: ReactNode
  /** Optional label for the icon button (sr-only or visible) */
  label?: string
}

export default function InfoPopover({ title, children, label = 'More info' }: InfoPopoverProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [open])

  return (
    <div className="relative inline-flex" ref={ref}>
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); setOpen((v) => !v) }}
        className="p-1 rounded-full text-[var(--text-muted)] hover:text-[var(--accent)] hover:bg-[var(--accent-soft)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-label={label}
      >
        <Info className="w-4 h-4" />
      </button>
      {open && (
        <div
          role="dialog"
          aria-label={title}
          className="absolute left-0 top-full mt-1 z-50 w-[min(320px,calc(100vw-1rem))] p-3 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] shadow-lg text-left"
        >
          <p className="font-medium text-[var(--text)] text-sm mb-1">{title}</p>
          <div className="text-xs text-[var(--text-muted)] [&_ul]:list-disc [&_ul]:pl-4 [&_ul]:space-y-0.5 [&_ol]:list-decimal [&_ol]:pl-4 [&_ol]:space-y-0.5">
            {children}
          </div>
        </div>
      )}
    </div>
  )
}
