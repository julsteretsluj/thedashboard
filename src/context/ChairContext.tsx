import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import type { Delegate, DelegateStrike, Motion, Speaker } from '../types'

interface ChairState {
  committee: string
  topic: string
  sessionStarted: boolean
  sessionStartTime: string | null
  delegates: Delegate[]
  delegateStrikes: DelegateStrike[]
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
}

const defaultState: ChairState = {
  committee: 'UNSC',
  topic: 'Cybersecurity and International Peace',
  sessionStarted: false,
  sessionStartTime: null,
  delegates: [],
  delegateStrikes: [],
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
}

type ChairContextValue = ChairState & {
  setCommittee: (c: string) => void
  setTopic: (t: string) => void
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
}

const ChairContext = createContext<ChairContextValue | null>(null)

export function ChairProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ChairState>(defaultState)

  const setCommittee = useCallback((committee: string) => {
    setState((s) => ({ ...s, committee }))
  }, [])
  const setTopic = useCallback((topic: string) => {
    setState((s) => ({ ...s, topic }))
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
    setState((s) => ({
      ...s,
      delegates: s.delegates.filter((x) => x.id !== id),
      delegateStrikes: s.delegateStrikes.filter((x) => x.delegateId !== id),
    }))
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
    setState((s) => ({
      ...s,
      voteInProgress: s.motions.find((m) => m.id === motionId) ?? null,
      delegateVotes: {},
    }))
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
    setState((s) => ({
      ...s,
      activeSpeaker: speaker,
      speakers: s.speakers.map((sp) =>
        sp.id === speaker?.id ? { ...sp, speaking: true, startTime: Date.now() } : { ...sp, speaking: false }
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

  const value: ChairContextValue = {
    ...state,
    setCommittee,
    setTopic,
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
  }

  return <ChairContext.Provider value={value}>{children}</ChairContext.Provider>
}

export function useChair() {
  const ctx = useContext(ChairContext)
  if (!ctx) throw new Error('useChair must be used within ChairProvider')
  return ctx
}
