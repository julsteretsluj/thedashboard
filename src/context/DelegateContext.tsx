import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import type { DelegateConference, CommitteeMatrixEntry } from '../types'
import { loadDelegateData, saveDelegateData } from '../lib/delegateData'

const DELEGATE_STORAGE_KEY = 'seamuns-dashboard-delegate-state'

function migrateConference(c: DelegateConference): DelegateConference {
  const hasLegacy = c.committeeMatrix && Object.keys(c.committeeMatrix).length > 0
  const hasEntries = c.committeeMatrixEntries && c.committeeMatrixEntries.length > 0
  const base = {
    ...c,
    delegateEmail: c.delegateEmail ?? '',
    positionPaperDeadline: c.positionPaperDeadline ?? '',
    conferenceEndDate: c.conferenceEndDate ?? '',
    committeeCount: c.committeeCount ?? 0,
    committees: c.committees ?? [],
    committeeMatrixEntries:
      hasLegacy && !hasEntries && c.committeeMatrix
        ? Object.entries(c.committeeMatrix).map(([committee, firstName]) => ({
            committee,
            firstName,
            delegation: '',
          }))
        : c.committeeMatrixEntries ?? [],
    pinnedCommittees: (c.pinnedCommittees ?? []).slice(0, 3),
    checklist: { ...defaultChecklist, ...(c.checklist || {}) },
  }
  return base
}

const defaultChecklist: DelegateConference['checklist'] = {
  positionPaper: false,
  researchTopic: false,
  researchCountryStance: false,
  researchResolutions: false,
  researchAllies: false,
  researchNews: false,
  positionPaperDraft: false,
  positionPaperFinal: false,
  positionPaperSubmit: false,
  openingSpeechDraft: false,
  openingSpeechTimed: false,
  openingSpeech: false,
  modSpeeches: false,
  modCaucusPoints: false,
  knowRules: false,
  knowAgenda: false,
  materialsReady: false,
}

const defaultConference = (id: string): DelegateConference => ({
  id,
  name: 'New Conference',
  country: '',
  delegateEmail: '',
  stanceOverview: '',
  committeeCount: 0,
  committees: [],
  committeeMatrixEntries: [],
  pinnedCommittees: [],
  countdownDate: '',
  conferenceEndDate: '',
  positionPaperDeadline: '',
  checklist: { ...defaultChecklist },
  trustedSources: [],
  nationSources: [],
  uploadedResources: [],
})

function generateId() {
  return crypto.randomUUID?.() ?? `conf-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

function loadDelegateStateFromStorage(): { conferences: DelegateConference[]; activeConferenceId: string } | null {
  try {
    const raw = localStorage.getItem(DELEGATE_STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as { conferences?: unknown[]; activeConferenceId?: string }
    if (!Array.isArray(parsed.conferences) || parsed.conferences.length === 0) return null
    const conferences = parsed.conferences.map((c) => migrateConference(c as DelegateConference))
    const activeConferenceId =
      typeof parsed.activeConferenceId === 'string' && parsed.activeConferenceId
        ? parsed.activeConferenceId
        : conferences[0]?.id ?? ''
    if (!activeConferenceId && conferences[0]) return { conferences, activeConferenceId: conferences[0].id }
    return { conferences, activeConferenceId }
  } catch {
    return null
  }
}

type DelegateContextValue = DelegateConference & {
  conferences: DelegateConference[]
  activeConferenceId: string
  setName: (n: string) => void
  setCountry: (c: string) => void
  setDelegateEmail: (e: string) => void
  setStanceOverview: (s: string) => void
  setCommitteeCount: (n: number) => void
  setCommittees: (list: string[]) => void
  addCommitteeMatrixEntry: (entry: CommitteeMatrixEntry) => void
  removeCommitteeMatrixEntry: (index: number) => void
  togglePinnedCommittee: (committee: string) => void
  setCountdownDate: (d: string) => void
  setConferenceEndDate: (d: string) => void
  setPositionPaperDeadline: (d: string) => void
  toggleChecklist: (key: keyof DelegateConference['checklist']) => void
  addTrustedSource: (s: string) => void
  removeTrustedSource: (i: number) => void
  addNationSource: (s: string) => void
  removeNationSource: (i: number) => void
  addUploadedResource: (name: string, url?: string) => void
  removeUploadedResource: (i: number) => void
  addConference: () => void
  removeConference: (id: string) => void
  setActiveConference: (id: string) => void
  saveToAccount: () => Promise<void>
  isSaving: boolean
  lastSaved: Date | null
  isLoaded: boolean
}

const DelegateContext = createContext<DelegateContextValue | null>(null)

function getCurrentConference(
  conferences: DelegateConference[],
  activeId: string
): DelegateConference {
  const c = conferences.find((x) => x.id === activeId)
  if (c) return c
  if (conferences.length > 0) return conferences[0]
  return defaultConference(generateId())
}

export function DelegateProvider({
  children,
  userId = null,
}: {
  children: ReactNode
  userId?: string | null
}) {
  const [conferences, setConferences] = useState<DelegateConference[]>(() => {
    const stored = loadDelegateStateFromStorage()
    if (stored?.conferences?.length) return stored.conferences
    return [defaultConference(generateId())]
  })
  const [activeConferenceId, setActiveConferenceIdState] = useState<string>(() => {
    const stored = loadDelegateStateFromStorage()
    if (stored?.activeConferenceId && stored?.conferences?.some((c) => c.id === stored.activeConferenceId))
      return stored.activeConferenceId
    return ''
  })
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  const activeId = activeConferenceId || conferences[0]?.id
  const current = getCurrentConference(conferences, activeId ?? '')

  useEffect(() => {
    if (!activeId && conferences[0]) {
      setActiveConferenceIdState(conferences[0].id)
    }
  }, [activeId, conferences])

  // Persist conference data to localStorage so refresh doesn't lose data (signed in or not)
  useEffect(() => {
    const t = setTimeout(() => {
      try {
        localStorage.setItem(
          DELEGATE_STORAGE_KEY,
          JSON.stringify({
            conferences,
            activeConferenceId: activeId ?? conferences[0]?.id ?? '',
          })
        )
      } catch {
        /* ignore */
      }
    }, 1000)
    return () => clearTimeout(t)
  }, [conferences, activeId])

  useEffect(() => {
    if (!userId) {
      setIsLoaded(true)
      return
    }
    let cancelled = false
    loadDelegateData(userId)
      .then((data) => {
        if (cancelled) return
        if (data && data.conferences.length > 0) {
          setConferences(data.conferences.map(migrateConference))
          setActiveConferenceIdState(data.activeConferenceId || data.conferences[0].id)
        } else {
          const stored = loadDelegateStateFromStorage()
          if (stored?.conferences?.length) {
            saveDelegateData(userId, {
              conferences: stored.conferences,
              activeConferenceId: stored.activeConferenceId || stored.conferences[0]?.id || '',
            }).catch(() => {})
          }
        }
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setIsLoaded(true)
      })
    return () => {
      cancelled = true
    }
  }, [userId])

  const updateActive = useCallback((updater: (c: DelegateConference) => DelegateConference) => {
    setConferences((list) => {
      const idx = list.findIndex((x) => x.id === activeId)
      if (idx < 0) return list
      const next = [...list]
      next[idx] = updater(list[idx])
      return next
    })
  }, [activeId])

  const setName = useCallback((name: string) => updateActive((c) => ({ ...c, name })), [updateActive])
  const setCountry = useCallback((country: string) => updateActive((c) => ({ ...c, country })), [updateActive])
  const setDelegateEmail = useCallback((delegateEmail: string) => updateActive((c) => ({ ...c, delegateEmail })), [updateActive])
  const setStanceOverview = useCallback((s: string) => updateActive((c) => ({ ...c, stanceOverview: s })), [updateActive])
  const setCommitteeCount = useCallback(
    (n: number) => updateActive((c) => ({ ...c, committeeCount: Math.max(0, Math.min(20, n)) })),
    [updateActive]
  )
  const setCommittees = useCallback(
    (list: string[]) => updateActive((c) => ({ ...c, committees: list })),
    [updateActive]
  )
  const addCommitteeMatrixEntry = useCallback(
    (entry: CommitteeMatrixEntry) =>
      updateActive((c) => ({
        ...c,
        committeeMatrixEntries: [...(c.committeeMatrixEntries ?? []), entry],
      })),
    [updateActive]
  )
  const removeCommitteeMatrixEntry = useCallback(
    (index: number) =>
      updateActive((c) => ({
        ...c,
        committeeMatrixEntries: (c.committeeMatrixEntries ?? []).filter((_, i) => i !== index),
      })),
    [updateActive]
  )
  const togglePinnedCommittee = useCallback(
    (committee: string) =>
      updateActive((c) => {
        const pinned = c.pinnedCommittees ?? []
        const idx = pinned.indexOf(committee)
        if (idx >= 0) {
          return { ...c, pinnedCommittees: pinned.filter((_, i) => i !== idx) }
        }
        if (pinned.length >= 3) return c
        return { ...c, pinnedCommittees: [...pinned, committee] }
      }),
    [updateActive]
  )
  const setCountdownDate = useCallback((d: string) => updateActive((c) => ({ ...c, countdownDate: d })), [updateActive])
  const setConferenceEndDate = useCallback((d: string) => updateActive((c) => ({ ...c, conferenceEndDate: d })), [updateActive])
  const setPositionPaperDeadline = useCallback((d: string) => updateActive((c) => ({ ...c, positionPaperDeadline: d })), [updateActive])
  const toggleChecklist = useCallback(
    (key: keyof DelegateConference['checklist']) =>
      updateActive((c) => ({
        ...c,
        checklist: { ...c.checklist, [key]: !c.checklist[key] },
      })),
    [updateActive]
  )
  const addTrustedSource = useCallback(
    (s: string) => updateActive((c) => ({ ...c, trustedSources: [...c.trustedSources, s] })),
    [updateActive]
  )
  const removeTrustedSource = useCallback(
    (i: number) =>
      updateActive((c) => ({
        ...c,
        trustedSources: c.trustedSources.filter((_, idx) => idx !== i),
      })),
    [updateActive]
  )
  const addNationSource = useCallback(
    (s: string) => updateActive((c) => ({ ...c, nationSources: [...c.nationSources, s] })),
    [updateActive]
  )
  const removeNationSource = useCallback(
    (i: number) =>
      updateActive((c) => ({
        ...c,
        nationSources: c.nationSources.filter((_, idx) => idx !== i),
      })),
    [updateActive]
  )
  const addUploadedResource = useCallback(
    (name: string, url?: string) =>
      updateActive((c) => ({
        ...c,
        uploadedResources: [...c.uploadedResources, { name, url }],
      })),
    [updateActive]
  )
  const removeUploadedResource = useCallback(
    (i: number) =>
      updateActive((c) => ({
        ...c,
        uploadedResources: c.uploadedResources.filter((_, idx) => idx !== i),
      })),
    [updateActive]
  )

  const addConference = useCallback(() => {
    const id = generateId()
    const conf = defaultConference(id)
    setConferences((list) => [...list, conf])
    setActiveConferenceIdState(id)
  }, [])

  const removeConference = useCallback((id: string) => {
    const remaining = conferences.filter((c) => c.id !== id)
    const nextList = remaining.length > 0 ? remaining : [defaultConference(generateId())]
    const newActive =
      activeId === id ? nextList[0]?.id ?? '' : activeId ?? nextList[0]?.id ?? ''
    setConferences(nextList)
    setActiveConferenceIdState(newActive)
  }, [conferences, activeId])

  const setActiveConference = useCallback((id: string) => {
    setActiveConferenceIdState(id)
  }, [])

  const saveToAccount = useCallback(async () => {
    if (!userId) return
    setIsSaving(true)
    try {
      await saveDelegateData(userId, {
        conferences,
        activeConferenceId: activeId ?? conferences[0]?.id ?? '',
      })
      setLastSaved(new Date())
    } finally {
      setIsSaving(false)
    }
  }, [userId, conferences, activeId])

  // Autosave: debounced save to account when data changes (only when signed in and after initial load)
  useEffect(() => {
    if (!userId || !isLoaded) return
    const t = setTimeout(() => {
      saveToAccount()
    }, 3000)
    return () => clearTimeout(t)
  }, [userId, isLoaded, conferences, activeId, saveToAccount])

  // Autosave every 5 minutes
  useEffect(() => {
    if (!userId || !isLoaded) return
    const interval = setInterval(() => saveToAccount(), 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [userId, isLoaded, saveToAccount])

  const value: DelegateContextValue = {
    ...current,
    conferences,
    activeConferenceId: activeId ?? '',
    setName,
    setCountry,
    setDelegateEmail,
    setStanceOverview,
    setCommitteeCount,
    setCommittees,
    addCommitteeMatrixEntry,
    removeCommitteeMatrixEntry,
    togglePinnedCommittee,
    setCountdownDate,
    setConferenceEndDate,
    setPositionPaperDeadline,
    toggleChecklist,
    addTrustedSource,
    removeTrustedSource,
    addNationSource,
    removeNationSource,
    addUploadedResource,
    removeUploadedResource,
    addConference,
    removeConference,
    setActiveConference,
    saveToAccount,
    isSaving,
    lastSaved,
    isLoaded,
  }

  return (
    <DelegateContext.Provider value={value}>
      {children}
    </DelegateContext.Provider>
  )
}

export function useDelegate() {
  const ctx = useContext(DelegateContext)
  if (!ctx) throw new Error('useDelegate must be used within DelegateProvider')
  return ctx
}

export type { DelegateConference }
