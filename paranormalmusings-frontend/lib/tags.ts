/**
 * Tag system for paranormal topics.
 * Maps topic chips to real tag archive pages for SEO targeting of long-tail queries.
 */

import { getContent } from './content'

export interface Topic {
  slug: string
  label: string
  description: string
  query: string[] // Keywords this topic targets
}

export const topics: Topic[] = [
  {
    slug: 'evp',
    label: 'EVP',
    description: 'Electronic Voice Phenomena — recordings of paranormal voices and messages',
    query: ['EVP', 'electronic voice phenomena', 'spirit communication', 'paranormal recording'],
  },
  {
    slug: 'possession',
    label: 'Possession',
    description: 'Spirit possession, entity attachment, and related phenomena',
    query: ['possession', 'spirit possession', 'entity attachment', 'demonic possession'],
  },
  {
    slug: 'spirit-guides',
    label: 'Spirit Guides',
    description: 'Guardian spirits, spiritual guides, and protective entities',
    query: ['spirit guides', 'guardian angels', 'spiritual protectors', 'guide spirits'],
  },
  {
    slug: 'reincarnation',
    label: 'Reincarnation',
    description: 'Rebirth, past lives, and the cycle of reincarnation',
    query: ['reincarnation', 'past lives', 'rebirth', 'soul evolution'],
  },
  {
    slug: 'hauntings',
    label: 'Hauntings',
    description: 'Ghosts, hauntings, and residual paranormal energy',
    query: ['hauntings', 'ghosts', 'haunted places', 'residual haunting'],
  },
  {
    slug: 'depossession',
    label: 'Depossession',
    description: 'Techniques and methods for removing unwanted spiritual attachments',
    query: ['depossession', 'exorcism', 'spirit removal', 'entity cleansing'],
  },
  {
    slug: 'ancestor-worship',
    label: 'Ancestor Worship',
    description: 'Honoring and communicating with ancestors and ancestral spirits',
    query: ['ancestor worship', 'ancestral spirits', 'honoring ancestors', 'family spirits'],
  },
  {
    slug: 'journey-soul',
    label: 'Journey of the Soul',
    description: 'The soul\'s journey through life, death, and beyond',
    query: ['soul journey', 'afterlife journey', 'spiritual journey', 'soul evolution'],
  },
  {
    slug: 'ghost-hunting-gear',
    label: 'Ghost Hunting Gear',
    description: 'Equipment and tools for paranormal investigation',
    query: ['ghost hunting equipment', 'paranormal investigation gear', 'EMF meters', 'thermal imaging'],
  },
]

/**
 * Get all topics
 */
export function getAllTopics(): Topic[] {
  return topics
}

/**
 * Get a single topic by slug
 */
export function getTopic(slug: string): Topic | undefined {
  return topics.find((t) => t.slug === slug)
}

/**
 * Get all posts tagged with a topic
 */
export async function getPostsByTopic(topicSlug: string) {
  const topic = getTopic(topicSlug)
  if (!topic) return []

  const content = await getContent()

  // Filter posts that match this topic's keywords
  return content.posts.filter((post) => {
    const titleLower = post.title.toLowerCase()
    const deklower = (post.dek || '').toLowerCase()
    const bodyText = post.body
      .filter((b) => b.type === 'p')
      .map((b) => b.text)
      .join(' ')
      .toLowerCase()

    return topic.query.some((keyword) => {
      const keywordLower = keyword.toLowerCase()
      return (
        titleLower.includes(keywordLower) ||
        deklower.includes(keywordLower) ||
        bodyText.includes(keywordLower)
      )
    })
  })
}

/**
 * Get topic breadcrumb for navigation
 */
export function getTopicBreadcrumb(topicSlug: string) {
  const topic = getTopic(topicSlug)
  if (!topic) return null

  return {
    label: `Tag: ${topic.label}`,
    href: `/topics/${topicSlug}`,
  }
}
