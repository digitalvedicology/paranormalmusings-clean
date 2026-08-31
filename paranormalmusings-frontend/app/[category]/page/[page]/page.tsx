import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import CategoryPage from '@/components/CategoryPage'
import { getContent } from '@/lib/content'

type Params = { category: string; page: string }

const POSTS_PER_PAGE = 15

/**
 * Paginated category pages.
 * Route: /eastern-views/page/2, /western-views/page/3, etc.
 *
 * Page 1 is served from /[category] (main page), pages 2+ from /[category]/page/[page]
 */

export async function generateStaticParams(): Promise<Params[]> {
  const content = await getContent()
  const params: Params[] = []

  for (const category of content.categories) {
    const posts = content.postsIn(category.key)
    // Skip lead story (page 1 shows lead + 14 archive posts)
    const archiveCount = posts.length - 1
    const totalPages = Math.ceil(archiveCount / POSTS_PER_PAGE)

    // Generate page 2+
    for (let page = 2; page <= totalPages; page++) {
      params.push({
        category: content.categorySlug(category.key),
        page: page.toString(),
      })
    }
  }

  return params
}

async function resolve(params: Params): Promise<{ page: number; totalPages: number }> {
  const content = await getContent()
  const post = content.bySlug(params.category) // Check if it's actually a post slug

  if (post) {
    // This is an article, not a category
    notFound()
  }

  const category = content.categories.find((c) => content.categorySlug(c.key) === params.category)
  if (!category) notFound()

  const page = parseInt(params.page, 10)
  if (isNaN(page) || page < 2) notFound() // Page 1 is served from /[category]

  const posts = content.postsIn(category.key)
  const archiveCount = posts.length - 1 // Exclude lead story
  const totalPages = Math.ceil(archiveCount / POSTS_PER_PAGE)

  if (page > totalPages) notFound()

  return { page, totalPages }
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const resolvedParams = await params
  const resolved = await resolve(resolvedParams)
  const content = await getContent()
  const category = content.categories.find((c) => content.categorySlug(c.key) === resolvedParams.category)

  if (!category) return {}

  const meta = content.categoryMeta(category.key)
  const baseUrl = 'https://paranormalmusings.com'
  const categoryHref = meta.href
  const pageUrl = `${baseUrl}${categoryHref}/page/${resolved.page}`

  const alternates: Record<string, string> = { canonical: pageUrl }

  // rel="prev" (except on page 2)
  if (resolved.page > 2) {
    alternates.prev = `${baseUrl}${categoryHref}/page/${resolved.page - 1}`
  } else if (resolved.page === 2) {
    alternates.prev = `${baseUrl}${categoryHref}`
  }

  // rel="next"
  if (resolved.page < resolved.totalPages) {
    alternates.next = `${baseUrl}${categoryHref}/page/${resolved.page + 1}`
  }

  return {
    title: `${meta.title} — Page ${resolved.page}`,
    description: `${meta.label} · Page ${resolved.page} of ${resolved.totalPages}`,
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
  const resolved = await resolve(resolvedParams)
  const content = await getContent()
  const category = content.categories.find((c) => content.categorySlug(c.key) === resolvedParams.category)

  if (!category) notFound()

  return <CategoryPage category={category.key} page={resolved.page} postsPerPage={POSTS_PER_PAGE} />
}
