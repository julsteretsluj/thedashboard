import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react'
import type { Delegate, DelegateStrike, DelegateFeedback, DelegateFeedbackType, Motion, Resolution, Amendment, Speaker, DelegateScore } from '../types'
import { getPresetDelegationFlag } from '../constants/delegationFlags'
import { getMajorityForMotion, computePassed } from '../constants/motionMajorities'
import { loadChairData, saveChairData, type ChairDataDoc, type ChairConferenceDoc } from '../lib/chairData'
import { PRESET_CONFERENCES } from '../constants/presetConferences'

export interface SessionRecord {
  id: string
  name: string
  startTime: string
  endTime: string
  durationSeconds: number
  totalPausedMs: number
}

export interface ChairConference {
  id: string
  name: string
  /** When set, uses preset-specific allocations (e.g. MUN07 IV matrix). */
  presetId?: string
  /** When set, only these committees use preset allocations. When undefined, all use preset. When [], none. */
  presetAllocationCommittees?: string[]
  data: ChairState
}

const MAX_TOPICS = 3

interface ChairState {
  committee: string
  /** Committee topics (up to 3). Replaces legacy single topic. */
  topics: string[]
  /** Optional universe for fictional committees (e.g. Star Wars, Harry Potter). Displayed before topic. */
  universe: string
  sessionStarted: boolean
  sessionStartTime: string | null
  /** Session duration in minutes. null = unlimited (count up). */
  sessionDurationMinutes: number | null
  /** Current session display name */
  sessionName: string
  /** When paused (ms since epoch). null = not paused. */
  sessionPausedAt: number | null
  /** Total ms spent paused so far (for elapsed calc) */
  sessionTotalPausedMs: number
  /** Completed/archived sessions */
  sessionRecords: SessionRecord[]
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
  resolutionVoteInProgress: Resolution | null
  amendmentVoteInProgress: Amendment | null
  delegateVotes: Record<string, 'yes' | 'no' | 'abstain'>
  resolutions: Resolution[]
  amendments: Amendment[]
  flowChecklist: Record<string, boolean>
  prepChecklist: Record<string, boolean>
  /** Custom emoji per delegation (e.g. "FWC" -> "🏴"). Overrides preset flags. */
  delegationEmojiOverrides: Record<string, string>
  chairName: string
  chairEmail: string
  delegateScores: Record<string, DelegateScore>
}

const defaultState: ChairState = {
  committee: '',
  topics: ['The Question of'],
  universe: '',
  sessionStarted: false,
  sessionStartTime: null,
  sessionDurationMinutes: null,
  sessionName: '',
  sessionPausedAt: null,
  sessionTotalPausedMs: 0,
  sessionRecords: [],
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
  resolutionVoteInProgress: null,
  amendmentVoteInProgress: null,
  delegateVotes: {},
  resolutions: [],
  amendments: [],
  flowChecklist: {},
  prepChecklist: {},
  delegationEmojiOverrides: {},
  chairName: '',
  chairEmail: '',
  delegateScores: {},
}

type ChairContextValue = ChairState & {
  setCommittee: (c: string) => void
  setTopics: (t: string[]) => void
  setTopicAtIndex: (index: number, value: string) => void
  setUniverse: (u: string) => void
  setChairName: (n: string) => void
  setChairEmail: (e: string) => void
  startSession: () => void
  stopSession: () => void
  pauseSession: () => void
  resumeSession: () => void
  setSessionName: (name: string) => void
  setSessionDurationMinutes: (minutes: number | null) => void
  deleteSessionFromHistory: (id: string) => void
  updateSessionInHistory: (id: string, patch: Partial<Pick<SessionRecord, 'name' | 'durationSeconds'>>) => void
  addDelegate: (d: Omit<Delegate, 'id'>) => void
  removeDelegate: (id: string) => void
  updateDelegate: (id: string, patch: Partial<Delegate>) => void
  addMotion: (text: string, type: 'motion' | 'point', submitter?: string, presetLabel?: string) => void
  starMotion: (id: string) => void
  setMotionStatus: (id: string, status: Motion['status']) => void
  startVote: (motionId: string) => void
  startResolutionVote: (resolutionId: string) => void
  startAmendmentVote: (amendmentId: string) => void
  recordVote: (delegateId: string, vote: 'yes' | 'no' | 'abstain') => void
  endVote: () => void
  endResolutionVote: () => void
  endAmendmentVote: () => void
  addResolution: (r: Omit<Resolution, 'id' | 'timestamp'>) => void
  removeResolution: (id: string) => void
  addAmendment: (a: Omit<Amendment, 'id' | 'timestamp'>) => void
  removeAmendment: (id: string) => void
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
  addDelegateFeedback: (delegateId: string, type: DelegateFeedbackType, reason: string) => void
  removeDelegateFeedback: (feedbackId: string) => void
  updateDelegateFeedback: (feedbackId: string, patch: { reason?: string }) => void
  getDelegateFeedbackItems: (delegateId: string) => DelegateFeedback[]
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
  conferences: ChairConference[]
  activeConferenceId: string
  setActiveConference: (id: string) => void
  addConference: () => void
  addConferenceFromPreset: (presetId: string) => void
  removeConference: (id: string) => void
  setConferenceName: (id: string, name: string) => void
  setPresetAllocationCommittees: (committees: string[] | undefined) => void
  /** When set, allocation matrices use preset-specific options (e.g. MUN07 IV). */
  currentPresetId: string | undefined
  /** When set, only these committees use preset allocations. undefined = all, [] = none. */
  currentPresetAllocationCommittees: string[] | undefined
}

function normalizeSpeaker(s: unknown): Speaker | null {
  if (!s || typeof s !== 'object') return null
  const o = s as Record<string, unknown>
  const id = typeof o.id === 'string' ? o.id : null
  const delegateId = typeof o.delegateId === 'string' ? o.delegateId : id ?? ''
  const country = typeof o.country === 'string' ? o.country : ''
  const name = typeof o.name === 'string' ? o.name : country
  const duration = typeof o.duration === 'number' && o.duration >= 0 ? o.duration : 60
  const speaking = o.speaking === true
  let startTime: number | undefined
  if (typeof o.startTime === 'number' && o.startTime > 0) {
    startTime = o.startTime < 1e12 ? o.startTime * 1000 : o.startTime
  }
  if (!id) return null
  return { id, delegateId, country, name, duration, speaking, ...(startTime != null && { startTime }) }
}

function normalizeSpeakerData(
  speakers: unknown[],
  _activeSpeaker: unknown, // never restore — timer is session-only
  speakerDuration: number
): { speakers: Speaker[]; activeSpeaker: Speaker | null; speakerDuration: number } {
  const normalized = speakers
    .map(normalizeSpeaker)
    .filter((s): s is Speaker => s != null)
  const dur = Math.max(30, Math.min(300, Number.isFinite(speakerDuration) ? speakerDuration : 60))
  const speakersCleared = normalized.map((s) => ({ ...s, speaking: false }))
  return { speakers: speakersCleared, activeSpeaker: null, speakerDuration: dur }
}

function defaultChairConference(id: string): ChairConference {
  return { id, name: '', data: { ...defaultState } }
}

function migrateChairConference(c: ChairConferenceDoc): ChairConference {
  const { speakers, speakerDuration: sd } = normalizeSpeakerData(
    Array.isArray(c.data.speakers) ? c.data.speakers : [],
    null,
    typeof c.data.speakerDuration === 'number' ? c.data.speakerDuration : 60
  )
  const raw = c.data as ChairState & { topic?: string; topics?: string[] }
  const topics = Array.isArray(raw.topics)
    ? raw.topics.slice(0, MAX_TOPICS)
    : typeof raw.topic === 'string' && raw.topic
      ? [raw.topic]
      : defaultState.topics
  const data: ChairState = {
    ...defaultState,
    ...c.data,
    topics,
    speakers,
    activeSpeaker: null,
    speakerDuration: sd,
    delegates: Array.isArray(c.data.delegates) ? (c.data.delegates as ChairState['delegates']) : defaultState.delegates,
    delegateStrikes: Array.isArray(c.data.delegateStrikes) ? (c.data.delegateStrikes as ChairState['delegateStrikes']) : defaultState.delegateStrikes,
    delegateFeedback: Array.isArray(c.data.delegateFeedback) ? (c.data.delegateFeedback as ChairState['delegateFeedback']) : defaultState.delegateFeedback,
    motions: Array.isArray(c.data.motions) ? (c.data.motions as ChairState['motions']) : defaultState.motions,
    resolutions: Array.isArray(c.data.resolutions) ? (c.data.resolutions as ChairState['resolutions']) : defaultState.resolutions,
    amendments: Array.isArray(c.data.amendments) ? (c.data.amendments as ChairState['amendments']) : defaultState.amendments,
    delegateScores: (c.data.delegateScores as ChairState['delegateScores']) ?? {},
    voteInProgress: (c.data.voteInProgress as ChairState['voteInProgress']) ?? null,
    resolutionVoteInProgress: null,
    amendmentVoteInProgress: null,
    sessionDurationMinutes: (c.data as { sessionDurationMinutes?: number | null }).sessionDurationMinutes ?? null,
    sessionName: (c.data as { sessionName?: string }).sessionName ?? '',
    sessionPausedAt: null,
    sessionTotalPausedMs: 0,
    sessionRecords: Array.isArray((c.data as { sessionRecords?: unknown[] }).sessionRecords)
      ? (c.data as { sessionRecords: SessionRecord[] }).sessionRecords
      : [],
  }
  return { id: c.id, name: c.name, presetId: c.presetId, presetAllocationCommittees: c.presetAllocationCommittees, data }
}

const ChairContext = createContext<ChairContextValue | null>(null)

function getCurrentConference(
  conferences: ChairConference[],
  activeId: string
): ChairConference {
  const c = conferences.find((x) => x.id === activeId)
  if (c) return c
  if (conferences.length > 0) return conferences[0]
  return defaultChairConference(crypto.randomUUID())
}

export function ChairProvider({
  children,
  userId = null,
}: {
  children: ReactNode
  userId?: string | null
}) {
  const [conferences, setConferences] = useState<ChairConference[]>(() => [defaultChairConference(crypto.randomUUID())])
  const [activeConferenceId, setActiveConferenceIdState] = useState<string>('')
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  const activeId = activeConferenceId || conferences[0]?.id
  const current = getCurrentConference(conferences, activeId ?? '')
  const state = current.data

  useEffect(() => {
    if (!activeId && conferences[0]) setActiveConferenceIdState(conferences[0].id)
  }, [activeId, conferences])

  // Load chair data from Firestore
  useEffect(() => {
    if (!userId) {
      setIsLoaded(true)
      return
    }
    let cancelled = false
    loadChairData(userId)
      .then((data) => {
        if (cancelled) return
        if (data?.conferences?.length) {
          setConferences(data.conferences.map(migrateChairConference))
          setActiveConferenceIdState(data.activeConferenceId || data.conferences[0].id)
        }
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setIsLoaded(true)
      })
    return () => { cancelled = true }
  }, [userId])

  const saveToAccount = useCallback(async () => {
    if (!userId) return
    setIsSaving(true)
    try {
      const payload: ChairDataDoc = {
        conferences: conferences.map((c) => ({
          id: c.id,
          name: c.name,
          presetId: c.presetId,
          presetAllocationCommittees: c.presetAllocationCommittees,
          data: {
            ...c.data,
            activeSpeaker: null,
            sessionRecords: c.data.sessionRecords ?? [],
          } as ChairConferenceDoc['data'],
        })),
        activeConferenceId: activeId ?? conferences[0]?.id ?? '',
      }
      await saveChairData(userId, payload)
      setLastSaved(new Date())
    } catch (err) {
      console.error('Failed to save chair data to Supabase:', err)
    } finally {
      setIsSaving(false)
    }
  }, [userId, conferences, activeId])

  // Autosave to Supabase when signed in (1s debounce — sessions and all data persist promptly)
  useEffect(() => {
    if (!userId || !isLoaded) return
    const t = setTimeout(() => saveToAccount(), 1000)
    return () => clearTimeout(t)
  }, [userId, isLoaded, conferences, activeId, saveToAccount])

  // Autosave every 5 minutes
  useEffect(() => {
    if (!userId || !isLoaded) return
    const interval = setInterval(() => saveToAccount(), 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [userId, isLoaded, saveToAccount])

  // Save when user switches tab or minimizes (before potential close)
  useEffect(() => {
    if (!userId || !isLoaded) return
    const handler = () => {
      if (document.visibilityState === 'hidden') saveToAccount()
    }
    document.addEventListener('visibilitychange', handler)
    return () => document.removeEventListener('visibilitychange', handler)
  }, [userId, isLoaded, saveToAccount])

  const updateActive = useCallback((updater: (s: ChairState) => ChairState) => {
    setConferences((list) => {
      const idx = list.findIndex((c) => c.id === activeId)
      if (idx < 0) return list
      const next = [...list]
      next[idx] = { ...next[idx], data: updater(list[idx].data) }
      return next
    })
  }, [activeId])

  const setCommittee = useCallback((committee: string) => updateActive((s) => ({ ...s, committee })), [updateActive])
  const setTopics = useCallback((topics: string[]) => updateActive((s) => ({ ...s, topics: topics.slice(0, MAX_TOPICS) })), [updateActive])
  const setTopicAtIndex = useCallback((index: number, value: string) => {
    updateActive((s) => {
      const next = [...(s.topics ?? [])]
      while (next.length <= index) next.push('')
      next[index] = value
      return { ...s, topics: next.slice(0, MAX_TOPICS) }
    })
  }, [updateActive])
  const setUniverse = useCallback((universe: string) => updateActive((s) => ({ ...s, universe })), [updateActive])
  const setChairName = useCallback((chairName: string) => updateActive((s) => ({ ...s, chairName })), [updateActive])
  const setChairEmail = useCallback((chairEmail: string) => updateActive((s) => ({ ...s, chairEmail })), [updateActive])
  const startSession = useCallback(() => updateActive((s) => ({
    ...s,
    sessionStarted: true,
    sessionStartTime: new Date().toISOString(),
    sessionPausedAt: null,
    sessionTotalPausedMs: 0,
  })), [updateActive])
  const stopSession = useCallback(() => updateActive((s) => {
    if (!s.sessionStartTime) return s
    const endTime = new Date().toISOString()
    const totalPaused = s.sessionTotalPausedMs + (s.sessionPausedAt ? Date.now() - s.sessionPausedAt : 0)
    const durationSeconds = Math.floor((new Date(endTime).getTime() - new Date(s.sessionStartTime).getTime() - totalPaused) / 1000)
    const record: SessionRecord = {
      id: crypto.randomUUID(),
      name: s.sessionName || `Session ${(s.sessionRecords?.length ?? 0) + 1}`,
      startTime: s.sessionStartTime,
      endTime,
      durationSeconds,
      totalPausedMs: totalPaused,
    }
    return {
      ...s,
      sessionStarted: false,
      sessionStartTime: null,
      sessionName: '',
      sessionPausedAt: null,
      sessionTotalPausedMs: 0,
      sessionRecords: [...(s.sessionRecords ?? []), record],
    }
  }), [updateActive])
  const pauseSession = useCallback(() => updateActive((s) => {
    if (!s.sessionStarted || s.sessionPausedAt) return s
    return { ...s, sessionPausedAt: Date.now() }
  }), [updateActive])
  const resumeSession = useCallback(() => updateActive((s) => {
    if (!s.sessionStarted || !s.sessionPausedAt) return s
    return { ...s, sessionTotalPausedMs: s.sessionTotalPausedMs + (Date.now() - s.sessionPausedAt), sessionPausedAt: null }
  }), [updateActive])
  const setSessionName = useCallback((name: string) => updateActive((s) => ({ ...s, sessionName: name })), [updateActive])
  const setSessionDurationMinutes = useCallback((minutes: number | null) => updateActive((s) => ({ ...s, sessionDurationMinutes: minutes })), [updateActive])
  const deleteSessionFromHistory = useCallback((id: string) => {
    updateActive((s) => ({
      ...s,
      sessionRecords: (s.sessionRecords ?? []).filter((r) => r.id !== id),
    }))
  }, [updateActive])
  const updateSessionInHistory = useCallback((id: string, patch: Partial<Pick<SessionRecord, 'name' | 'durationSeconds'>>) => {
    updateActive((s) => ({
      ...s,
      sessionRecords: (s.sessionRecords ?? []).map((r) =>
        r.id === id ? { ...r, ...patch } : r
      ),
    }))
  }, [updateActive])
  const addDelegate = useCallback((d: Omit<Delegate, 'id'>) => {
    updateActive((s) => ({ ...s, delegates: [...s.delegates, { ...d, id: crypto.randomUUID() }] }))
  }, [updateActive])
  const removeDelegate = useCallback((id: string) => {
    updateActive((s) => {
      const { [id]: _, ...restScores } = s.delegateScores ?? {}
      return {
        ...s,
        delegates: s.delegates.filter((x) => x.id !== id),
        delegateStrikes: s.delegateStrikes.filter((x) => x.delegateId !== id),
        delegateFeedback: s.delegateFeedback.filter((x) => x.delegateId !== id),
        delegateScores: restScores,
      }
    })
  }, [updateActive])
  const updateDelegate = useCallback((id: string, patch: Partial<Delegate>) => {
    updateActive((s) => ({ ...s, delegates: s.delegates.map((d) => (d.id === id ? { ...d, ...patch } : d)) }))
  }, [updateActive])
  const addMotion = useCallback((text: string, type: 'motion' | 'point', submitter?: string, presetLabel?: string) => {
    updateActive((s) => ({
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
          ...(submitter?.trim() && { submitter: submitter.trim() }),
          ...(presetLabel?.trim() && { presetLabel: presetLabel.trim() }),
        },
      ],
    }))
  }, [updateActive])
  const starMotion = useCallback((id: string) => {
    updateActive((s) => ({ ...s, motions: s.motions.map((m) => (m.id === id ? { ...m, starred: !m.starred } : m)) }))
  }, [updateActive])
  const setMotionStatus = useCallback((id: string, status: Motion['status']) => {
    updateActive((s) => ({ ...s, motions: s.motions.map((m) => (m.id === id ? { ...m, status } : m)) }))
  }, [updateActive])
  const startVote = useCallback((motionId: string) => {
    updateActive((s) => {
      const motion = s.motions.find((m) => m.id === motionId)
      if (!motion || motion.type === 'point') return s
      return { ...s, voteInProgress: motion, resolutionVoteInProgress: null, amendmentVoteInProgress: null, delegateVotes: {} }
    })
  }, [updateActive])
  const startResolutionVote = useCallback((resolutionId: string) => {
    updateActive((s) => {
      const resolution = s.resolutions.find((r) => r.id === resolutionId)
      if (!resolution) return s
      return { ...s, voteInProgress: null, resolutionVoteInProgress: resolution, amendmentVoteInProgress: null, delegateVotes: {} }
    })
  }, [updateActive])
  const startAmendmentVote = useCallback((amendmentId: string) => {
    updateActive((s) => {
      const amendment = s.amendments.find((a) => a.id === amendmentId)
      if (!amendment) return s
      return { ...s, voteInProgress: null, resolutionVoteInProgress: null, amendmentVoteInProgress: amendment, delegateVotes: {} }
    })
  }, [updateActive])
  const recordVote = useCallback((delegateId: string, vote: 'yes' | 'no' | 'abstain') => {
    updateActive((s) => ({ ...s, delegateVotes: { ...s.delegateVotes, [delegateId]: vote } }))
  }, [updateActive])
  const endVote = useCallback(() => {
    updateActive((s) => {
      if (!s.voteInProgress) return s
      const yes = Object.values(s.delegateVotes).filter((v) => v === 'yes').length
      const no = Object.values(s.delegateVotes).filter((v) => v === 'no').length
      const abstain = Object.values(s.delegateVotes).filter((v) => v === 'abstain').length
      const m = s.voteInProgress
      const { type: majType } = getMajorityForMotion(m.presetLabel, m.type)
      const passed = majType === 'chair' ? false : computePassed(yes, no, abstain, majType)
      return {
        ...s,
        motions: s.motions.map((motion) =>
          motion.id === m.id ? { ...motion, votes: { yes, no, abstain }, status: majType === 'chair' ? 'tabled' : (passed ? 'passed' : 'failed') } : motion
        ),
        voteInProgress: null,
        delegateVotes: {},
      }
    })
  }, [updateActive])
  const endResolutionVote = useCallback(() => {
    updateActive((s) => {
      if (!s.resolutionVoteInProgress) return s
      const yes = Object.values(s.delegateVotes).filter((v) => v === 'yes').length
      const no = Object.values(s.delegateVotes).filter((v) => v === 'no').length
      const abstain = Object.values(s.delegateVotes).filter((v) => v === 'abstain').length
      const passed = computePassed(yes, no, abstain, 'two-thirds')
      return {
        ...s,
        resolutions: s.resolutions.map((r) =>
          r.id === s.resolutionVoteInProgress!.id ? { ...r, votes: { yes, no, abstain }, status: passed ? 'passed' : 'failed' } : r
        ),
        resolutionVoteInProgress: null,
        delegateVotes: {},
      }
    })
  }, [updateActive])
  const endAmendmentVote = useCallback(() => {
    updateActive((s) => {
      if (!s.amendmentVoteInProgress) return s
      const yes = Object.values(s.delegateVotes).filter((v) => v === 'yes').length
      const no = Object.values(s.delegateVotes).filter((v) => v === 'no').length
      const abstain = Object.values(s.delegateVotes).filter((v) => v === 'abstain').length
      const passed = computePassed(yes, no, abstain, 'simple')
      return {
        ...s,
        amendments: s.amendments.map((a) =>
          a.id === s.amendmentVoteInProgress!.id ? { ...a, votes: { yes, no, abstain }, status: passed ? 'passed' : 'failed' } : a
        ),
        amendmentVoteInProgress: null,
        delegateVotes: {},
      }
    })
  }, [updateActive])
  const addResolution = useCallback((r: Omit<Resolution, 'id' | 'timestamp'>) => {
    updateActive((s) => ({
      ...s,
      resolutions: [...s.resolutions, { ...r, id: crypto.randomUUID(), timestamp: new Date().toISOString() }],
    }))
  }, [updateActive])
  const removeResolution = useCallback((id: string) => {
    updateActive((s) => ({
      ...s,
      resolutions: s.resolutions.filter((x) => x.id !== id),
      resolutionVoteInProgress: s.resolutionVoteInProgress?.id === id ? null : s.resolutionVoteInProgress,
    }))
  }, [updateActive])
  const addAmendment = useCallback((a: Omit<Amendment, 'id' | 'timestamp'>) => {
    updateActive((s) => ({
      ...s,
      amendments: [...s.amendments, { ...a, id: crypto.randomUUID(), timestamp: new Date().toISOString() }],
    }))
  }, [updateActive])
  const removeAmendment = useCallback((id: string) => {
    updateActive((s) => ({
      ...s,
      amendments: s.amendments.filter((x) => x.id !== id),
      amendmentVoteInProgress: s.amendmentVoteInProgress?.id === id ? null : s.amendmentVoteInProgress,
    }))
  }, [updateActive])
  const addToSpeakers = useCallback((delegateId: string, country: string, name: string) => {
    updateActive((s) => ({
      ...s,
      speakers: [
        ...s.speakers,
        { id: crypto.randomUUID(), delegateId, country, name, duration: s.speakerDuration, speaking: false },
      ],
    }))
  }, [updateActive])
  const removeFromSpeakers = useCallback((id: string) => {
    updateActive((s) => ({
      ...s,
      speakers: s.speakers.filter((x) => x.id !== id),
      activeSpeaker: s.activeSpeaker?.id === id ? null : s.activeSpeaker,
    }))
  }, [updateActive])
  const setActiveSpeaker = useCallback((speaker: Speaker | null) => {
    const now = Date.now()
    updateActive((s) => ({
      ...s,
      activeSpeaker: speaker ? { ...speaker, speaking: true, startTime: now } : null,
      speakers: s.speakers.map((sp) =>
        sp.id === speaker?.id ? { ...sp, speaking: true, startTime: now } : { ...sp, speaking: false }
      ),
    }))
  }, [updateActive])
  const setSpeakerDuration = useCallback((duration: number) => updateActive((s) => ({ ...s, speakerDuration: duration })), [updateActive])
  const setRollCallComplete = useCallback((rollCallComplete: boolean) => updateActive((s) => ({ ...s, rollCallComplete })), [updateActive])
  const addCrisisSlide = useCallback((slide: string) => updateActive((s) => ({ ...s, crisisSlides: [...s.crisisSlides, slide] })), [updateActive])
  const addCrisisSpeaker = useCallback((speaker: string) => updateActive((s) => ({ ...s, crisisSpeakers: [...s.crisisSpeakers, speaker] })), [updateActive])
  const addCrisisFact = useCallback((fact: string) => updateActive((s) => ({ ...s, crisisFacts: [...s.crisisFacts, fact] })), [updateActive])
  const addCrisisPathway = useCallback((pathway: string) => updateActive((s) => ({ ...s, crisisPathways: [...s.crisisPathways, pathway] })), [updateActive])
  const addToArchive = useCallback((type: string, name: string, content?: string) => updateActive((s) => ({ ...s, archive: [...s.archive, { type, name, content }] })), [updateActive])

  const addStrike = useCallback((delegateId: string, type: string) => {
    updateActive((s) => ({
      ...s,
      delegateStrikes: [...s.delegateStrikes, { delegateId, type, timestamp: new Date().toISOString() }],
    }))
  }, [updateActive])
  const removeStrike = useCallback((delegateId: string, type: string) => {
    updateActive((s) => {
      const idx = [...s.delegateStrikes].reverse().findIndex((x) => x.delegateId === delegateId && x.type === type)
      if (idx === -1) return s
      const actualIdx = s.delegateStrikes.length - 1 - idx
      return { ...s, delegateStrikes: s.delegateStrikes.filter((_, i) => i !== actualIdx) }
    })
  }, [updateActive])

  const addDelegateFeedback = useCallback((delegateId: string, type: DelegateFeedbackType, reason: string) => {
    updateActive((s) => ({
      ...s,
      delegateFeedback: [...s.delegateFeedback, { id: crypto.randomUUID(), delegateId, type, reason: reason.trim() || undefined, timestamp: new Date().toISOString() }],
    }))
  }, [updateActive])

  const removeDelegateFeedback = useCallback((feedbackId: string) => {
    updateActive((s) => ({
      ...s,
      delegateFeedback: s.delegateFeedback.filter((f) => {
        const id = f.id ?? `legacy-${f.delegateId}-${f.type}-${f.timestamp}`
        return id !== feedbackId
      }),
    }))
  }, [updateActive])

  const updateDelegateFeedback = useCallback((feedbackId: string, patch: { reason?: string }) => {
    updateActive((s) => ({
      ...s,
      delegateFeedback: s.delegateFeedback.map((f) => {
        const id = f.id ?? `legacy-${f.delegateId}-${f.type}-${f.timestamp}`
        return id === feedbackId ? { ...f, ...(patch.reason !== undefined && { reason: patch.reason.trim() || undefined }) } : f
      }),
    }))
  }, [updateActive])

  const getDelegateFeedbackItems = useCallback((delegateId: string): DelegateFeedback[] => {
    return state.delegateFeedback
      .filter((f) => f.delegateId === delegateId)
      .map((f) => ({ ...f, id: f.id ?? `legacy-${f.delegateId}-${f.type}-${f.timestamp}` }))
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
  }, [state.delegateFeedback])

  const getFeedbackCountsByType = useCallback((delegateId: string): Record<DelegateFeedbackType, number> => {
    const counts: Record<DelegateFeedbackType, number> = { compliment: 0, concern: 0 }
    state.delegateFeedback
      .filter((f) => f.delegateId === delegateId)
      .forEach((f) => {
        const type = f.type === 'compliment' || f.type === 'concern' ? f.type : (String(f.type).toLowerCase() === 'compliment' ? 'compliment' : 'concern')
        counts[type] = (counts[type] ?? 0) + 1
      })
    return counts
  }, [state.delegateFeedback])

  const toggleFlowStep = useCallback((stepId: string) => {
    updateActive((s) => ({ ...s, flowChecklist: { ...s.flowChecklist, [stepId]: !s.flowChecklist[stepId] } }))
  }, [updateActive])
  const isFlowStepDone = useCallback((stepId: string) => !!state.flowChecklist[stepId], [state.flowChecklist])
  const resetFlowChecklist = useCallback(() => updateActive((s) => ({ ...s, flowChecklist: {} })), [updateActive])

  const togglePrepStep = useCallback((stepId: string) => {
    updateActive((s) => ({ ...s, prepChecklist: { ...s.prepChecklist, [stepId]: !s.prepChecklist[stepId] } }))
  }, [updateActive])
  const isPrepStepDone = useCallback((stepId: string) => !!state.prepChecklist[stepId], [state.prepChecklist])
  const resetPrepChecklist = useCallback(() => updateActive((s) => ({ ...s, prepChecklist: {} })), [updateActive])

  const setDelegationEmoji = useCallback((delegation: string, emoji: string | null) => {
    updateActive((s) => {
      const next = { ...s.delegationEmojiOverrides }
      if (emoji === null || emoji === '') delete next[delegation]
      else next[delegation] = emoji
      return { ...s, delegationEmojiOverrides: next }
    })
  }, [updateActive])
  const getDelegationEmoji = useCallback((delegation: string): string => {
    const override = state.delegationEmojiOverrides[delegation]
    if (override !== undefined && override !== '') return override
    return getPresetDelegationFlag(delegation, state.committee)
  }, [state.delegationEmojiOverrides, state.committee])

  const setDelegateScore = useCallback((delegateId: string, score: Partial<DelegateScore>) => {
    updateActive((s) => ({
      ...s,
      delegateScores: {
        ...(s.delegateScores ?? {}),
        [delegateId]: { ...(s.delegateScores?.[delegateId] ?? {}), ...score },
      },
    }))
  }, [updateActive])
  const getDelegateScore = useCallback((delegateId: string): DelegateScore => {
    return state.delegateScores?.[delegateId] ?? {}
  }, [state.delegateScores])

  const addConference = useCallback(() => {
    const id = crypto.randomUUID()
    setConferences((list) => [...list, defaultChairConference(id)])
    setActiveConferenceIdState(id)
  }, [])
  const addConferenceFromPreset = useCallback((presetId: string) => {
    const preset = PRESET_CONFERENCES.find((p) => p.id === presetId)
    if (!preset) return
    const id = crypto.randomUUID()
    const conf = defaultChairConference(id)
    conf.presetId = presetId
    setConferences((list) => [...list, conf])
    setActiveConferenceIdState(id)
  }, [])
  const removeConference = useCallback((id: string) => {
    const remaining = conferences.filter((c) => c.id !== id)
    const nextList = remaining.length > 0 ? remaining : [defaultChairConference(crypto.randomUUID())]
    const newActive = id === activeId ? (nextList[0]?.id ?? '') : activeId
    setConferences(nextList)
    setActiveConferenceIdState(newActive)
  }, [conferences, activeId])
  const setActiveConference = useCallback((id: string) => setActiveConferenceIdState(id), [])
  const setConferenceName = useCallback((id: string, name: string) => {
    setConferences((list) => list.map((c) => (c.id === id ? { ...c, name } : c)))
  }, [])
  const setPresetAllocationCommittees = useCallback((committees: string[] | undefined) => {
    if (!activeId) return
    setConferences((list) =>
      list.map((c) => (c.id === activeId ? { ...c, presetAllocationCommittees: committees } : c))
    )
  }, [activeId])

  const value: ChairContextValue = {
    ...state,
    setCommittee,
    setTopics,
    setTopicAtIndex,
    setUniverse,
    setChairName,
    setChairEmail,
    startSession,
    stopSession,
    pauseSession,
    resumeSession,
    setSessionName,
    setSessionDurationMinutes,
    deleteSessionFromHistory,
    updateSessionInHistory,
    addDelegate,
    removeDelegate,
    updateDelegate,
    addMotion,
    starMotion,
    setMotionStatus,
    startVote,
    startResolutionVote,
    startAmendmentVote,
    recordVote,
    endVote,
    endResolutionVote,
    endAmendmentVote,
    addResolution,
    removeResolution,
    addAmendment,
    removeAmendment,
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
    removeDelegateFeedback,
    updateDelegateFeedback,
    getDelegateFeedbackItems,
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
    conferences,
    activeConferenceId: activeId ?? '',
    setActiveConference,
    addConference,
    addConferenceFromPreset,
    removeConference,
    setConferenceName,
    setPresetAllocationCommittees,
    currentPresetId: current?.presetId,
    currentPresetAllocationCommittees: current?.presetAllocationCommittees,
  }

  return <ChairContext.Provider value={value}>{children}</ChairContext.Provider>
}

export function useChair() {
  const ctx = useContext(ChairContext)
  if (!ctx) throw new Error('useChair must be used within ChairProvider')
  return ctx
}
