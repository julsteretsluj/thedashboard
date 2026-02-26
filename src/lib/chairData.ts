import { supabase } from './supabase'

/**
 * Single chair room state (committee, delegates, motions, etc.).
 */
export interface ChairStateDoc {
  committee: string
  /** Committee topics (up to 3). Legacy: topic string migrated to topics[0]. */
  topics?: string[]
  topic?: string
  universe: string
  sessionStarted: boolean
  sessionStartTime: string | null
  sessionDurationMinutes?: number | null
  sessionName?: string
  sessionRecords?: { id: string; name: string; startTime: string; endTime: string; durationSeconds: number; totalPausedMs: number }[]
  delegates: unknown[]
  delegateStrikes: unknown[]
  delegateFeedback: unknown[]
  motions: unknown[]
  speakers: unknown[]
  activeSpeaker?: unknown
  speakerDuration: number
  rollCallComplete: boolean
  crisisSlides: string[]
  crisisSpeakers: string[]
  crisisFacts: string[]
  crisisPathways: string[]
  archive: { type: string; name: string; content?: string }[]
  voteInProgress: unknown
  resolutionVoteInProgress?: unknown
  amendmentVoteInProgress?: unknown
  resolutions?: unknown[]
  amendments?: unknown[]
  delegateVotes: Record<string, 'yes' | 'no' | 'abstain'>
  flowChecklist: Record<string, boolean>
  prepChecklist: Record<string, boolean>
  delegationEmojiOverrides: Record<string, string>
  chairName: string
  chairEmail: string
  delegateScores?: Record<string, unknown>
}

/** One conference = one chair room state. */
export interface ChairConferenceDoc {
  id: string
  name: string
  presetId?: string
  presetAllocationCommittees?: string[]
  data: ChairStateDoc
}

/** Top-level persisted shape: multiple conferences per user. */
export interface ChairDataDoc {
  conferences: ChairConferenceDoc[]
  activeConferenceId: string
}

/** @deprecated Legacy flat doc — migrated to ChairDataDoc. */
export type ChairDataDocLegacy = ChairStateDoc

function isConferencesFormat(raw: unknown): raw is ChairDataDoc {
  return (
    raw != null &&
    typeof raw === 'object' &&
    Array.isArray((raw as ChairDataDoc).conferences) &&
    typeof (raw as ChairDataDoc).activeConferenceId === 'string'
  )
}

/** Migrate legacy flat doc to conferences format. */
export function migrateChairData(raw: unknown): ChairDataDoc {
  if (isConferencesFormat(raw) && raw.conferences.length > 0) {
    return raw
  }
  const legacy = raw as ChairDataDocLegacy | null
  const id = typeof crypto?.randomUUID === 'function' ? crypto.randomUUID() : `conf-${Date.now()}`
  const data: ChairStateDoc = legacy && typeof legacy === 'object'
    ? {
        committee: typeof legacy.committee === 'string' ? legacy.committee : 'UNSC',
        topics: Array.isArray((legacy as { topics?: string[] }).topics)
          ? (legacy as { topics: string[] }).topics.slice(0, 3)
          : typeof (legacy as { topic?: string }).topic === 'string'
            ? [(legacy as { topic: string }).topic]
            : ['The Question of'],
        universe: typeof legacy.universe === 'string' ? legacy.universe : '',
        sessionStarted: !!legacy.sessionStarted,
        sessionStartTime: legacy.sessionStartTime ?? null,
        sessionDurationMinutes: null,
        delegates: Array.isArray(legacy.delegates) ? legacy.delegates : [],
        delegateStrikes: Array.isArray(legacy.delegateStrikes) ? legacy.delegateStrikes : [],
        delegateFeedback: Array.isArray(legacy.delegateFeedback) ? legacy.delegateFeedback : [],
        motions: Array.isArray(legacy.motions) ? legacy.motions : [],
        speakers: Array.isArray(legacy.speakers) ? legacy.speakers : [],
        speakerDuration: typeof legacy.speakerDuration === 'number' ? legacy.speakerDuration : 60,
        rollCallComplete: !!legacy.rollCallComplete,
        crisisSlides: Array.isArray(legacy.crisisSlides) ? legacy.crisisSlides : [],
        crisisSpeakers: Array.isArray(legacy.crisisSpeakers) ? legacy.crisisSpeakers : [],
        crisisFacts: Array.isArray(legacy.crisisFacts) ? legacy.crisisFacts : [],
        crisisPathways: Array.isArray(legacy.crisisPathways) ? legacy.crisisPathways : [],
        archive: Array.isArray(legacy.archive) ? legacy.archive : [],
        voteInProgress: legacy.voteInProgress ?? null,
        delegateVotes: legacy.delegateVotes && typeof legacy.delegateVotes === 'object' ? legacy.delegateVotes : {},
        flowChecklist: legacy.flowChecklist && typeof legacy.flowChecklist === 'object' ? legacy.flowChecklist : {},
        prepChecklist: legacy.prepChecklist && typeof legacy.prepChecklist === 'object' ? legacy.prepChecklist : {},
        delegationEmojiOverrides: legacy.delegationEmojiOverrides && typeof legacy.delegationEmojiOverrides === 'object' ? legacy.delegationEmojiOverrides : {},
        chairName: typeof legacy.chairName === 'string' ? legacy.chairName : '',
        chairEmail: typeof legacy.chairEmail === 'string' ? legacy.chairEmail : '',
        resolutionVoteInProgress: legacy.resolutionVoteInProgress ?? null,
        amendmentVoteInProgress: legacy.amendmentVoteInProgress ?? null,
        resolutions: Array.isArray(legacy.resolutions) ? legacy.resolutions : [],
        amendments: Array.isArray(legacy.amendments) ? legacy.amendments : [],
        delegateScores: legacy.delegateScores ?? {},
        sessionName: '',
        sessionRecords: [],
      }
    : {
        committee: 'UNSC',
        topics: ['The Question of'],
        universe: '',
        sessionStarted: false,
        sessionStartTime: null,
        sessionDurationMinutes: null,
        sessionName: '',
        sessionRecords: [],
        delegates: [],
        delegateStrikes: [],
        delegateFeedback: [],
        motions: [],
        speakers: [],
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
      }
  return {
    conferences: [{ id, name: 'Default Conference', data }],
    activeConferenceId: id,
  }
}

export async function loadChairData(userId: string): Promise<ChairDataDoc | null> {
  if (!supabase) return null
  const { data, error } = await supabase
    .from('chair_data')
    .select('data')
    .eq('user_id', userId)
    .maybeSingle()
  if (error || !data?.data) return null
  return migrateChairData(data.data)
}

export async function saveChairData(
  userId: string,
  data: ChairDataDoc
): Promise<void> {
  if (!supabase) return
  const { error } = await supabase
    .from('chair_data')
    .upsert(
      { user_id: userId, data, updated_at: new Date().toISOString() },
      { onConflict: 'user_id' }
    )
  if (error) throw new Error(`Save failed: ${error.message}`)
}
