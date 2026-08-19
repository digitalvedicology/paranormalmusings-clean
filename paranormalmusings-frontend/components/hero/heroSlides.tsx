import type { ReactNode } from 'react'

/**
 * Each slide carries its own drawn backdrop, so the hero is never at the mercy
 * of whatever photo a random seed returns. Drop a real photograph at the
 * `image` path and it covers the artwork automatically.
 */
export type HeroSlide = {
  art: string
  image: string
  eyebrow: string
  readTime: string
  headline: ReactNode
  excerpt: ReactNode
  byline?: { date: string; extra?: string }
  cta: { label: string; href: string }
  secondaryCta?: { label: string; href: string }
  headingLevel: 'h1' | 'h2'
  silhouette: ReactNode
}

const headlineBreak = <br className="hidden sm:block" />

export const heroSlides: HeroSlide[] = [
  /* ── SLIDE 1 · The blog ─────────────────────────────────────────────── */
  {
    art: 'art-1',
    image: '/images/hero-1.jpg',
    eyebrow: 'Featured',
    readTime: '8 min read',
    headingLevel: 'h1',
    headline: (
      <>
        The stories behind{headlineBreak} what we call the{headlineBreak}
        <span className="grad-word">unexplained.</span>
      </>
    ),
    excerpt: (
      <>
        Twenty-five years of paranormal investigation — explorations of life after death from
        Indian&nbsp;(Eastern) and Western viewpoints, encounters with inhuman energies, and notes on the
        paranormal energy spectrum.
      </>
    ),
    cta: { label: 'Read Featured Story', href: '/western-views' },
    secondaryCta: { label: 'Explore Latest', href: '#latest' },
    // A moonlit stand of trees over a low horizon.
    silhouette: (
      <svg className="silhouette" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
        <circle cx="1180" cy="200" r="86" fill="#E8D9B4" opacity=".16" />
        <circle cx="1180" cy="200" r="52" fill="#F0E4C6" opacity=".22" />
        <g stroke="#0A0704" strokeLinecap="round" fill="none" opacity=".92">
          <path d="M1310 900V430" strokeWidth="26" />
          <path d="M1310 560c-52-16-96-52-124-104M1310 560c52-16 96-52 124-104" strokeWidth="14" />
          <path d="M1310 480c-34-24-58-58-70-100M1310 480c34-24 58-58 70-100" strokeWidth="10" />
          <path d="M1186 456c-30-8-56-26-74-52M1434 456c30-8 56-26 74-52" strokeWidth="7" />
          <path d="M240 900V500" strokeWidth="18" />
          <path d="M240 620c-40-12-72-40-94-80M240 620c40-12 72-40 94-80" strokeWidth="10" />
          <path d="M240 546c-26-18-44-44-52-76M240 546c26-18 44-44 52-76" strokeWidth="7" />
        </g>
        <path d="M0 838c210-26 360 14 560-4s330-52 540-30 330 34 500 18v78H0Z" fill="#080503" opacity=".95" />
      </svg>
    ),
  },

  /* ── SLIDE 2 · Western Views ────────────────────────────────────────── */
  {
    art: 'art-2',
    image: '/images/hero-2.jpg',
    eyebrow: 'Western Views',
    readTime: '7 min read',
    headingLevel: 'h2',
    headline: (
      <>
        How to protect yourself{headlineBreak} from ghosts and <span className="grad-word">bad spirits?</span>
      </>
    ),
    excerpt: (
      <>
        I am pretty sure that the question of how to protect yourself from ghosts and bad spirits has come to
        everyone&rsquo;s mind. In this excerpt, you will learn how to protect yourself…
      </>
    ),
    byline: { date: 'April 1, 2021', extra: '0 comments' },
    // This slide is the article itself, so it links straight to it.
    cta: { label: 'Read Story', href: '/western-views/how-to-protect-yourself-from-ghosts-and-bad-spirits' },
    // A lit threshold in a dark room.
    silhouette: (
      <svg className="silhouette" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
        <defs>
          <linearGradient id="pmDoor" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#F2E6C6" stopOpacity=".55" />
            <stop offset="1" stopColor="#E4CE94" stopOpacity=".16" />
          </linearGradient>
        </defs>
        <rect x="880" y="196" width="210" height="560" rx="6" fill="url(#pmDoor)" />
        <path d="M880 756h210l190 144H700l180-144Z" fill="#E4CE94" opacity=".10" />
        <rect x="836" y="160" width="298" height="44" fill="#0A0704" opacity=".9" />
        <rect x="820" y="160" width="30" height="640" fill="#0A0704" opacity=".9" />
        <rect x="1120" y="160" width="30" height="640" fill="#0A0704" opacity=".9" />
        <rect x="0" y="740" width="1600" height="160" fill="#070402" opacity=".92" />
      </svg>
    ),
  },

  /* ── SLIDE 3 · Eastern Views ────────────────────────────────────────── */
  {
    art: 'art-3',
    image: '/images/hero-3.jpg',
    eyebrow: 'Eastern Views',
    readTime: '6 min read',
    headingLevel: 'h2',
    headline: (
      <>
        Death, rebirth and{headlineBreak}
        <span className="grad-word">evolution.</span>
      </>
    ),
    excerpt: (
      <>
        Let&rsquo;s discuss Death, Rebirth and Evolution from the eastern perspective. The issue of rebirth, or
        the existence of the soul beyond a single lifetime…
      </>
    ),
    byline: { date: 'April 1, 2021' },
    cta: { label: 'Read Story', href: '/eastern-views' },
    // A sun low over layered ridges.
    silhouette: (
      <svg className="silhouette" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
        <circle cx="470" cy="556" r="120" fill="#E9D6A6" opacity=".18" />
        <circle cx="470" cy="556" r="72" fill="#F2E4BE" opacity=".26" />
        <path d="M0 596c220-70 380 26 560-16s360-96 560-40 320 60 480 30v330H0Z" fill="#120C06" opacity=".85" />
        <path d="M0 690c260-54 420 30 640 6s340-70 560-34 300 44 400 26v212H0Z" fill="#0C0804" opacity=".92" />
        <path d="M0 790c300-40 460 26 700 8s360-46 560-24 260 26 340 14v112H0Z" fill="#070402" />
      </svg>
    ),
  },

  /* ── SLIDE 4 · Investigation ────────────────────────────────────────── */
  {
    art: 'art-4',
    image: '/images/hero-4.jpg',
    eyebrow: 'Investigation',
    readTime: '7 min read',
    headingLevel: 'h2',
    headline: (
      <>
        How to review the best{headlineBreak} paranormal <span className="grad-word">evidence.</span>
      </>
    ),
    excerpt: (
      <>
        Capturing the evidence of paranormal activity is the ultimate goal for an investigator. Sieving through
        the footage for the genuine anomaly is the harder half…
      </>
    ),
    byline: { date: 'April 1, 2021' },
    cta: { label: 'Read Story', href: '/investigation' },
    // A night treeline under an EVP trace.
    silhouette: (
      <svg className="silhouette" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
        <g stroke="#D9BF89" fill="none" opacity=".26" strokeLinecap="round">
          <path
            d="M60 300c40 0 40-54 80-54s40 96 80 96 40-132 80-132 40 150 80 150 40-72 80-72 40 40 80 40 40-96 80-96 40 128 80 128 40-58 80-58 40 22 80 22 40-84 80-84 40 92 80 92 40-40 80-40 40 18 80 18"
            strokeWidth="3"
          />
        </g>
        <g fill="#080503">
          <path d="M120 900 240 470l120 430Z" />
          <path d="M300 900 420 520l120 380Z" opacity=".95" />
          <path d="M0 900 90 560l90 340Z" opacity=".9" />
          <path d="M1180 900l130-470 130 470Z" />
          <path d="M1380 900l120-410 120 410Z" opacity=".95" />
          <path d="M980 900l100-360 100 360Z" opacity=".85" />
          <path d="M620 900l80-300 80 300Z" opacity=".7" />
        </g>
        <rect x="0" y="856" width="1600" height="44" fill="#060402" />
      </svg>
    ),
  },
]

/** Inner pages reuse a slide's drawn backdrop for their banner. */
export const silhouetteFor = (art: string) => heroSlides.find((slide) => slide.art === art)?.silhouette
