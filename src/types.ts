export interface Delegate {
  id: string
  country: string
  name?: string
  committee?: string
  present?: boolean
  vote?: 'yes' | 'no' | 'abstain' | null
}

export interface DelegateStrike {
  delegateId: string
  type: string
  timestamp: string
}

export type DelegateFeedbackType = 'compliment' | 'concern'

export interface DelegateFeedback {
  delegateId: string
  type: DelegateFeedbackType
  timestamp: string
}

export interface Motion {
  id: string
  text: string
  type: 'motion' | 'point'
  starred: boolean
  timestamp: string
  status: 'active' | 'passed' | 'failed' | 'tabled'
  votes?: { yes: number; no: number; abstain: number }
}

export interface Speaker {
  id: string
  delegateId: string
  country: string
  name: string
  duration: number
  startTime?: number
  speaking: boolean
}

export interface CommitteeSession {
  id: string
  committee: string
  topic: string
  startedAt: string | null
  stoppedAt: string | null
  rollCallComplete: boolean
}

export interface CommitteeMatrixEntry {
  committee: string
  firstName: string
  delegation: string
}

export interface DelegateConference {
  id: string
  name: string
  country: string
  stanceOverview: string
  /** Number of committees for this conference (set when registering) */
  committeeCount: number
  /** Which committees (set when registering) */
  committees: string[]
  /** Legacy: committee -> first name (migrated to committeeMatrixEntries) */
  committeeMatrix?: Record<string, string>
  /** Committee matrix: committee, first name, delegation */
  committeeMatrixEntries: CommitteeMatrixEntry[]
  countdownDate: string
  checklist: {
    positionPaper: boolean
    researchTopic: boolean
    researchCountryStance: boolean
    openingSpeech: boolean
    modSpeeches: boolean
  }
  trustedSources: string[]
  nationSources: string[]
  uploadedResources: { name: string; url?: string }[]
}
