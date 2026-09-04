import { cache } from 'react'
import seed from './seed/content.json'
import staticContent from './static-content.json'
import type {
  CardData,
  Category,
  CategoryPage,
  ContentDoc,
  HubCluster,
  HubQuestion,
  Post,
} from './content-types'

export type { Block, ArticleSection } from './blocks'
export { articleSections, headingId } from './blocks'
export type {
  CardData,
  Category,
  CategoryPage,
  ContentDoc,
  HubCluster,
  HubQuestion,
  NavLink,
  Post,
  RelatedSite,
  SiteSettings,
  Topic,
} from './content-types'

/**
 * Where the site's copy comes from.
 *
 * Every page calls `getContent()` and reads what it needs off the result. The
 * document is fetched from the admin once per revalidation window and cached by
 * Next, so the pages stay static-fast while remaining editable — and the admin
 * pings /api/revalidate after each save, so an edit is live at once rather than
 * at the end of the window.
 *
 * If the admin is unreachable the bundled seed is served instead. A CMS being
 * down should slow nobody's reading; the site simply serves what it last knew
 * to be true.
 */

const ADMIN_URL = (process.env.ADMIN_API_URL ?? 'http://localhost:3001').replace(/\/$/, '')
const REVALIDATE = Number(process.env.CONTENT_REVALIDATE ?? 60)

/** picsum stands in until real artwork lands in /public/images. */
export const photo = (seedValue: string, w: number, h: number) =>
  `https://picsum.photos/seed/${seedValue}/${w}/${h}`

/**
 * The picture to show for something that has both a real image and a seed.
 *
 * Everything with artwork — a post, a section, the author — carries an `image`
 * set in the admin and a `seed` that generates a placeholder. This prefers the
 * real one and falls back to the placeholder, so a page is never full of empty
 * grey boxes while the photography is still being gathered.
 *
 * Pure, and used by client components too, so it takes the two fields rather
 * than the whole record.
 */
export const artwork = (image: string, seedValue: string, w: number, h: number) =>
  image || photo(seedValue, w, h)

async function fetchDoc(): Promise<ContentDoc> {
  try {
    // Load from static file (no admin dependency)
    const doc = staticContent as ContentDoc
    if (!Array.isArray(doc.categories) || !Array.isArray(doc.posts)) throw new Error('unexpected payload')
    return doc
  } catch (error) {
    console.warn(`[content] falling back to the bundled seed: ${(error as Error).message}`)
    return seed as unknown as ContentDoc
  }
}

/* ── The bundle every page reads ─────────────────────────────────────── */

export type Content = ReturnType<typeof derive>

function derive(doc: ContentDoc) {
  const byKey = new Map(doc.categories.map((category) => [category.key, category]))
  const bySlugMap = new Map(doc.posts.map((post) => [post.slug, post]))

  const bySlug = (slug: string) => bySlugMap.get(slug)

  /** Resolves a list of slugs to posts, dropping any that no longer exist. */
  const pick = (slugs: string[]): Post[] => slugs.map(bySlug).filter((post): post is Post => Boolean(post))

  /**
   * Everything filed under a section — the posts that live there, plus the ones
   * cross-filed into it. A cross-filed post keeps the address of its own
   * section, so it appears in both listings without ever having two URLs.
   */
  const postsIn = (key: Category) =>
    doc.posts.filter((post) => post.category === key || post.alsoIn.includes(key))

  /**
   * A category's own meta. Falls back to a placeholder rather than throwing:
   * an unpublished section can still be referenced by a stale link, and a
   * missing label is a better outcome than a 500.
   *
   * **Count is dynamically calculated** from postsIn() to ensure accuracy,
   * overriding any stale seed data.
   */
  const meta = (key: Category): CategoryPage => {
    const seedMeta = byKey.get(key)
    const actualCount = postsIn(key).length

    return {
      ...(seedMeta || {
        key,
        label: key,
        title: key,
        href: `/${key}`,
        image: '',
        seed: `pm-${key}`,
        art: 'art-1',
        blurb: '',
        lede: '',
        layout: 'archive',
        published: false,
        hub: { pillar: null, clusters: [], questions: [] },
      }),
      count: actualCount, // Always use actual count, never seed value
    }
  }

  const articleHref = (post: Post) => `${meta(post.category).href}/${post.slug}`

  /**
   * A post links to its own page once it has been written up; until then it
   * points at its category, so nothing on the site links to an empty article.
   */
  const postHref = (post: Post) => (post.body.length ? articleHref(post) : meta(post.category).href)

  /** What a card shows above its title — the kicker if it has one, else the category. */
  const categoryLabel = (post: Post) => post.kicker || meta(post.category).label

  const spotlightPost = bySlug(doc.home.spotlight.slug)

  return {
    site: doc.site,
    posts: doc.posts,
    categories: doc.categories,
    /** Display order wherever categories are listed. */
    categoryOrder: doc.categories.map((category) => category.key),
    navLinks: doc.navLinks,
    popularSearches: doc.popularSearches,
    topics: doc.topics,
    relatedSites: doc.relatedSites,

    categoryMeta: meta,
    /** The URL segment a category owns, e.g. 'western-views'. */
    categorySlug: (key: Category) => meta(key).href.slice(1),

    postsIn,
    bySlug,
    articleHref,
    postHref,
    categoryLabel,

    /** Posts with a body — the set that gets a static article route. */
    writtenPosts: () => doc.posts.filter((post) => post.body.length),

    /** Up to three other posts in the same category, for "read next". */
    relatedPosts: (post: Post, limit = 3) =>
      postsIn(post.category)
        .filter((other) => other.slug !== post.slug)
        .slice(0, limit),

    toCard: (post: Post): CardData => ({
      slug: post.slug,
      title: post.title,
      href: postHref(post),
      label: categoryLabel(post),
      image: post.image,
      seed: post.seed,
      date: post.date,
      readTime: post.readTime,
      excerpt: post.excerpt,
      written: post.body.length > 0,
    }),

    /* ── Home page slices ─────────────────────────────────────────────── */
    home: doc.home,
    highlights: pick(doc.home.highlights),
    investigationRows: pick(doc.home.investigationRows),
    latestPosts: pick(doc.home.latestPosts),
    spotlight: spotlightPost ? { ...spotlightPost, alt: doc.home.spotlight.alt } : null,

    /* ── Footer ───────────────────────────────────────────────────────── */
    footerPopular: pick(doc.footerPopular),

    /* ── Hub curation ─────────────────────────────────────────────────── */
    hubPillar: (key: Category) => meta(key).hub.pillar,
    hubClusters: (key: Category): HubCluster[] => meta(key).hub.clusters,
    hubQuestions: (key: Category): HubQuestion[] => meta(key).hub.questions,
    hasHub: (key: Category) => meta(key).layout === 'hub',
  }
}

/**
 * `cache` dedupes this across one render pass, so a page whose layout, hero and
 * six sections each ask for the content still resolves it once.
 */
export const getContent = cache(async (): Promise<Content> => derive(await fetchDoc()))
