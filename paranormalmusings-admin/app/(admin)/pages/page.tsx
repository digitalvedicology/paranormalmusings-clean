import Link from 'next/link'
import PageOrder from '@/components/PageOrder'
import { Pill } from '@/components/ui'
import { postsIn, readDoc } from '@/lib/store'

export const dynamic = 'force-dynamic'

export const metadata = { title: 'Pages' }

export default async function PagesPage() {
  const doc = await readDoc()

  const pages = doc.categories.map((category) => ({
    key: category.key,
    label: category.label,
    href: category.href,
    layout: category.layout,
    published: category.published,
    posts: postsIn(doc, category.key).length,
  }))

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-[30px] leading-tight text-ink">Pages</h1>
          <p className="mt-1.5 max-w-2xl text-[14px] leading-relaxed text-muted">
            Each of these is a section of the site — its own address, its own copy, its own posts. Open one to edit
            what it says and how it is laid out.
          </p>
        </div>
        <Link href="/pages/new" className="btn-primary">
          Add a page
        </Link>
      </header>

      <ul className="grid gap-4 sm:grid-cols-2">
        {pages.map((page) => (
          <li key={page.key} className="card p-5">
            <div className="flex items-start justify-between gap-3">
              <Link href={`/pages/${page.key}`} className="font-display text-[20px] text-ink hover:text-gold-600">
                {page.label}
              </Link>
              <Pill status={page.published ? 'published' : 'draft'} />
            </div>

            <p className="mt-1.5 text-[12.5px] text-muted">{page.href}</p>

            <dl className="mt-4 flex gap-6 border-t border-rule pt-3.5 text-[12.5px]">
              <div>
                <dt className="label">Posts</dt>
                <dd className="mt-0.5 text-[15px] font-semibold text-ink">{page.posts}</dd>
              </div>
              <div>
                <dt className="label">Layout</dt>
                <dd className="mt-0.5 text-[15px] font-semibold text-ink">
                  {page.layout === 'hub' ? 'Curated hub' : 'Archive'}
                </dd>
              </div>
            </dl>

            <div className="mt-4 flex gap-2">
              <Link href={`/pages/${page.key}`} className="btn-ghost btn-sm">
                Edit page
              </Link>
              <Link href={`/posts?category=${page.key}`} className="btn-ghost btn-sm">
                Its posts
              </Link>
            </div>
          </li>
        ))}
      </ul>

      <PageOrder pages={pages.map((page) => ({ key: page.key, label: page.label }))} />
    </div>
  )
}
