import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import type { DelegateConference } from '../types'
import { loadDelegateData, saveDelegateData } from '../lib/delegateData'

const defaultConference = (id: string): DelegateConference => ({
  id,
  name: 'New Conference',
  country: '',
  stanceOverview: '',
  committeeMatrix: {},
  countdownDate: '',
  checklist: {
    positionPaper: false,
    researchTopic: false,
    researchCountryStance: false,
    openingSpeech: false,
    modSpeeches: false,
  },
  trustedSources: [],
  nationSources: [],
  uploadedResources: [],
})

function generateId() {
  return crypto.randomUUID?.() ?? `conf-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

type DelegateContextValue = DelegateConference & {
  conferences: DelegateConference[]
  activeConferenceId: string
  setName: (n: string) => void
  setCountry: (c: string) => void
  setStanceOverview: (s: string) => void
  setCommitteeMatrix: (committee: string, firstName: string) => void
  setCountdownDate: (d: string) => void
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
  const [conferences, setConferences] = useState<DelegateConference[]>(() => [
    defaultConference(generateId()),
  ])
  const [activeConferenceId, setActiveConferenceIdState] = useState<string>(() => conferences[0]?.id ?? '')
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

  useEffect(() => {
    if (!userId) {
      setIsLoaded(true)
      return
    }
    let cancelled = false
    loadDelegateData(userId)
      .then((data) => {
        if (cancelled || !data) return
        if (data.conferences.length > 0) {
          setConferences(data.conferences)
          setActiveConferenceIdState(data.activeConferenceId || data.conferences[0].id)
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
  const setStanceOverview = useCallback((s: string) => updateActive((c) => ({ ...c, stanceOverview: s })), [updateActive])
  const setCommitteeMatrix = useCallback(
    (committee: string, firstName: string) =>
      updateActive((c) => ({
        ...c,
        committeeMatrix: { ...c.committeeMatrix, [committee]: firstName },
      })),
    [updateActive]
  )
  const setCountdownDate = useCallback((d: string) => updateActive((c) => ({ ...c, countdownDate: d })), [updateActive])
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

  const value: DelegateContextValue = {
    ...current,
    conferences,
    activeConferenceId: activeId ?? '',
    setName,
    setCountry,
    setStanceOverview,
    setCommitteeMatrix,
    setCountdownDate,
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
