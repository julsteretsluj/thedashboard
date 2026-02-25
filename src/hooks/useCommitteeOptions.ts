import { useState, useEffect, useRef } from 'react'
import { COMMITTEE_OPTIONS } from '../constants/committees'
import { useSupabaseAuth } from '../context/SupabaseAuthContext'
import {
  loadUserCommitteeOptions,
  loadCommitteeOptionsFromSupabase,
  saveUserCommitteeOptions,
  type CommitteeOption,
} from '../lib/committeeConfig'

export type { CommitteeOption }

const BUILT_IN_OPTIONS: CommitteeOption[] = COMMITTEE_OPTIONS.map((o) => ({ value: o.value, label: o.label }))

/**
 * Committee list for dropdowns. Loads from Firestore (user doc then global config) so it
 * survives site data clear when signed in; then /committees.json; then built-in.
 */
export function useCommitteeOptions(): CommitteeOption[] {
  const [options, setOptions] = useState<CommitteeOption[]>(BUILT_IN_OPTIONS)
  const { user } = useSupabaseAuth()
  const userId = user?.uid ?? null
  const savedRef = useRef(false)

  useEffect(() => {
    let cancelled = false

    async function load() {
      // 1. Signed-in: try user's saved committee list first (survives site data clear)
      if (userId) {
        const userOpts = await loadUserCommitteeOptions(userId)
        if (cancelled) return
        if (userOpts?.length) {
          setOptions(userOpts)
          // Re-save migrated list (e.g. EP → EU) so Firestore doc stays up to date
          saveUserCommitteeOptions(userId, userOpts).catch(() => {})
          return
        }
      }

      // 2. Global Supabase config
      const supabaseOpts = await loadCommitteeOptionsFromSupabase()
      if (cancelled) return
      if (supabaseOpts?.length) {
        setOptions(supabaseOpts)
        if (userId && !savedRef.current) {
          savedRef.current = true
          saveUserCommitteeOptions(userId, supabaseOpts).catch(() => {})
        }
        return
      }

      // 3. /committees.json
      try {
        const r = await fetch('/committees.json')
        if (cancelled) return
        if (r.ok) {
          const data = (await r.json()) as unknown
          if (Array.isArray(data) && data.length > 0 && data.every((x: unknown) => x && typeof (x as CommitteeOption).value === 'string' && typeof (x as CommitteeOption).label === 'string')) {
            const list = data as CommitteeOption[]
            setOptions(list)
            if (userId && !savedRef.current) {
              savedRef.current = true
              saveUserCommitteeOptions(userId, list).catch(() => {})
            }
            return
          }
        }
      } catch {
        // ignore
      }

      // 4. Built-in (already set as initial state); save for signed-in user so next time we have it in Firestore
      if (userId && !savedRef.current) {
        savedRef.current = true
        saveUserCommitteeOptions(userId, BUILT_IN_OPTIONS).catch(() => {})
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [userId])

  return options
}
