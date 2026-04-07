/** SEAMUNS emblem — circular logo from public/logo.png (favicon + in-app) */
export default function Logo({ className = 'h-8 w-auto' }: { className?: string }) {
  return (
    <img
      src="/logo.png"
      alt="SEAMUNS"
      className={`rounded-full object-contain ${className}`}
      fetchPriority="high"
    />
  )
}
