import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ArticlePage from '@/components/ArticlePage'
import { getContent } from '@/lib/content'
import { articleSchema, breadcrumbSchema, formatDateToISO8601 } from '@/lib/structured-data'
import { investigationArticleSchemas } from '@/lib/investigation-schema'
import { easternArticleSchemas } from '@/lib/eastern-schema'
import { westernArticleSchemas } from '@/lib/western-schema'
import { casesArticleSchemas } from '@/lib/cases-schema'

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
  const resolvedParams = await params
  const post = await resolve(resolvedParams)
  if (!post) return {}

  const content = await (await import('@/lib/content')).getContent()
  const baseUrl = 'https://paranormalmusings.com'
  const articleUrl = `${baseUrl}${content.articleHref(post)}`

  // Use SEO metadata if available, fallback to post content
  const title = post.seo?.metaTitle || post.title
  const description = post.seo?.metaDescription || post.dek || post.excerpt
  const ogTitle = post.seo?.ogTitle || post.title
  const ogDescription = post.seo?.ogDescription || description
  const ogImage = post.seo?.ogImage || undefined
  const canonical = post.seo?.canonical || articleUrl

  // Parse and format date to ISO 8601
  const publishedDate = post.date ? formatDateToISO8601(post.date) : undefined

  const metadata: Metadata = {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      type: 'article',
      url: articleUrl,
      publishedTime: publishedDate,
      modifiedTime: publishedDate,
      authors: [content.site.author],
      tags: post.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: ogTitle,
      description: ogDescription,
      creator: '@paranormalmusings',
    },
  }

  if (ogImage) {
    metadata.openGraph = {
      ...metadata.openGraph,
      images: [{ url: ogImage, width: 1200, height: 630 }],
    }
  }

  return metadata
}


export default async function Page({ params }: { params: Promise<Params> }) {
  const post = await resolve(await params)
  if (!post) notFound()

  const content = await getContent()
  const categoryMeta = content.categoryMeta(post.category)

  // Select the hand-authored @graph schema by category (Organization, Person,
  // WebSite, BlogPosting, WebPage, BreadcrumbList) or fall back to generated.
  const schemaLookups: Record<string, Record<string, object>> = {
    investigation: investigationArticleSchemas,
    eastern: easternArticleSchemas,
    western: westernArticleSchemas,
    cases: casesArticleSchemas,
  }
  const handAuthoredSchema = schemaLookups[post.category]?.[post.slug]

  const articleSchemaData = handAuthoredSchema ? undefined : articleSchema(post, categoryMeta, content.site.author)
  const breadcrumbSchemaData = handAuthoredSchema ? undefined : breadcrumbSchema(categoryMeta, post)

  return (
    <>
      <ArticlePage post={post} />
      {/* JSON-LD Structured Data */}
      {handAuthoredSchema ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(handAuthoredSchema) }}
          suppressHydrationWarning
        />
      ) : (
        <>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchemaData) }}
            suppressHydrationWarning
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchemaData) }}
            suppressHydrationWarning
          />
        </>
      )}
    </>
  )
}
