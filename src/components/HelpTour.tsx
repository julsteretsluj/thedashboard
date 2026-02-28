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
  const [isMobile, setIsMobile] = useState(false)
  const step = steps[stepIndex]

  const updateRect = useCallback(() => {
    if (step?.target) setRect(getRect(step.target))
  }, [step?.target])

  useEffect(() => {
    const updateViewport = () => setIsMobile(window.innerWidth < 768)
    updateViewport()
    window.addEventListener('resize', updateViewport)
    return () => window.removeEventListener('resize', updateViewport)
  }, [])

  useEffect(() => {
    if (isOpen) setStepIndex(0)
  }, [isOpen])

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

  useEffect(() => {
    if (!isOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [isOpen])

  if (!isOpen) return null

  const canPrev = stepIndex > 0
  const canNext = stepIndex < steps.length - 1
  const goPrev = () => setStepIndex((i) => Math.max(0, i - 1))
  const goNext = () => (canNext ? setStepIndex((i) => i + 1) : onClose())
  const focusTarget = () => {
    const target = step?.target ? document.querySelector(step.target) : null
    if (!target) return
    target.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' })
    requestAnimationFrame(updateRect)
  }

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

      {/* Mobile bottom-sheet tour */}
      {step && isMobile && (
        <div className="absolute inset-x-0 bottom-0 z-[101] p-2">
          <div className="mx-auto w-full max-w-[36rem] rounded-2xl shadow-xl border border-[var(--border)] bg-[var(--bg-elevated)] p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
            <div className="mb-3 flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs font-medium uppercase tracking-wide text-[var(--text-muted)]">
                  Step {stepIndex + 1} of {steps.length}
                </p>
                <h3 className="font-semibold text-[var(--text)] truncate">{step.title}</h3>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--bg-card)] transition-colors shrink-0"
                aria-label="Close tour"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-[var(--text-muted)] leading-relaxed mb-4">{step.body}</p>
            <div className="mb-4 flex flex-wrap gap-1.5">
              {steps.map((s, i) => (
                <button
                  key={`${s.target}-${i}`}
                  type="button"
                  onClick={() => setStepIndex(i)}
                  className={`h-1.5 rounded-full transition-all ${
                    i === stepIndex ? 'w-6 bg-[var(--brand)]' : 'w-3 bg-[var(--border)]'
                  }`}
                  aria-label={`Go to step ${i + 1}`}
                  title={`Step ${i + 1}`}
                />
              ))}
            </div>
            <div className="flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={focusTarget}
                className="px-3 py-2 rounded-lg text-sm font-medium border border-[var(--border)] text-[var(--text)] hover:bg-[var(--bg-card)] transition-colors"
              >
                Focus target
              </button>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={goPrev}
                  disabled={!canPrev}
                  className="px-3 py-2 rounded-lg text-sm font-medium border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--bg-card)] disabled:opacity-40 disabled:pointer-events-none transition-colors"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={goNext}
                  className="px-3 py-2 rounded-lg text-sm font-medium bg-[var(--brand)] text-white hover:opacity-90 transition-opacity"
                >
                  {canNext ? 'Next' : 'Done'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Desktop tooltip card - position near target */}
      {step && rect && !isMobile && (
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
                onClick={goPrev}
                disabled={!canPrev}
                className="p-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--bg-card)] disabled:opacity-40 disabled:pointer-events-none transition-colors"
                aria-label="Previous"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={goNext}
                className="px-3 py-1.5 rounded-lg text-sm font-medium bg-[var(--brand)] text-white hover:opacity-90 transition-opacity"
              >
                {canNext ? 'Next' : 'Done'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Fallback when target not found */}
      {step && !rect && !isMobile && (
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
