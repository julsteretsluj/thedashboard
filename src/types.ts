/** Roll call: absent; present (may abstain from voting); present-and-voting (must vote, cannot abstain). */
export type RollCallStatus = 'absent' | 'present' | 'present-and-voting'

export interface Delegate {
  id: string
  country: string
  name?: string
  email?: string
  committee?: string
  /** @deprecated Use rollCallStatus. Kept for migration. */
  present?: boolean
  /** Roll call status. Defaults to absent if unset (or derived from present). */
  rollCallStatus?: RollCallStatus
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
    researchResolutions: boolean
    researchAllies: boolean
    researchNews: boolean
    positionPaperDraft: boolean
    positionPaperFinal: boolean
    positionPaperSubmit: boolean
    openingSpeechDraft: boolean
    openingSpeechTimed: boolean
    openingSpeech: boolean
    modSpeeches: boolean
    modCaucusPoints: boolean
    knowRules: boolean
    knowAgenda: boolean
    materialsReady: boolean
  }
  trustedSources: string[]
  nationSources: string[]
  uploadedResources: { name: string; url?: string }[]
}
