/**
 * The shape of the whole site, in one document.
 *
 * This file is the contract between the three apps: the admin edits a
 * `ContentDoc`, `/api/content` serves one, and the frontend renders one. The
 * frontend keeps a byte-identical copy of these types in `lib/content-types.ts`
 * — if you change something here, change it there too.
 */

/* ── Article bodies ──────────────────────────────────────────────────────
   Bodies are lists of blocks rather than blobs of HTML, so the site keeps
   control of measure, rhythm and heading style. Mirrors the frontend's
   lib/blocks.ts exactly.                                                   */
export type Block =
  /** `tone: 'note'` sets the section apart as an advisory aside. */
  | { type: 'h2'; text: string; tone?: 'note' }
  /** A named point inside a section — only h2 opens a new section. */
  | { type: 'h3'; text: string }
  | { type: 'p'; text: string }
  | { type: 'quote'; text: string }
  | { type: 'list'; items: string[] }
  /**
   * A picture between paragraphs. `alt` describes it for anyone who cannot see
   * it; a decorative image is marked by leaving it empty, which is a different
   * thing from forgetting to write one.
   */
  | { type: 'image'; src: string; alt: string; caption?: string }

export const BLOCK_TYPES = ['h2', 'h3', 'p', 'quote', 'list', 'image'] as const
export type BlockType = (typeof BLOCK_TYPES)[number]

/* ── Categories ──────────────────────────────────────────────────────── */

/** One of the four drawn backdrops in the site's globals.css. */
export const ART_KEYS = ['art-1', 'art-2', 'art-3', 'art-4'] as const
export type ArtKey = (typeof ART_KEYS)[number]

/**
 * Which component renders the category page:
 * `hub` is the curated index (featured piece + paginated grid + CTA),
 * `archive` is the plain reverse-chronological list.
 */
export const LAYOUTS = ['hub', 'archive'] as const
export type CategoryLayout = (typeof LAYOUTS)[number]

export type HubCluster = { title: string; blurb: string; slugs: string[] }
export type HubQuestion = { question: string; slug: string }

export type CategoryPage = {
  /** Stable id. Referenced by posts and by the home-page slots. */
  key: string
  /** Short name, used in nav, chips and card kickers. */
  label: string
  /** The <h1> and <title> of the category page. */
  title: string
  /** Route the page lives at, leading slash included. */
  href: string
  /** The number shown in "See all N stories" — a display figure, not a count. */
  count: number
  /** The banner photograph. Empty falls back to the placeholder the seed generates. */
  image: string
  /** Generates the placeholder used until a real image is set. */
  seed: string
  art: ArtKey
  /** One line, used on cards that link into the category. */
  blurb: string
  /** The standfirst under the category page's own title. */
  lede: string
  layout: CategoryLayout
  /** Unpublished categories drop out of nav, footer and listings. */
  published: boolean
  hub: {
    /** Slug of the piece featured across the top. */
    pillar: string | null
    clusters: HubCluster[]
    questions: HubQuestion[]
  }
  /** SEO Metadata */
  seo?: {
    metaTitle?: string
    metaDescription?: string
    keyword?: string
    ogTitle?: string
    ogDescription?: string
    ogImage?: string
    canonical?: string
  }
}

/* ── Posts ───────────────────────────────────────────────────────────── */

/** Where the featured image sits on the article page. */
export const PLACEMENTS = ['lead', 'standard', 'hidden'] as const
export type ImagePlacement = (typeof PLACEMENTS)[number]

export const STATUSES = ['published', 'draft'] as const
export type PostStatus = (typeof STATUSES)[number]

export type Post = {
  slug: string
  title: string
  /** The category that owns the post's URL. */
  category: string
  /** Extra categories it is filed under, shown alongside the primary. */
  alsoIn: string[]
  /** Real artwork. Empty falls back to the placeholder the seed generates. */
  image: string
  /**
   * Where that artwork sits on the article page. It is used on cards and in
   * listings either way — 'hidden' only takes it off the article itself.
   */
  imagePlacement: ImagePlacement
  seed: string
  date: string
  readTime: string
  /** Sub-label shown instead of the category on investigation rows. */
  kicker: string
  /** The summary on cards and in listings. */
  excerpt: string
  /** Standfirst — the paragraph under the headline on the article itself. */
  dek: string
  tags: string[]
  /** Empty means "not written up yet": cards link to the category instead. */
  body: Block[]
  status: PostStatus
  /** SEO Metadata */
  seo?: {
    metaTitle?: string
    metaDescription?: string
    keyword?: string
    ogTitle?: string
    ogDescription?: string
    ogImage?: string
    canonical?: string
  }
}

/* ── Everything else ─────────────────────────────────────────────────── */

export type SiteSettings = {
  name: string
  tagline: string
  author: string
  /** The byline portrait, shown beside every article and on every card. */
  authorImage: string
  description: string
  address: string[]
  phone: { label: string; href: string }
  email: { label: string; href: string }
}

export type HomeSettings = {
  /** Which category fills the big feature band. */
  featureCategory: string
  /** Which category fills the three-up card band. */
  cardBandCategory: string
  highlights: string[]
  investigationRows: string[]
  latestPosts: string[]
  spotlight: { slug: string; alt: string }
}

export type NavLink = { label: string; href: string; mobileLabel: string }
export const ICON_KEYS = ['wave', 'spirit', 'sun', 'flame', 'house', 'release', 'book', 'heart', 'gear'] as const
export type IconKey = (typeof ICON_KEYS)[number]
export type Topic = { label: string; icon: IconKey; href: string }
export type RelatedSite = { name: string; href: string; blurb: string; domain: string; image: string }

export type ContentDoc = {
  version: number
  /** ISO stamp, rewritten on every successful save. */
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
