import { useState } from 'react'
import { useChair } from '../../context/ChairContext'
import { Plus, Trash2, Vote, ExternalLink } from 'lucide-react'
import { computePassed, RESOLUTION_MAJORITY, AMENDMENT_MAJORITY } from '../../constants/motionMajorities'
import type { Resolution, Amendment } from '../../types'

function parseList(val: string): string[] {
  return val
    .split(/[,;]/)
    .map((s) => s.trim())
    .filter(Boolean)
}

function joinList(arr: string[]): string {
  return arr.join(', ')
}

export default function ChairResolutions() {
  const {
    resolutions,
    amendments,
    addResolution,
    removeResolution,
    addAmendment,
    removeAmendment,
    startResolutionVote,
    startAmendmentVote,
    delegates,
    getDelegationEmoji,
  } = useChair()
  const [title, setTitle] = useState('')
  const [mainSubmitters, setMainSubmitters] = useState('')
  const [coSubmitters, setCoSubmitters] = useState('')
  const [gdocLink, setGdocLink] = useState('')
  const [amendText, setAmendText] = useState('')
  const [amendSubmitters, setAmendSubmitters] = useState('')
  const [amendResolutionId, setAmendResolutionId] = useState('')
  const [amendGdocLink, setAmendGdocLink] = useState('')

  const submit = () => {
    const t = title.trim()
    if (!t) return
    addResolution({
      title: t,
      mainSubmitters: parseList(mainSubmitters),
      coSubmitters: parseList(coSubmitters),
      gdocLink: gdocLink.trim(),
    })
    setTitle('')
    setMainSubmitters('')
    setCoSubmitters('')
    setGdocLink('')
  }

  const submitAmendment = () => {
    const t = amendText.trim()
    if (!t) return
    addAmendment({
      text: t,
      resolutionId: amendResolutionId || undefined,
      submitters: parseList(amendSubmitters),
      gdocLink: amendGdocLink.trim(),
    })
    setAmendText('')
    setAmendSubmitters('')
    setAmendResolutionId('')
    setAmendGdocLink('')
  }

  const addCountry = (field: 'main' | 'co', country: string) => {
    if (!country) return
    if (field === 'main') {
      const list = parseList(mainSubmitters)
      if (!list.includes(country)) setMainSubmitters(joinList([...list, country]))
    } else {
      const list = parseList(coSubmitters)
      if (!list.includes(country)) setCoSubmitters(joinList([...list, country]))
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-semibold text-2xl text-[var(--text)] mb-1">📜 Resolutions</h2>
        <p className="text-[var(--text-muted)] text-sm">
          Add resolutions and amendments, then record votes. Main submitters, co-submitters, and link to Google Doc.
        </p>
      </div>

      <div className="card-block p-4 space-y-3">
        <h3 className="text-sm font-medium text-[var(--text)]">➕ Add resolution</h3>
        <div className="space-y-3">
          <label className="block">
            <span className="text-xs text-[var(--text-muted)] block mb-0.5">Title</span>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && submit()}
              placeholder="e.g. Resolution on Cybersecurity"
              className="w-full px-3 py-2 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text)] text-sm placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            />
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="block">
              <span className="text-xs text-[var(--text-muted)] block mb-0.5">Main submitters</span>
              <div className="flex gap-1">
                <input
                  type="text"
                  value={mainSubmitters}
                  onChange={(e) => setMainSubmitters(e.target.value)}
                  placeholder="e.g. USA, UK, France"
                  className="flex-1 px-3 py-2 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text)] text-sm placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                />
                <select
                  onChange={(e) => {
                    addCountry('main', e.target.value)
                    e.target.value = ''
                  }}
                  className="px-2 py-2 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                  title="Add delegate"
                >
                  <option value="">+</option>
                  {[...delegates]
                    .sort((a, b) => a.country.localeCompare(b.country, undefined, { sensitivity: 'base' }))
                    .map((d) => (
                      <option key={d.id} value={d.country}>
                        {d.country}
                      </option>
                    ))}
                </select>
              </div>
            </label>
            <label className="block">
              <span className="text-xs text-[var(--text-muted)] block mb-0.5">Co-submitters</span>
              <div className="flex gap-1">
                <input
                  type="text"
                  value={coSubmitters}
                  onChange={(e) => setCoSubmitters(e.target.value)}
                  placeholder="e.g. Germany, Japan"
                  className="flex-1 px-3 py-2 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text)] text-sm placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                />
                <select
                  onChange={(e) => {
                    addCountry('co', e.target.value)
                    e.target.value = ''
                  }}
                  className="px-2 py-2 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                  title="Add delegate"
                >
                  <option value="">+</option>
                  {[...delegates]
                    .sort((a, b) => a.country.localeCompare(b.country, undefined, { sensitivity: 'base' }))
                    .map((d) => (
                      <option key={d.id} value={d.country}>
                        {d.country}
                      </option>
                    ))}
                </select>
              </div>
            </label>
          </div>
          <label className="block">
            <span className="text-xs text-[var(--text-muted)] block mb-0.5">Link to Google Doc</span>
            <input
              type="url"
              value={gdocLink}
              onChange={(e) => setGdocLink(e.target.value)}
              placeholder="https://docs.google.com/..."
              className="w-full px-3 py-2 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text)] text-sm placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            />
          </label>
          <button
            onClick={submit}
            disabled={!title.trim()}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--accent)] text-white text-sm font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-4 h-4" /> Add resolution
          </button>
        </div>
      </div>

      <div className="card-block overflow-hidden">
        <div className="px-4 py-3 border-b border-[var(--border)]">
          <h3 className="text-sm font-medium text-[var(--text)]">📋 Resolutions list</h3>
        </div>
        {resolutions.length === 0 ? (
          <div className="px-4 py-8 text-center text-[var(--text-muted)] text-sm">
            No resolutions yet. Add one above.
          </div>
        ) : (
          <ul className="divide-y divide-[var(--border)] max-h-96 overflow-auto">
            {[...resolutions].reverse().map((r: Resolution) => {
              const rStatus = r.votes
                ? (r.status ?? (computePassed(r.votes.yes, r.votes.no, r.votes.abstain, 'two-thirds') ? 'passed' : 'failed'))
                : null
              const rBorder = rStatus === 'passed' ? 'border-l-4 border-l-[var(--success)]' : rStatus === 'failed' ? 'border-l-4 border-l-[var(--danger)]' : ''
              return (
              <li key={r.id} className={`px-4 py-3 flex flex-col gap-2 ${rBorder}`}>
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-[var(--text)]">{r.title}</p>
                    <div className="text-xs text-[var(--text-muted)] mt-1 flex flex-wrap gap-x-3 gap-y-0.5">
                      {r.mainSubmitters.length > 0 && (
                        <span>
                          Main: {r.mainSubmitters.map((c) => (getDelegationEmoji(c) || '🏳️') + ' ' + c).join(', ')}
                        </span>
                      )}
                      {r.coSubmitters.length > 0 && (
                        <span>
                          Co: {r.coSubmitters.map((c) => (getDelegationEmoji(c) || '🏳️') + ' ' + c).join(', ')}
                        </span>
                      )}
                    </div>
                    {r.gdocLink && (
                      <a
                        href={r.gdocLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 mt-1 text-xs text-[var(--accent)] hover:underline"
                      >
                        <ExternalLink className="w-3 h-3" />
                        Open doc
                      </a>
                    )}
                    {r.votes && (
                      <p className="text-xs text-[var(--text-muted)] mt-1">
                        Yes {r.votes.yes} / No {r.votes.no} / Abstain {r.votes.abstain}
                        <span className={`ml-2 font-medium ${rStatus === 'passed' ? 'text-[var(--success)]' : rStatus === 'failed' ? 'text-[var(--danger)]' : ''}`}>
                          — {rStatus === 'passed' ? 'Passed' : rStatus === 'failed' ? 'Failed' : 'Pending'} (2/3)
                        </span>
                      </p>
                    )}
                    {!r.votes && (
                      <p className="text-xs text-[var(--text-muted)] mt-1" title={RESOLUTION_MAJORITY.rule}>
                        Pending — {RESOLUTION_MAJORITY.label} required
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-1 shrink-0 self-end sm:self-auto">
                    <button
                      onClick={() => startResolutionVote(r.id)}
                      className="flex items-center gap-1 px-2 py-1 rounded-lg bg-[var(--accent)] text-white text-xs font-medium hover:opacity-90"
                    >
                      <Vote className="w-3.5 h-3.5" />
                      Vote
                    </button>
                    <button
                      onClick={() => removeResolution(r.id)}
                      className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--danger)] hover:bg-[var(--danger)]/10"
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </li>
            )})}
          </ul>
        )}
      </div>

      <div className="card-block p-4 space-y-3">
        <h3 className="text-sm font-medium text-[var(--text)]">➕ Add amendment</h3>
        <div className="space-y-3">
          <label className="block">
            <span className="text-xs text-[var(--text-muted)] block mb-0.5">Amendment text</span>
            <input
              type="text"
              value={amendText}
              onChange={(e) => setAmendText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && submitAmendment()}
              placeholder="e.g. Replace operative clause 3 with..."
              className="w-full px-3 py-2 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text)] text-sm placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            />
          </label>
          <div className="flex flex-wrap gap-3">
            <label className="block flex-1 min-w-[180px]">
              <span className="text-xs text-[var(--text-muted)] block mb-0.5">Submitters</span>
              <div className="flex gap-1">
                <input
                  type="text"
                  value={amendSubmitters}
                  onChange={(e) => setAmendSubmitters(e.target.value)}
                  placeholder="e.g. USA, UK"
                  className="flex-1 px-3 py-2 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text)] text-sm placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                />
                <select
                  onChange={(e) => {
                    const c = e.target.value
                    if (!c) return
                    const list = parseList(amendSubmitters)
                    if (!list.includes(c)) setAmendSubmitters(joinList([...list, c]))
                    e.target.value = ''
                  }}
                  className="px-2 py-2 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text)] text-sm"
                  title="Add delegate"
                >
                  <option value="">+</option>
                  {[...delegates]
                    .sort((a, b) => a.country.localeCompare(b.country, undefined, { sensitivity: 'base' }))
                    .map((d) => (
                      <option key={d.id} value={d.country}>
                        {d.country}
                      </option>
                    ))}
                </select>
              </div>
            </label>
            <label className="block flex-1 min-w-[180px]">
              <span className="text-xs text-[var(--text-muted)] block mb-0.5">Amends resolution</span>
              <select
                value={amendResolutionId}
                onChange={(e) => setAmendResolutionId(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text)] text-sm"
              >
                <option value="">— None —</option>
                {resolutions.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.title}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <label className="block">
            <span className="text-xs text-[var(--text-muted)] block mb-0.5">Link to Google Doc</span>
            <input
              type="url"
              value={amendGdocLink}
              onChange={(e) => setAmendGdocLink(e.target.value)}
              placeholder="https://docs.google.com/..."
              className="w-full px-3 py-2 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text)] text-sm placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            />
          </label>
          <button
            onClick={submitAmendment}
            disabled={!amendText.trim()}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--accent)] text-white text-sm font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-4 h-4" /> Add amendment
          </button>
        </div>
      </div>

      <div className="card-block overflow-hidden">
        <div className="px-4 py-3 border-b border-[var(--border)]">
          <h3 className="text-sm font-medium text-[var(--text)]">📝 Amendments list</h3>
        </div>
        {amendments.length === 0 ? (
          <div className="px-4 py-8 text-center text-[var(--text-muted)] text-sm">
            No amendments yet. Add one above.
          </div>
        ) : (
          <ul className="divide-y divide-[var(--border)] max-h-80 overflow-auto">
            {[...amendments].reverse().map((a: Amendment) => {
              const aStatus = a.votes
                ? (a.status ?? (computePassed(a.votes.yes, a.votes.no, a.votes.abstain, 'simple') ? 'passed' : 'failed'))
                : null
              const aBorder = aStatus === 'passed' ? 'border-l-4 border-l-[var(--success)]' : aStatus === 'failed' ? 'border-l-4 border-l-[var(--danger)]' : ''
              return (
              <li key={a.id} className={`px-4 py-3 flex flex-col gap-2 ${aBorder}`}>
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-[var(--text)]">{a.text}</p>
                    <div className="text-xs text-[var(--text-muted)] mt-1 flex flex-wrap gap-x-3 gap-y-0.5">
                      {a.resolutionId && (
                        <span>
                          Amends: {resolutions.find((r) => r.id === a.resolutionId)?.title ?? a.resolutionId}
                        </span>
                      )}
                      {a.submitters.length > 0 && (
                        <span>
                          {a.submitters.map((c) => (getDelegationEmoji(c) || '🏳️') + ' ' + c).join(', ')}
                        </span>
                      )}
                    </div>
                    {a.gdocLink && (
                      <a
                        href={a.gdocLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 mt-1 text-xs text-[var(--accent)] hover:underline"
                      >
                        <ExternalLink className="w-3 h-3" />
                        Open doc
                      </a>
                    )}
                    {a.votes && (
                      <p className="text-xs text-[var(--text-muted)] mt-1">
                        Yes {a.votes.yes} / No {a.votes.no} / Abstain {a.votes.abstain}
                        <span className={`ml-2 font-medium ${aStatus === 'passed' ? 'text-[var(--success)]' : aStatus === 'failed' ? 'text-[var(--danger)]' : ''}`}>
                          — {aStatus === 'passed' ? 'Passed' : aStatus === 'failed' ? 'Failed' : 'Pending'} (simple)
                        </span>
                      </p>
                    )}
                    {!a.votes && (
                      <p className="text-xs text-[var(--text-muted)] mt-1" title={AMENDMENT_MAJORITY.rule}>
                        Pending — {AMENDMENT_MAJORITY.label} required
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-1 shrink-0 self-end sm:self-auto">
                    <button
                      onClick={() => startAmendmentVote(a.id)}
                      className="flex items-center gap-1 px-2 py-1 rounded-lg bg-[var(--accent)] text-white text-xs font-medium hover:opacity-90"
                    >
                      <Vote className="w-3.5 h-3.5" />
                      Vote
                    </button>
                    <button
                      onClick={() => removeAmendment(a.id)}
                      className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--danger)] hover:bg-[var(--danger)]/10"
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </li>
            )})}
          </ul>
        )}
      </div>
    </div>
  )
}
