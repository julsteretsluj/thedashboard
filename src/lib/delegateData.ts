import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from './firebase'
import type { DelegateConference } from '../types'

const COLLECTION = 'delegateData'

export interface DelegateDataDoc {
  conferences: DelegateConference[]
  activeConferenceId: string
}

export async function loadDelegateData(
  userId: string
): Promise<DelegateDataDoc | null> {
  if (!db) return null
  const ref = doc(db, COLLECTION, userId)
  const snap = await getDoc(ref)
  if (!snap.exists()) return null
  return snap.data() as DelegateDataDoc
}

export async function saveDelegateData(
  userId: string,
  data: DelegateDataDoc
): Promise<void> {
  if (!db) return
  const ref = doc(db, COLLECTION, userId)
  await setDoc(ref, data)
}
