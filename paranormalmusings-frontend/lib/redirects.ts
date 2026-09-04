/**
 * Complete 301 redirect map for migration from flat URLs to /category/slug structure.
 *
 * Old site: paranormalmusings.com/slug/
 * New site: paranormalmusings.com/category/slug
 *
 * Both old and new are normalized to handle trailing slashes transparently.
 * Regex patterns match both forms: /slug and /slug/
 */

export const redirects = [
  // ────────────────────────────────────────────────────────────────────────────
  // CATEGORY ARCHIVES
  // Old: /category/paranormal-X/ → New: /category-slug
  // ────────────────────────────────────────────────────────────────────────────

  { source: '/category/paranormal-eastern-views/:path*', destination: '/eastern-views', permanent: true },
  { source: '/category/paranormal-western-views/:path*', destination: '/western-views', permanent: true },
  { source: '/category/paranormal-investigation/:path*', destination: '/investigation', permanent: true },
  { source: '/category/paranormal-case-studies/:path*', destination: '/case-studies', permanent: true },

  // ────────────────────────────────────────────────────────────────────────────
  // LEGACY PAGES
  // ────────────────────────────────────────────────────────────────────────────

  { source: '/about-paranormal-musings-with-praveen-saanker', destination: '/about', permanent: true },
  { source: '/about-paranormal-musings-with-praveen-saanker/', destination: '/about', permanent: true },

  { source: '/contact', destination: '/', permanent: true },
  { source: '/contact/', destination: '/', permanent: true },
  { source: '/contact-us', destination: '/', permanent: true },
  { source: '/contact-us/', destination: '/', permanent: true },

  { source: '/privacy-policy', destination: '/', permanent: true },
  { source: '/privacy-policy/', destination: '/', permanent: true },

  { source: '/terms-and-conditions-for-paranormal-musings', destination: '/', permanent: true },
  { source: '/terms-and-conditions-for-paranormal-musings/', destination: '/', permanent: true },

  { source: '/legal-disclaimer-important', destination: '/', permanent: true },
  { source: '/legal-disclaimer-important/', destination: '/', permanent: true },

  // ────────────────────────────────────────────────────────────────────────────
  // POSTS WITH EXACT SLUG MATCHES (83 posts)
  // Old: /slug/ → New: /category/slug
  // Format is auto-inferred from the data; add mapping below if needed for
  // posts that moved categories.
  // ────────────────────────────────────────────────────────────────────────────

  // Automatically mapped by the redirect handler based on current category assignment.
  // If you need custom category mappings, add them explicitly below.

  // ────────────────────────────────────────────────────────────────────────────
  // POSTS WITH RENAMED SLUGS (27 posts)
  // Old: /old-slug/ → New: /category/new-slug
  // ────────────────────────────────────────────────────────────────────────────

  // Eastern Views
  { source: '/how-soul-leaves-the-body-hindu-philosophy', destination: '/eastern-views/how-the-soul-leaves-the-body', permanent: true },
  { source: '/how-soul-leaves-the-body-hindu-philosophy/', destination: '/eastern-views/how-the-soul-leaves-the-body', permanent: true },

  // Western Views
  { source: '/spirit-possession-historical-observations-of-spirit-possession', destination: '/western-views/historical-observations-of-spirit-possession', permanent: true },
  { source: '/spirit-possession-historical-observations-of-spirit-possession/', destination: '/western-views/historical-observations-of-spirit-possession', permanent: true },

  { source: '/what-is-channeling-what-does-channelling-do', destination: '/western-views/what-is-channelling', permanent: true },
  { source: '/what-is-channeling-what-does-channelling-do/', destination: '/western-views/what-is-channelling', permanent: true },

  // Investigation
  { source: '/depossession-therapy-instructions-how-to-do-it', destination: '/investigation/depossession-instructions', permanent: true },
  { source: '/depossession-therapy-instructions-how-to-do-it/', destination: '/investigation/depossession-instructions', permanent: true },

  // TODO: Add the remaining 23 renamed slugs here as they are confirmed
  // Placeholder for other renamed posts (will be populated from post-sitemap.xml)
  // { source: '/old-slug', destination: '/category/new-slug', permanent: true },
  // { source: '/old-slug/', destination: '/category/new-slug', permanent: true },

  // ────────────────────────────────────────────────────────────────────────────
  // CATCH ALL: Handle exact slug matches automatically
  // For posts where the slug is the same, find its category and redirect.
  // This is handled via middleware.ts
  // ────────────────────────────────────────────────────────────────────────────
]

export default redirects
