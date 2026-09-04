import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import GA4Init from '@/components/GA4Init'
import ScrollReveal from '@/components/ScrollReveal'
import SiteFooter from '@/components/SiteFooter'
import SiteHeader from '@/components/SiteHeader'
import { getContent } from '@/lib/content'
import { webSiteSchema } from '@/lib/structured-data'
import './globals.css'

/**
 * Both are variable fonts, so no `weight` is named: one file each carries the
 * whole axis. Listing weights instead makes next/font fetch a separate static
 * file per weight — fourteen of them here — and preload every one, which is a
 * dozen requests fighting the hero photograph for the opening bytes.
 */
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

/** The masthead is editable, so the metadata is built per request rather than at module load. */
export async function generateMetadata(): Promise<Metadata> {
  const { site } = await getContent()
  const baseUrl = 'https://paranormalmusings.com'

  return {
    title: {
      default: `${site.name} with ${site.author}`,
      template: `%s · ${site.name}`,
    },
    description: site.description,
    robots: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
    alternates: {
      canonical: baseUrl,
    },
    openGraph: {
      title: `${site.name} with ${site.author}`,
      description: site.description,
      type: 'website',
      url: baseUrl,
      locale: 'en_US',
      siteName: site.name,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${site.name} with ${site.author}`,
      description: site.description,
      creator: '@paranormalmusings',
    },
    manifest: '/manifest.json',
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const content = await getContent()
  const schema = webSiteSchema(content.site)

  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <head>
        {/* Link tags for icons and manifest */}
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1a1a1a" media="(prefers-color-scheme: dark)" />
        <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />

        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      </head>
      <body className="bg-paper font-sans text-body antialiased">
        {/* Google Analytics 4 */}
        <GA4Init />

        {/* Skip-to-content link for keyboard users */}
        <a
          href="#main"
          className="absolute -top-12 left-0 z-50 bg-ink text-paper px-4 py-2 rounded-br focus:top-0 focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all"
        >
          Skip to content
        </a>

        {/* The header is a client component, so its copy is passed in.
            Search index is fetched lazily via /api/search-index to reduce page payload. */}
        <SiteHeader
          site={content.site}
          navLinks={content.navLinks}
          popularSearches={content.popularSearches}
        />
        <main id="main">{children}</main>
        <SiteFooter />
        {/* One observer for the whole app; re-runs per navigation. */}
        <ScrollReveal />
      </body>
    </html>
  )
}
