import NavigationForm from '@/components/NavigationForm'
import { readDoc } from '@/lib/store'

export const dynamic = 'force-dynamic'

export const metadata = { title: 'Navigation' }

export default async function NavigationPage() {
  const doc = await readDoc()

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-[30px] leading-tight text-ink">Navigation</h1>
        <p className="mt-1.5 max-w-2xl text-[14px] leading-relaxed text-muted">
          The menu, the topic chips and the footer — everything that wraps around the pages themselves.
        </p>
      </header>

      <NavigationForm
        navLinks={doc.navLinks}
        popularSearches={doc.popularSearches}
        topics={doc.topics}
        relatedSites={doc.relatedSites}
        footerPopular={doc.footerPopular}
        categories={doc.categories.map((entry) => ({ key: entry.key, label: entry.label, href: entry.href }))}
        posts={doc.posts.map((post) => ({ slug: post.slug, title: post.title, status: post.status }))}
        siteUrl={process.env.SITE_URL ?? 'http://localhost:3000'}
      />
    </div>
  )
}
