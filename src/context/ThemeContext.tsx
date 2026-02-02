import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

const STORAGE_KEY_THEME = 'seamuns-dashboard-theme'
const STORAGE_KEY_COLOR_MODE = 'seamuns-dashboard-color-mode'

export const THEMES = [
  { id: 'default', label: 'Default', emoji: '◆', brand: '#2563eb' },
  { id: 'health', label: 'Health', emoji: '🏥', brand: '#0d9488' },
  { id: 'war', label: 'War & conflict', emoji: '⚔️', brand: '#b91c1c' },
  { id: 'women', label: 'Women', emoji: '♀', brand: '#a855f7' },
  { id: 'nature', label: 'Nature', emoji: '🌿', brand: '#16a34a' },
  { id: 'peace', label: 'Peace', emoji: '🕊️', brand: '#0284c7' },
  { id: 'economy', label: 'Economy', emoji: '📈', brand: '#d97706' },
  { id: 'education', label: 'Education', emoji: '📚', brand: '#4f46e5' },
  { id: 'rights', label: 'Human rights', emoji: '✊', brand: '#dc2626' },
] as const

export type ThemeId = (typeof THEMES)[number]['id']
export type ColorMode = 'light' | 'dark'

type ThemeContextValue = {
  themeId: ThemeId
  setThemeId: (id: ThemeId) => void
  themes: typeof THEMES
  colorMode: ColorMode
  setColorMode: (mode: ColorMode) => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

const isValidThemeId = (s: string): s is ThemeId =>
  THEMES.some((t) => t.id === s)

const isValidColorMode = (s: string): s is ColorMode =>
  s === 'light' || s === 'dark'

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeId, setThemeIdState] = useState<ThemeId>(() => {
    if (typeof window === 'undefined') return 'default'
    const stored = localStorage.getItem(STORAGE_KEY_THEME)
    return stored && isValidThemeId(stored) ? stored : 'default'
  })

  const [colorMode, setColorModeState] = useState<ColorMode>(() => {
    if (typeof window === 'undefined') return 'light'
    const stored = localStorage.getItem(STORAGE_KEY_COLOR_MODE)
    return stored && isValidColorMode(stored) ? stored : 'light'
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', themeId)
    localStorage.setItem(STORAGE_KEY_THEME, themeId)
  }, [themeId])

  useEffect(() => {
    document.documentElement.setAttribute('data-color-mode', colorMode)
    localStorage.setItem(STORAGE_KEY_COLOR_MODE, colorMode)
  }, [colorMode])

  const setThemeId = (id: ThemeId) => setThemeIdState(id)
  const setColorMode = (mode: ColorMode) => setColorModeState(mode)

  return (
    <ThemeContext.Provider
      value={{
        themeId,
        setThemeId,
        themes: THEMES,
        colorMode,
        setColorMode,
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}
