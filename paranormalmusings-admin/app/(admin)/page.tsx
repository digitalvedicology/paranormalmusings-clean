import Link from 'next/link'
import { Pill } from '@/components/ui'
import { postsIn, readDoc } from '@/lib/store'

export const dynamic = 'force-dynamic'

export const metadata = { title: 'Overview' }

export default async function OverviewPage() {
  const doc = await readDoc()

  const drafts = doc.posts.filter((post) => post.status === 'draft')
  const unwritten = doc.posts.filter((post) => post.body.length === 0)
  const hidden = doc.categories.filter((category) => !category.published)

  const stats = [
    { label: 'Pages', value: doc.categories.length, hint: `${hidden.length} hidden` },
    { label: 'Posts', value: doc.posts.length, hint: `${drafts.length} draft` },
    { label: 'Written up', value: doc.posts.length - unwritten.length, hint: `${unwritten.length} still empty` },
  ]

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-display text-[30px] leading-tight text-ink">Overview</h1>
        <p className="mt-1.5 text-[14px] text-muted">
          Last saved{' '}
          {new Date(doc.updatedAt).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })}.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label} className="card p-5">
            <p className="label">{stat.label}</p>
            <p className="mt-2 font-display text-[34px] leading-none text-ink">{stat.value}</p>
            <p className="mt-2 text-[12.5px] text-muted">{stat.hint}</p>
          </div>
        ))}
      </div>

      <section className="card overflow-hidden">
        <div className="flex items-center justify-between border-b border-rule px-5 py-4">
          <h2 className="font-display text-[19px] text-ink">Pages</h2>
          <Link href="/pages" className="text-[13px] font-semibold text-gold-600 hover:text-gold-700">
            Manage pages →
          </Link>
        </div>

        <ul className="divide-y divide-rule">
          {doc.categories.map((category) => {
            const owned = postsIn(doc, category.key)
            return (
              <li key={category.key} className="flex items-center justify-between gap-4 px-5 py-3.5">
                <div className="min-w-0">
                  <Link
                    href={`/pages/${category.key}`}
                    className="text-[14.5px] font-semibold text-ink hover:text-gold-600"
                  >
                    {category.label}
                  </Link>
                  <p className="mt-0.5 truncate text-[12.5px] text-muted">
                    {category.href} · {owned.length} post{owned.length === 1 ? '' : 's'} ·{' '}
                    {category.layout === 'hub' ? 'curated hub' : 'archive list'}
                  </p>
                </div>
                <Pill status={category.published ? 'published' : 'draft'} />
              </li>
            )
          })}
        </ul>
      </section>

      {drafts.length ? (
        <section className="card overflow-hidden">
          <div className="border-b border-rule px-5 py-4">
            <h2 className="font-display text-[19px] text-ink">Drafts</h2>
            <p className="mt-1 text-[12.5px] text-muted">Not visible on the site until published.</p>
          </div>
          <ul className="divide-y divide-rule">
            {drafts.slice(0, 8).map((post) => (
              <li key={post.slug} className="px-5 py-3">
                <Link href={`/posts/${post.slug}`} className="text-[14px] text-ink hover:text-gold-600">
                  {post.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  )
}
