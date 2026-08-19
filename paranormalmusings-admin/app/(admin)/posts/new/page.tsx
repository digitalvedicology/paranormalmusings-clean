import Link from 'next/link'
import PostForm from '@/components/PostForm'
import { readDoc } from '@/lib/store'
import type { Post } from '@/lib/types'

export const dynamic = 'force-dynamic'

export const metadata = { title: 'New post' }

export default async function NewPostPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const { category } = await searchParams
  const doc = await readDoc()

  const first = doc.categories[0]?.key ?? ''
  const chosen = category && doc.categories.some((entry) => entry.key === category) ? category : first

  // A blank post, so the create screen and the edit screen are the same form.
  const blank: Post = {
    slug: '',
    title: '',
    category: chosen,
    alsoIn: [],
    image: '',
    seed: '',
    date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
    readTime: '',
    kicker: '',
    excerpt: '',
    dek: '',
    tags: [],
    body: [],
    status: 'draft',
  }

  return (
    <div className="space-y-6">
      <header>
        <Link href="/posts" className="text-[13px] font-semibold text-gold-600 hover:text-gold-700">
          ← Posts
        </Link>
        <h1 className="mt-2 font-display text-[30px] leading-tight text-ink">Write a post</h1>
        <p className="mt-1.5 text-[14px] text-muted">It saves as a draft until you publish it.</p>
      </header>

      <PostForm
        post={blank}
        mode="create"
        categories={doc.categories.map((entry) => ({ key: entry.key, label: entry.label, href: entry.href }))}
        siteUrl={process.env.SITE_URL ?? 'http://localhost:3000'}
      />
    </div>
  )
}
