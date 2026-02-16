import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from './firebase'

const CONFIG_COLLECTION = 'config'
const COMMITTEES_DOC_ID = 'committees'
const USER_CONFIG_COLLECTION = 'userConfig'

export interface CommitteeOption {
  value: string
  label: string
}

function isValidOptions(data: unknown): data is CommitteeOption[] {
  return (
    Array.isArray(data) &&
    data.length > 0 &&
    data.every((x) => x && typeof (x as CommitteeOption).value === 'string' && typeof (x as CommitteeOption).label === 'string')
  )
}

/**
 * Load committee options from global config (read by anyone; survives site data clear).
 */
export async function loadCommitteeOptionsFromFirestore(): Promise<CommitteeOption[] | null> {
  if (!db) return null
  try {
    const ref = doc(db, CONFIG_COLLECTION, COMMITTEES_DOC_ID)
    const snap = await getDoc(ref)
    if (!snap.exists()) return null
    const data = snap.data()
    const options = data?.options ?? data?.committeeOptions ?? data
    if (isValidOptions(options)) return options
    return null
  } catch {
    return null
  }
}

/**
 * Load committee options saved for this user (persists across site data clear when signed in).
 */
export async function loadUserCommitteeOptions(userId: string): Promise<CommitteeOption[] | null> {
  if (!db || !userId) return null
  try {
    const ref = doc(db, USER_CONFIG_COLLECTION, userId)
    const snap = await getDoc(ref)
    if (!snap.exists()) return null
    const data = snap.data()
    const options = data?.committeeOptions ?? data?.options ?? data
    if (isValidOptions(options)) return options
    return null
  } catch {
    return null
  }
}

/**
 * Save committee options for this user so they persist after site data clear.
 */
export async function saveUserCommitteeOptions(userId: string, options: CommitteeOption[]): Promise<void> {
  if (!db || !userId) return
  try {
    const ref = doc(db, USER_CONFIG_COLLECTION, userId)
    await setDoc(ref, { committeeOptions: options, updatedAt: new Date().toISOString() }, { merge: true })
  } catch {
    // ignore
  }
}
