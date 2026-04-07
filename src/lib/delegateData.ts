import { supabase } from './supabase'
import type { DelegateConference } from '../types'
import type { RemoteDocLoad } from './remoteDocLoad'

export interface DelegateDataDoc {
  conferences: DelegateConference[]
  activeConferenceId: string
}

export async function loadDelegateData(
  userId: string
): Promise<RemoteDocLoad<DelegateDataDoc>> {
  if (!supabase) return { ok: true, doc: null }
  const { data, error } = await supabase
    .from('delegate_data')
    .select('data')
    .eq('user_id', userId)
    .maybeSingle()
  if (error) return { ok: false, error: error.message }
  if (!data?.data) return { ok: true, doc: null }
  try {
    const doc = data.data as DelegateDataDoc
    if (!doc || !Array.isArray(doc.conferences)) return { ok: true, doc: null }
    return { ok: true, doc }
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Invalid delegate data in database'
    return { ok: false, error: msg }
  }
}

export async function saveDelegateData(
  userId: string,
  data: DelegateDataDoc
): Promise<void> {
  if (!supabase) return
  const { error } = await supabase
    .from('delegate_data')
    .upsert({ user_id: userId, data, updated_at: new Date().toISOString() }, { onConflict: 'user_id' })
  if (error) throw new Error(`Save failed: ${error.message}`)
}
