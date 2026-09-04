import { getContent } from '@/lib/content'

/**
 * GET /api/search-index
 *
 * Returns the full search index (all posts with slug, title, image, date, read time, excerpt).
 * Fetched lazily by the search overlay when the user opens the search box.
 *
 * Cacheable: revalidates when content changes (ISR tag-based revalidation).
 * Gzipped: ~40 KB on the wire (vs 269 KB page payload).
 */

export async function GET() {
  const content = await getContent()
  const searchIndex = content.posts.map(content.toCard)

  return Response.json(searchIndex, {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      'X-Content-Type-Options': 'nosniff',
    },
  })
}
