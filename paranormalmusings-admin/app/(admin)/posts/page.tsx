import Link from 'next/link'
import PostFilters from '@/components/PostFilters'
import Tabs from '@/components/Tabs'
import { Pill } from '@/components/ui'
import { readDoc } from '@/lib/store'

export const dynamic = 'force-dynamic'

export const metadata = { title: 'Posts' }

type Search = Promise<{ category?: string; status?: string; q?: string }>

export default async function PostsPage({ searchParams }: { searchParams: Search }) {
  const { category = 'all', status = 'all', q = '' } = await searchParams
  const doc = await readDoc()

  const query = q.toLowerCase().trim()
  const labels = new Map(doc.categories.map((entry) => [entry.key, entry.label]))

  const posts = doc.posts
    .filter((post) => category === 'all' || post.category === category || post.alsoIn.includes(category))
    .filter((post) => status === 'all' || post.status === status)
    .filter((post) => !query || `${post.title} ${post.excerpt} ${post.slug}`.toLowerCase().includes(query))

  // Tab counts stay honest to the other filters, so a tab never promises rows
  // the current search will not show.
  const countFor = (key: string) =>
    doc.posts.filter(
      (post) =>
        (key === 'all' || post.category === key || post.alsoIn.includes(key)) &&
        (status === 'all' || post.status === status) &&
        (!query || `${post.title} ${post.excerpt} ${post.slug}`.toLowerCase().includes(query)),
    ).length

  const withFilters = (key: string) => {
    const params = new URLSearchParams()
    if (key !== 'all') params.set('category', key)
    if (status !== 'all') params.set('status', status)
    if (q) params.set('q', q)
    const suffix = params.toString()
    return suffix ? `/posts?${suffix}` : '/posts'
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-[30px] leading-tight text-ink">Posts</h1>
          <p className="mt-1.5 text-[14px] text-muted">Every article on the site, across all sections.</p>
        </div>
        <Link href="/posts/new" className="btn-primary">
          Write a post
        </Link>
      </header>

      <Tabs
        active={category}
        tabs={[
          { key: 'all', label: 'All', href: withFilters('all'), count: countFor('all') },
          ...doc.categories.map((entry) => ({
            key: entry.key,
            label: entry.label,
            href: withFilters(entry.key),
            count: countFor(entry.key),
          })),
        ]}
      />

      <PostFilters category={category} status={status} q={q} />

      {posts.length === 0 ? (
        <p className="card px-5 py-8 text-center text-[14px] text-muted">Nothing matches those filters.</p>
      ) : (
        <ul className="card divide-y divide-rule overflow-hidden">
          {posts.map((post) => (
            <li key={post.slug} className="flex items-start justify-between gap-4 px-5 py-3.5">
              <div className="min-w-0">
                <Link href={`/posts/${post.slug}`} className="text-[14.5px] font-semibold text-ink hover:text-gold-600">
                  {post.title}
                </Link>
                <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[12.5px] text-muted">
                  <span>{labels.get(post.category) ?? post.category}</span>
                  {post.alsoIn.map((key) => (
                    <span key={key} className="text-muted/70">
                      + {labels.get(key) ?? key}
                    </span>
                  ))}
                  <span className="opacity-50">·</span>
                  <span>{post.date || 'No date'}</span>
                  <span className="opacity-50">·</span>
                  <span>{post.body.length ? `${post.body.length} blocks` : 'Not written up'}</span>
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                {post.body.length === 0 ? <span className="pill-muted">Empty</span> : null}
                <Pill status={post.status} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
