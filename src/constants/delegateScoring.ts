import type { DelegateScore } from '../types'

export const SCORE_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8] as const

export const DELEGATE_CRITERIA = [
  { key: 'creativity' as const, label: 'Creativity' },
  { key: 'diplomacy' as const, label: 'Diplomacy' },
  { key: 'collaboration' as const, label: 'Collaboration' },
  { key: 'leadership' as const, label: 'Leadership' },
  { key: 'knowledgeResearch' as const, label: 'Knowledge' },
  { key: 'participation' as const, label: 'Participation' },
] as const

export const POSITION_PAPER_CRITERIA = [
  { key: 'researchDepth' as const, label: 'Research Depth' },
  { key: 'countryStanceAlignment' as const, label: 'Country Stance' },
  { key: 'policyAccuracy' as const, label: 'Policy Accuracy' },
  { key: 'proposedSolutions' as const, label: 'Proposed Solutions' },
  { key: 'formattingStyleCitations' as const, label: 'Formatting & Citations' },
] as const

export const FULL_RUBRIC = {
  delegate: [
    { label: 'Creativity', beginning: 'Proposes repetitive or standard solutions; rarely thinks outside the existing framework.', developing: 'Offers some original ideas but struggles to adapt them to changing committee dynamics.', proficient: 'Frequently suggests innovative solutions and unique clauses for draft resolutions.', exemplary: 'Highly creative; develops "game-changing" compromises that bridge clashing blocs.' },
    { label: 'Diplomacy', beginning: 'Lacks professional decorum; occasionally dismissive of other delegates\' viewpoints.', developing: 'Respectful but unremarkable; maintains a neutral presence without building rapport.', proficient: 'Consistently professional; actively seeks to understand and incorporate opposing views.', exemplary: 'Exemplifies true statesmanship; commands respect while remaining humble and inclusive.' },
    { label: 'Collaboration', beginning: 'Works in isolation or refuses to compromise on minor details; disrupts group work.', developing: 'Contributes to a bloc but does not take an active role in drafting or merging ideas.', proficient: 'A strong team player; helps merge resolutions and ensures all bloc members have a voice.', exemplary: 'The "glue" of the committee; brings disparate groups together and facilitates consensus.' },
    { label: 'Leadership', beginning: 'Passive; waits for others to initiate motions or start discussions during caucuses.', developing: 'Shows leadership in small groups but is hesitant to lead the house or present for the bloc.', proficient: 'Takes clear initiative; leads unmoderated caucuses and manages the drafting process.', exemplary: 'Visionary leader; sets the tone for the room and inspires others through action and guidance.' },
    { label: 'Knowledge & Research', beginning: 'Frequently confused by the topic; relies on generalities rather than specific facts.', developing: 'Has a basic understanding of the agenda but misses technical or legal nuances.', proficient: 'Demonstrates strong command of the topic; cites relevant stats and UN past actions.', exemplary: 'Expert-level mastery; uses deep research to navigate technical debates and debunk false info.' },
    { label: 'Participation', beginning: 'Rarely speaks; frequently absent during caucusing or inactive during voting.', developing: 'Speaks occasionally in moderated caucuses; participates only when prompted.', proficient: 'Consistently active in all sessions; frequently raises motions and contributes to the floor.', exemplary: 'Necessary and consistent presence; engages in every aspect of the debate from start to finish.' },
  ],
  positionPaper: [
    { label: 'Research Depth', beginning: 'Minimal data; lacks specific UN resolutions, treaty citations, or historical context.', developing: 'Basic data provided; mentions well-known treaties but lacks specific localised evidence.', proficient: 'Strong research; includes relevant stats, past UN actions, and committee-specific history.', exemplary: 'Exceptional depth; identifies niche legal loopholes, specific funding gaps, or rare data points.' },
    { label: 'Country Stance Alignment', beginning: 'Frequently contradicts the assigned country\'s real-world geopolitical interests or voting history.', developing: 'Generally follows policy but lacks clarity on sensitive or controversial national stances.', proficient: 'Consistently accurate; clearly reflects the nation\'s strategic regional and global interests.', exemplary: 'Highly nuanced; addresses complex regional dynamics and clearly defines national "red lines."' },
    { label: 'Policy Accuracy', beginning: 'Fundamental misunderstanding of the topic\'s legal framework or the committee\'s mandate.', developing: 'Understands the general topic but misses technical or legal complexities within current policy.', proficient: 'Solid grasp of complex policy issues (e.g., specific clauses in international law).', exemplary: 'Expert-level accuracy; integrates technical facts to build a sophisticated policy argument.' },
    { label: 'Proposed Solutions', beginning: 'Vague or non-actionable (e.g., "countries should talk more"). No implementation plan.', developing: 'Generic solutions; lack details on funding, specific UN agencies, or feasibility.', proficient: 'Innovative and actionable; proposes specific mechanisms, task forces, or monitoring bodies.', exemplary: 'Sophisticated and holistic; solutions are original, feasible, and legally sound with clear timelines.' },
    { label: 'Formatting, Style & Citations', beginning: 'Significant errors in UN citation style; unprofessional tone.', developing: 'Standard formatting, but contains several grammatical gaps or inconsistent citation styles.', proficient: 'Professional UN academic formatting; clear, concise, and persuasive diplomatic language.', exemplary: 'Flawless UN academic style; compelling narrative and perfect citation of all sources.' },
  ],
} as const

export function scoreSum(score: DelegateScore, keys: readonly { key: keyof DelegateScore }[]): number {
  return keys.reduce((sum, { key }) => sum + ((score[key] as number) ?? 0), 0)
}
