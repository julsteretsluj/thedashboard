import { Link } from 'react-router-dom'
import {
  Gavel,
  User,
  Globe,
  Palette,
  Save,
  BookOpen,
  FileText,
  CheckSquare,
  Clock,
  Users,
  LayoutGrid,
  Mic,
  Vote,
  ScrollText,
  AlertTriangle,
  Archive,
  Trophy,
  Link as LinkIcon,
  ChevronRight,
} from 'lucide-react'
import Breadcrumbs from '../components/Breadcrumbs'

interface Feature {
  icon: React.ReactNode
  title: string
  description: string
}

function FeatureCard({ icon, title, description }: Feature) {
  return (
    <div className="flex gap-3 p-3 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border)]">
      <div className="w-9 h-9 rounded-lg bg-[var(--accent-soft)] flex items-center justify-center shrink-0 text-[var(--accent)]">
        {icon}
      </div>
      <div className="min-w-0">
        <h3 className="font-semibold text-[var(--text)] text-sm">{title}</h3>
        <p className="text-[var(--text-muted)] text-xs mt-0.5 leading-relaxed">{description}</p>
      </div>
    </div>
  )
}

export default function About() {
  const overallFeatures: Feature[] = [
    {
      icon: <Palette className="w-4 h-4" />,
      title: 'Theme selector',
      description: 'Switch between light and dark mode. Preference is saved in your browser.',
    },
    {
      icon: <Save className="w-4 h-4" />,
      title: 'Sign in & save to account',
      description: 'Sign in to persist your conferences and data across devices. Data syncs to your account when signed in.',
    },
    {
      icon: <Users className="w-4 h-4" />,
      title: 'Multiple conferences',
      description: 'Add several conferences and switch between them. Each conference keeps its own setup and data.',
    },
    {
      icon: <BookOpen className="w-4 h-4" />,
      title: 'Preset conferences',
      description: 'Add a conference from a preset (e.g. MUN07 IV, THAIMUN XIII, SEAMUN I) to pre-fill name, dates, committees, and allocation matrices.',
    },
    {
      icon: <Globe className="w-4 h-4" />,
      title: 'Globe view',
      description: 'Interactive 3D globe with Chair and Delegate sections as pins. Click a pin to fly to that section and open its content.',
    },
    {
      icon: <LinkIcon className="w-4 h-4" />,
      title: 'Official UN links',
      description: 'Quick links to UN resources (UN websites, research tools, documentation) for both chairs and delegates.',
    },
  ]

  const delegateFeatures: Feature[] = [
    {
      icon: <Globe className="w-4 h-4" />,
      title: 'Country & stance',
      description: 'Set conference name, up to 3 committee topics, your country assignment, email (optional), and a brief stance overview.',
    },
    {
      icon: <Clock className="w-4 h-4" />,
      title: 'Countdown',
      description: 'Set conference start/end and position paper deadline. See live countdowns until conference and deadlines.',
    },
    {
      icon: <Users className="w-4 h-4" />,
      title: 'Committee matrix',
      description: 'Configure committees for the conference. Add entries per committee: first name and delegation. Each delegation shows a flag emoji.',
    },
    {
      icon: <FileText className="w-4 h-4" />,
      title: 'Prep template',
      description: 'MUN Prep Template (Google Doc) to structure research, country stance, position paper, and speeches. Make a copy and fill it in.',
    },
    {
      icon: <LinkIcon className="w-4 h-4" />,
      title: 'Trusted & nation sources',
      description: 'Add links to trusted sources and nation-specific resources for research and country policy.',
    },
    {
      icon: <Archive className="w-4 h-4" />,
      title: 'Chair report & resources',
      description: 'View handbook, position paper guidelines, and resources uploaded by your chair.',
    },
    {
      icon: <CheckSquare className="w-4 h-4" />,
      title: 'Checklist',
      description: 'Tick off research, position paper, speeches, and materials. Aligned with MUN Prep Template sections (topic research, country stance, position paper, opening speech, before conference).',
    },
    {
      icon: <LinkIcon className="w-4 h-4" />,
      title: 'Official links',
      description: 'UN resources, research tools, and conference-related links.',
    },
  ]

  const chairFeatures: Feature[] = [
    {
      icon: <BookOpen className="w-4 h-4" />,
      title: 'Committee & topics',
      description: 'Set committee name, optional universe for fictional committees, up to 3 committee topics, and chair name/email. Conference name per room.',
    },
    {
      icon: <CheckSquare className="w-4 h-4" />,
      title: 'Prep checklist',
      description: 'Before-conference checklist: rules review, topic research, room setup, materials, and team coordination.',
    },
    {
      icon: <CheckSquare className="w-4 h-4" />,
      title: 'Flow checklist',
      description: 'During-session flow: roll call → open floor → recognize motions → vote → engage or GSL → repeat.',
    },
    {
      icon: <Users className="w-4 h-4" />,
      title: 'Delegates',
      description: 'Add delegates by country (UNGA or custom). Optionally set name and email. Bulk add, remove selected, remove all. Edit allocation, name, and email. Custom emoji per delegation. Revoke voting or speaking rights separately. Record strikes. Delegate scoring (1–8 per criterion).',
    },
    {
      icon: <LayoutGrid className="w-4 h-4" />,
      title: 'Digital room',
      description: 'Grid view of all delegates with roll-call status. Give compliments or concern reminders. Active speaker bar.',
    },
    {
      icon: <Users className="w-4 h-4" />,
      title: 'Roll call',
      description: 'Mark each delegate as Absent, Present (may abstain), or Present and voting (must vote). Mark roll call complete when done.',
    },
    {
      icon: <FileText className="w-4 h-4" />,
      title: 'Session',
      description: 'Start, stop, pause, and resume sessions. Session history with names (e.g. Moderated caucus, Unmoderated caucus). Edit or delete sessions.',
    },
    {
      icon: <Mic className="w-4 h-4" />,
      title: 'Speakers',
      description: 'Mod speakers list with add/remove. Set speaking duration. Start and stop active speaker with live timer. Delegates with speaking revoked cannot be added.',
    },
    {
      icon: <FileText className="w-4 h-4" />,
      title: 'Motions & points',
      description: 'Add motions and points. Preset options (moderated caucus, unmoderated caucus, consultation, open/close speaker list). Star motions. Set status (active, passed, failed, tabled). Start votes.',
    },
    {
      icon: <ScrollText className="w-4 h-4" />,
      title: 'Resolutions & amendments',
      description: 'Add resolutions and amendments with main/co-submitters and Google Doc links. Record votes.',
    },
    {
      icon: <Vote className="w-4 h-4" />,
      title: 'Voting',
      description: 'Manual voting: record Yes, No, or Abstain per delegate. Present-and-voting cannot abstain. Delegates with voting revoked are excluded.',
    },
    {
      icon: <FileText className="w-4 h-4" />,
      title: 'Point and motion tracker',
      description: 'Track points and motions during the session.',
    },
    {
      icon: <Trophy className="w-4 h-4" />,
      title: 'Delegate tracker',
      description: 'Score delegates 1–8 per criterion (Delegate Criteria, Position Paper). Rubric descriptions. Identify top candidates and best position paper.',
    },
    {
      icon: <AlertTriangle className="w-4 h-4" />,
      title: 'Crisis',
      description: 'Crisis slides, speakers list, facts, and pathways. Add crisis elements for crisis committees.',
    },
    {
      icon: <Archive className="w-4 h-4" />,
      title: 'Archive',
      description: 'Store position papers, chair reports, prep docs, and resources. Delegates can access from Chair Report & Resources.',
    },
    {
      icon: <LinkIcon className="w-4 h-4" />,
      title: 'Official links',
      description: 'UN resources and conference-related links.',
    },
  ]

  return (
    <div className="max-w-[900px] mx-auto px-3 sm:px-6 py-8 sm:py-12">
      <Breadcrumbs
        items={[
          { label: 'Dashboard', href: '/' },
          { label: 'About' },
        ]}
        className="mb-6"
      />

      <div className="mb-8 sm:mb-10">
        <h1 className="text-2xl sm:text-3xl font-semibold text-[var(--text)] mb-2">
          About SEAMUNs Dashboard
        </h1>
        <p className="text-[var(--text-muted)] text-sm sm:text-base leading-relaxed">
          Part of <a href="https://seamuns.site" target="_blank" rel="noopener noreferrer" className="text-[var(--brand)] hover:underline">SEAMUNs</a> — Model UN conferences across South East Asia. This dashboard helps chairs run committee sessions and delegates prepare for conferences.
        </p>
      </div>

      <section className="mb-10">
        <h2 className="text-lg font-semibold text-[var(--text)] mb-3 flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-[var(--brand-soft)] flex items-center justify-center text-[var(--brand)]">
            <Globe className="w-4 h-4" />
          </span>
          Overall features
        </h2>
        <p className="text-[var(--text-muted)] text-sm mb-4">
          Available to all users across the dashboard.
        </p>
        <div className="grid sm:grid-cols-2 gap-3">
          {overallFeatures.map((f, i) => (
            <FeatureCard key={i} icon={f.icon} title={f.title} description={f.description} />
          ))}
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-lg font-semibold text-[var(--text)] mb-3 flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-[var(--accent-soft)] flex items-center justify-center text-[var(--accent)]">
            <User className="w-4 h-4" />
          </span>
          Delegate features
        </h2>
        <p className="text-[var(--text-muted)] text-sm mb-4">
          In the <Link to="/delegate" className="text-[var(--accent)] hover:underline">Delegate Dashboard</Link> — prepare for conferences, track research, and manage your committee matrix.
        </p>
        <div className="grid sm:grid-cols-2 gap-3">
          {delegateFeatures.map((f, i) => (
            <FeatureCard key={i} icon={f.icon} title={f.title} description={f.description} />
          ))}
        </div>
        <Link
          to="/guide/delegate"
          className="inline-flex items-center gap-2 mt-4 text-sm font-medium text-[var(--accent)] hover:underline"
        >
          Delegate setup guide
          <ChevronRight className="w-4 h-4" />
        </Link>
      </section>

      <section className="mb-10">
        <h2 className="text-lg font-semibold text-[var(--text)] mb-3 flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-[var(--brand-soft)] flex items-center justify-center text-[var(--brand)]">
            <Gavel className="w-4 h-4" />
          </span>
          Chair features
        </h2>
        <p className="text-[var(--text-muted)] text-sm mb-4">
          In the <Link to="/chair" className="text-[var(--brand)] hover:underline">Chair Room</Link> — run roll call, motions, voting, speakers, and crisis during committee sessions.
        </p>
        <div className="grid sm:grid-cols-2 gap-3">
          {chairFeatures.map((f, i) => (
            <FeatureCard key={i} icon={f.icon} title={f.title} description={f.description} />
          ))}
        </div>
        <Link
          to="/guide/chair"
          className="inline-flex items-center gap-2 mt-4 text-sm font-medium text-[var(--brand)] hover:underline"
        >
          Chair setup guide
          <ChevronRight className="w-4 h-4" />
        </Link>
      </section>
    </div>
  )
}
