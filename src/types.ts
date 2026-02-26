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
  /** When true, delegate cannot vote (e.g. sanctions). */
  votingRightsRevoked?: boolean
  /** When true, delegate cannot be added to speakers list (e.g. sanctions). */
  speakingRightsRevoked?: boolean
}

export interface DelegateStrike {
  delegateId: string
  type: string
  timestamp: string
}

export type DelegateFeedbackType = 'compliment' | 'concern'

export interface DelegateFeedback {
  id?: string
  delegateId: string
  type: DelegateFeedbackType
  /** Reason (required when giving feedback from Digital Room). */
  reason?: string
  timestamp: string
}

export interface Resolution {
  id: string
  title: string
  mainSubmitters: string[]
  coSubmitters: string[]
  gdocLink: string
  timestamp: string
  votes?: { yes: number; no: number; abstain: number }
}

export interface Amendment {
  id: string
  text: string
  /** Id of resolution this amends (optional) */
  resolutionId?: string
  submitters: string[]
  gdocLink: string
  timestamp: string
  votes?: { yes: number; no: number; abstain: number }
}

export interface Motion {
  id: string
  text: string
  type: 'motion' | 'point'
  starred: boolean
  timestamp: string
  status: 'active' | 'passed' | 'failed' | 'tabled'
  /** Delegate/country that submitted the motion or point */
  submitter?: string
  /** Preset name (e.g. Moderated caucus, Consultation) when created from preset */
  presetLabel?: string
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

/** SEAMUN I delegate scoring (1–8 per category). Delegate criteria = 48 pts, Position paper = 40 pts. */
export interface DelegateScore {
  creativity?: number
  diplomacy?: number
  collaboration?: number
  leadership?: number
  knowledgeResearch?: number
  participation?: number
  researchDepth?: number
  countryStanceAlignment?: number
  policyAccuracy?: number
  proposedSolutions?: number
  formattingStyleCitations?: number
  evidenceOfExcellence?: string
  justification?: string
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
  /** When set, uses preset-specific allocations (e.g. MUN07 IV matrix). */
  presetId?: string
  /** When set, only these committees use preset allocations. undefined = all, [] = none. */
  presetAllocationCommittees?: string[]
  country: string
  /** Delegate's email (optional), e.g. for chair contact. */
  delegateEmail: string
  stanceOverview: string
  /** Number of committees for this conference (set when registering) */
  committeeCount: number
  /** Which committees (set when registering) */
  committees: string[]
  /** Committee topics (up to 3) for this conference */
  committeeTopics?: string[]
  /** Legacy: committee -> first name (migrated to committeeMatrixEntries) */
  committeeMatrix?: Record<string, string>
  /** Committee matrix: committee, first name, delegation */
  committeeMatrixEntries: CommitteeMatrixEntry[]
  /** Pinned committee values (max 3), shown first in tabs */
  pinnedCommittees?: string[]
  countdownDate: string
  /** Conference end date/time (optional). */
  conferenceEndDate: string
  /** Optional position paper deadline (date/time) for a second countdown. */
  positionPaperDeadline: string
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
