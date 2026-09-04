import { body, handle, json, requireAuth } from '@/lib/api'
import { saved } from '@/lib/revalidate'
import { readDoc, update } from '@/lib/store'
import { parseNavLinks, parseRelatedSites, parseStringList, parseTopics } from '@/lib/validate'

export const dynamic = 'force-dynamic'

/**
 * The chrome around the pages: header nav, search suggestions, topic chips and
 * the footer's sister-site list. Grouped into one route because they are edited
 * on one screen and nothing else refers to them.
 */
export async function GET() {
  return handle(async () => {
    const doc = await readDoc()
    return json({
      navLinks: doc.navLinks,
      popularSearches: doc.popularSearches,
      topics: doc.topics,
      relatedSites: doc.relatedSites,
      footerPopular: doc.footerPopular,
      posts: doc.posts.map((post) => ({ slug: post.slug, title: post.title, status: post.status })),
      categories: doc.categories.map((category) => ({ key: category.key, label: category.label, href: category.href })),
    })
  })
}

export async function PATCH(request: Request) {
  return handle(async () => {
    await requireAuth(request)

    const doc = await readDoc()
    const raw = ((await body(request)) ?? {}) as Record<string, unknown>

    const navLinks = parseNavLinks(raw.navLinks, doc.navLinks)
    const popularSearches = parseStringList(raw.popularSearches, 'popularSearches', doc.popularSearches)
    const topics = parseTopics(raw.topics, doc.topics)
    const relatedSites = parseRelatedSites(raw.relatedSites, doc.relatedSites)
    const footerPopular = parseStringList(raw.footerPopular, 'footerPopular', doc.footerPopular)

    await update((draft) => {
      draft.navLinks = navLinks
      draft.popularSearches = popularSearches
      draft.topics = topics
      draft.relatedSites = relatedSites
      draft.footerPopular = footerPopular
    })

    return json({ navLinks, popularSearches, topics, relatedSites, footerPopular, ...(await saved()) })
  })
}
