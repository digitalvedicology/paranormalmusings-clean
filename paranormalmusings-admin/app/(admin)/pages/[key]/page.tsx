import { notFound } from 'next/navigation'
import CategoryForm from '@/components/CategoryForm'
import Tabs from '@/components/Tabs'
import { findCategory, postsIn, readDoc } from '@/lib/store'

export const dynamic = 'force-dynamic'

type Params = { params: Promise<{ key: string }> }

export async function generateMetadata({ params }: Params) {
  const { key } = await params
  const category = findCategory(await readDoc(), key)
  return { title: category ? category.label : 'Page' }
}

export default async function EditPagePage({ params }: Params) {
  const { key } = await params
  const doc = await readDoc()
  const category = findCategory(doc, key)
  if (!category) notFound()

  // The hub pickers reference posts by slug; offering the whole catalogue means
  // a hub can feature a piece filed under another section.
  const posts = doc.posts.map((post) => ({
    slug: post.slug,
    title: post.title,
    category: post.category,
    status: post.status,
  }))

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-[30px] leading-tight text-ink">{category.label}</h1>
        <p className="mt-1.5 text-[14px] text-muted">
          {postsIn(doc, key).length} post{postsIn(doc, key).length === 1 ? '' : 's'} in this section.
        </p>
      </header>

      <Tabs
        active={key}
        tabs={doc.categories.map((entry) => ({
          key: entry.key,
          label: entry.label,
          href: `/pages/${entry.key}`,
          count: postsIn(doc, entry.key).length,
        }))}
      />

      <CategoryForm category={category} posts={posts} siteUrl={process.env.SITE_URL ?? 'http://localhost:3000'} />
    </div>
  )
}
