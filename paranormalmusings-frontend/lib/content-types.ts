import type { Block } from './blocks'

/**
 * The shape the admin serves and this site renders.
 *
 * Kept byte-identical to `lib/types.ts` in paranormalmusings-admin — that file
 * is the source of truth, this one is its copy on the reading side. If you
 * change one, change the other.
 */

/**
 * Categories are data now rather than a fixed union, so a new section can be
 * added in the admin without a deploy. Everything that used to be typed
 * `Category` still is; the type is simply wider.
 */
export type Category = string

export type HubCluster = { title: string; blurb: string; slugs: string[] }
export type HubQuestion = { question: string; slug: string }

export type CategoryPage = {
  key: string
  label: string
  title: string
  href: string
  count: number
  /** The section photograph. Empty falls back to the seed placeholder. */
  image: string
  seed: string
  art: string
  blurb: string
  lede: string
  /** `hub` is the curated index; `archive` is the plain reverse-chronological list. */
  layout: 'hub' | 'archive'
  published: boolean
  hub: { pillar: string | null; clusters: HubCluster[]; questions: HubQuestion[] }
}

export type Post = {
  slug: string
  title: string
  category: Category
  /** Extra categories it is filed under, shown alongside the primary. */
  alsoIn: Category[]
  /** Real artwork. Empty falls back to the seed placeholder. */
  image: string
  seed: string
  date: string
  readTime: string
  /** Sub-label shown instead of the category on investigation rows. */
  kicker: string
  excerpt: string
  /** Standfirst — the paragraph under the headline. */
  dek: string
  tags: string[]
  /** Empty means "not written up yet": cards link to the category instead. */
  body: Block[]
  status: 'published' | 'draft'
}

export type SiteSettings = {
  name: string
  tagline: string
  author: string
  /** The byline portrait. */
  authorImage: string
  description: string
  address: string[]
  phone: { label: string; href: string }
  email: { label: string; href: string }
}

export type HomeSettings = {
  featureCategory: Category
  cardBandCategory: Category
  highlights: string[]
  investigationRows: string[]
  latestPosts: string[]
  spotlight: { slug: string; alt: string }
}

export type NavLink = { label: string; href: string; mobileLabel: string }
export type Topic = { label: string; icon: string; href: string }
export type RelatedSite = { name: string; href: string; blurb: string; domain: string; image: string }

export type ContentDoc = {
  version: number
  updatedAt: string
  site: SiteSettings
  /** Ordered — this array *is* the display order. */
  categories: CategoryPage[]
  posts: Post[]
  home: HomeSettings
  navLinks: NavLink[]
  popularSearches: string[]
  topics: Topic[]
  relatedSites: RelatedSite[]
  footerPopular: string[]
}

/**
 * The flat shape a card needs. Client components take this rather than a Post,
 * so article bodies never get serialised into the browser payload.
 */
export type CardData = {
  slug: string
  title: string
  href: string
  label: string
  image: string
  seed: string
  date: string
  readTime: string
  excerpt?: string
  written: boolean
}
