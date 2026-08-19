import type { SVGProps } from 'react'

/** The arrow that trails every link on the page. */
export function ArrowRight({ className = 'w-4 h-4', ...rest }: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...rest}>
      <path d="M5 12h13M13 6l6 6-6 6" />
    </svg>
  )
}

export function SearchIcon({ className = 'w-[19px] h-[19px]' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.2-3.2" />
    </svg>
  )
}

/**
 * The tree-of-life mark, redrawn as SVG so it stays sharp at any size.
 * Once the artwork file lands in /public, replace this component's body with
 * an <img src="/logo.png" alt="Paranormal Musings" className="h-11 w-auto" />
 * and drop the wordmark beside it — the file already contains the lettering.
 */
export function Logo({ className = 'w-11 h-11 shrink-0', flat = false }: { className?: string; flat?: boolean }) {
  if (flat) {
    // Footer variant: single gold canopy, single bark tone, no gradients.
    return (
      <svg viewBox="0 0 80 80" className={className} fill="none" aria-hidden="true">
        <g fill="#C9A75B">
          <circle cx="40" cy="19" r="12" />
          <circle cx="26" cy="26" r="10.5" />
          <circle cx="54" cy="26" r="10.5" />
          <circle cx="17" cy="36" r="8.5" />
          <circle cx="63" cy="36" r="8.5" />
          <circle cx="30" cy="37" r="9" />
          <circle cx="50" cy="37" r="9" />
          <circle cx="40" cy="33" r="10" />
          <circle cx="23" cy="44" r="6" />
          <circle cx="57" cy="44" r="6" />
          <circle cx="40" cy="45" r="6.5" />
          <circle cx="32" cy="47" r="5" />
          <circle cx="48" cy="47" r="5" />
        </g>
        <g stroke="#9A7350" strokeLinecap="round" fill="none">
          <path d="M40 51V29" strokeWidth="5" />
          <path d="M40 38c-5-2-9-5.4-11.6-9.8M40 38c5-2 9-5.4 11.6-9.8" strokeWidth="2.9" />
          <path d="M40 31c-2.9-2.7-4.9-6-6-10M40 31c2.9-2.7 4.9-6 6-10" strokeWidth="2.3" />
        </g>
        <path d="M37 49h6l1.8 17.5H35.2L37 49Z" fill="#9A7350" />
        <g stroke="#9A7350" strokeLinecap="round" fill="none">
          <path d="M40 65c-5 .9-8.4 2.7-13.8 3.8M40 65c5 .9 8.4 2.7 13.8 3.8" strokeWidth="3.2" />
          <path d="M40 66c-2.9 2.1-4.6 4.3-5.5 7.3M40 66c2.9 2.1 4.6 4.3 5.5 7.3" strokeWidth="2.6" />
        </g>
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 80 80" className={className} fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="pmCanopy" x1="40" y1="6" x2="40" y2="52" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#D9BF89" />
          <stop offset=".5" stopColor="#A9791F" />
          <stop offset="1" stopColor="#6E4A17" />
        </linearGradient>
        <linearGradient id="pmTrunk" x1="40" y1="34" x2="40" y2="74" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#7A5636" />
          <stop offset="1" stopColor="#4A3320" />
        </linearGradient>
      </defs>

      {/* canopy: overlapping leaf clusters, dense at the crown */}
      <g fill="url(#pmCanopy)">
        <circle cx="40" cy="19" r="12" />
        <circle cx="26" cy="26" r="10.5" />
        <circle cx="54" cy="26" r="10.5" />
        <circle cx="17" cy="36" r="8.5" />
        <circle cx="63" cy="36" r="8.5" />
        <circle cx="30" cy="37" r="9" />
        <circle cx="50" cy="37" r="9" />
        <circle cx="40" cy="33" r="10" />
        <circle cx="23" cy="44" r="6" />
        <circle cx="57" cy="44" r="6" />
        <circle cx="40" cy="45" r="6.5" />
        <circle cx="32" cy="47" r="5" />
        <circle cx="48" cy="47" r="5" />
      </g>

      {/* branch filigree reaching up through the foliage */}
      <g stroke="url(#pmTrunk)" strokeLinecap="round" fill="none">
        <path d="M40 51V29" strokeWidth="5" />
        <path d="M40 38c-5-2-9-5.4-11.6-9.8M40 38c5-2 9-5.4 11.6-9.8" strokeWidth="2.9" />
        <path d="M40 31c-2.9-2.7-4.9-6-6-10M40 31c2.9-2.7 4.9-6 6-10" strokeWidth="2.3" />
        <path d="M40 26c-1.4-2-2.2-4.2-2.4-6.6M40 26c1.4-2 2.2-4.2 2.4-6.6" strokeWidth="1.8" />
      </g>

      {/* trunk and root flare */}
      <path d="M37 49h6l1.8 17.5H35.2L37 49Z" fill="url(#pmTrunk)" />
      <g stroke="url(#pmTrunk)" strokeLinecap="round" fill="none">
        <path d="M40 65c-5 .9-8.4 2.7-13.8 3.8M40 65c5 .9 8.4 2.7 13.8 3.8" strokeWidth="3.2" />
        <path d="M40 66c-2.9 2.1-4.6 4.3-5.5 7.3M40 66c2.9 2.1 4.6 4.3 5.5 7.3" strokeWidth="2.6" />
        <path d="M40 67v6.5" strokeWidth="2.2" />
      </g>
    </svg>
  )
}

/** Icons for the topic chips, keyed by `icon` in lib/content.ts. */
const topicPaths: Record<string, React.ReactNode> = {
  wave: <path d="M4 12h3l2-5 3 10 2.5-7 1.5 4h4" />,
  spirit: <path d="M12 4a5 5 0 0 0-5 5v9l2-1.4 1.5 1.4L12 16.6l1.5 1.4L15 16.6l2 1.4V9a5 5 0 0 0-5-5Z" />,
  sun: (
    <>
      <path d="M12 3v3M12 18v3M3 12h3M18 12h3M6 6l2 2M16 16l2 2M18 6l-2 2M8 16l-2 2" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  flame: <path d="M12 4c4 2 6 4.5 6 8a6 6 0 0 1-12 0c0-3.5 2-6 6-8Z" />,
  house: (
    <>
      <path d="M5 20V9l7-5 7 5v11" />
      <path d="M9.5 20v-5h5v5" />
    </>
  ),
  release: (
    <>
      <path d="M12 3v9M8.5 6.5 12 3l3.5 3.5" />
      <path d="M5 13a7 7 0 0 0 14 0" />
    </>
  ),
  book: (
    <>
      <rect x="4" y="3" width="16" height="18" rx="2" />
      <path d="M8 8h8M8 12h8M8 16h5" />
    </>
  ),
  heart: <path d="M12 21s-7-4.4-7-9.5A4.5 4.5 0 0 1 12 8a4.5 4.5 0 0 1 7 3.5C19 16.6 12 21 12 21Z" />,
  gear: (
    <>
      <path d="M9 3h6v5l3 4v9H6v-9l3-4V3Z" />
      <path d="M9 8h6" />
    </>
  ),
}

export function TopicIcon({ name }: { name: string }) {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      {topicPaths[name]}
    </svg>
  )
}
