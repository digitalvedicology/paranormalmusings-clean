import type { MetadataRoute } from 'next'
import { getContent } from '@/lib/content'
import { getAllTopics } from '@/lib/tags'

/**
 * Dynamic sitemap generator for all pages and articles.
 * Includes categories, topic archives, and all written posts.
 */

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://paranormalmusings.com'
  const content = await getContent()
  const topics = getAllTopics()
  const postsPerPage = 15

  const entries: MetadataRoute.Sitemap = [
    // Home page
    {
      url: baseUrl,
      changeFrequency: 'weekly',
      priority: 1,
    },

    // About page
    {
      url: `${baseUrl}/about`,
      changeFrequency: 'monthly',
      priority: 0.8,
    },

    // Topic archive pages
    ...topics.map((topic) => ({
      url: `${baseUrl}/topics/${topic.slug}`,
      changeFrequency: 'weekly' as const,
      priority: 0.75,
    })),

    // Category pages and their pagination
    ...content.categories.flatMap((category) => {
      const categoryHref = content.categoryMeta(category.key).href
      const posts = content.postsIn(category.key)
      const archiveCount = posts.length - 1 // Exclude lead story
      const totalPages = Math.ceil(archiveCount / postsPerPage)

      const pages: MetadataRoute.Sitemap = [
        // Page 1 (main category page)
        {
          url: `${baseUrl}${categoryHref}`,
          changeFrequency: 'daily' as const,
          priority: 0.9,
          lastModified: new Date(),
        },
      ]

      // Pages 2+
      for (let page = 2; page <= totalPages; page++) {
        pages.push({
          url: `${baseUrl}${categoryHref}/page/${page}`,
          changeFrequency: 'daily' as const,
          priority: 0.8,
          lastModified: new Date(),
        })
      }

      return pages
    }),

    // Article pages
    ...content.writtenPosts().map((post) => ({
      url: `${baseUrl}${content.articleHref(post)}`,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
      lastModified: post.date ? new Date(post.date) : new Date(),
    })),
  ]

  return entries
}
