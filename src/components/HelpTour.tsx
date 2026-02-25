import { useState, useEffect, useCallback } from 'react'
import { HelpCircle, ChevronLeft, X } from 'lucide-react'

export type TourStep = {
  target: string
  title: string
  body: string
}

type Props = {
  steps: TourStep[]
  onClose: () => void
  isOpen: boolean
}

function getRect(selector: string): DOMRect | null {
  const el = document.querySelector(selector)
  return el?.getBoundingClientRect() ?? null
}

export default function HelpTour({ steps, onClose, isOpen }: Props) {
  const [stepIndex, setStepIndex] = useState(0)
  const [rect, setRect] = useState<DOMRect | null>(null)
  const step = steps[stepIndex]

  const updateRect = useCallback(() => {
    if (step?.target) setRect(getRect(step.target))
  }, [step?.target])

  useEffect(() => {
    if (!isOpen || !step?.target) return
    updateRect()
    const ro = new ResizeObserver(updateRect)
    const el = document.querySelector(step.target)
    if (el) ro.observe(el)
    window.addEventListener('scroll', updateRect, true)
    window.addEventListener('resize', updateRect)
    const t = requestAnimationFrame(updateRect)
    return () => {
      ro.disconnect()
      window.removeEventListener('scroll', updateRect, true)
      window.removeEventListener('resize', updateRect)
      cancelAnimationFrame(t)
    }
  }, [isOpen, step?.target, updateRect])

  if (!isOpen) return null

  const canPrev = stepIndex > 0
  const canNext = stepIndex < steps.length - 1

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center" aria-modal="true" role="dialog" aria-label="Feature tour">
      {/* Backdrop with spotlight cutout */}
      <div className="absolute inset-0 pointer-events-none">
        {rect && (
          <div
            className="absolute rounded-lg ring-2 ring-[var(--brand)] ring-offset-2 ring-offset-transparent bg-transparent pointer-events-none transition-[top,left,width,height] duration-150"
            style={{
              top: rect.top - 6,
              left: rect.left - 6,
              width: rect.width + 12,
              height: rect.height + 12,
              boxShadow: '0 0 0 9999px rgba(0,0,0,0.6)',
            }}
          />
        )}
      </div>

      {/* Clickable overlay - clicks close or advance */}
      <div
        className="absolute inset-0 cursor-default"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose()
        }}
        aria-hidden
      />

      {/* Tooltip card - position near target */}
      {step && rect && (
        <div
          className="absolute z-[101] w-[min(320px,calc(100vw-2rem)) rounded-xl shadow-xl border border-[var(--border)] bg-[var(--bg-elevated)] p-4"
          style={{
            top: rect.bottom + 16,
            left: Math.min(rect.left, window.innerWidth - 336),
            maxWidth: 'calc(100vw - 2rem)',
          }}
        >
          <div className="flex items-start justify-between gap-3 mb-3">
            <h3 className="font-semibold text-[var(--text)]">{step.title}</h3>
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-lg text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--bg-card)] transition-colors shrink-0"
              aria-label="Close tour"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-sm text-[var(--text-muted)] leading-relaxed mb-4">{step.body}</p>
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs text-[var(--text-muted)]">
              {stepIndex + 1} / {steps.length}
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setStepIndex((i) => Math.max(0, i - 1))}
                disabled={!canPrev}
                className="p-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--bg-card)] disabled:opacity-40 disabled:pointer-events-none transition-colors"
                aria-label="Previous"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => (canNext ? setStepIndex((i) => i + 1) : onClose())}
                className="px-3 py-1.5 rounded-lg text-sm font-medium bg-[var(--brand)] text-white hover:opacity-90 transition-opacity"
              >
                {canNext ? 'Next' : 'Done'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Fallback when target not found */}
      {step && !rect && (
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-[101] w-[min(320px,calc(100vw-2rem)) rounded-xl shadow-xl border border-[var(--border)] bg-[var(--bg-elevated)] p-4">
          <h3 className="font-semibold text-[var(--text)] mb-2">{step.title}</h3>
          <p className="text-sm text-[var(--text-muted)] leading-relaxed mb-4">{step.body}</p>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg text-sm font-medium bg-[var(--brand)] text-white hover:opacity-90"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export function HelpButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="p-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--brand)] hover:bg-[var(--brand-soft)] transition-colors"
      title="Feature tour"
      aria-label="Show feature tour"
    >
      <HelpCircle className="w-5 h-5" />
    </button>
  )
}
