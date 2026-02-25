/**
 * Section → globe location mapping. Each Chair/Delegate section flies to a location.
 */
export interface GlobeSection {
  id: string
  label: string
  role: 'chair' | 'delegate'
  lat: number
  lng: number
  altitude?: number
}

/* Chair sections: spread across globe to avoid tag overlap */
export const CHAIR_SECTIONS: GlobeSection[] = [
  { id: 'committee', label: 'Committee & Topic', role: 'chair', lat: 46.2, lng: 6.1 },      // Geneva
  { id: 'prep', label: 'Prep checklist', role: 'chair', lat: 13.7, lng: 100.5 },            // Bangkok
  { id: 'flow', label: 'Flow checklist', role: 'chair', lat: 35.7, lng: 139.7 },            // Tokyo
  { id: 'delegates', label: 'Delegates', role: 'chair', lat: 40.7, lng: -74.0 },            // New York
  { id: 'room', label: 'Digital Room', role: 'chair', lat: 48.2, lng: 16.4 },               // Vienna
  { id: 'rollcall', label: 'Roll Call', role: 'chair', lat: -1.3, lng: 36.8 },              // Nairobi
  { id: 'session', label: 'Session', role: 'chair', lat: 52.1, lng: 4.3 },                  // The Hague
  { id: 'speakers', label: 'Speakers', role: 'chair', lat: 59.9, lng: 10.8 },               // Oslo
  { id: 'motions', label: 'Motions & Points', role: 'chair', lat: 55.8, lng: 37.6 },        // Moscow
  { id: 'voting', label: 'Voting', role: 'chair', lat: 1.3, lng: 103.8 },                   // Singapore
  { id: 'score', label: 'Votes/voting', role: 'chair', lat: -33.9, lng: 18.4 },             // Cape Town
  { id: 'crisis', label: 'Crisis', role: 'chair', lat: 30.0, lng: 31.2 },                   // Cairo
  { id: 'archive', label: 'Archive', role: 'chair', lat: 41.9, lng: 12.5 },                 // Rome
  { id: 'tracker', label: 'Delegate Tracker', role: 'chair', lat: 39.9, lng: 116.4 },       // Beijing
  { id: 'links', label: 'Official links', role: 'chair', lat: -34.6, lng: -58.4 },          // Buenos Aires
]

/* Delegate sections: spread across globe to avoid tag overlap */
export const DELEGATE_SECTIONS: GlobeSection[] = [
  { id: 'country', label: 'Country & Stance', role: 'delegate', lat: -35.3, lng: 149.1 },   // Canberra
  { id: 'countdown', label: 'Countdown', role: 'delegate', lat: 19.1, lng: 72.9 },          // Mumbai
  { id: 'matrix', label: 'Committee Matrix', role: 'delegate', lat: 22.3, lng: 114.2 },     // Hong Kong
  { id: 'prep', label: 'Prep Template', role: 'delegate', lat: -6.2, lng: 106.8 },          // Jakarta
  { id: 'sources', label: 'Trusted & Nation Sources', role: 'delegate', lat: 45.4, lng: -75.7 }, // Ottawa
  { id: 'resources', label: 'Chair Report & Resources', role: 'delegate', lat: 59.3, lng: 18.1 }, // Stockholm
  { id: 'checklist', label: 'Checklist', role: 'delegate', lat: -23.5, lng: -46.6 },        // São Paulo
  { id: 'links', label: 'Official links', role: 'delegate', lat: 40.4, lng: -3.7 },         // Madrid
]

export const ALL_SECTIONS: GlobeSection[] = [...CHAIR_SECTIONS, ...DELEGATE_SECTIONS]
