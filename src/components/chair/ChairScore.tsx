import { useChair } from '../../context/ChairContext'
import {
  getMajorityForMotion,
  RESOLUTION_MAJORITY,
  AMENDMENT_MAJORITY,
  computePassed,
} from '../../constants/motionMajorities'

type TrackerItem = {
  id: string
  kind: 'motion' | 'point' | 'resolution' | 'amendment'
  title: string
  timestamp: string
  status: 'active' | 'pending' | 'passed' | 'failed' | 'tabled'
  votes?: { yes: number; no: number; abstain: number }
  majorityLabel: string
  majorityRule: string
  submitterText?: string
}

function statusClass(status: TrackerItem['status']) {
  if (status === 'passed') return 'text-[var(--success)]'
  if (status === 'failed') return 'text-[var(--danger)]'
  if (status === 'active') return 'text-[var(--accent)]'
  return 'text-[var(--text-muted)]'
}

export default function ChairScore() {
  const {
    motions,
    resolutions,
    amendments,
    voteInProgress,
    resolutionVoteInProgress,
    amendmentVoteInProgress,
    getDelegationEmoji,
  } = useChair()

  const motionItems: TrackerItem[] = motions.map((m) => {
    const majority = getMajorityForMotion(m.presetLabel, m.type)
    return {
      id: m.id,
      kind: m.type,
      title: m.text,
      timestamp: m.timestamp,
      status: m.status,
      votes: m.votes,
      majorityLabel: majority.label,
      majorityRule: majority.rule,
      submitterText: m.submitter
        ? `${getDelegationEmoji(m.submitter) || '🏳️'} ${m.submitter}`
        : undefined,
    }
  })

  const resolutionItems: TrackerItem[] = resolutions.map((r) => {
    const status = r.votes
      ? (r.status ??
        (computePassed(r.votes.yes, r.votes.no, r.votes.abstain, 'two-thirds')
          ? 'passed'
          : 'failed'))
      : 'pending'
    const submitters = [...r.mainSubmitters, ...r.coSubmitters]
      .map((c) => `${getDelegationEmoji(c) || '🏳️'} ${c}`)
      .join(', ')

    return {
      id: r.id,
      kind: 'resolution',
      title: r.title,
      timestamp: r.timestamp,
      status,
      votes: r.votes,
      majorityLabel: RESOLUTION_MAJORITY.label,
      majorityRule: RESOLUTION_MAJORITY.rule,
      submitterText: submitters || undefined,
    }
  })

  const amendmentItems: TrackerItem[] = amendments.map((a) => {
    const status = a.votes
      ? (a.status ??
        (computePassed(a.votes.yes, a.votes.no, a.votes.abstain, 'simple')
          ? 'passed'
          : 'failed'))
      : 'pending'
    const submitters = a.submitters
      .map((c) => `${getDelegationEmoji(c) || '🏳️'} ${c}`)
      .join(', ')

    return {
      id: a.id,
      kind: 'amendment',
      title: a.text,
      timestamp: a.timestamp,
      status,
      votes: a.votes,
      majorityLabel: AMENDMENT_MAJORITY.label,
      majorityRule: AMENDMENT_MAJORITY.rule,
      submitterText: submitters || undefined,
    }
  })

  const allItems = [...motionItems, ...resolutionItems, ...amendmentItems].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  )

  const passed = allItems.filter((i) => i.status === 'passed').length
  const failed = allItems.filter((i) => i.status === 'failed').length
  const activeOrPending = allItems.filter(
    (i) => i.status === 'active' || i.status === 'pending'
  ).length
  const tabled = allItems.filter((i) => i.status === 'tabled').length

  const activeVotingText = voteInProgress
    ? `Motion: ${voteInProgress.text}`
    : resolutionVoteInProgress
      ? `Resolution: ${resolutionVoteInProgress.title}`
      : amendmentVoteInProgress
        ? `Amendment: ${amendmentVoteInProgress.text}`
        : null

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-semibold text-2xl text-[var(--text)] mb-1">
          📊 Voting tracker
        </h2>
        <p className="text-[var(--text-muted)] text-sm">
          Full voting history for motions, points, resolutions, and amendments.
        </p>
      </div>

      {activeVotingText && (
        <div className="accent-highlight-wave rounded-xl border-2 border-[var(--accent)] bg-[var(--accent-soft)]/30 p-4">
          <p className="text-sm font-medium text-[var(--accent)]">● Vote in progress</p>
          <p className="text-sm text-[var(--text)] mt-1">{activeVotingText}</p>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        <div className="card-block p-4 text-center">
          <div className="text-2xl font-semibold text-[var(--success)]">{passed}</div>
          <div className="text-xs text-[var(--text-muted)] mt-1">✓ Passed</div>
        </div>
        <div className="card-block p-4 text-center">
          <div className="text-2xl font-semibold text-[var(--danger)]">{failed}</div>
          <div className="text-xs text-[var(--text-muted)] mt-1">✗ Failed</div>
        </div>
        <div className="card-block p-4 text-center">
          <div className="text-2xl font-semibold text-[var(--accent)]">{activeOrPending}</div>
          <div className="text-xs text-[var(--text-muted)] mt-1">● Active / pending</div>
        </div>
        <div className="card-block p-4 text-center">
          <div className="text-2xl font-semibold text-[var(--text-muted)]">{tabled}</div>
          <div className="text-xs text-[var(--text-muted)] mt-1">— Tabled</div>
        </div>
        <div className="card-block p-4 text-center">
          <div className="text-2xl font-semibold text-[var(--accent)]">{allItems.length}</div>
          <div className="text-xs text-[var(--text-muted)] mt-1">◇ Total items</div>
        </div>
      </div>

      <div className="card-block p-4">
        <h3 className="text-sm font-medium text-[var(--text)] mb-2">▸ Breakdown</h3>
        <p className="text-sm text-[var(--text-muted)]">
          Motions: {motionItems.filter((i) => i.kind === 'motion').length} · Points:{' '}
          {motionItems.filter((i) => i.kind === 'point').length} · Resolutions:{' '}
          {resolutionItems.length} · Amendments: {amendmentItems.length}
        </p>
      </div>

      <div className="card-block overflow-hidden">
        <div className="px-4 py-3 border-b border-[var(--border)]">
          <h3 className="text-sm font-medium text-[var(--text)]">🗂️ Full voting log</h3>
        </div>
        {allItems.length === 0 ? (
          <div className="px-4 py-8 text-center text-sm text-[var(--text-muted)]">
            No voting items yet.
          </div>
        ) : (
          <ul className="divide-y divide-[var(--border)] max-h-[34rem] overflow-auto">
            {allItems.map((item) => (
              <li key={`${item.kind}-${item.id}`} className="px-4 py-3">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[var(--text-muted)]">
                  <span className="uppercase">{item.kind}</span>
                  <span>•</span>
                  <span>{new Date(item.timestamp).toLocaleString()}</span>
                  <span>•</span>
                  <span className={`font-medium ${statusClass(item.status)}`}>
                    {item.status[0].toUpperCase() + item.status.slice(1)}
                  </span>
                </div>
                <p className="text-sm text-[var(--text)] mt-1">{item.title}</p>
                {item.submitterText && (
                  <p className="text-xs text-[var(--text-muted)] mt-1 break-words">
                    Submitter(s): {item.submitterText}
                  </p>
                )}
                <p
                  className="text-xs text-[var(--text-muted)] mt-1"
                  title={item.majorityRule}
                >
                  Majority required: {item.majorityLabel}
                </p>
                <p className="text-xs text-[var(--text-muted)] mt-1">
                  Votes:{' '}
                  {item.votes
                    ? `Yes ${item.votes.yes} / No ${item.votes.no} / Abstain ${item.votes.abstain}`
                    : 'Not recorded yet'}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
