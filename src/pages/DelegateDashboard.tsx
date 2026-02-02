import { useState } from 'react'
import { DelegateProvider } from '../context/DelegateContext'
import {
  Globe,
  FileText,
  BookOpen,
  CheckSquare,
  Clock,
  Users,
  Link as LinkIcon,
} from 'lucide-react'
import DelegateCountry from '../components/delegate/DelegateCountry'
import DelegateMatrix from '../components/delegate/DelegateMatrix'
import DelegatePrep from '../components/delegate/DelegatePrep'
import DelegateSources from '../components/delegate/DelegateSources'
import DelegateResources from '../components/delegate/DelegateResources'
import DelegateChecklist from '../components/delegate/DelegateChecklist'
import DelegateCountdown from '../components/delegate/DelegateCountdown'
import { User } from 'lucide-react'

const sections = [
  { id: 'country', label: '🌍 Country & stance', icon: Globe },
  { id: 'matrix', label: '📊 Committee matrix', icon: Users },
  { id: 'prep', label: '📝 Prep template', icon: FileText },
  { id: 'sources', label: '🔗 Trusted & nation sources', icon: LinkIcon },
  { id: 'resources', label: '📚 Chair report & resources', icon: BookOpen },
  { id: 'checklist', label: '✅ Checklist', icon: CheckSquare },
  { id: 'countdown', label: '⏱️ Conference countdown', icon: Clock },
]

function DelegateDashboardContent() {
  const [active, setActive] = useState('country')

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
                  ? 'bg-[var(--gold-soft)] text-[var(--gold)]'
                  : 'text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--bg-card)]'
              }`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
            </button>
          ))}
        </div>
      </aside>
      <main className="flex-1 p-4 sm:p-6 overflow-auto">
        {active === 'country' && <DelegateCountry />}
        {active === 'matrix' && <DelegateMatrix />}
        {active === 'prep' && <DelegatePrep />}
        {active === 'sources' && <DelegateSources />}
        {active === 'resources' && <DelegateResources />}
        {active === 'checklist' && <DelegateChecklist />}
        {active === 'countdown' && <DelegateCountdown />}
      </main>
    </div>
  )
}

export default function DelegateDashboard() {
  return (
    <DelegateProvider>
      <div className="border-b border-[var(--border)] bg-[var(--bg-elevated)] px-4 py-3 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[var(--gold-soft)] flex items-center justify-center">
          <User className="w-5 h-5 text-[var(--gold)]" />
        </div>
        <div>
          <h1 className="font-serif text-xl text-[var(--text)]">📄 Delegate Dashboard</h1>
          <p className="text-sm text-[var(--text-muted)]">🌍 Country · 📊 matrix · 📝 prep · ✅ checklist · ⏱️ countdown</p>
        </div>
      </div>
      <DelegateDashboardContent />
    </DelegateProvider>
  )
}
