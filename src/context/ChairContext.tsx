import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react'
import type { Delegate, DelegateStrike, DelegateFeedback, DelegateFeedbackType, Motion, Speaker, DelegateScore } from '../types'
import { getPresetDelegationFlag } from '../constants/delegationFlags'
import { loadChairData, saveChairData, type ChairDataDoc } from '../lib/chairData'

const CHAIR_STATE_STORAGE_KEY = 'seamuns-dashboard-chair-state'

interface ChairState {
  committee: string
  topic: string
  /** Optional universe for fictional committees (e.g. Star Wars, Harry Potter). Displayed before topic. */
  universe: string
  sessionStarted: boolean
  sessionStartTime: string | null
  delegates: Delegate[]
  delegateStrikes: DelegateStrike[]
  delegateFeedback: DelegateFeedback[]
  motions: Motion[]
  speakers: Speaker[]
  activeSpeaker: Speaker | null
  speakerDuration: number
  rollCallComplete: boolean
  crisisSlides: string[]
  crisisSpeakers: string[]
  crisisFacts: string[]
  crisisPathways: string[]
  archive: { type: string; name: string; content?: string }[]
  voteInProgress: Motion | null
  delegateVotes: Record<string, 'yes' | 'no' | 'abstain'>
  flowChecklist: Record<string, boolean>
  prepChecklist: Record<string, boolean>
  /** Custom emoji per delegation (e.g. "FWC" -> "🏴"). Overrides preset flags. */
  delegationEmojiOverrides: Record<string, string>
  chairName: string
  chairEmail: string
  delegateScores: Record<string, DelegateScore>
}

const defaultState: ChairState = {
  committee: 'UNSC',
  topic: 'Cybersecurity and International Peace',
  universe: '',
  sessionStarted: false,
  sessionStartTime: null,
  delegates: [],
  delegateStrikes: [],
  delegateFeedback: [],
  motions: [],
  speakers: [],
  activeSpeaker: null,
  speakerDuration: 60,
  rollCallComplete: false,
  crisisSlides: [],
  crisisSpeakers: [],
  crisisFacts: [],
  crisisPathways: [],
  archive: [],
  voteInProgress: null,
  delegateVotes: {},
  flowChecklist: {},
  prepChecklist: {},
  delegationEmojiOverrides: {},
  chairName: '',
  chairEmail: '',
  delegateScores: {},
}

type ChairContextValue = ChairState & {
  setCommittee: (c: string) => void
  setTopic: (t: string) => void
  setUniverse: (u: string) => void
  setChairName: (n: string) => void
  setChairEmail: (e: string) => void
  startSession: () => void
  stopSession: () => void
  addDelegate: (d: Omit<Delegate, 'id'>) => void
  removeDelegate: (id: string) => void
  updateDelegate: (id: string, patch: Partial<Delegate>) => void
  addMotion: (text: string, type: 'motion' | 'point') => void
  starMotion: (id: string) => void
  setMotionStatus: (id: string, status: Motion['status']) => void
  startVote: (motionId: string) => void
  recordVote: (delegateId: string, vote: 'yes' | 'no' | 'abstain') => void
  endVote: () => void
  addToSpeakers: (delegateId: string, country: string, name: string) => void
  removeFromSpeakers: (id: string) => void
  setActiveSpeaker: (s: Speaker | null) => void
  setSpeakerDuration: (n: number) => void
  setRollCallComplete: (v: boolean) => void
  addCrisisSlide: (s: string) => void
  addCrisisSpeaker: (s: string) => void
  addCrisisFact: (s: string) => void
  addCrisisPathway: (s: string) => void
  addToArchive: (type: string, name: string, content?: string) => void
  addStrike: (delegateId: string, type: string) => void
  removeStrike: (delegateId: string, type: string) => void
  getStrikeCount: (delegateId: string, type: string) => number
  getStrikeCountsByType: (delegateId: string) => Record<string, number>
  addDelegateFeedback: (delegateId: string, type: DelegateFeedbackType) => void
  getFeedbackCountsByType: (delegateId: string) => Record<DelegateFeedbackType, number>
  toggleFlowStep: (stepId: string) => void
  isFlowStepDone: (stepId: string) => boolean
  resetFlowChecklist: () => void
  togglePrepStep: (stepId: string) => void
  isPrepStepDone: (stepId: string) => boolean
  resetPrepChecklist: () => void
  setDelegationEmoji: (delegation: string, emoji: string | null) => void
  getDelegationEmoji: (delegation: string) => string
  setDelegateScore: (delegateId: string, score: Partial<DelegateScore>) => void
  getDelegateScore: (delegateId: string) => DelegateScore
  saveToAccount: () => Promise<void>
  isSaving: boolean
  lastSaved: Date | null
  isLoaded: boolean
}

function loadChairStateFromStorage(): ChairState {
  try {
    const raw = localStorage.getItem(CHAIR_STATE_STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<ChairState>
      return { ...defaultState, ...parsed, delegateScores: parsed.delegateScores ?? {} }
    }
  } catch {
    /* ignore */
  }
  return defaultState
}

const ChairContext = createContext<ChairContextValue | null>(null)

export function ChairProvider({
  children,
  userId = null,
}: {
  children: ReactNode
  userId?: string | null
}) {
  const [state, setState] = useState<ChairState>(loadChairStateFromStorage)
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  // Load chair state from Firestore (or backfill from localStorage when no doc yet)
  useEffect(() => {
    if (!userId) {
      setIsLoaded(true)
      return
    }
    let cancelled = false
    loadChairData(userId)
      .then((data) => {
        if (cancelled) return
        if (data) {
          setState({
            ...defaultState,
            ...data,
            delegates: Array.isArray(data.delegates) ? (data.delegates as ChairState['delegates']) : defaultState.delegates,
            delegateStrikes: Array.isArray(data.delegateStrikes) ? (data.delegateStrikes as ChairState['delegateStrikes']) : defaultState.delegateStrikes,
            delegateFeedback: Array.isArray(data.delegateFeedback) ? (data.delegateFeedback as ChairState['delegateFeedback']) : defaultState.delegateFeedback,
            motions: Array.isArray(data.motions) ? (data.motions as ChairState['motions']) : defaultState.motions,
            speakers: Array.isArray(data.speakers) ? (data.speakers as ChairState['speakers']) : defaultState.speakers,
            activeSpeaker: data.activeSpeaker as ChairState['activeSpeaker'],
            voteInProgress: data.voteInProgress as ChairState['voteInProgress'],
            delegateScores: (data.delegateScores as ChairState['delegateScores']) ?? {},
          })
        } else {
          const local = loadChairStateFromStorage()
          saveChairData(userId, local as unknown as ChairDataDoc).catch(() => {})
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

  // Persist chair state to localStorage (debounced) so refresh doesn't lose data
  useEffect(() => {
    const t = setTimeout(() => {
      try {
        localStorage.setItem(CHAIR_STATE_STORAGE_KEY, JSON.stringify(state))
      } catch {
        /* ignore */
      }
    }, 1000)
    return () => clearTimeout(t)
  }, [state])

  const saveToAccount = useCallback(async () => {
    if (!userId) return
    setIsSaving(true)
    try {
      await saveChairData(userId, state as unknown as ChairDataDoc)
      setLastSaved(new Date())
    } finally {
      setIsSaving(false)
    }
  }, [userId, state])

  // Autosave to Firestore when signed in and after initial load (debounced on state change)
  useEffect(() => {
    if (!userId || !isLoaded) return
    const t = setTimeout(() => {
      saveToAccount()
    }, 3000)
    return () => clearTimeout(t)
  }, [userId, isLoaded, state, saveToAccount])

  // Autosave every 5 minutes
  useEffect(() => {
    if (!userId || !isLoaded) return
    const interval = setInterval(() => saveToAccount(), 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [userId, isLoaded, saveToAccount])

  const setCommittee = useCallback((committee: string) => {
    setState((s) => ({ ...s, committee }))
  }, [])
  const setTopic = useCallback((topic: string) => {
    setState((s) => ({ ...s, topic }))
  }, [])
  const setUniverse = useCallback((universe: string) => {
    setState((s) => ({ ...s, universe }))
  }, [])
  const setChairName = useCallback((chairName: string) => {
    setState((s) => ({ ...s, chairName }))
  }, [])
  const setChairEmail = useCallback((chairEmail: string) => {
    setState((s) => ({ ...s, chairEmail }))
  }, [])
  const startSession = useCallback(() => {
    setState((s) => ({
      ...s,
      sessionStarted: true,
      sessionStartTime: new Date().toISOString(),
    }))
  }, [])
  const stopSession = useCallback(() => {
    setState((s) => ({
      ...s,
      sessionStarted: false,
      sessionStartTime: null,
    }))
  }, [])
  const addDelegate = useCallback((d: Omit<Delegate, 'id'>) => {
    setState((s) => ({
      ...s,
      delegates: [...s.delegates, { ...d, id: crypto.randomUUID() }],
    }))
  }, [])
  const removeDelegate = useCallback((id: string) => {
    setState((s) => {
      const { [id]: _, ...restScores } = s.delegateScores ?? {}
      return {
        ...s,
        delegates: s.delegates.filter((x) => x.id !== id),
        delegateStrikes: s.delegateStrikes.filter((x) => x.delegateId !== id),
        delegateFeedback: s.delegateFeedback.filter((x) => x.delegateId !== id),
        delegateScores: restScores,
      }
    })
  }, [])
  const updateDelegate = useCallback((id: string, patch: Partial<Delegate>) => {
    setState((s) => ({
      ...s,
      delegates: s.delegates.map((d) => (d.id === id ? { ...d, ...patch } : d)),
    }))
  }, [])
  const addMotion = useCallback((text: string, type: 'motion' | 'point') => {
    setState((s) => ({
      ...s,
      motions: [
        ...s.motions,
        {
          id: crypto.randomUUID(),
          text,
          type,
          starred: false,
          timestamp: new Date().toISOString(),
          status: 'active',
        },
      ],
    }))
  }, [])
  const starMotion = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      motions: s.motions.map((m) => (m.id === id ? { ...m, starred: !m.starred } : m)),
    }))
  }, [])
  const setMotionStatus = useCallback((id: string, status: Motion['status']) => {
    setState((s) => ({
      ...s,
      motions: s.motions.map((m) => (m.id === id ? { ...m, status } : m)),
    }))
  }, [])
  const startVote = useCallback((motionId: string) => {
    setState((s) => {
      const motion = s.motions.find((m) => m.id === motionId)
      if (!motion || motion.type === 'point') return s
      return {
        ...s,
        voteInProgress: motion,
        delegateVotes: {},
      }
    })
  }, [])
  const recordVote = useCallback((delegateId: string, vote: 'yes' | 'no' | 'abstain') => {
    setState((s) => ({
      ...s,
      delegateVotes: { ...s.delegateVotes, [delegateId]: vote },
    }))
  }, [])
  const endVote = useCallback(() => {
    setState((s) => {
      if (!s.voteInProgress) return s
      const yes = Object.values(s.delegateVotes).filter((v) => v === 'yes').length
      const no = Object.values(s.delegateVotes).filter((v) => v === 'no').length
      const abstain = Object.values(s.delegateVotes).filter((v) => v === 'abstain').length
      return {
        ...s,
        motions: s.motions.map((m) =>
          m.id === s.voteInProgress!.id
            ? { ...m, votes: { yes, no, abstain }, status: yes > no ? 'passed' : 'failed' }
            : m
        ),
        voteInProgress: null,
        delegateVotes: {},
      }
    })
  }, [])
  const addToSpeakers = useCallback((delegateId: string, country: string, name: string) => {
    setState((s) => ({
      ...s,
      speakers: [
        ...s.speakers,
        {
          id: crypto.randomUUID(),
          delegateId,
          country,
          name,
          duration: s.speakerDuration,
          speaking: false,
        },
      ],
    }))
  }, [])
  const removeFromSpeakers = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      speakers: s.speakers.filter((x) => x.id !== id),
      activeSpeaker: s.activeSpeaker?.id === id ? null : s.activeSpeaker,
    }))
  }, [])
  const setActiveSpeaker = useCallback((speaker: Speaker | null) => {
    const now = Date.now()
    setState((s) => ({
      ...s,
      activeSpeaker: speaker ? { ...speaker, speaking: true, startTime: now } : null,
      speakers: s.speakers.map((sp) =>
        sp.id === speaker?.id ? { ...sp, speaking: true, startTime: now } : { ...sp, speaking: false }
      ),
    }))
  }, [])
  const setSpeakerDuration = useCallback((duration: number) => {
    setState((s) => ({ ...s, speakerDuration: duration }))
  }, [])
  const setRollCallComplete = useCallback((rollCallComplete: boolean) => {
    setState((s) => ({ ...s, rollCallComplete }))
  }, [])
  const addCrisisSlide = useCallback((slide: string) => {
    setState((s) => ({ ...s, crisisSlides: [...s.crisisSlides, slide] }))
  }, [])
  const addCrisisSpeaker = useCallback((speaker: string) => {
    setState((s) => ({ ...s, crisisSpeakers: [...s.crisisSpeakers, speaker] }))
  }, [])
  const addCrisisFact = useCallback((fact: string) => {
    setState((s) => ({ ...s, crisisFacts: [...s.crisisFacts, fact] }))
  }, [])
  const addCrisisPathway = useCallback((pathway: string) => {
    setState((s) => ({ ...s, crisisPathways: [...s.crisisPathways, pathway] }))
  }, [])
  const addToArchive = useCallback((type: string, name: string, content?: string) => {
    setState((s) => ({ ...s, archive: [...s.archive, { type, name, content }] }))
  }, [])

  const addStrike = useCallback((delegateId: string, type: string) => {
    setState((s) => ({
      ...s,
      delegateStrikes: [
        ...s.delegateStrikes,
        { delegateId, type, timestamp: new Date().toISOString() },
      ],
    }))
  }, [])
  const removeStrike = useCallback((delegateId: string, type: string) => {
    setState((s) => {
      const idx = [...s.delegateStrikes].reverse().findIndex(
        (x) => x.delegateId === delegateId && x.type === type
      )
      if (idx === -1) return s
      const actualIdx = s.delegateStrikes.length - 1 - idx
      return {
        ...s,
        delegateStrikes: s.delegateStrikes.filter((_, i) => i !== actualIdx),
      }
    })
  }, [])

  const addDelegateFeedback = useCallback((delegateId: string, type: DelegateFeedbackType) => {
    setState((s) => ({
      ...s,
      delegateFeedback: [
        ...s.delegateFeedback,
        { delegateId, type, timestamp: new Date().toISOString() },
      ],
    }))
  }, [])

  const getFeedbackCountsByType = useCallback((delegateId: string): Record<DelegateFeedbackType, number> => {
    const counts: Record<DelegateFeedbackType, number> = { compliment: 0, concern: 0 }
    state.delegateFeedback
      .filter((f) => f.delegateId === delegateId)
      .forEach((f) => {
        counts[f.type] = (counts[f.type] ?? 0) + 1
      })
    return counts
  }, [state.delegateFeedback])

  const toggleFlowStep = useCallback((stepId: string) => {
    setState((s) => ({
      ...s,
      flowChecklist: {
        ...s.flowChecklist,
        [stepId]: !s.flowChecklist[stepId],
      },
    }))
  }, [])
  const isFlowStepDone = useCallback((stepId: string) => !!state.flowChecklist[stepId], [state.flowChecklist])
  const resetFlowChecklist = useCallback(() => {
    setState((s) => ({ ...s, flowChecklist: {} }))
  }, [])

  const togglePrepStep = useCallback((stepId: string) => {
    setState((s) => ({
      ...s,
      prepChecklist: {
        ...s.prepChecklist,
        [stepId]: !s.prepChecklist[stepId],
      },
    }))
  }, [])
  const isPrepStepDone = useCallback((stepId: string) => !!state.prepChecklist[stepId], [state.prepChecklist])
  const resetPrepChecklist = useCallback(() => {
    setState((s) => ({ ...s, prepChecklist: {} }))
  }, [])

  const setDelegationEmoji = useCallback((delegation: string, emoji: string | null) => {
    setState((s) => {
      const next = { ...s.delegationEmojiOverrides }
      if (emoji === null || emoji === '') delete next[delegation]
      else next[delegation] = emoji
      return { ...s, delegationEmojiOverrides: next }
    })
  }, [])
  const getDelegationEmoji = useCallback((delegation: string): string => {
    const override = state.delegationEmojiOverrides[delegation]
    if (override !== undefined && override !== '') return override
    return getPresetDelegationFlag(delegation)
  }, [state.delegationEmojiOverrides])

  const setDelegateScore = useCallback((delegateId: string, score: Partial<DelegateScore>) => {
    setState((s) => ({
      ...s,
      delegateScores: {
        ...(s.delegateScores ?? {}),
        [delegateId]: { ...(s.delegateScores?.[delegateId] ?? {}), ...score },
      },
    }))
  }, [])
  const getDelegateScore = useCallback((delegateId: string): DelegateScore => {
    return state.delegateScores?.[delegateId] ?? {}
  }, [state.delegateScores])

  const value: ChairContextValue = {
    ...state,
    setCommittee,
    setTopic,
    setUniverse,
    setChairName,
    setChairEmail,
    startSession,
    stopSession,
    addDelegate,
    removeDelegate,
    updateDelegate,
    addMotion,
    starMotion,
    setMotionStatus,
    startVote,
    recordVote,
    endVote,
    addToSpeakers,
    removeFromSpeakers,
    setActiveSpeaker,
    setSpeakerDuration,
    setRollCallComplete,
    addCrisisSlide,
    addCrisisSpeaker,
    addCrisisFact,
    addCrisisPathway,
    addToArchive,
    addStrike,
    removeStrike,
    getStrikeCount: (delegateId: string, type: string) =>
      state.delegateStrikes.filter((s) => s.delegateId === delegateId && s.type === type).length,
    getStrikeCountsByType: (delegateId: string) => {
      const counts: Record<string, number> = {}
      state.delegateStrikes
        .filter((s) => s.delegateId === delegateId)
        .forEach((s) => {
          counts[s.type] = (counts[s.type] ?? 0) + 1
        })
      return counts
    },
    addDelegateFeedback,
    getFeedbackCountsByType,
    toggleFlowStep,
    isFlowStepDone,
    resetFlowChecklist,
    togglePrepStep,
    isPrepStepDone,
    resetPrepChecklist,
    setDelegationEmoji,
    getDelegationEmoji,
    setDelegateScore,
    getDelegateScore,
    saveToAccount,
    isSaving,
    lastSaved,
    isLoaded,
  }

  return <ChairContext.Provider value={value}>{children}</ChairContext.Provider>
}

export function useChair() {
  const ctx = useContext(ChairContext)
  if (!ctx) throw new Error('useChair must be used within ChairProvider')
  return ctx
}
