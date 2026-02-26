/**
 * Preset conferences from seamuns.site / seamun.com.
 * Users can add a conference from a preset to pre-fill name, dates, and committees.
 */
export interface PresetConference {
  id: string
  name: string
  /** Conference website URL */
  url?: string
  location?: string
  /** Delegate: conference start (for countdown) */
  countdownDate?: string
  /** Delegate: conference end */
  conferenceEndDate?: string
  /** Delegate: position paper deadline */
  positionPaperDeadline?: string
  /** Delegate: position paper guidelines URL (e.g. THAIMUN) */
  positionPaperGuidelinesUrl?: string
  /** Committee values for this conference (Delegate matrix, Chair default) */
  committees?: string[]
  /** Chair: default committee when creating a room */
  defaultCommittee?: string
}

/**
 * Preset conferences from seamuns.site / thaimun.org / seamun.com.
 * Allocation matrices (committee → country/role options) are PDPA-compliant: only institutional
 * data (countries, public-figure roles). No delegate names, emails, or other personal identifiers.
 */
export const PRESET_CONFERENCES: PresetConference[] = [
  {
    id: 'mun07-iv',
    name: 'MUN07 IV',
    location: 'Bangkok, Thailand',
    positionPaperDeadline: '2026-03-03T23:59:59',
    committees: ['UNHRC', 'UNSC', 'UNOOSA', 'DISEC', 'SPECPOL', 'ASEAN', 'Interpol', 'ICJ', 'USCC', 'PC'],
    defaultCommittee: 'UNHRC',
  },
  {
    id: 'thaimun-xiii-2026',
    name: 'THAIMUN XIII 2026',
    url: 'https://www.thaimun.org',
    location: 'Bangkok, Thailand',
    countdownDate: '2026-03-20T07:30:00',
    conferenceEndDate: '2026-03-22T17:00:00',
    positionPaperDeadline: '2026-03-08T23:59:59',
    positionPaperGuidelinesUrl: 'https://docs.google.com/document/d/18NdK9XVvkxsYxW4jTED1pPUosmsUY-LXey93UIwKf3A/edit?usp=sharing',
    committees: [
      'ICJ',
      'EU',
      'UNESCO',
      'IOPC',
      'UNICEF',
      'UNSC',
      'AL',
      'DISEC',
      'USCC',
      'UKPC',
      'HCC',
      'HSOC',
      'UNHRC',
      'ECOSOC',
      'UNODC',
      'WHO',
      'PC',
      'UNOOSA',
      'IMO',
      'Interpol',
      'NATO',
    ],
    defaultCommittee: 'UNSC',
  },
  {
    id: 'seamun-i-2027',
    name: 'SEAMUN I 2027',
    url: 'https://seamun.com',
    location: 'Bangkok, Thailand',
    countdownDate: '2027-01-23T08:00:00',
    conferenceEndDate: '2027-01-24T17:30:00',
    positionPaperDeadline: '2027-01-15T23:59:59',
    committees: ['UNHRC', 'DISEC', 'UN-Women', 'Interpol', 'PC', 'WHO', 'UNSC', 'UNODC', 'ECOSOC', 'FWC'],
    defaultCommittee: 'UNHRC',
  },
]
