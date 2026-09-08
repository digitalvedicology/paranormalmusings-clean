/**
 * JSON-LD Structured Data helpers for rich snippets and search results.
 * Includes Article, Person, WebSite, SearchAction, BreadcrumbList, etc.
 */

import type { Post, SiteSettings, CategoryPage } from './content-types'

const baseUrl = 'https://paranormalmusings.com'

/**
 * Article schema for a blog post.
 * Enables rich snippets in search results and knowledge panels.
 */
export function articleSchema(
  post: Post,
  categoryMeta: CategoryPage,
  siteAuthor: string,
) {
  const articleUrl = `${baseUrl}${categoryMeta.href}/${post.slug}`
  const publishedDate = formatDateToISO8601(post.date)

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.dek || post.excerpt,
    image: post.image || `${baseUrl}/images/paranormalmusings-logo.png`,
    datePublished: publishedDate,
    dateModified: publishedDate,
    author: {
      '@type': 'Person',
      name: siteAuthor,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Paranormal Musings',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/images/paranormalmusings-logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': articleUrl,
    },
    articleBody: post.body
      .filter((b) => b.type === 'p')
      .map((b) => b.text)
      .join('\n\n'),
    articleSection: categoryMeta.label,
    keywords: post.tags.join(', '),
  }
}

/**
 * WebSite schema with SearchAction for site-wide search box.
 * Enables sitelinks search box in Google results.
 */
export function webSiteSchema(
  site: SiteSettings,
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    url: baseUrl,
    name: `${site.name} with ${site.author}`,
    description: site.description,
    author: {
      '@type': 'Person',
      name: site.author,
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${baseUrl}/?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }
}

/**
 * BreadcrumbList schema for navigation hierarchy.
 * Displays breadcrumbs in search results.
 */
export function breadcrumbSchema(
  categoryMeta: CategoryPage,
  post?: Post,
) {
  interface BreadcrumbItem {
    '@type': string
    position: number
    name: string
    item: string
  }
  const items: BreadcrumbItem[] = [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: baseUrl,
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: categoryMeta.label,
      item: `${baseUrl}${categoryMeta.href}`,
    },
  ]

  if (post) {
    items.push({
      '@type': 'ListItem',
      position: 3,
      name: post.title,
      item: `${baseUrl}${categoryMeta.href}/${post.slug}`,
    })
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items,
  }
}

/**
 * FAQPage schema for Q&A content.
 * Use when a category has hub questions.
 */
export function faqPageSchema(questions: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: questions.map((q) => ({
      '@type': 'Question',
      name: q.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: q.answer,
      },
    })),
  }
}

/**
 * Parse various date formats and convert to ISO 8601.
 * Handles: "14 March 2021", "2021-03-14", Date objects, etc.
 */
export function formatDateToISO8601(dateStr: string | Date): string {
  if (dateStr instanceof Date) {
    return dateStr.toISOString()
  }

  const parsed = new Date(dateStr)
  if (!isNaN(parsed.getTime())) {
    return parsed.toISOString()
  }

  // Handle "DD Month YYYY" format (e.g., "14 March 2021")
  const monthMap: { [key: string]: string } = {
    january: '01',
    february: '02',
    march: '03',
    april: '04',
    may: '05',
    june: '06',
    july: '07',
    august: '08',
    september: '09',
    october: '10',
    november: '11',
    december: '12',
  }

  const parts = dateStr.trim().split(/\s+/)
  if (parts.length >= 3) {
    const day = parts[0].padStart(2, '0')
    const month = monthMap[parts[1].toLowerCase()]?.padStart(2, '0')
    const year = parts[2]

    if (month && year) {
      return `${year}-${month}-${day}T00:00:00Z`
    }
  }

  return dateStr
}
