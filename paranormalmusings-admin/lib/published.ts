import type { ContentDoc } from './types'

/**
 * The published view of the document.
 *
 * Drafts and unpublished categories are stripped here, at the edge of the API,
 * rather than in the frontend — so an unfinished piece never travels over the
 * wire and cannot be read out of the page payload by anyone who looks.
 *
 * Removing content leaves dangling references behind it, so the same pass
 * repairs them: a curated slot pointing at a hidden post is emptied rather than
 * left to render a broken card.
 */
export function publishedView(doc: ContentDoc): ContentDoc {
  const categories = doc.categories.filter((category) => category.published)
  const liveKeys = new Set(categories.map((category) => category.key))

  const posts = doc.posts
    .filter((post) => post.status === 'published' && liveKeys.has(post.category))
    .map((post) => ({ ...post, alsoIn: post.alsoIn.filter((key) => liveKeys.has(key)) }))

  const liveSlugs = new Set(posts.map((post) => post.slug))
  const keep = (list: string[]) => list.filter((slug) => liveSlugs.has(slug))

  return {
    ...doc,
    categories: categories.map((category) => ({
      ...category,
      hub: {
        pillar: category.hub.pillar && liveSlugs.has(category.hub.pillar) ? category.hub.pillar : null,
        clusters: category.hub.clusters.map((cluster) => ({ ...cluster, slugs: keep(cluster.slugs) })),
        questions: category.hub.questions.filter((question) => liveSlugs.has(question.slug)),
      },
    })),
    posts,
    home: {
      ...doc.home,
      highlights: keep(doc.home.highlights),
      investigationRows: keep(doc.home.investigationRows),
      latestPosts: keep(doc.home.latestPosts),
      spotlight: liveSlugs.has(doc.home.spotlight.slug) ? doc.home.spotlight : { slug: '', alt: '' },
    },
    // A menu link pointing at an unpublished page would render a 404.
    navLinks: doc.navLinks.filter((link) => {
      const category = doc.categories.find((entry) => entry.href === link.href)
      return !category || category.published
    }),
    footerPopular: keep(doc.footerPopular),
  }
}
