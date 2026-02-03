/**
 * Preset delegation (country) options for committee matrix.
 * Common MUN delegations — can be extended per conference if needed.
 */
export const DELEGATION_OPTIONS = [
  'Afghanistan', 'Argentina', 'Australia', 'Bangladesh', 'Brazil', 'Canada',
  'China', 'Colombia', 'Egypt', 'Ethiopia', 'France', 'Germany', 'India',
  'Indonesia', 'Iran', 'Iraq', 'Israel', 'Italy', 'Japan', 'Kenya', 'Malaysia',
  'Mexico', 'Nigeria', 'Pakistan', 'Philippines', 'Poland', 'Russia', 'Rwanda',
  'Saudi Arabia', 'South Africa', 'South Korea', 'Spain', 'Thailand', 'Turkey',
  'Uganda', 'United Kingdom', 'United States', 'Vietnam', 'Zimbabwe',
] as const

export type DelegationOption = (typeof DELEGATION_OPTIONS)[number]

export const OTHER_DELEGATION_VALUE = '__OTHER__'
