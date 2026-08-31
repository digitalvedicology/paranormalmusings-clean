import { getContent } from '@/lib/content'

/**
 * RSS 2.0 Feed generator.
 * Provides feed for feed readers and syndicators.
 * Available at /feed or /feed.xml
 */

export async function GET() {
  const baseUrl = 'https://paranormalmusings.com'
  const content = await getContent()

  // Get latest 20 written posts
  const posts = content
    .writtenPosts()
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 20)

  // Extract plain text from blocks for description
  const getPlainText = (blocks: Array<{ type: string; text?: string }>) => {
    return blocks
      .filter((b) => b.type === 'p')
      .map((b) => b.text || '')
      .join(' ')
      .slice(0, 300)
  }

  const rssItems = posts
    .map((post) => {
      const url = `${baseUrl}${content.articleHref(post)}`
      const description = post.dek || post.excerpt || getPlainText(post.body) || 'Read more...'
      const pubDate = new Date(post.date).toUTCString()

      return `
    <item>
      <title>${escapeXml(post.title)}</title>
      <description>${escapeXml(description)}</description>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${pubDate}</pubDate>
      <category>${escapeXml(content.categoryMeta(post.category).label)}</category>
    </item>
      `.trim()
    })
    .join('\n    ')

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>${escapeXml(content.site.name)} with ${escapeXml(content.site.author)}</title>
    <link>${baseUrl}</link>
    <description>${escapeXml(content.site.description)}</description>
    <language>en-us</language>
    <copyright>© ${new Date().getFullYear()} ${escapeXml(content.site.author)}</copyright>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <docs>https://www.rssboard.org/rss-specification</docs>
    ${rssItems}
  </channel>
</rss>`

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  })
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}
