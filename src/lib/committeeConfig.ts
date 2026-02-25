import { supabase } from './supabase'

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

/** Migrate old EP / European Parliament to EU — European Union; dedupe by value. */
function migrateCommitteeOptions(options: CommitteeOption[]): CommitteeOption[] {
  const migrated = options.map((o) => {
    if (o.value === 'EP' || (o.label && (o.label.includes('European Parliament') || o.label === 'EP — European Parliament'))) {
      return { value: 'EU', label: 'EU — European Union' }
    }
    return o
  })
  const byValue = new Map<string, CommitteeOption>()
  migrated.forEach((o) => byValue.set(o.value, o))
  return [...byValue.values()]
}

/**
 * Load committee options from global config (read by anyone).
 */
export async function loadCommitteeOptionsFromSupabase(): Promise<CommitteeOption[] | null> {
  if (!supabase) return null
  try {
    const { data, error } = await supabase
      .from('config')
      .select('options')
      .eq('key', 'committees')
      .maybeSingle()
    if (error || !data) return null
    const options = data.options ?? data
    if (isValidOptions(options)) return migrateCommitteeOptions(options)
    return null
  } catch {
    return null
  }
}

/**
 * Load committee options saved for this user.
 */
export async function loadUserCommitteeOptions(userId: string): Promise<CommitteeOption[] | null> {
  if (!supabase || !userId) return null
  try {
    const { data, error } = await supabase
      .from('user_config')
      .select('committee_options')
      .eq('user_id', userId)
      .maybeSingle()
    if (error || !data) return null
    const d = data as Record<string, unknown>
    const options = d.committee_options ?? d.options
    if (isValidOptions(options)) return migrateCommitteeOptions(options)
    return null
  } catch {
    return null
  }
}

/**
 * Save committee options for this user.
 */
export async function saveUserCommitteeOptions(userId: string, options: CommitteeOption[]): Promise<void> {
  if (!supabase || !userId) return
  try {
    await supabase
      .from('user_config')
      .upsert(
        { user_id: userId, committee_options: options, updated_at: new Date().toISOString() },
        { onConflict: 'user_id' }
      )
  } catch {
    // ignore
  }
}
