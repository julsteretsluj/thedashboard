import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from './firebase'

const COLLECTION = 'chairData'

/** Chair state as persisted to Firestore (same shape as ChairContext state). */
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
}

export async function loadChairData(userId: string): Promise<ChairDataDoc | null> {
  if (!db) return null
  const ref = doc(db, COLLECTION, userId)
  const snap = await getDoc(ref)
  if (!snap.exists()) return null
  return snap.data() as ChairDataDoc
}

export async function saveChairData(
  userId: string,
  data: ChairDataDoc
): Promise<void> {
  if (!db) return
  const ref = doc(db, COLLECTION, userId)
  await setDoc(ref, data)
}
