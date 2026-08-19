import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ArticlePage from '@/components/ArticlePage'
import { getContent } from '@/lib/content'

type Params = { category: string; slug: string }

/**
 * Articles written after the last build still have to resolve, so unknown
 * params are rendered on demand rather than refused. `resolve` below is what
 * actually decides whether a URL is real — an unknown slug still 404s, it just
 * does so after a lookup instead of at build time.
 */
export const dynamicParams = true

/** Written-up posts are prerendered; the rest are built on first request. */
export async function generateStaticParams(): Promise<Params[]> {
  const content = await getContent()
  return content.writtenPosts().map((post) => ({
    category: content.categorySlug(post.category),
    slug: post.slug,
  }))
}

async function resolve(params: Params) {
  const content = await getContent()
  const post = content.bySlug(params.slug)

  // The category segment has to match too, so an article is reachable at one
  // URL only rather than under every section's path.
  if (!post || !post.body.length || content.categorySlug(post.category) !== params.category) return undefined
  return post
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const post = await resolve(await params)
  if (!post) return {}

  const description = post.dek || post.excerpt
  return {
    title: post.title,
    description,
    openGraph: { title: post.title, description, type: 'article', publishedTime: post.date },
  }
}

export default async function Page({ params }: { params: Promise<Params> }) {
  const post = await resolve(await params)
  if (!post) notFound()

  return <ArticlePage post={post} />
}
