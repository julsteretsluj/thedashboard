import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'

export interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
  className?: string
}

export default function Breadcrumbs({ items, className = '' }: BreadcrumbsProps) {
  if (items.length === 0) return null

  return (
    <nav
      aria-label="Breadcrumb"
      className={`flex items-center gap-1 text-xs text-[var(--text-muted)] flex-wrap ${className}`}
    >
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1">
          {i > 0 && <ChevronRight className="w-3.5 h-3.5 shrink-0 text-[var(--text-muted)]/60" />}
          {item.href ? (
            <Link
              to={item.href}
              className="hover:text-[var(--brand)] transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-[var(--text)] font-medium">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  )
}
