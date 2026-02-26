import { useState } from 'react'
import { useChair } from '../../context/ChairContext'
import { Plus, Star, Minus, ChevronDown, ChevronUp } from 'lucide-react'
import { getMajorityForMotion } from '../../constants/motionMajorities'

type PresetField = { key: string; label: string; placeholder: string }
type Preset = {
  id: string
  label: string
  type: 'motion' | 'point'
  template: (values: Record<string, string>) => string
  fields: PresetField[]
}

const PRESETS: Preset[] = [
  {
    id: 'mod-caucus',
    label: 'Moderated caucus',
    type: 'motion',
    template: (v) =>
      `Motion for moderated caucus for ${v.duration || '___'} on the topic of ${v.topic || '___'} with ${v.speakerTime || '___'} per speaker`,
    fields: [
      { key: 'duration', label: 'Total time', placeholder: 'e.g. 10 minutes' },
      { key: 'topic', label: 'Topic', placeholder: 'e.g. causes of conflict' },
      { key: 'speakerTime', label: 'Time per speaker', placeholder: 'e.g. 45 seconds' },
    ],
  },
  {
    id: 'unmod-caucus',
    label: 'Unmoderated caucus',
    type: 'motion',
    template: (v) => `Motion for unmoderated caucus for ${v.duration || '___'}`,
    fields: [{ key: 'duration', label: 'Duration', placeholder: 'e.g. 5 minutes' }],
  },
  {
    id: 'consultation',
    label: 'Consultation',
    type: 'motion',
    template: (v) => `Motion for consultation for ${v.duration || '___'} on the topic of ${v.topic || '___'}`,
    fields: [
      { key: 'duration', label: 'Duration', placeholder: 'e.g. 10 minutes' },
      { key: 'topic', label: 'Topic', placeholder: 'e.g. bloc positions' },
    ],
  },
  {
    id: 'open-speaker-list',
    label: 'Open speaker list',
    type: 'motion',
    template: () => 'Motion to open the speaker list',
    fields: [],
  },
  {
    id: 'close-speaker-list',
    label: 'Close speaker list',
    type: 'motion',
    template: () => 'Motion to close the speaker list',
    fields: [],
  },
  {
    id: 'close-debate',
    label: 'Close debate',
    type: 'motion',
    template: () => 'Motion to close debate',
    fields: [],
  },
  {
    id: 'voting-procedure',
    label: 'Move to voting procedure',
    type: 'motion',
    template: () => 'Motion to move to voting procedure',
    fields: [],
  },
  {
    id: 'set-agenda',
    label: 'Set the agenda',
    type: 'motion',
    template: (v) => `Motion to set the agenda to ${v.topic || '___'}`,
    fields: [{ key: 'topic', label: 'Topic/order', placeholder: 'e.g. Topic A first' }],
  },
  {
    id: 'divide-question',
    label: 'Divide the question',
    type: 'motion',
    template: (v) => `Motion to divide the question${v.clauses ? `: ${v.clauses}` : ''}`,
    fields: [{ key: 'clauses', label: 'Clauses (optional)', placeholder: 'e.g. OP1, OP2 as separate votes' }],
  },
  {
    id: 'table-resolution',
    label: 'Table the resolution',
    type: 'motion',
    template: () => 'Motion to table the resolution',
    fields: [],
  },
  {
    id: 'adjourn',
    label: 'Adjourn the meeting',
    type: 'motion',
    template: () => 'Motion to adjourn the meeting',
    fields: [],
  },
  {
    id: 'suspend',
    label: 'Suspend the meeting',
    type: 'motion',
    template: (v) => `Motion to suspend the meeting${v.duration ? ` for ${v.duration}` : ''}`,
    fields: [{ key: 'duration', label: 'Duration (optional)', placeholder: 'e.g. 15 minutes' }],
  },
  {
    id: 'extend-debate',
    label: 'Extend debate time',
    type: 'motion',
    template: (v) => `Motion to extend debate for ${v.duration || '___'}`,
    fields: [{ key: 'duration', label: 'Additional time', placeholder: 'e.g. 5 minutes' }],
  },
  {
    id: 'roll-call-vote',
    label: 'Roll call vote',
    type: 'motion',
    template: () => 'Motion for a roll call vote',
    fields: [],
  },
  {
    id: 'point-order',
    label: 'Point of order',
    type: 'point',
    template: () => 'Point of order',
    fields: [],
  },
  {
    id: 'point-information',
    label: 'Point of information',
    type: 'point',
    template: () => 'Point of information',
    fields: [],
  },
  {
    id: 'point-personal',
    label: 'Point of personal privilege',
    type: 'point',
    template: () => 'Point of personal privilege',
    fields: [],
  },
  {
    id: 'point-parliamentary',
    label: 'Point of parliamentary inquiry',
    type: 'point',
    template: () => 'Point of parliamentary inquiry',
    fields: [],
  },
  {
    id: 'right-of-reply',
    label: 'Right of reply',
    type: 'point',
    template: () => 'Right of reply',
    fields: [],
  },
]

export default function ChairMotions() {
  const { motions, addMotion, starMotion, setMotionStatus, startVote, delegates, getDelegationEmoji } = useChair()
  const [text, setText] = useState('')
  const [type, setType] = useState<'motion' | 'point'>('motion')
  const [submitter, setSubmitter] = useState('')
  const [presetOpen, setPresetOpen] = useState(false)
  const [selectedPreset, setSelectedPreset] = useState<Preset | null>(null)
  const [presetValues, setPresetValues] = useState<Record<string, string>>({})

  const submit = () => {
    if (!text.trim()) return
    addMotion(text.trim(), type, submitter || undefined)
    setText('')
  }

  const applyPreset = (preset: Preset) => {
    setSelectedPreset(preset)
    setPresetValues({})
    setType(preset.type)
  }

  const submitPreset = () => {
    if (!selectedPreset) return
    const built = selectedPreset.template(presetValues)
    addMotion(built, selectedPreset.type, submitter || undefined, selectedPreset.label)
    setSelectedPreset(null)
    setPresetValues({})
    setPresetOpen(false)
  }

  const activeMotions = motions.filter((m) => m.status === 'active')
  const pastMotions = motions.filter((m) => m.status !== 'active')

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-semibold text-2xl text-[var(--text)] mb-1">📜 Motions & Points</h2>
        <p className="text-[var(--text-muted)] text-sm">Record and star motions and points.</p>
      </div>

      <div className="card-block p-4 space-y-3">
        <div className="flex gap-2">
          <button
            onClick={() => setType('motion')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              type === 'motion' ? 'bg-[var(--accent-soft)] text-[var(--accent)]' : 'bg-[var(--bg-elevated)] text-[var(--text-muted)]'
            }`}
          >
            📜 Motion
          </button>
          <button
            onClick={() => setType('point')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              type === 'point' ? 'bg-[var(--accent-soft)] text-[var(--accent)]' : 'bg-[var(--bg-elevated)] text-[var(--text-muted)]'
            }`}
          >
            • Point
          </button>
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && submit()}
            placeholder={type === 'motion' ? 'e.g. Motion to open the speaker list' : 'e.g. Point of order'}
            className="flex-1 min-w-[200px] px-3 py-2 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text)] placeholder-[var(--text-muted)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
          />
          <select
            value={submitter}
            onChange={(e) => setSubmitter(e.target.value)}
            className="px-3 py-2 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            title="Submitter (country)"
          >
            <option value="">No submitter</option>
            {[...delegates]
              .sort((a, b) => a.country.localeCompare(b.country, undefined, { sensitivity: 'base' }))
              .map((d) => (
                <option key={d.id} value={d.country}>
                  {getDelegationEmoji(d.country) || '🏳️'} {d.country}
                </option>
              ))}
          </select>
          <button
            onClick={submit}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--accent)] text-white text-sm font-medium hover:opacity-90"
          >
            <Plus className="w-4 h-4" /> ➕ Add
          </button>
        </div>

        <div className="border-t border-[var(--border)] pt-3 mt-3">
          <button
            type="button"
            onClick={() => setPresetOpen(!presetOpen)}
            className="flex items-center gap-1.5 text-xs font-medium text-[var(--text-muted)] hover:text-[var(--accent)]"
          >
            {presetOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            Presets: Moderated caucus · Unmoderated caucus · Consultation · …
          </button>
          {presetOpen && (
            <div className="mt-2 space-y-2">
              <div className="flex flex-wrap gap-1.5">
                {PRESETS.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => applyPreset(p)}
                    className={`px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
                      selectedPreset?.id === p.id
                        ? 'bg-[var(--accent)] text-white'
                        : 'bg-[var(--bg-elevated)] text-[var(--text-muted)] hover:text-[var(--text)] border border-[var(--border)]'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
              {selectedPreset && (
                <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] p-3 space-y-2">
                  {selectedPreset.fields.length === 0 ? (
                    <p className="text-xs text-[var(--text-muted)]">
                      {selectedPreset.template({})}
                    </p>
                  ) : (
                    selectedPreset.fields.map((f) => (
                      <label key={f.key} className="block">
                        <span className="text-xs text-[var(--text-muted)] block mb-0.5">{f.label}</span>
                        <input
                          type="text"
                          value={presetValues[f.key] ?? ''}
                          onChange={(e) => setPresetValues((v) => ({ ...v, [f.key]: e.target.value }))}
                          placeholder={f.placeholder}
                          className="w-full px-2.5 py-1.5 rounded-md bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text)] text-sm placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                        />
                      </label>
                    ))
                  )}
                  <div className="flex gap-2 pt-1">
                    <button
                      type="button"
                      onClick={submitPreset}
                      className="px-3 py-1.5 rounded-md bg-[var(--accent)] text-white text-xs font-medium hover:opacity-90"
                    >
                      Add {selectedPreset.type === 'motion' ? 'motion' : 'point'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedPreset(null)}
                      className="px-3 py-1.5 rounded-md text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--bg-card)] text-xs font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {activeMotions.length > 0 && (
        <div className="accent-highlight-wave rounded-xl border border-[var(--accent)]/40 bg-[var(--accent-soft)]/30 p-4">
          <h3 className="text-sm font-medium text-[var(--accent)] mb-3">● Active</h3>
          <ul className="space-y-2">
            {activeMotions.map((m) => {
              const { label: majorityLabel, rule: majorityRule } = getMajorityForMotion(m.presetLabel, m.type)
              return (
                <li key={m.id} className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={() => starMotion(m.id)}
                    className="p-1 rounded text-[var(--text-muted)] hover:text-[var(--accent)]"
                    title={m.starred ? 'Unstar' : 'Star'}
                  >
                    <Star className={`w-4 h-4 ${m.starred ? 'fill-[var(--accent)] text-[var(--accent)]' : ''}`} />
                  </button>
                  <span className="text-xs text-[var(--text-muted)] uppercase">{m.type}</span>
                  {m.presetLabel && (
                    <span className="text-xs px-1.5 py-0.5 rounded bg-[var(--accent)]/10 text-[var(--accent)] font-medium">
                      {m.presetLabel}
                    </span>
                  )}
                  <span className="text-xs text-[var(--text-muted)]" title={majorityRule}>({majorityLabel})</span>
                  <span className="text-sm text-[var(--text)] flex-1">{m.text}</span>
                  {m.submitter && (
                    <span className="text-xs text-[var(--text-muted)] shrink-0">
                      {getDelegationEmoji(m.submitter) || '🏳️'} {m.submitter}
                    </span>
                  )}
                  <div className="flex gap-1">
                    <button
                      onClick={() => setMotionStatus(m.id, 'tabled')}
                      className="p-1.5 rounded-lg bg-[var(--text-muted)]/20 text-[var(--text-muted)] hover:bg-[var(--text-muted)]/30"
                      title="Tabled"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    {m.type === 'motion' && (
                      <button
                        onClick={() => startVote(m.id)}
                        className="px-2 py-1 rounded-lg bg-[var(--accent)] text-white text-xs font-medium"
                        title={`Vote — ${majorityLabel}`}
                      >
                        Vote
                      </button>
                    )}
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      )}

      <div className="card-block overflow-hidden">
        <div className="px-4 py-3 border-b border-[var(--border)]">
          <h3 className="text-sm font-medium text-[var(--text)]">📋 Log</h3>
        </div>
        <ul className="divide-y divide-[var(--border)] max-h-96 overflow-auto">
          {[...pastMotions].reverse().map((m) => {
            const { label: majorityLabel, rule: majorityRule } = getMajorityForMotion(m.presetLabel, m.type)
            const statusLabel = m.status === 'passed' ? 'Passed' : m.status === 'failed' ? 'Failed' : m.status === 'tabled' ? 'Tabled' : 'Pending'
            const statusClass = m.status === 'passed' ? 'text-[var(--success)]' : m.status === 'failed' ? 'text-[var(--danger)]' : 'text-[var(--text-muted)]'
            const rowBorder = m.status === 'passed' ? 'border-l-4 border-l-[var(--success)]' : m.status === 'failed' ? 'border-l-4 border-l-[var(--danger)]' : ''
            return (
              <li key={m.id} className={`px-4 py-3 flex items-start gap-2 ${rowBorder}`}>
                <button
                  onClick={() => starMotion(m.id)}
                  className="p-1 rounded mt-0.5 text-[var(--text-muted)] hover:text-[var(--accent)] flex-shrink-0"
                >
                  <Star className={`w-4 h-4 ${m.starred ? 'fill-[var(--accent)] text-[var(--accent)]' : ''}`} />
                </button>
                <div className="flex-1 min-w-0">
                  <span className="text-xs text-[var(--text-muted)] uppercase">{m.type}</span>
                  {m.presetLabel && (
                    <span className="text-xs px-1.5 py-0.5 rounded bg-[var(--accent)]/10 text-[var(--accent)] font-medium ml-2">
                      {m.presetLabel}
                    </span>
                  )}
                  {m.submitter && (
                    <span className="text-xs text-[var(--text-muted)] ml-2">
                      {getDelegationEmoji(m.submitter) || '🏳️'} {m.submitter}
                    </span>
                  )}
                  <p className="text-sm text-[var(--text)]">{m.text}</p>
                  <div className="flex items-center gap-2 mt-1 text-xs text-[var(--text-muted)] flex-wrap">
                    <span>{new Date(m.timestamp).toLocaleString()}</span>
                    <span className={`font-medium ${statusClass}`}>{statusLabel}</span>
                    {m.type === 'motion' && <span className="text-[var(--text-muted)]/80" title={majorityRule}>({majorityLabel})</span>}
                    {m.type === 'motion' && m.votes && (
                      <span>Yes {m.votes.yes} / No {m.votes.no} / Abstain {m.votes.abstain}</span>
                    )}
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
