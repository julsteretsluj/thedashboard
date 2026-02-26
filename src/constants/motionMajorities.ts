/**
 * MUN motion majority requirements.
 * Simple majority = more yes than no.
 * 2/3 majority = yes >= 2/3 of (yes + no); abstentions don't count toward the threshold.
 */
export type MajorityType = 'simple' | 'two-thirds' | 'chair'

/** Labels (presetLabel) that require 2/3 majority. */
const TWO_THIRDS_LABELS = new Set([
  'close debate',
  'close the debate',
  'move to voting procedure',
  'move to voting',
  'adjourn the meeting',
  'suspend the meeting',
])

/** Points are decided by the chair, no vote. */
const CHAIR_DECIDES_LABELS = new Set([
  'point of order',
  'point of information',
  'point of personal privilege',
  'point of parliamentary inquiry',
  'right of reply',
])

export function getMajorityForMotion(presetLabel?: string, type?: 'motion' | 'point'): {
  type: MajorityType
  label: string
} {
  if (type === 'point') {
    return { type: 'chair', label: 'Chair decides' }
  }
  const lower = (presetLabel ?? '').toLowerCase()
  if (CHAIR_DECIDES_LABELS.has(lower)) {
    return { type: 'chair', label: 'Chair decides' }
  }
  if (TWO_THIRDS_LABELS.has(lower) || lower.includes('close debate') || lower.includes('voting procedure') || lower.includes('adjourn') || lower.includes('suspend')) {
    return { type: 'two-thirds', label: '2/3 majority' }
  }
  return { type: 'simple', label: 'Simple majority' }
}

export function computePassed(
  yes: number,
  no: number,
  _abstain: number,
  majority: MajorityType
): boolean {
  if (majority === 'chair') return false
  if (majority === 'simple') return yes > no
  if (majority === 'two-thirds') {
    const total = yes + no
    if (total === 0) return false
    return yes >= (2 / 3) * total
  }
  return yes > no
}
