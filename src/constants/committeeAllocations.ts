/**
 * Possible participants (country/delegation allocations) per committee.
 * Used in Chair Room (add delegate) and Delegate Matrix (delegation dropdown per committee).
 * Real participants (already in the room) are merged in at runtime in Chair.
 * Non-traditional committees (Arab League, EU, IOC, UKPC, Press Corps, HCC) guided by THAIMUN-style allocations.
 */
import { DELEGATION_OPTIONS } from './delegations'
import { COMMITTEE_OPTIONS } from './committees'
import { US_SENATE_ALLOCATION_OPTIONS } from './usSenate'
import {
  ARAB_LEAGUE_ALLOCATION,
  EU_ALLOCATION,
  IOC_ALLOCATION,
  UKPC_ALLOCATION,
  PRESS_CORPS_ALLOCATION,
  HCC_ALLOCATION,
} from './nonTraditionalAllocations'

/** UNSC: 5 permanent + 10 elected (example composition; chairs can add custom via "Other"). */
const UNSC_DELEGATIONS = [
  'China',
  'France',
  'Russian Federation',
  'United Kingdom',
  'United States',
  'Albania',
  'Brazil',
  'Gabon',
  'Ghana',
  'India',
  'Ireland',
  'Kenya',
  'Mexico',
  'Norway',
  'United Arab Emirates',
] as const

/** Historical Security Council: same 15 as typical UNSC. */
const HSC_DELEGATIONS = [...UNSC_DELEGATIONS]

/** Map from committee option value to limited allocation. Single source of truth keyed by value only. */
const ALLOCATION_BY_VALUE: Record<string, readonly string[]> = {
  UNSC: UNSC_DELEGATIONS,
  HSC: HSC_DELEGATIONS,
  'US-Senate': US_SENATE_ALLOCATION_OPTIONS,
  AL: ARAB_LEAGUE_ALLOCATION,
  EU: EU_ALLOCATION,
  IOPC: IOC_ALLOCATION,
  UKPC: UKPC_ALLOCATION,
  PC: PRESS_CORPS_ALLOCATION,
  HCC: HCC_ALLOCATION,
}

const FULL_UNGA = [...DELEGATION_OPTIONS]

/** Known limited-allocation committee values. */
const LIMITED_VALUES = new Set(Object.keys(ALLOCATION_BY_VALUE))

/** Normalize dashes so "AL - Arab League" and "AL — Arab League" both match. */
function normalizeForMatch(s: string): string {
  return (s ?? '').replace(/[\u2013\u2014\u2212\-]/g, '-').trim()
}

/** Resolve committee string (value or label) to committee option value. */
function toCommitteeValue(committeeValueOrLabel: string): string {
  const key = (committeeValueOrLabel ?? '').trim()
  if (!key) return ''
  if (ALLOCATION_BY_VALUE[key]) return key
  const normKey = normalizeForMatch(key)
  const option = COMMITTEE_OPTIONS.find(
    (o) =>
      o.value === key ||
      o.label === key ||
      normalizeForMatch(o.label) === normKey
  )
  if (option) return option.value
  const prefixMatch = key.match(/^([A-Za-z0-9\-]+)\s*[—\-–\s]/)
  if (prefixMatch?.[1] && LIMITED_VALUES.has(prefixMatch[1])) return prefixMatch[1]
  return key
}

/**
 * Returns possible delegation (country/role) options for a committee.
 * Use in Chair when adding delegates and in Delegate Matrix per-committee tab.
 * @param committeeValueOrLabel - Committee value (e.g. UNSC, AL) or display label; custom names get full UNGA.
 */
export function getDelegationsForCommittee(committeeValueOrLabel: string): string[] {
  if (!committeeValueOrLabel || !committeeValueOrLabel.trim()) {
    return FULL_UNGA
  }
  const value = toCommitteeValue(committeeValueOrLabel)
  const limited = value ? ALLOCATION_BY_VALUE[value] : undefined
  if (limited) return [...limited]
  return FULL_UNGA
}

/**
 * Returns allocation options for a committee, merging real participants (already in the room)
 * with possible participants. Real participants appear first so chairs see who's already added.
 * @param committeeValueOrLabel - Current committee
 * @param alreadyInRoom - Country names already added as delegates (real participants)
 */
export function getAllocationOptionsForCommittee(
  committeeValueOrLabel: string,
  alreadyInRoom: string[]
): string[] {
  const possible = getDelegationsForCommittee(committeeValueOrLabel)
  const inRoomSet = new Set(alreadyInRoom)
  const possibleSet = new Set(possible)
  const onlyInRoom = alreadyInRoom.filter((c) => !possibleSet.has(c))
  const inRoomAndPossible = alreadyInRoom.filter((c) => possibleSet.has(c))
  const notYetInRoom = possible.filter((c) => !inRoomSet.has(c))
  return [...inRoomAndPossible, ...notYetInRoom, ...onlyInRoom]
}
