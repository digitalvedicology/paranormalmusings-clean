import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import CategoryPage from '@/components/CategoryPage'
import { getContent } from '@/lib/content'

type Params = { category: string }

/**
 * Category archive pages (page 1).
 * Route: /eastern-views, /western-views, /investigation, /case-studies
 *
 * Page 2+ use /[category]/page/[page]/page.tsx
 */

export async function generateStaticParams(): Promise<Params[]> {
  const content = await getContent()
  return content.categories.map((category) => ({
    category: content.categorySlug(category.key),
  }))
}

async function resolve(category: string) {
  const content = await getContent()
  const categoryMeta = content.categories.find((c) => content.categorySlug(c.key) === category)

  if (!categoryMeta) {
    // Not a category, check if it's a post slug
    const post = content.bySlug(category)
    if (post && post.body.length) {
      // It's an article, let [slug] handle it
      return null
    }
    notFound()
  }

  return categoryMeta.key
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const resolvedParams = await params
  const categoryKey = await resolve(resolvedParams.category)

  if (!categoryKey) return {}

  const content = await getContent()
  const meta = content.categoryMeta(categoryKey)
  const baseUrl = 'https://paranormalmusings.com'

  const allPosts = content.postsIn(categoryKey)
  const archiveCount = allPosts.length - 1 // Exclude lead story
  const totalPages = Math.ceil(archiveCount / 15)

  const alternates: any = { canonical: `${baseUrl}${meta.href}` }

  // rel="next" for page 2
  if (totalPages > 1) {
    alternates.next = `${baseUrl}${meta.href}/page/2`
  }

  return {
    title: meta.title,
    description: meta.blurb,
    alternates,
    robots: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
  }
}

export default async function Page({ params }: { params: Promise<Params> }) {
  const resolvedParams = await params
  const categoryKey = await resolve(resolvedParams.category)

  if (!categoryKey) notFound()

  return <CategoryPage category={categoryKey} page={1} postsPerPage={15} />
}
