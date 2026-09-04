import Link from 'next/link'
import { notFound } from 'next/navigation'
import PostForm from '@/components/PostForm'
import { findPost, postUsage, readDoc } from '@/lib/store'

export const dynamic = 'force-dynamic'

type Params = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Params) {
  const { slug } = await params
  const post = findPost(await readDoc(), slug)
  return { title: post ? post.title : 'Post' }
}

export default async function EditPostPage({ params }: Params) {
  const { slug } = await params
  const doc = await readDoc()
  const post = findPost(doc, slug)
  if (!post) notFound()

  const usage = postUsage(doc, slug)
  const pinned = [...usage.home, ...usage.footer, ...usage.hubs.map((key) => `${key} hub`)]

  return (
    <div className="space-y-6">
      <header>
        <Link href="/posts" className="text-[13px] font-semibold text-gold-600 hover:text-gold-700">
          ← Posts
        </Link>
        <h1 className="mt-2 font-display text-[30px] leading-tight text-ink">{post.title}</h1>

        {pinned.length ? (
          <p className="mt-2 text-[12.5px] text-muted">
            Featured in: <span className="text-body">{pinned.join(', ')}</span>. Deleting it clears those slots.
          </p>
        ) : null}
      </header>

      <PostForm
        post={post}
        categories={doc.categories.map((entry) => ({ key: entry.key, label: entry.label, href: entry.href }))}
        siteUrl={process.env.SITE_URL ?? 'http://localhost:3000'}
      />
    </div>
  )
}
