import { useState } from 'react'
import { ChairProvider } from '../context/ChairContext'
import {
  LayoutGrid,
  Users,
  FileText,
  Vote,
  BookOpen,
  ListOrdered,
  Play,
  Mic,
  AlertTriangle,
  Archive,
  Settings,
  Gavel,
} from 'lucide-react'
import ChairRoomView from '../components/chair/ChairRoomView'
import ChairDelegates from '../components/chair/ChairDelegates'
import ChairMotions from '../components/chair/ChairMotions'
import ChairVoting from '../components/chair/ChairVoting'
import ChairCommitteeTopic from '../components/chair/ChairCommitteeTopic'
import ChairScore from '../components/chair/ChairScore'
import ChairRollCall from '../components/chair/ChairRollCall'
import ChairSession from '../components/chair/ChairSession'
import ChairSpeakers from '../components/chair/ChairSpeakers'
import ChairCrisis from '../components/chair/ChairCrisis'
import ChairArchive from '../components/chair/ChairArchive'

const sections = [
  { id: 'room', label: '🖥️ Digital Room', icon: LayoutGrid },
  { id: 'delegates', label: '👥 Delegates', icon: Users },
  { id: 'motions', label: '📜 Motions & Points', icon: FileText },
  { id: 'voting', label: '🗳️ Voting', icon: Vote },
  { id: 'committee', label: '📌 Committee & Topic', icon: BookOpen },
  { id: 'score', label: '📊 Score', icon: ListOrdered },
  { id: 'rollcall', label: '✅ Roll Call', icon: ListOrdered },
  { id: 'session', label: '▶️ Session', icon: Play },
  { id: 'speakers', label: '🎤 Speakers', icon: Mic },
  { id: 'crisis', label: '⚠️ Crisis', icon: AlertTriangle },
  { id: 'archive', label: '📁 Archive', icon: Archive },
]

function ChairRoomContent() {
  const [active, setActive] = useState('room')
  const [showSettings, setShowSettings] = useState(false)

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-3.5rem)]">
      <aside className="lg:w-56 border-b lg:border-b-0 lg:border-r border-[var(--border)] bg-[var(--bg-elevated)] flex-shrink-0 overflow-x-auto">
        <div className="flex lg:flex-col gap-1 p-2">
          {sections.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActive(id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors w-full text-left ${
                active === id
                  ? 'bg-[var(--accent-soft)] text-[var(--accent)]'
                  : 'text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--bg-card)]'
              }`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
            </button>
          ))}
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--bg-card)] mt-auto"
          >
            <Settings className="w-4 h-4" />
            ⚙️ Settings
          </button>
        </div>
      </aside>
      <main className="flex-1 p-4 sm:p-6 overflow-auto">
        {showSettings && (
          <div className="mb-6 p-4 rounded-xl border border-[var(--border)] bg-[var(--bg-card)]">
            <ChairCommitteeTopic onClose={() => setShowSettings(false)} />
          </div>
        )}
        {active === 'room' && <ChairRoomView />}
        {active === 'delegates' && <ChairDelegates />}
        {active === 'motions' && <ChairMotions />}
        {active === 'voting' && <ChairVoting />}
        {active === 'committee' && <ChairCommitteeTopic />}
        {active === 'score' && <ChairScore />}
        {active === 'rollcall' && <ChairRollCall />}
        {active === 'session' && <ChairSession />}
        {active === 'speakers' && <ChairSpeakers />}
        {active === 'crisis' && <ChairCrisis />}
        {active === 'archive' && <ChairArchive />}
      </main>
    </div>
  )
}

export default function ChairRoom() {
  return (
    <ChairProvider>
      <div className="border-b border-[var(--border)] bg-[var(--bg-elevated)] px-4 py-3 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[var(--accent-soft)] flex items-center justify-center">
          <Gavel className="w-5 h-5 text-[var(--accent)]" />
        </div>
        <div>
          <h1 className="font-serif text-xl text-[var(--text)]">⚖️ Chair Room</h1>
          <p className="text-sm text-[var(--text-muted)]">🖥️ Digital room · 📜 motions · 🗳️ voting · 🎤 speakers</p>
        </div>
      </div>
      <ChairRoomContent />
    </ChairProvider>
  )
}
