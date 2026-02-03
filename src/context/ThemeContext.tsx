import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

const STORAGE_KEY_THEME = 'seamuns-dashboard-theme'
const STORAGE_KEY_COLOR_MODE = 'seamuns-dashboard-color-mode'
const STORAGE_KEY_COLOR_THEME = 'seamuns-dashboard-color-theme'

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

export const COLOR_THEMES = [
  { id: 'gold-blue', label: 'Gold & Blue', emoji: '🏅' },
  { id: 'red', label: 'Red', emoji: '🔴' },
  { id: 'orange', label: 'Orange', emoji: '🟠' },
  { id: 'yellow', label: 'Yellow', emoji: '🟡' },
  { id: 'green', label: 'Green', emoji: '🟢' },
  { id: 'light-blue', label: 'Light Blue', emoji: '🩵' },
  { id: 'blue', label: 'Blue', emoji: '🔵' },
  { id: 'purple', label: 'Purple', emoji: '💜' },
  { id: 'pink', label: 'Pink', emoji: '🩷' },
  { id: 'brown', label: 'Brown', emoji: '🟤' },
  { id: 'monochromatic', label: 'Monochromatic', emoji: '⬜' },
] as const

export type ThemeId = (typeof THEMES)[number]['id']
export type ColorThemeId = (typeof COLOR_THEMES)[number]['id']
export type ColorMode = 'light' | 'dark'

type ThemeContextValue = {
  themeId: ThemeId
  setThemeId: (id: ThemeId) => void
  themes: typeof THEMES
  colorThemeId: ColorThemeId
  setColorThemeId: (id: ColorThemeId) => void
  colorThemes: typeof COLOR_THEMES
  colorMode: ColorMode
  setColorMode: (mode: ColorMode) => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

const isValidThemeId = (s: string): s is ThemeId =>
  THEMES.some((t) => t.id === s)

const isValidColorThemeId = (s: string): s is ColorThemeId =>
  COLOR_THEMES.some((t) => t.id === s)

const isValidColorMode = (s: string): s is ColorMode =>
  s === 'light' || s === 'dark'

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeId, setThemeIdState] = useState<ThemeId>(() => {
    if (typeof window === 'undefined') return 'default'
    const stored = localStorage.getItem(STORAGE_KEY_THEME)
    return stored && isValidThemeId(stored) ? stored : 'default'
  })

  const [colorThemeId, setColorThemeIdState] = useState<ColorThemeId>(() => {
    if (typeof window === 'undefined') return 'gold-blue'
    const stored = localStorage.getItem(STORAGE_KEY_COLOR_THEME)
    return stored && isValidColorThemeId(stored) ? stored : 'gold-blue'
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
    document.documentElement.setAttribute('data-color-theme', colorThemeId)
    localStorage.setItem(STORAGE_KEY_COLOR_THEME, colorThemeId)
  }, [colorThemeId])

  useEffect(() => {
    document.documentElement.setAttribute('data-color-mode', colorMode)
    localStorage.setItem(STORAGE_KEY_COLOR_MODE, colorMode)
  }, [colorMode])

  const setThemeId = (id: ThemeId) => setThemeIdState(id)
  const setColorThemeId = (id: ColorThemeId) => setColorThemeIdState(id)
  const setColorMode = (mode: ColorMode) => setColorModeState(mode)

  return (
    <ThemeContext.Provider
      value={{
        themeId,
        setThemeId,
        themes: THEMES,
        colorThemeId,
        setColorThemeId,
        colorThemes: COLOR_THEMES,
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
