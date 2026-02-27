import { useState, useRef, useEffect, useCallback, useMemo, type ReactNode } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Globe from 'react-globe.gl'
import type { GlobeMethods } from 'react-globe.gl'
import { Gavel, User, Compass, ChevronDown, ChevronUp, MapPin, RotateCw, Navigation, Star } from 'lucide-react'
import { useSupabaseAuth } from '../context/SupabaseAuthContext'
import { useDelegate } from '../context/DelegateContext'
import { ChairProvider } from '../context/ChairContext'
import { DelegateProvider } from '../context/DelegateContext'
import { CHAIR_SECTIONS, DELEGATE_SECTIONS, ALL_SECTIONS, type GlobeSection } from '../constants/globeSections'
import PlaneTickets from '../components/PlaneTickets'
import HelpTour, { HelpButton } from '../components/HelpTour'
import Breadcrumbs from '../components/Breadcrumbs'
import type { TourStep } from '../components/HelpTour'

const FLIGHT_MS = 1800
const REDIRECT_AFTER_FLY_MS = 700

const TOUR_STEPS: TourStep[] = [
  {
    target: '[data-tour="globe"]',
    title: 'Globe & pins',
    body: 'Click any baggage-tag label on the globe to fly there, then open that section on its official Chair or Delegate page. Pins show Chair (blue) and Delegate (cyan) sections.',
  },
  {
    target: '[data-tour="last-visited"]',
    title: 'Last visited',
    body: 'Shows the last location you clicked. Use the arrow button to return there quickly.',
  },
  {
    target: '[data-tour="plane-tickets"]',
    title: 'Boarding passes',
    body: 'Chair Room and Delegate links. Click to open, or use the copy button to share the link with others.',
  },
  {
    target: '[data-tour="role-toggle"]',
    title: 'Chair / Delegate',
    body: 'Switch between chair sections (Committee, Delegates, Session, etc.) and delegate sections (Country, Matrix, Checklist, etc.).',
  },
  {
    target: '[data-tour="section-tabs"]',
    title: 'Section tabs',
    body: 'Click a tab to fly briefly, then open that section on its official page. Star tabs to pin your favorites at the top.',
  },
  {
    target: '[data-tour="rotation"]',
    title: 'Rotation',
    body: 'Drag the slider to rotate the globe and explore different regions.',
  },
]

const CHAIR_DEFAULT_SECTION = { id: 'session', role: 'chair' as const }
const DELEGATE_DEFAULT_SECTION = { id: 'countdown', role: 'delegate' as const }

function useWindowSize() {
  const [size, setSize] = useState({ w: 800, h: 600 })
  useEffect(() => {
    const update = () => setSize({ w: window.innerWidth, h: window.innerHeight })
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])
  return size
}

const STARRED_KEY = 'seamuns-starred-sections'
function sectionKey(s: GlobeSection) {
  return `${s.role}:${s.id}` as const
}
function useStarredSections() {
  const [starred, setStarred] = useState<Set<string>>(() => {
    try {
      const raw = localStorage.getItem(STARRED_KEY)
      if (!raw) return new Set()
      const arr = JSON.parse(raw) as string[]
      return new Set(Array.isArray(arr) ? arr : [])
    } catch {
      return new Set()
    }
  })
  const toggleStar = useCallback((s: GlobeSection) => {
    const key = sectionKey(s)
    setStarred((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      try {
        localStorage.setItem(STARRED_KEY, JSON.stringify([...next]))
      } catch {}
      return next
    })
  }, [])
  const isStarred = useCallback((s: GlobeSection) => starred.has(sectionKey(s)), [starred])
  return { isStarred, toggleStar }
}

const GEO_CACHE = new Map<string, string | null>()
const LOCATION_CACHE = new Map<string, string | null>()
const geoKey = (lat: number, lng: number) => `${lat.toFixed(2)}_${lng.toFixed(2)}`
async function fetchCountryAt(lat: number, lng: number): Promise<string | null> {
  const key = geoKey(lat, lng)
  if (GEO_CACHE.has(key)) return GEO_CACHE.get(key) ?? null
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
      { headers: { Accept: 'application/json' } }
    )
    const data = (await res.json()) as { address?: { country?: string } }
    const country = data?.address?.country ?? null
    GEO_CACHE.set(key, country)
    return country
  } catch {
    GEO_CACHE.set(key, null)
    return null
  }
}

type AddressParts = {
  city?: string
  town?: string
  village?: string
  municipality?: string
  state?: string
  country?: string
}
async function fetchLocationLabel(lat: number, lng: number): Promise<string | null> {
  const key = geoKey(lat, lng)
  if (LOCATION_CACHE.has(key)) return LOCATION_CACHE.get(key) ?? null
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1`,
      { headers: { Accept: 'application/json' } }
    )
    const data = (await res.json()) as { address?: AddressParts }
    const addr = data?.address
    if (!addr?.country) {
      LOCATION_CACHE.set(key, null)
      return null
    }
    const city = addr.city ?? addr.town ?? addr.village ?? addr.municipality ?? addr.state ?? null
    const label = city ? `${city}, ${addr.country}` : addr.country
    LOCATION_CACHE.set(key, label)
    return label
  } catch {
    LOCATION_CACHE.set(key, null)
    return null
  }
}

function GlobeViewInner() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const pendingRedirectRef = useRef<number | null>(null)
  const globeRef = useRef<GlobeMethods | undefined>(undefined)
  const globeContainerRef = useRef<HTMLDivElement>(null)
  const { w, h } = useWindowSize()
  const isMobile = w < 768
  const [roleFilter, setRoleFilter] = useState<'chair' | 'delegate'>('chair')
  const [flyToMinimized, setFlyToMinimized] = useState(isMobile)
  const [globeRotation, setGlobeRotation] = useState(0)
  const [lastClickedCountry, setLastClickedCountry] = useState<string | null>(null)
  const [lastClickedCoords, setLastClickedCoords] = useState<{ lat: number; lng: number } | null>(null)
  const [lastClickedSection, setLastClickedSection] = useState<GlobeSection | null>(null)
  const [tourOpen, setTourOpen] = useState(false)
  const { isStarred, toggleStar } = useStarredSections()

  useEffect(() => {
    if (tourOpen) setFlyToMinimized(false)
  }, [tourOpen])
  useEffect(() => {
    setFlyToMinimized(isMobile)
  }, [isMobile])
  const baseSections = roleFilter === 'chair' ? CHAIR_SECTIONS : DELEGATE_SECTIONS
  const sections = useMemo(
    () => [...baseSections].sort((a, b) => (isStarred(b) ? 1 : 0) - (isStarred(a) ? 1 : 0)),
    [baseSections, isStarred]
  )
  const { setCountdownDate } = useDelegate()!

  const flyTo = useCallback((section: GlobeSection) => {
    globeRef.current?.pointOfView(
      { lat: section.lat, lng: section.lng, altitude: 1.8 },
      FLIGHT_MS
    )
    setGlobeRotation(((section.lng % 360) + 360) % 360)
  }, [])

  const openSectionPage = useCallback((section: GlobeSection) => {
    if (pendingRedirectRef.current !== null) {
      window.clearTimeout(pendingRedirectRef.current)
      pendingRedirectRef.current = null
    }
    setRoleFilter(section.role)
    flyTo(section)
    const base = section.role === 'chair' ? '/chair' : '/delegate'
    pendingRedirectRef.current = window.setTimeout(() => {
      navigate(`${base}#${section.id}`)
      pendingRedirectRef.current = null
    }, REDIRECT_AFTER_FLY_MS)
  }, [flyTo, navigate])

  useEffect(() => {
    return () => {
      if (pendingRedirectRef.current !== null) {
        window.clearTimeout(pendingRedirectRef.current)
      }
    }
  }, [])

  const handleRotationChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = Number(e.target.value)
      setGlobeRotation(val)
      const globe = globeRef.current
      if (!globe) return
      const current = globe.pointOfView()
      const lat = current?.lat ?? 0
      const alt = current?.altitude ?? 1.8
      globe.pointOfView({ lat, lng: val, altitude: alt }, 0)
    },
    []
  )

  const handleGlobeClick = useCallback((coords: { lat: number; lng: number }) => {
    setLastClickedCoords(coords)
    setLastClickedSection(null)
    fetchCountryAt(coords.lat, coords.lng).then(setLastClickedCountry)
  }, [])

  const handlePointClick = useCallback(
    (p: { section: GlobeSection }) => {
      const section = (p as { section: GlobeSection }).section
      if (section) {
        setLastClickedCoords({ lat: section.lat, lng: section.lng })
        setLastClickedSection(section)
        fetchCountryAt(section.lat, section.lng).then(setLastClickedCountry)
        openSectionPage(section)
      }
    },
    [openSectionPage]
  )

  const goToLastVisited = useCallback(() => {
    if (!lastClickedCoords) return
    if (lastClickedSection) {
      setRoleFilter(lastClickedSection.role)
      flyTo(lastClickedSection)
    } else {
      globeRef.current?.pointOfView(
        { lat: lastClickedCoords.lat, lng: lastClickedCoords.lng, altitude: 1.8 },
        FLIGHT_MS
      )
      setGlobeRotation(((lastClickedCoords.lng % 360) + 360) % 360)
    }
  }, [lastClickedCoords, lastClickedSection, flyTo])

  useEffect(() => {
    const role = searchParams.get('role')
    const start = searchParams.get('start')
    if (role === 'chair' || role === 'delegate') {
      setRoleFilter(role)
      const def = role === 'chair' ? CHAIR_DEFAULT_SECTION : DELEGATE_DEFAULT_SECTION
      const section = (role === 'chair' ? CHAIR_SECTIONS : DELEGATE_SECTIONS).find(
        (s) => s.id === def.id && s.role === def.role
      )
      if (section) {
        const t = setTimeout(() => flyTo(section), 100)
        return () => clearTimeout(t)
      }
    }
    if (start && start.trim()) setCountdownDate(start.trim())
  }, [searchParams, setCountdownDate, flyTo])

  const GLOBE_IMAGE = 'https://unpkg.com/three-globe@2.31.1/example/img/earth-day.jpg'

  const pointsData = useMemo(
    () =>
      ALL_SECTIONS.map((s) => ({
        lat: s.lat,
        lng: s.lng,
        label: s.label,
        section: s,
      })),
    []
  )

  const barHeight = 72
  const globeHeight = Math.max(isMobile ? 320 : 400, h - 80 - barHeight)

  return (
    <div className="relative flex flex-col w-full h-full min-h-[500px]" style={{ height: 'calc(100vh - 5rem)' }}>
      {/* Help button — top-right */}
      <div className="absolute right-2 sm:right-4 top-2 sm:top-4 z-30 flex items-center gap-2">
        <HelpButton onClick={() => setTourOpen(true)} />
      </div>
      <HelpTour steps={TOUR_STEPS} isOpen={tourOpen} onClose={() => setTourOpen(false)} />
      {/* Breadcrumbs + Last visited — top-left */}
      <div className="absolute left-2 sm:left-4 top-2 sm:top-4 z-30 flex flex-col gap-2 max-w-[calc(100%-4rem)]">
        <Breadcrumbs
          items={[
            { label: 'Dashboard', href: '/' },
            { label: 'Globe', href: '/globe' },
          ]}
          className="rounded-lg px-3 py-2 bg-[var(--bg-card)]/90 backdrop-blur border border-[var(--border)]"
        />
        <div
          data-tour="last-visited"
          className="rounded-xl px-4 py-2.5 text-sm font-medium shadow-lg bg-[var(--bg-card)] border border-[var(--border)]"
        aria-live="polite"
      >
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-[var(--brand)] shrink-0" aria-hidden />
          <span className="text-[var(--text-muted)]">Last visited</span>
          <span className="text-[var(--text)] font-semibold truncate max-w-[140px]">
            {lastClickedCountry ?? '—'}
          </span>
          <button
            type="button"
            onClick={goToLastVisited}
            disabled={!lastClickedCoords}
            className="p-1.5 rounded-lg text-[var(--brand)] hover:bg-[var(--brand-soft)] disabled:text-[var(--text-muted)] disabled:hover:bg-transparent disabled:cursor-not-allowed transition-colors"
            title="Return to last visited"
            aria-label="Return to last visited"
          >
            <Navigation className="w-4 h-4" />
          </button>
        </div>
        </div>
      </div>

      <div className="flex-1 min-h-0 flex flex-col md:flex-row gap-3 md:gap-4 px-2 sm:px-4 pt-2 sm:pt-4 pb-2 min-w-0">
        {/* Globe */}
        <div ref={globeContainerRef} data-tour="globe" className="flex-1 min-w-0 flex items-center justify-center relative">
          <Globe
        ref={globeRef}
        globeImageUrl={GLOBE_IMAGE}
        bumpImageUrl={undefined}
        showGraticules={false}
        backgroundColor="rgba(0,0,0,0)"
        showAtmosphere={true}
        atmosphereColor="rgba(0, 200, 255, 0.35)"
        showGlobe={true}
        onGlobeClick={handleGlobeClick}
        pointsData={pointsData}
        pointLat="lat"
        pointLng="lng"
        pointColor={(p) => ((p as { section: GlobeSection }).section.role === 'chair' ? '#3b82f6' : '#06b6d4')}
        pointAltitude={0.15}
        pointRadius={1.2}
        pointsMerge={false}
        onPointClick={(p) => handlePointClick(p as { section: GlobeSection })}
        htmlElementsData={pointsData}
        htmlLat="lat"
        htmlLng="lng"
        htmlAltitude={0.28}
        htmlElement={(d) => {
          const datum = d as { label: string; section: GlobeSection }
          const el = document.createElement('div')
          el.className = `baggage-tag baggage-tag--${datum?.section?.role ?? 'chair'}`
          el.textContent = datum.label
          el.style.pointerEvents = 'auto'
          el.style.cursor = 'pointer'
          el.addEventListener('click', (e) => {
            e.stopPropagation()
            e.preventDefault()
            if (datum?.section) handlePointClick(datum)
          })
          return el
        }}
        width={w}
        height={globeHeight}
      />
        </div>
        {/* Desktop boarding passes */}
        {!isMobile && (
          <div data-tour="plane-tickets" className="shrink-0 z-10 flex flex-col gap-3 self-center">
            <PlaneTickets vertical={true} />
          </div>
        )}
      </div>

      {/* Bottom bar */}
      <div className="shrink-0 px-2 sm:px-4 pb-3 sm:pb-4 pt-1 sm:pt-2 z-20 flex flex-col sm:flex-row gap-2 sm:gap-3">
        {isMobile && (
          <div data-tour="plane-tickets" className="rounded-2xl overflow-hidden glass-nav px-3 py-2.5 w-full">
            <PlaneTickets vertical={false} />
          </div>
        )}
        {/* Fly to section */}
        <div className="rounded-2xl overflow-hidden glass-nav flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 p-2.5 sm:p-3">
            <div className="flex items-center gap-2 shrink-0">
              <Compass className="w-4 h-4 text-[var(--brand)]" aria-hidden />
              <span className="text-sm font-medium text-[var(--text)]">Fly to section</span>
              <button
                type="button"
                onClick={() => setFlyToMinimized((m) => !m)}
                className="p-1 rounded text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--bg-base)] transition-colors"
                title={flyToMinimized ? 'Expand' : 'Minimize'}
                aria-label={flyToMinimized ? 'Expand fly to section' : 'Minimize fly to section'}
              >
                {flyToMinimized ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>
            {!flyToMinimized && (
              <>
            <div data-tour="role-toggle" className="flex gap-1 p-0.5 rounded-lg bg-[var(--bg-base)] shrink-0">
            <button
              type="button"
              onClick={() => setRoleFilter('chair')}
              className={`flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-md text-xs font-medium transition-colors ${
                roleFilter === 'chair' ? 'bg-[var(--brand)] text-white' : 'text-[var(--text-muted)] hover:text-[var(--text)]'
              }`}
            >
              <Gavel className="w-3.5 h-3.5" /> Chair
            </button>
            <button
              type="button"
              onClick={() => setRoleFilter('delegate')}
              className={`flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-md text-xs font-medium transition-colors ${
                roleFilter === 'delegate' ? 'bg-[var(--accent)] text-white' : 'text-[var(--text-muted)] hover:text-[var(--text)]'
              }`}
            >
              <User className="w-3.5 h-3.5" /> Delegate
            </button>
            </div>
            <div data-tour="section-tabs" className="flex flex-wrap gap-1 overflow-x-auto min-w-0 max-h-36 sm:max-h-none">
            {sections.map((s) => (
              <div
                key={`${s.role}-${s.id}`}
                className="shrink-0 flex items-center gap-0.5 px-2 py-1.5 pr-1 rounded-lg text-sm transition-colors whitespace-nowrap group/tab text-[var(--text-muted)] hover:bg-[var(--bg-base)] hover:text-[var(--text)]"
              >
                <button
                  type="button"
                  onClick={() => openSectionPage(s)}
                  className="text-left flex-1 min-w-0 py-0.5"
                >
                  {s.label}
                </button>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); toggleStar(s) }}
                  className={`p-0.5 rounded transition-colors flex-shrink-0 ${
                    isStarred(s)
                      ? 'text-[var(--gold)] hover:opacity-80'
                      : 'opacity-0 group-hover/tab:opacity-70 hover:!opacity-100 text-[var(--text-muted)] hover:text-[var(--gold)]'
                  }`}
                  title={isStarred(s) ? 'Unstar' : 'Star this section'}
                  aria-label={isStarred(s) ? `Unstar ${s.label}` : `Star ${s.label}`}
                >
                  <Star className={`w-3.5 h-3.5 ${isStarred(s) ? 'fill-current' : ''}`} />
                </button>
              </div>
            ))}
            </div>
              </>
            )}
          </div>
        </div>
        <div data-tour="rotation" className="rounded-2xl overflow-hidden glass-nav shrink-0 px-4 py-3 flex items-center gap-3 min-w-0 sm:min-w-[200px]">
          <RotateCw className="w-4 h-4 text-[var(--brand)] shrink-0" aria-hidden />
          <div className="flex-1 min-w-0">
            <label htmlFor="globe-rotation" className="sr-only">Rotate globe</label>
            <input
              id="globe-rotation"
              type="range"
              min={0}
              max={360}
              value={Math.round(globeRotation)}
              onChange={handleRotationChange}
              className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-[var(--brand)] bg-[var(--bg-base)]"
              aria-label="Rotate globe"
            />
          </div>
        </div>
      </div>

    </div>
  )
}

export default function GlobeView() {
  const { user } = useSupabaseAuth()
  const userId = user?.uid ?? null

  return (
    <ChairProvider userId={userId}>
      <DelegateProvider userId={userId}>
        <GlobeViewInner />
      </DelegateProvider>
    </ChairProvider>
  )
}
