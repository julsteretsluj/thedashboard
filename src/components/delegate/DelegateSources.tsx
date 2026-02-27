import { useState, useMemo } from 'react'
import { useDelegate } from '../../context/DelegateContext'
import { Plus, Trash2, Search } from 'lucide-react'
import { UN_SOURCES_BY_CATEGORY, UN_OFFICIAL_SOURCES } from '../../constants/unOfficialLinks'

const OTHER_TRUSTED_SOURCES = [
  'Reuters',
  'BBC News',
  'Al Jazeera',
  'Associated Press (AP)',
  'The Guardian',
  'Council on Foreign Relations (CFR)',
  'Human Rights Watch',
  'Amnesty International',
]

const PRESET_TRUSTED_SOURCES = [...UN_OFFICIAL_SOURCES.map((s) => s.name), ...OTHER_TRUSTED_SOURCES]

const SOURCE_URLS: Record<string, string> = Object.fromEntries(
  UN_OFFICIAL_SOURCES.map((s) => [s.name, s.url])
)

/** Key terms (topic-related) → suggested preset sources for MUN research */
const KEY_TERMS_TO_SOURCES: Record<string, string[]> = {
  health: ['WHO', 'UN News'],
  disease: ['WHO', 'UN News'],
  refugee: ['UNHCR', 'UN News', 'Amnesty International'],
  refugees: ['UNHCR', 'UN News', 'Amnesty International'],
  migration: ['UNHCR', 'UN News', 'IOM (International Organization for Migration)'],
  climate: ['UN News', 'UN Environment Programme (UNEP)', 'Reuters', 'The Guardian'],
  environment: ['UN News', 'UN Environment Programme (UNEP)', 'Reuters', 'The Guardian'],
  economy: ['World Bank', 'IMF', 'UN News'],
  economic: ['World Bank', 'IMF', 'UN News'],
  finance: ['IMF', 'World Bank'],
  rights: [
    'Human Rights Watch',
    'Amnesty International',
    'UN News',
    'UN Human Rights (OHCHR)',
  ],
  'human-rights': [
    'Human Rights Watch',
    'Amnesty International',
    'UN News',
    'UN Human Rights (OHCHR)',
  ],
  conflict: ['Reuters', 'BBC News', 'Council on Foreign Relations (CFR)', 'UN News', 'UN Peacekeeping'],
  security: ['Reuters', 'BBC News', 'Council on Foreign Relations (CFR)', 'UN News', 'UN Security Council'],
  peace: ['UN News', 'UN Peacekeeping', 'Reuters', 'BBC News'],
  education: ['UN News', 'UNESCO'],
  women: ['UN News', 'Amnesty International', 'UN Women'],
  gender: ['UN News', 'Amnesty International', 'UN Women'],
  disarmament: ['UN News', 'UN Office for Disarmament Affairs (UNODA)', 'Reuters'],
  arms: ['UN News', 'UN Office for Disarmament Affairs (UNODA)', 'Reuters'],
  drugs: ['UN Office on Drugs and Crime (UNODC)', 'UN News'],
  crime: ['UN Office on Drugs and Crime (UNODC)', 'UN News'],
  treaties: ['UN Treaty Collection', 'UN Official Document System (ODS)', 'UN Audiovisual Library of International Law'],
  documents: ['UN Official Document System (ODS)', 'UN Digital Library', 'UN Treaty Collection'],
  food: ['WFP (World Food Programme)', 'FAO', 'UN News'],
  labour: ['ILO', 'UN News'],
  habitat: ['UN-Habitat', 'UN News'],
  charter: ['UN Charter', 'UN Official Document System (ODS)'],
  missions: ['UN Peacekeeping', 'UN Peacekeeping – current missions', 'UN Special Political Missions'],
}

function getSuggestedSources(searchQuery: string): string[] {
  const terms = searchQuery
    .toLowerCase()
    .trim()
    .split(/\s+/)
    .filter(Boolean)
  if (terms.length === 0) return []
  const seen = new Set<string>()
  for (const t of terms) {
    const fromMapping: string[] = []
    for (const [key, sources] of Object.entries(KEY_TERMS_TO_SOURCES)) {
      if (key.includes(t) || t.includes(key)) fromMapping.push(...sources)
    }
    const byName = PRESET_TRUSTED_SOURCES.filter((s) => s.toLowerCase().includes(t))
    ;[...fromMapping, ...byName].forEach((s) => seen.add(s))
  }
  const fullQuery = terms.join(' ')
  const byFullQuery = PRESET_TRUSTED_SOURCES.filter((s) => s.toLowerCase().includes(fullQuery))
  byFullQuery.forEach((s) => seen.add(s))
  return Array.from(seen)
}

export default function DelegateSources() {
  const {
    trustedSources,
    nationSources,
    addTrustedSource,
    removeTrustedSource,
    addNationSource,
    removeNationSource,
  } = useDelegate()
  const [trustedInput, setTrustedInput] = useState('')
  const [nationInput, setNationInput] = useState('')
  const [keyTermsQuery, setKeyTermsQuery] = useState('')

  const suggestedByTerms = useMemo(
    () => getSuggestedSources(keyTermsQuery),
    [keyTermsQuery]
  )

  const addTrusted = () => {
    if (!trustedInput.trim()) return
    addTrustedSource(trustedInput.trim())
    setTrustedInput('')
  }
  const addNation = () => {
    if (!nationInput.trim()) return
    addNationSource(nationInput.trim())
    setNationInput('')
  }

  const addPresetTrusted = (source: string) => {
    if (trustedSources.includes(source)) return
    addTrustedSource(source)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-semibold text-2xl text-[var(--text)] mb-1">🔗 Trusted & Nation Sources</h2>
        <p className="text-[var(--text-muted)] text-sm">Trusted sources and nation-specific sources for research.</p>
      </div>

      <div className="card-block p-4 space-y-4">
        <h3 className="text-sm font-medium text-[var(--text)]">🔍 Search by key terms (topic-related)</h3>
        <p className="text-xs text-[var(--text-muted)]">Enter terms related to your topic (e.g. health, refugees, climate, economy) to see suggested sources.</p>
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)] pointer-events-none" />
            <input
              id="sources-key-terms"
              name="sources-key-terms"
              type="text"
              value={keyTermsQuery}
              onChange={(e) => setKeyTermsQuery(e.target.value)}
              placeholder="e.g. health refugees climate"
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text)] placeholder-[var(--text-muted)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            />
          </div>
        </div>
        {suggestedByTerms.length > 0 && (
          <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] p-3">
            <p className="text-xs font-medium text-[var(--text-muted)] mb-2">Suggested sources for your topic</p>
            <div className="flex flex-wrap gap-1.5">
              {suggestedByTerms.map((source) => (
                <button
                  key={source}
                  type="button"
                  onClick={() => addPresetTrusted(source)}
                  disabled={trustedSources.includes(source)}
                  className="px-2.5 py-1 rounded-md text-xs font-medium transition-colors bg-[var(--accent-soft)] text-[var(--accent)] hover:opacity-90 border border-[var(--accent)]/30 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  + {source}
                </button>
              ))}
            </div>
          </div>
        )}

        <h3 className="text-sm font-medium text-[var(--text)] pt-2 border-t border-[var(--border)]">✓ Trusted sources</h3>
        <p className="text-xs text-[var(--text-muted)] mb-2">Official UN links by category (click to add; open link in new tab).</p>
        {UN_SOURCES_BY_CATEGORY.map(({ category, sources }) => (
          <div key={category} className="mb-4">
            <h4 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide mb-1.5">{category}</h4>
            <div className="flex flex-wrap gap-1.5">
              {sources.map(({ name, url }) => (
                <span key={name} className="inline-flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => addPresetTrusted(name)}
                    disabled={trustedSources.includes(name)}
                    className="px-2.5 py-1 rounded-md text-xs font-medium transition-colors bg-[var(--bg-elevated)] text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--accent-soft)] border border-[var(--border)] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    + {name}
                  </button>
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--accent)] hover:underline text-xs"
                    title="Open in new tab"
                  >
                    ↗
                  </a>
                </span>
              ))}
            </div>
          </div>
        ))}
        <h4 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide mb-1.5 mt-4">Other trusted</h4>
        <div className="flex flex-wrap gap-1.5 mb-2">
          {OTHER_TRUSTED_SOURCES.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => addPresetTrusted(preset)}
              disabled={trustedSources.includes(preset)}
              className="px-2.5 py-1 rounded-md text-xs font-medium transition-colors bg-[var(--bg-elevated)] text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--accent-soft)] border border-[var(--border)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              + {preset}
            </button>
          ))}
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            id="sources-trusted-input"
            name="sources-trusted"
            type="text"
            value={trustedInput}
            onChange={(e) => setTrustedInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addTrusted()}
            placeholder="URL or name"
            className="flex-1 px-3 py-2 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text)] placeholder-[var(--text-muted)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
          />
          <button
            onClick={addTrusted}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-[var(--accent)] text-white text-sm font-medium hover:opacity-90"
          >
            <Plus className="w-4 h-4" /> Add
          </button>
        </div>
        <ul className="space-y-2">
          {trustedSources.map((s, i) => {
            const url = SOURCE_URLS[s]
            return (
              <li key={i} className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg bg-[var(--bg-elevated)] text-sm text-[var(--text)]">
                {url ? (
                  <a href={url} target="_blank" rel="noopener noreferrer" className="text-[var(--accent)] hover:underline truncate min-w-0">
                    {s} ↗
                  </a>
                ) : (
                  <span className="truncate min-w-0">{s}</span>
                )}
                <button onClick={() => removeTrustedSource(i)} className="p-1 rounded text-[var(--text-muted)] hover:text-[var(--danger)] shrink-0">
                  <Trash2 className="w-4 h-4" />
                </button>
              </li>
            )
          })}
        </ul>
      </div>

      <div className="card-block p-4 space-y-4">
        <h3 className="text-sm font-medium text-[var(--text)]">🌍 Nation-specific sources</h3>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            id="sources-nation-input"
            name="sources-nation"
            type="text"
            value={nationInput}
            onChange={(e) => setNationInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addNation()}
            placeholder="URL or name"
            className="flex-1 px-3 py-2 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text)] placeholder-[var(--text-muted)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
          />
          <button
            onClick={addNation}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-[var(--accent)] text-white text-sm font-medium hover:opacity-90"
          >
            <Plus className="w-4 h-4" /> Add
          </button>
        </div>
        <ul className="space-y-2">
          {nationSources.map((s, i) => (
            <li key={i} className="flex items-center justify-between px-3 py-2 rounded-lg bg-[var(--bg-elevated)] text-sm text-[var(--text)]">
              {s}
              <button onClick={() => removeNationSource(i)} className="p-1 rounded text-[var(--text-muted)] hover:text-[var(--danger)]">
                <Trash2 className="w-4 h-4" />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
