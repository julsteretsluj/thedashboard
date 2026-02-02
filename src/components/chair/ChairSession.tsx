import { useChair } from '../../context/ChairContext'
import { Play, Square } from 'lucide-react'

export default function ChairSession() {
  const { sessionStarted, sessionStartTime, startSession, stopSession } = useChair()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-2xl text-[var(--text)] mb-1">▶️ Committee Session</h2>
        <p className="text-[var(--text-muted)] text-sm">Start or stop the committee session.</p>
      </div>
      <div className="card-block p-6 flex flex-col sm:flex-row items-center gap-6">
        <div className="flex items-center gap-3">
          <span
            className={`w-3 h-3 rounded-md ${sessionStarted ? 'bg-[var(--success)] animate-pulse' : 'bg-[var(--text-muted)]'}`}
          />
          <span className="text-sm font-medium text-[var(--text)]">
            {sessionStarted ? '● Session in progress' : '○ Session not started'}
          </span>
        </div>
        {sessionStartTime && (
          <p className="text-xs text-[var(--text-muted)]">
            Started: {new Date(sessionStartTime).toLocaleString()}
          </p>
        )}
        <div className="flex gap-3">
          {!sessionStarted ? (
            <button
              onClick={startSession}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--success)] text-white text-sm font-medium hover:opacity-90 transition-opacity"
            >
              <Play className="w-4 h-4" /> ▶️ Start session
            </button>
          ) : (
            <button
              onClick={stopSession}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--danger)] text-white text-sm font-medium hover:opacity-90 transition-opacity"
            >
              <Square className="w-4 h-4" /> ⏹️ Stop session
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
