import { supabase } from './supabase'
import type { DelegateConference } from '../types'

export interface DelegateDataDoc {
  conferences: DelegateConference[]
  activeConferenceId: string
}

export async function loadDelegateData(
  userId: string
): Promise<DelegateDataDoc | null> {
  if (!supabase) return null
  const { data, error } = await supabase
    .from('delegate_data')
    .select('data')
    .eq('user_id', userId)
    .maybeSingle()
  if (error || !data?.data) return null
  return data.data as DelegateDataDoc
}

export async function saveDelegateData(
  userId: string,
  data: DelegateDataDoc
): Promise<void> {
  if (!supabase) return
  await supabase
    .from('delegate_data')
    .upsert({ user_id: userId, data, updated_at: new Date().toISOString() }, { onConflict: 'user_id' })
}
