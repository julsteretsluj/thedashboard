/**
 * MUN motion majority requirements per UN GA and typical Model UN ROP.
 * Simple majority = more yes than no (abstentions don't count).
 * 2/3 majority = yes ≥ 2/3 of (yes + no); abstentions don't count.
 */
export type MajorityType = 'simple' | 'two-thirds' | 'chair'

/** Motions requiring 2/3 per UN GA ROP and Model UN conventions. */
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

export interface MajorityInfo {
  type: MajorityType
  label: string
  /** ROP formula: exact rule for a pass. */
  rule: string
}

export function getMajorityForMotion(presetLabel?: string, type?: 'motion' | 'point'): MajorityInfo {
  if (type === 'point') {
    return { type: 'chair', label: 'Chair decides', rule: 'Chair rules; no committee vote.' }
  }
  const lower = (presetLabel ?? '').toLowerCase()
  if (CHAIR_DECIDES_LABELS.has(lower)) {
    return { type: 'chair', label: 'Chair decides', rule: 'Chair rules; no committee vote.' }
  }
  if (TWO_THIRDS_LABELS.has(lower) || lower.includes('close debate') || lower.includes('voting procedure') || lower.includes('adjourn') || lower.includes('suspend')) {
    return {
      type: 'two-thirds',
      label: '2/3 majority',
      rule: 'Passes if yes ≥ 2/3 of (yes + no). Abstentions don\'t count toward threshold.',
    }
  }
  return {
    type: 'simple',
    label: 'Simple majority',
    rule: 'Passes if yes > no. Abstentions don\'t count.',
  }
}

/** Resolution vote: 2/3 per UN GA ROP Rule 83/84. */
export const RESOLUTION_MAJORITY: MajorityInfo = {
  type: 'two-thirds',
  label: '2/3 majority',
  rule: 'Passes if yes ≥ 2/3 of (yes + no). Abstentions don\'t count. Per UN GA ROP.',
}

/** Amendment vote: simple majority per typical MUN ROP. */
export const AMENDMENT_MAJORITY: MajorityInfo = {
  type: 'simple',
  label: 'Simple majority',
  rule: 'Passes if yes > no. Abstentions don\'t count.',
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
