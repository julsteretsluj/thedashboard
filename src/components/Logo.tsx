/** SEAMUNs logo — inline SVG so it adapts to theme (currentColor) and always loads */
export default function Logo({ className = 'h-8 w-auto' }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 120 32"
      fill="none"
      className={className}
      aria-hidden
    >
      <rect width="32" height="32" rx="6" fill="currentColor" fillOpacity={0.12} />
      <path
        d="M8 10h16v2H8V10zm0 5h12v2H8v-2zm0 5h14v2H8v-2z"
        fill="currentColor"
        fillOpacity={0.85}
      />
      <circle cx="24" cy="22" r="4" fill="currentColor" fillOpacity={0.7} />
      <text
        x="40"
        y="22"
        fontFamily="Georgia, serif"
        fontSize="18"
        fontWeight="600"
        fill="currentColor"
      >
        SEAMUNs
      </text>
    </svg>
  )
}
