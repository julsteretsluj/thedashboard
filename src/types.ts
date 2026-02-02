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

export interface DelegateConference {
  id: string
  name: string
  country: string
  stanceOverview: string
  committeeMatrix: Record<string, string> // committee -> first name
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
