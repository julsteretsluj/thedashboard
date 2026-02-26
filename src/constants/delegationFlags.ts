/**
 * ISO 3166-1 alpha-2 codes for UNGA member states (matches DELEGATION_OPTIONS names).
 * Used to render flag emojis for delegations.
 */
const COUNTRY_TO_ISO: Record<string, string> = {
  Afghanistan: 'AF',
  Albania: 'AL',
  Algeria: 'DZ',
  Andorra: 'AD',
  Angola: 'AO',
  'Antigua and Barbuda': 'AG',
  Argentina: 'AR',
  Armenia: 'AM',
  Australia: 'AU',
  Austria: 'AT',
  Azerbaijan: 'AZ',
  Bahamas: 'BS',
  Bahrain: 'BH',
  Bangladesh: 'BD',
  Barbados: 'BB',
  Belarus: 'BY',
  Belgium: 'BE',
  Belize: 'BZ',
  Benin: 'BJ',
  Bhutan: 'BT',
  Bolivia: 'BO',
  'Bosnia and Herzegovina': 'BA',
  Botswana: 'BW',
  Brazil: 'BR',
  'Brunei Darussalam': 'BN',
  Bulgaria: 'BG',
  'Burkina Faso': 'BF',
  Burundi: 'BI',
  'Cabo Verde': 'CV',
  Cambodia: 'KH',
  Cameroon: 'CM',
  Canada: 'CA',
  'Central African Republic': 'CF',
  Chad: 'TD',
  Chile: 'CL',
  China: 'CN',
  Colombia: 'CO',
  Comoros: 'KM',
  Congo: 'CG',
  'Costa Rica': 'CR',
  Croatia: 'HR',
  Cuba: 'CU',
  Cyprus: 'CY',
  'Czech Republic': 'CZ',
  "Côte d'Ivoire": 'CI',
  'Democratic People\'s Republic of Korea': 'KP',
  'Democratic Republic of the Congo': 'CD',
  Denmark: 'DK',
  Djibouti: 'DJ',
  Dominica: 'DM',
  'Dominican Republic': 'DO',
  Ecuador: 'EC',
  Egypt: 'EG',
  'El Salvador': 'SV',
  'Equatorial Guinea': 'GQ',
  Eritrea: 'ER',
  Estonia: 'EE',
  Eswatini: 'SZ',
  Ethiopia: 'ET',
  Fiji: 'FJ',
  Finland: 'FI',
  France: 'FR',
  Gabon: 'GA',
  Gambia: 'GM',
  Georgia: 'GE',
  Germany: 'DE',
  Ghana: 'GH',
  Greece: 'GR',
  Grenada: 'GD',
  Guatemala: 'GT',
  Guinea: 'GN',
  'Guinea-Bissau': 'GW',
  Guyana: 'GY',
  Haiti: 'HT',
  Honduras: 'HN',
  Hungary: 'HU',
  Iceland: 'IS',
  India: 'IN',
  Indonesia: 'ID',
  Iran: 'IR',
  Iraq: 'IQ',
  Ireland: 'IE',
  Israel: 'IL',
  Italy: 'IT',
  Jamaica: 'JM',
  Japan: 'JP',
  Jordan: 'JO',
  Kazakhstan: 'KZ',
  Kenya: 'KE',
  Kiribati: 'KI',
  Kuwait: 'KW',
  Kyrgyzstan: 'KG',
  'Lao People\'s Democratic Republic': 'LA',
  Latvia: 'LV',
  Lebanon: 'LB',
  Lesotho: 'LS',
  Liberia: 'LR',
  Libya: 'LY',
  Liechtenstein: 'LI',
  Lithuania: 'LT',
  Luxembourg: 'LU',
  Madagascar: 'MG',
  Malawi: 'MW',
  Malaysia: 'MY',
  Maldives: 'MV',
  Mali: 'ML',
  Malta: 'MT',
  'Marshall Islands': 'MH',
  Mauritania: 'MR',
  Mauritius: 'MU',
  Mexico: 'MX',
  'Micronesia (Federated States of)': 'FM',
  Moldova: 'MD',
  Monaco: 'MC',
  Mongolia: 'MN',
  Montenegro: 'ME',
  Morocco: 'MA',
  Mozambique: 'MZ',
  Myanmar: 'MM',
  Namibia: 'NA',
  Nauru: 'NR',
  Nepal: 'NP',
  Netherlands: 'NL',
  'New Zealand': 'NZ',
  Nicaragua: 'NI',
  Niger: 'NE',
  Nigeria: 'NG',
  'North Macedonia': 'MK',
  Norway: 'NO',
  Oman: 'OM',
  Pakistan: 'PK',
  Palau: 'PW',
  Panama: 'PA',
  'Papua New Guinea': 'PG',
  Paraguay: 'PY',
  Peru: 'PE',
  Philippines: 'PH',
  Poland: 'PL',
  Portugal: 'PT',
  Qatar: 'QA',
  'Republic of Korea': 'KR',
  Romania: 'RO',
  'Russian Federation': 'RU',
  Rwanda: 'RW',
  'Saint Kitts and Nevis': 'KN',
  'Saint Lucia': 'LC',
  'Saint Vincent and the Grenadines': 'VC',
  Samoa: 'WS',
  'San Marino': 'SM',
  'Sao Tome and Principe': 'ST',
  'Saudi Arabia': 'SA',
  Senegal: 'SN',
  Serbia: 'RS',
  Seychelles: 'SC',
  'Sierra Leone': 'SL',
  Singapore: 'SG',
  Slovakia: 'SK',
  Slovenia: 'SI',
  'Solomon Islands': 'SB',
  Somalia: 'SO',
  'South Africa': 'ZA',
  'South Sudan': 'SS',
  Spain: 'ES',
  'Sri Lanka': 'LK',
  Sudan: 'SD',
  Suriname: 'SR',
  Sweden: 'SE',
  Switzerland: 'CH',
  'Syrian Arab Republic': 'SY',
  Tajikistan: 'TJ',
  Thailand: 'TH',
  'Timor-Leste': 'TL',
  Togo: 'TG',
  Tonga: 'TO',
  'Trinidad and Tobago': 'TT',
  Tunisia: 'TN',
  Turkey: 'TR',
  Turkmenistan: 'TM',
  Tuvalu: 'TV',
  Uganda: 'UG',
  Ukraine: 'UA',
  'United Arab Emirates': 'AE',
  'United Kingdom': 'GB',
  'United Republic of Tanzania': 'TZ',
  'United States': 'US',
  Uruguay: 'UY',
  Uzbekistan: 'UZ',
  Vanuatu: 'VU',
  Venezuela: 'VE',
  'Viet Nam': 'VN',
  Yemen: 'YE',
  Zambia: 'ZM',
  Zimbabwe: 'ZW',
}

/** Alternate names and common variants → ISO code. */
const DELEGATION_ALIASES: Record<string, string> = {
  Russia: 'RU',
  'Russian Federation': 'RU',
  'North Korea': 'KP',
  DPRK: 'KP',
  'South Korea': 'KR',
  Korea: 'KR',
  Taiwan: 'TW',
  'Republic of China': 'TW',
  Vietnam: 'VN',
  'Viet Nam': 'VN',
  Syria: 'SY',
  'Syrian Arab Republic': 'SY',
  UK: 'GB',
  Britain: 'GB',
  'Great Britain': 'GB',
  England: 'GB',
  'United Kingdom': 'GB',
  USA: 'US',
  America: 'US',
  'United States': 'US',
  UAE: 'AE',
  Emirates: 'AE',
  'United Arab Emirates': 'AE',
  Tanzania: 'TZ',
  'Ivory Coast': 'CI',
  "Cote d'Ivoire": 'CI',
  "Côte d'Ivoire": 'CI',
  DRC: 'CD',
  ROC: 'TW',
  Czechia: 'CZ',
  Macedonia: 'MK',
  'North Macedonia': 'MK',
  Swaziland: 'SZ',
  Palestine: 'PS',
  Vatican: 'VA',
  'Vatican City': 'VA',
  'Hong Kong': 'HK',
  Macau: 'MO',
  Macao: 'MO',
  Kosovo: 'XK',
  Brunei: 'BN',
  'Brunei Darussalam': 'BN',
  CAR: 'CF',
  'Central African Rep': 'CF',
  Laos: 'LA',
  'Lao PDR': 'LA',
  'Lao People\'s Democratic Republic': 'LA',
  'Sri Lanka': 'LK',
  Ceylon: 'LK',
  Burkina: 'BF',
  'Burkina Faso': 'BF',
  'Cape Verde': 'CV',
  'Cabo Verde': 'CV',
  'São Tomé': 'ST',
  'Sao Tome': 'ST',
  'East Timor': 'TL',
  'Timor Leste': 'TL',
  Burma: 'MM',
  Myanmar: 'MM',
  Holland: 'NL',
  Netherlands: 'NL',
  Persia: 'IR',
  Iran: 'IR',
  Rhodesia: 'ZW',
  Zaire: 'CD',
  'Republic of Congo': 'CG',
  Congo: 'CG',
  'Republic of Ireland': 'IE',
  'Northern Ireland': 'GB',
  Scotland: 'GB',
  Wales: 'GB',
}

/** USCC and similar committees: thematic emojis for party roles. */
function getThematicEmoji(delegationName: string): string {
  const n = delegationName.toLowerCase()
  const rMatch = /(?:^|\s)(?:r-|republican|\(r\)|\(r\s*\))/.test(n) || n.startsWith('r-')
  const dMatch = /(?:^|\s)(?:d-|democrat|\(d\)|\(d\s*\))/.test(n) || n.startsWith('d-')
  const iMatch = /(?:^|\s)(?:i-|independent|\(i\)|\(i\s*\))/.test(n) || n.startsWith('i-')
  if (rMatch) return '❤️'
  if (dMatch) return '💙'
  if (iMatch) return '🤍'
  return ''
}

/** Normalize string for fuzzy match: lowercase, collapse whitespace, strip accents. */
function normalize(s: string): string {
  return (s ?? '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

/** Build a lookup: normalized name → ISO. */
function buildNormalizedLookup(): Map<string, string> {
  const m = new Map<string, string>()
  for (const [name, iso] of Object.entries(COUNTRY_TO_ISO)) {
    m.set(normalize(name), iso)
  }
  for (const [alias, iso] of Object.entries(DELEGATION_ALIASES)) {
    m.set(normalize(alias), iso)
  }
  return m
}

const NORMALIZED_TO_ISO = buildNormalizedLookup()

/** Find closest country name by normalized match or substring. */
function findClosestIso(name: string): string | null {
  const norm = normalize(name)
  if (!norm) return null
  if (NORMALIZED_TO_ISO.has(norm)) return NORMALIZED_TO_ISO.get(norm) ?? null
  for (const [key, iso] of NORMALIZED_TO_ISO) {
    if (key.includes(norm) || norm.includes(key)) return iso
  }
  const words = norm.split(/\s+/).filter(Boolean)
  for (const [key, iso] of NORMALIZED_TO_ISO) {
    if (words.some((w) => key.includes(w) && w.length >= 3)) return iso
  }
  return null
}

/** Convert ISO 3166-1 alpha-2 code to flag emoji (regional indicator symbols). */
function isoToFlagEmoji(iso: string): string {
  if (!/^[A-Z]{2}$/i.test(iso)) return ''
  return Array.from(iso.toUpperCase())
    .map((c) => String.fromCodePoint(0x1f1e6 - 65 + c.charCodeAt(0)))
    .join('')
}

/** Committees that use thematic emojis (e.g. USCC party colours) instead of country flags. */
const THEMATIC_COMMITTEES = ['USCC', 'US-Senate', 'HCC']

/**
 * Get default flag emoji for a delegation name.
 * Handles: thematic (USCC), exact match, aliases, normalized match, closest match.
 * USCC/similar: Republican=❤️, Democrat=💙, Independent=🤍.
 */
export function getPresetDelegationFlag(delegationName: string, committee?: string): string {
  if (!delegationName || typeof delegationName !== 'string') return ''
  const trimmed = delegationName.trim()
  if (!trimmed) return ''

  if (committee && THEMATIC_COMMITTEES.includes(committee)) {
    const thematic = getThematicEmoji(trimmed)
    if (thematic) return thematic
  }

  const code = COUNTRY_TO_ISO[trimmed] ?? DELEGATION_ALIASES[trimmed] ?? findClosestIso(trimmed)
  return code ? isoToFlagEmoji(code) : ''
}
