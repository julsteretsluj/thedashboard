import { supabase } from './supabase'

/**
 * All chair info persisted to Supabase: committee, topic, delegates, motions,
 * speakers, crisis, archive, voting, checklists, emoji overrides, chair name/email.
 */
export interface ChairDataDoc {
  committee: string
  topic: string
  universe: string
  sessionStarted: boolean
  sessionStartTime: string | null
  delegates: unknown[]
  delegateStrikes: unknown[]
  delegateFeedback: unknown[]
  motions: unknown[]
  speakers: unknown[]
  activeSpeaker: unknown
  speakerDuration: number
  rollCallComplete: boolean
  crisisSlides: string[]
  crisisSpeakers: string[]
  crisisFacts: string[]
  crisisPathways: string[]
  archive: { type: string; name: string; content?: string }[]
  voteInProgress: unknown
  delegateVotes: Record<string, 'yes' | 'no' | 'abstain'>
  flowChecklist: Record<string, boolean>
  prepChecklist: Record<string, boolean>
  delegationEmojiOverrides: Record<string, string>
  chairName: string
  chairEmail: string
  delegateScores?: Record<string, unknown>
}

export async function loadChairData(userId: string): Promise<ChairDataDoc | null> {
  if (!supabase) return null
  const { data, error } = await supabase
    .from('chair_data')
    .select('data')
    .eq('user_id', userId)
    .maybeSingle()
  if (error || !data?.data) return null
  return data.data as ChairDataDoc
}

export async function saveChairData(
  userId: string,
  data: ChairDataDoc
): Promise<void> {
  if (!supabase) return
  await supabase
    .from('chair_data')
    .upsert({ user_id: userId, data, updated_at: new Date().toISOString() }, { onConflict: 'user_id' })
}
