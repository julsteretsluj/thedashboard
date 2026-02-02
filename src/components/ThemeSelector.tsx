import { useState, useRef, useEffect } from 'react'
import { Palette, Sun, Moon } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

export default function ThemeSelector() {
  const { themeId, setThemeId, themes, colorMode, setColorMode } = useTheme()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    if (open) document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [open])

  const current = themes.find((t) => t.id === themeId) ?? themes[0]

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--bg-card)] transition-colors"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label="Theme"
      >
        <Palette className="w-4 h-4 flex-shrink-0" />
        <span className="hidden sm:inline">Theme</span>
        <span className="text-[var(--brand)]" title={current.label}>
          {current.emoji}
        </span>
      </button>
      {open && (
        <div
          className="absolute right-0 top-full mt-1 py-2 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] shadow-lg z-50 min-w-[200px]"
          role="listbox"
          aria-label="Theme options"
        >
          <div className="px-3 py-1.5 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide border-b border-[var(--border)] mb-2">
            Appearance
          </div>
          <div className="flex gap-1 px-2 pb-2">
            <button
              type="button"
              onClick={() => setColorMode('light')}
              className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                colorMode === 'light'
                  ? 'bg-[var(--brand-soft)] text-[var(--brand)]'
                  : 'text-[var(--text-muted)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text)]'
              }`}
              aria-pressed={colorMode === 'light'}
            >
              <Sun className="w-4 h-4" />
              Light
            </button>
            <button
              type="button"
              onClick={() => setColorMode('dark')}
              className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                colorMode === 'dark'
                  ? 'bg-[var(--brand-soft)] text-[var(--brand)]'
                  : 'text-[var(--text-muted)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text)]'
              }`}
              aria-pressed={colorMode === 'dark'}
            >
              <Moon className="w-4 h-4" />
              Dark
            </button>
          </div>
          <div className="px-3 py-1.5 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide border-b border-[var(--border)] mb-2">
            Color theme
          </div>
          {themes.map((t) => (
            <button
              key={t.id}
              type="button"
              role="option"
              aria-selected={themeId === t.id}
              onClick={() => {
                setThemeId(t.id)
                setOpen(false)
              }}
              className={`flex items-center gap-2 w-full px-3 py-2 text-left text-sm transition-colors whitespace-nowrap min-w-0 ${
                themeId === t.id
                  ? 'bg-[var(--brand-soft)] text-[var(--brand)]'
                  : 'text-[var(--text)] hover:bg-[var(--bg-elevated)]'
              }`}
            >
              <span className="text-base flex-shrink-0" aria-hidden>
                {t.emoji}
              </span>
              <span className="truncate">{t.label}</span>
              {themeId === t.id && (
                <span className="ml-auto text-[var(--brand)]" aria-hidden>
                  ✓
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
