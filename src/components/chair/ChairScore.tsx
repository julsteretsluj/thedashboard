import { useChair } from '../../context/ChairContext'

export default function ChairScore() {
  const { motions } = useChair()
  const passed = motions.filter((m) => m.status === 'passed').length
  const failed = motions.filter((m) => m.status === 'failed').length
  const tabled = motions.filter((m) => m.status === 'tabled').length
  const motionsCount = motions.filter((m) => m.type === 'motion').length
  const pointsCount = motions.filter((m) => m.type === 'point').length

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-semibold text-2xl text-[var(--text)] mb-1">📊 Votes/voting</h2>
        <p className="text-[var(--text-muted)] text-sm">Motions and points summary.</p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="card-block p-4 text-center">
          <div className="text-2xl font-semibold text-[var(--success)]">{passed}</div>
          <div className="text-xs text-[var(--text-muted)] mt-1">✓ Passed</div>
        </div>
        <div className="card-block p-4 text-center">
          <div className="text-2xl font-semibold text-[var(--danger)]">{failed}</div>
          <div className="text-xs text-[var(--text-muted)] mt-1">✗ Failed</div>
        </div>
        <div className="card-block p-4 text-center">
          <div className="text-2xl font-semibold text-[var(--text-muted)]">{tabled}</div>
          <div className="text-xs text-[var(--text-muted)] mt-1">— Tabled</div>
        </div>
        <div className="card-block p-4 text-center">
          <div className="text-2xl font-semibold text-[var(--accent)]">{motions.length}</div>
          <div className="text-xs text-[var(--text-muted)] mt-1">◇ Total</div>
        </div>
      </div>
      <div className="card-block p-4">
        <h3 className="text-sm font-medium text-[var(--text)] mb-2">▸ Breakdown</h3>
        <p className="text-sm text-[var(--text-muted)]">
          Motions: {motionsCount} · Points: {pointsCount}
        </p>
      </div>
    </div>
  )
}
