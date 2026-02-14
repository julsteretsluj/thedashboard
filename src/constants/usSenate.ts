/**
 * Current US Senate roster (119th Congress, 2025).
 * Each senator has state, name, and party (D = Democrat, R = Republican, I = Independent).
 * Independents King (ME) and Sanders (VT) caucus with Democrats.
 */
export type SenatorParty = 'D' | 'R' | 'I'

export interface Senator {
  state: string
  name: string
  party: SenatorParty
}

/** Format: "State - Name (Party)" for dropdowns and display. */
export function formatSenatorLabel(s: Senator): string {
  const partyLabel = s.party === 'D' ? 'Democrat' : s.party === 'R' ? 'Republican' : 'Independent'
  return `${s.state} — ${s.name} (${partyLabel})`
}

/** All 100 current senators, alphabetical by state then name. */
export const US_SENATE_SENATORS: Senator[] = [
  { state: 'Alabama', name: 'Katie Britt', party: 'R' },
  { state: 'Alabama', name: 'Tommy Tuberville', party: 'R' },
  { state: 'Alaska', name: 'Lisa Murkowski', party: 'R' },
  { state: 'Alaska', name: 'Dan Sullivan', party: 'R' },
  { state: 'Arizona', name: 'Mark Kelly', party: 'D' },
  { state: 'Arizona', name: 'Kyrsten Sinema', party: 'I' },
  { state: 'Arkansas', name: 'John Boozman', party: 'R' },
  { state: 'Arkansas', name: 'Tom Cotton', party: 'R' },
  { state: 'California', name: 'Alex Padilla', party: 'D' },
  { state: 'California', name: 'Laphonza Butler', party: 'D' },
  { state: 'Colorado', name: 'Michael Bennet', party: 'D' },
  { state: 'Colorado', name: 'John Hickenlooper', party: 'D' },
  { state: 'Connecticut', name: 'Richard Blumenthal', party: 'D' },
  { state: 'Connecticut', name: 'Chris Murphy', party: 'D' },
  { state: 'Delaware', name: 'Tom Carper', party: 'D' },
  { state: 'Delaware', name: 'Chris Coons', party: 'D' },
  { state: 'Florida', name: 'Rick Scott', party: 'R' },
  { state: 'Florida', name: 'Marco Rubio', party: 'R' },
  { state: 'Georgia', name: 'Jon Ossoff', party: 'D' },
  { state: 'Georgia', name: 'Raphael Warnock', party: 'D' },
  { state: 'Hawaii', name: 'Brian Schatz', party: 'D' },
  { state: 'Hawaii', name: 'Mazie Hirono', party: 'D' },
  { state: 'Idaho', name: 'Mike Crapo', party: 'R' },
  { state: 'Idaho', name: 'Jim Risch', party: 'R' },
  { state: 'Illinois', name: 'Dick Durbin', party: 'D' },
  { state: 'Illinois', name: 'Tammy Duckworth', party: 'D' },
  { state: 'Indiana', name: 'Todd Young', party: 'R' },
  { state: 'Indiana', name: 'Jim Banks', party: 'R' },
  { state: 'Iowa', name: 'Chuck Grassley', party: 'R' },
  { state: 'Iowa', name: 'Joni Ernst', party: 'R' },
  { state: 'Kansas', name: 'Jerry Moran', party: 'R' },
  { state: 'Kansas', name: 'Roger Marshall', party: 'R' },
  { state: 'Kentucky', name: 'Mitch McConnell', party: 'R' },
  { state: 'Kentucky', name: 'Rand Paul', party: 'R' },
  { state: 'Louisiana', name: 'Bill Cassidy', party: 'R' },
  { state: 'Louisiana', name: 'John Kennedy', party: 'R' },
  { state: 'Maine', name: 'Susan Collins', party: 'R' },
  { state: 'Maine', name: 'Angus King', party: 'I' },
  { state: 'Maryland', name: 'Ben Cardin', party: 'D' },
  { state: 'Maryland', name: 'Chris Van Hollen', party: 'D' },
  { state: 'Massachusetts', name: 'Elizabeth Warren', party: 'D' },
  { state: 'Massachusetts', name: 'Ed Markey', party: 'D' },
  { state: 'Michigan', name: 'Gary Peters', party: 'D' },
  { state: 'Michigan', name: 'Elissa Slotkin', party: 'D' },
  { state: 'Minnesota', name: 'Amy Klobuchar', party: 'D' },
  { state: 'Minnesota', name: 'Tina Smith', party: 'D' },
  { state: 'Mississippi', name: 'Roger Wicker', party: 'R' },
  { state: 'Mississippi', name: 'Cindy Hyde-Smith', party: 'R' },
  { state: 'Missouri', name: 'Josh Hawley', party: 'R' },
  { state: 'Missouri', name: 'Eric Schmitt', party: 'R' },
  { state: 'Montana', name: 'Jon Tester', party: 'D' },
  { state: 'Montana', name: 'Steve Daines', party: 'R' },
  { state: 'Nebraska', name: 'Deb Fischer', party: 'R' },
  { state: 'Nebraska', name: 'Pete Ricketts', party: 'R' },
  { state: 'Nevada', name: 'Catherine Cortez Masto', party: 'D' },
  { state: 'Nevada', name: 'Jacky Rosen', party: 'D' },
  { state: 'New Hampshire', name: 'Jeanne Shaheen', party: 'D' },
  { state: 'New Hampshire', name: 'Maggie Hassan', party: 'D' },
  { state: 'New Jersey', name: 'Cory Booker', party: 'D' },
  { state: 'New Jersey', name: 'Andy Kim', party: 'D' },
  { state: 'New Mexico', name: 'Martin Heinrich', party: 'D' },
  { state: 'New Mexico', name: 'Ben Ray Luján', party: 'D' },
  { state: 'New York', name: 'Chuck Schumer', party: 'D' },
  { state: 'New York', name: 'Kirsten Gillibrand', party: 'D' },
  { state: 'North Carolina', name: 'Thom Tillis', party: 'R' },
  { state: 'North Carolina', name: 'Ted Budd', party: 'R' },
  { state: 'North Dakota', name: 'John Hoeven', party: 'R' },
  { state: 'North Dakota', name: 'Kevin Cramer', party: 'R' },
  { state: 'Ohio', name: 'Sherrod Brown', party: 'D' },
  { state: 'Ohio', name: 'JD Vance', party: 'R' },
  { state: 'Oklahoma', name: 'James Lankford', party: 'R' },
  { state: 'Oklahoma', name: 'Markwayne Mullin', party: 'R' },
  { state: 'Oregon', name: 'Ron Wyden', party: 'D' },
  { state: 'Oregon', name: 'Jeff Merkley', party: 'D' },
  { state: 'Pennsylvania', name: 'Bob Casey Jr.', party: 'D' },
  { state: 'Pennsylvania', name: 'John Fetterman', party: 'D' },
  { state: 'Rhode Island', name: 'Jack Reed', party: 'D' },
  { state: 'Rhode Island', name: 'Sheldon Whitehouse', party: 'D' },
  { state: 'South Carolina', name: 'Lindsey Graham', party: 'R' },
  { state: 'South Carolina', name: 'Tim Scott', party: 'R' },
  { state: 'South Dakota', name: 'John Thune', party: 'R' },
  { state: 'South Dakota', name: 'Mike Rounds', party: 'R' },
  { state: 'Tennessee', name: 'Marsha Blackburn', party: 'R' },
  { state: 'Tennessee', name: 'Bill Hagerty', party: 'R' },
  { state: 'Texas', name: 'John Cornyn', party: 'R' },
  { state: 'Texas', name: 'Ted Cruz', party: 'R' },
  { state: 'Utah', name: 'Mike Lee', party: 'R' },
  { state: 'Utah', name: 'John Curtis', party: 'R' },
  { state: 'Vermont', name: 'Peter Welch', party: 'D' },
  { state: 'Vermont', name: 'Bernie Sanders', party: 'I' },
  { state: 'Virginia', name: 'Mark Warner', party: 'D' },
  { state: 'Virginia', name: 'Tim Kaine', party: 'D' },
  { state: 'Washington', name: 'Patty Murray', party: 'D' },
  { state: 'Washington', name: 'Maria Cantwell', party: 'D' },
  { state: 'West Virginia', name: 'Shelley Moore Capito', party: 'R' },
  { state: 'West Virginia', name: 'Jim Justice', party: 'R' },
  { state: 'Wisconsin', name: 'Tammy Baldwin', party: 'D' },
  { state: 'Wisconsin', name: 'Ron Johnson', party: 'R' },
  { state: 'Wyoming', name: 'John Barrasso', party: 'R' },
  { state: 'Wyoming', name: 'Cynthia Lummis', party: 'R' },
]

/** Display labels for allocation dropdowns: "State — Name (Party)". */
export const US_SENATE_ALLOCATION_OPTIONS = US_SENATE_SENATORS.map(formatSenatorLabel)
