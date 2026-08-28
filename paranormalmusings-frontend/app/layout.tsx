import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import ScrollReveal from '@/components/ScrollReveal'
import SiteFooter from '@/components/SiteFooter'
import SiteHeader from '@/components/SiteHeader'
import { getContent } from '@/lib/content'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-inter',
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-playfair',
  display: 'swap',
})

/** The masthead is editable, so the metadata is built per request rather than at module load. */
export async function generateMetadata(): Promise<Metadata> {
  const { site } = await getContent()

  return {
    title: {
      default: `${site.name} with ${site.author}`,
      template: `%s · ${site.name}`,
    },
    description: site.description,
    openGraph: {
      title: `${site.name} with ${site.author}`,
      description: site.description,
      type: 'website',
    },
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const content = await getContent()

  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="bg-paper font-sans text-body antialiased">
        {/* The header is a client component, so its copy is passed in. */}
        <SiteHeader
          site={content.site}
          navLinks={content.navLinks}
          popularSearches={content.popularSearches}
          searchIndex={content.posts.map(content.toCard)}
        />
        <main>{children}</main>
        <SiteFooter />
        {/* One observer for the whole app; re-runs per navigation. */}
        <ScrollReveal />
      </body>
    </html>
  )
}
