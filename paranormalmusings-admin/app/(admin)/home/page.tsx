import HomeForm from '@/components/HomeForm'
import { readDoc } from '@/lib/store'

export const dynamic = 'force-dynamic'

export const metadata = { title: 'Home page' }

export default async function HomePage() {
  const doc = await readDoc()

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-[30px] leading-tight text-ink">Home page</h1>
        <p className="mt-1.5 max-w-2xl text-[14px] leading-relaxed text-muted">
          The front page is a run of bands down the screen. This is what fills each one.
        </p>
      </header>

      <HomeForm
        home={doc.home}
        categories={doc.categories.map((entry) => ({ key: entry.key, label: entry.label }))}
        posts={doc.posts.map((post) => ({
          slug: post.slug,
          title: post.title,
          category: post.category,
          status: post.status,
        }))}
      />
    </div>
  )
}
