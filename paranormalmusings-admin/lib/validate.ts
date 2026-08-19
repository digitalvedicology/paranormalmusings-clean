import { ART_KEYS, BLOCK_TYPES, ICON_KEYS, LAYOUTS, STATUSES } from './types'
import type { Block, CategoryPage, ContentDoc, Post } from './types'

/**
 * Hand-rolled validation, kept deliberately small.
 *
 * Every API route runs its payload through here before it reaches the store, so
 * a malformed request is rejected with a readable list of problems rather than
 * writing a document the site cannot render. The rule throughout: unknown
 * fields are dropped, not merged — every returned object is built field by
 * field, so nothing a caller invents can reach disk.
 */

export class Invalid extends Error {
  constructor(public problems: string[]) {
    super(problems.join('; '))
  }
}

const str = (value: unknown, field: string, problems: string[], { required = false } = {}): string => {
  if (typeof value !== 'string') {
    if (value !== undefined) problems.push(`${field} must be text`)
    else if (required) problems.push(`${field} is required`)
    return ''
  }
  const trimmed = value.trim()
  if (required && !trimmed) problems.push(`${field} is required`)
  return trimmed
}

const strList = (value: unknown, field: string, problems: string[]): string[] => {
  if (value === undefined) return []
  if (!Array.isArray(value)) {
    problems.push(`${field} must be a list`)
    return []
  }
  return value.map((entry) => String(entry ?? '').trim()).filter(Boolean)
}

const oneOf = <T extends string>(
  value: unknown,
  allowed: readonly T[],
  field: string,
  fallback: T,
  problems: string[],
): T => {
  if (value === undefined) return fallback
  if (typeof value !== 'string' || !allowed.includes(value as T)) {
    problems.push(`${field} must be one of: ${allowed.join(', ')}`)
    return fallback
  }
  return value as T
}

export const slugify = (value: string): string =>
  value
    .toLowerCase()
    .replace(/[‘’']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

/**
 * An image reference is either an absolute URL or a site-relative path. Anything
 * else — a bare filename, a Windows path pasted from Explorer — would render as
 * a broken image with no explanation, so it is refused here instead.
 */
export const parseImage = (value: unknown, field: string, problems: string[], fallback = ''): string => {
  if (value === undefined) return fallback

  const image = str(value, field, problems)
  if (!image) return ''

  const ok = /^https?:\/\//.test(image) || image.startsWith('/')
  if (!ok) problems.push(`${field} must be a full URL or start with "/"`)

  return ok ? image : fallback
}

/* ── Blocks ──────────────────────────────────────────────────────────── */

export function parseBody(value: unknown, problems: string[]): Block[] {
  if (value === undefined) return []
  if (!Array.isArray(value)) {
    problems.push('body must be a list of blocks')
    return []
  }

  const blocks: Block[] = []

  value.forEach((raw, index) => {
    const at = `body[${index}]`
    if (!raw || typeof raw !== 'object') {
      problems.push(`${at} must be an object`)
      return
    }

    const block = raw as Record<string, unknown>
    const type = oneOf(block.type, BLOCK_TYPES, `${at}.type`, 'p', problems)

    if (type === 'list') {
      const items = strList(block.items, `${at}.items`, problems)
      // A list with nothing in it renders as a stray gap, so drop it.
      if (items.length) blocks.push({ type: 'list', items })
      return
    }

    if (type === 'image') {
      const src = parseImage(block.src, `${at}.src`, problems)
      // An image block with no picture is an empty frame; drop it rather than
      // render a gap. `alt` may legitimately be empty — that marks it decorative.
      if (!src) return

      const caption = str(block.caption, `${at}.caption`, problems)
      const image: Block = { type: 'image', src, alt: str(block.alt, `${at}.alt`, problems) }
      blocks.push(caption ? { ...image, caption } : image)
      return
    }

    const text = str(block.text, `${at}.text`, problems, { required: true })
    if (!text) return

    if (type === 'h2') {
      const tone = block.tone === 'note' ? ('note' as const) : undefined
      blocks.push(tone ? { type: 'h2', text, tone } : { type: 'h2', text })
      return
    }

    blocks.push({ type, text } as Block)
  })

  return blocks
}

/* ── Posts ───────────────────────────────────────────────────────────── */

/**
 * Builds a post from a request payload. `base` is the existing post on an edit,
 * so a PATCH only has to send the fields it is actually changing.
 */
export function parsePost(input: unknown, doc: ContentDoc, base?: Post): Post {
  const problems: string[] = []
  const raw = (input ?? {}) as Record<string, unknown>
  const has = (field: string) => Object.prototype.hasOwnProperty.call(raw, field)
  const keep = <T>(field: string, read: () => T, fallback: T): T => (has(field) ? read() : fallback)

  const title = keep('title', () => str(raw.title, 'title', problems, { required: true }), base?.title ?? '')
  if (!title) problems.push('title is required')

  const slug = has('slug') ? slugify(str(raw.slug, 'slug', problems)) : (base?.slug ?? slugify(title))
  if (!slug) problems.push('slug is required')

  const categoryKeys = doc.categories.map((category) => category.key)
  const category = keep(
    'category',
    () => str(raw.category, 'category', problems, { required: true }),
    base?.category ?? '',
  )
  if (category && !categoryKeys.includes(category)) problems.push(`category "${category}" does not exist`)

  const alsoIn = keep('alsoIn', () => strList(raw.alsoIn, 'alsoIn', problems), base?.alsoIn ?? []).filter(
    (key) => key !== category,
  )
  for (const key of alsoIn) if (!categoryKeys.includes(key)) problems.push(`alsoIn category "${key}" does not exist`)

  // A slug is a URL, so a clash would silently shadow an existing article.
  const clash = doc.posts.find((post) => post.slug === slug && post.slug !== base?.slug)
  if (clash) problems.push(`slug "${slug}" is already used by "${clash.title}"`)

  if (problems.length) throw new Invalid(problems)

  const post: Post = {
    slug,
    title,
    category,
    alsoIn,
    image: parseImage(raw.image, 'image', problems, base?.image ?? ''),
    seed: keep('seed', () => str(raw.seed, 'seed', problems), base?.seed ?? `pm-${slug}`.slice(0, 40)),
    date: keep('date', () => str(raw.date, 'date', problems), base?.date ?? ''),
    readTime: keep('readTime', () => str(raw.readTime, 'readTime', problems), base?.readTime ?? ''),
    kicker: keep('kicker', () => str(raw.kicker, 'kicker', problems), base?.kicker ?? ''),
    excerpt: keep('excerpt', () => str(raw.excerpt, 'excerpt', problems), base?.excerpt ?? ''),
    dek: keep('dek', () => str(raw.dek, 'dek', problems), base?.dek ?? ''),
    tags: keep('tags', () => strList(raw.tags, 'tags', problems), base?.tags ?? []),
    body: keep('body', () => parseBody(raw.body, problems), base?.body ?? []),
    status: keep('status', () => oneOf(raw.status, STATUSES, 'status', 'draft', problems), base?.status ?? 'draft'),
  }

  if (problems.length) throw new Invalid(problems)
  return post
}

/* ── Categories ──────────────────────────────────────────────────────── */

export function parseCategory(input: unknown, base: CategoryPage): CategoryPage {
  const problems: string[] = []
  const raw = (input ?? {}) as Record<string, unknown>
  const has = (field: string) => Object.prototype.hasOwnProperty.call(raw, field)
  const keep = <T>(field: string, read: () => T, fallback: T): T => (has(field) ? read() : fallback)

  let href = keep('href', () => str(raw.href, 'href', problems, { required: true }), base.href)
  if (href && !href.startsWith('/')) {
    problems.push('href must start with "/"')
    href = base.href
  }

  const count = keep(
    'count',
    () => {
      const value = Number(raw.count)
      if (!Number.isFinite(value) || value < 0) {
        problems.push('count must be a number of 0 or more')
        return base.count
      }
      return Math.round(value)
    },
    base.count,
  )

  const hubInput = (raw.hub ?? {}) as Record<string, unknown>
  const hub = has('hub')
    ? {
        pillar:
          hubInput.pillar === null || hubInput.pillar === undefined
            ? null
            : str(hubInput.pillar, 'hub.pillar', problems) || null,
        clusters: Array.isArray(hubInput.clusters)
          ? hubInput.clusters.map((entry, index) => {
              const cluster = (entry ?? {}) as Record<string, unknown>
              return {
                title: str(cluster.title, `hub.clusters[${index}].title`, problems, { required: true }),
                blurb: str(cluster.blurb, `hub.clusters[${index}].blurb`, problems),
                slugs: strList(cluster.slugs, `hub.clusters[${index}].slugs`, problems),
              }
            })
          : base.hub.clusters,
        questions: Array.isArray(hubInput.questions)
          ? hubInput.questions.map((entry, index) => {
              const question = (entry ?? {}) as Record<string, unknown>
              return {
                question: str(question.question, `hub.questions[${index}].question`, problems, { required: true }),
                slug: str(question.slug, `hub.questions[${index}].slug`, problems, { required: true }),
              }
            })
          : base.hub.questions,
      }
    : base.hub

  const category: CategoryPage = {
    key: base.key,
    label: keep('label', () => str(raw.label, 'label', problems, { required: true }), base.label),
    title: keep('title', () => str(raw.title, 'title', problems, { required: true }), base.title),
    href,
    count,
    image: parseImage(raw.image, 'image', problems, base.image),
    seed: keep('seed', () => str(raw.seed, 'seed', problems), base.seed),
    art: keep('art', () => oneOf(raw.art, ART_KEYS, 'art', base.art, problems), base.art),
    blurb: keep('blurb', () => str(raw.blurb, 'blurb', problems), base.blurb),
    lede: keep('lede', () => str(raw.lede, 'lede', problems), base.lede),
    layout: keep('layout', () => oneOf(raw.layout, LAYOUTS, 'layout', base.layout, problems), base.layout),
    published: keep('published', () => raw.published !== false, base.published),
    hub,
  }

  if (problems.length) throw new Invalid(problems)
  return category
}

/* ── Site, home, nav, topics, related sites ──────────────────────────── */

export function parseSite(input: unknown, base: ContentDoc['site']): ContentDoc['site'] {
  const problems: string[] = []
  const raw = (input ?? {}) as Record<string, unknown>
  const phone = (raw.phone ?? {}) as Record<string, unknown>
  const email = (raw.email ?? {}) as Record<string, unknown>

  const site: ContentDoc['site'] = {
    name: str(raw.name ?? base.name, 'name', problems, { required: true }),
    tagline: str(raw.tagline ?? base.tagline, 'tagline', problems),
    author: str(raw.author ?? base.author, 'author', problems, { required: true }),
    authorImage: parseImage(raw.authorImage, 'authorImage', problems, base.authorImage),
    description: str(raw.description ?? base.description, 'description', problems),
    address: raw.address === undefined ? base.address : strList(raw.address, 'address', problems),
    phone: {
      label: str(phone.label ?? base.phone.label, 'phone.label', problems),
      href: str(phone.href ?? base.phone.href, 'phone.href', problems),
    },
    email: {
      label: str(email.label ?? base.email.label, 'email.label', problems),
      href: str(email.href ?? base.email.href, 'email.href', problems),
    },
  }

  if (problems.length) throw new Invalid(problems)
  return site
}

export function parseHome(input: unknown, doc: ContentDoc): ContentDoc['home'] {
  const problems: string[] = []
  const raw = (input ?? {}) as Record<string, unknown>
  const base = doc.home

  const slugs = new Set(doc.posts.map((post) => post.slug))
  const categoryKeys = doc.categories.map((category) => category.key)

  const slugList = (value: unknown, field: string, fallback: string[]): string[] => {
    if (value === undefined) return fallback
    const list = strList(value, field, problems)
    for (const slug of list) if (!slugs.has(slug)) problems.push(`${field}: no post with slug "${slug}"`)
    return list
  }

  const categoryKey = (value: unknown, field: string, fallback: string): string => {
    if (value === undefined) return fallback
    const key = str(value, field, problems, { required: true })
    if (key && !categoryKeys.includes(key)) problems.push(`${field}: no category "${key}"`)
    return key
  }

  const spotlightInput = (raw.spotlight ?? {}) as Record<string, unknown>
  const spotlightSlug =
    spotlightInput.slug === undefined ? base.spotlight.slug : str(spotlightInput.slug, 'spotlight.slug', problems)
  if (spotlightSlug && !slugs.has(spotlightSlug)) problems.push(`spotlight: no post with slug "${spotlightSlug}"`)

  const home: ContentDoc['home'] = {
    featureCategory: categoryKey(raw.featureCategory, 'featureCategory', base.featureCategory),
    cardBandCategory: categoryKey(raw.cardBandCategory, 'cardBandCategory', base.cardBandCategory),
    highlights: slugList(raw.highlights, 'highlights', base.highlights),
    investigationRows: slugList(raw.investigationRows, 'investigationRows', base.investigationRows),
    latestPosts: slugList(raw.latestPosts, 'latestPosts', base.latestPosts),
    spotlight: {
      slug: spotlightSlug,
      alt: spotlightInput.alt === undefined ? base.spotlight.alt : str(spotlightInput.alt, 'spotlight.alt', problems),
    },
  }

  if (problems.length) throw new Invalid(problems)
  return home
}

export function parseNavLinks(input: unknown, base: ContentDoc['navLinks']): ContentDoc['navLinks'] {
  if (input === undefined) return base
  if (!Array.isArray(input)) throw new Invalid(['navLinks must be a list'])
  const problems: string[] = []

  const links = input.map((entry, index) => {
    const raw = (entry ?? {}) as Record<string, unknown>
    const href = str(raw.href, `navLinks[${index}].href`, problems, { required: true })
    if (href && !href.startsWith('/') && !href.startsWith('http')) {
      problems.push(`navLinks[${index}].href must start with "/" or "http"`)
    }
    return {
      label: str(raw.label, `navLinks[${index}].label`, problems, { required: true }),
      href,
      mobileLabel: str(raw.mobileLabel, `navLinks[${index}].mobileLabel`, problems),
    }
  })

  if (problems.length) throw new Invalid(problems)
  return links
}

export function parseTopics(input: unknown, base: ContentDoc['topics']): ContentDoc['topics'] {
  if (input === undefined) return base
  if (!Array.isArray(input)) throw new Invalid(['topics must be a list'])
  const problems: string[] = []

  const topics = input.map((entry, index) => {
    const raw = (entry ?? {}) as Record<string, unknown>
    return {
      label: str(raw.label, `topics[${index}].label`, problems, { required: true }),
      icon: oneOf(raw.icon, ICON_KEYS, `topics[${index}].icon`, 'wave', problems),
      href: str(raw.href, `topics[${index}].href`, problems, { required: true }),
    }
  })

  if (problems.length) throw new Invalid(problems)
  return topics
}

export function parseRelatedSites(input: unknown, base: ContentDoc['relatedSites']): ContentDoc['relatedSites'] {
  if (input === undefined) return base
  if (!Array.isArray(input)) throw new Invalid(['relatedSites must be a list'])
  const problems: string[] = []

  const sites = input.map((entry, index) => {
    const raw = (entry ?? {}) as Record<string, unknown>
    return {
      name: str(raw.name, `relatedSites[${index}].name`, problems, { required: true }),
      href: str(raw.href, `relatedSites[${index}].href`, problems, { required: true }),
      blurb: str(raw.blurb, `relatedSites[${index}].blurb`, problems),
      domain: str(raw.domain, `relatedSites[${index}].domain`, problems),
      image: parseImage(raw.image, `relatedSites[${index}].image`, problems),
    }
  })

  if (problems.length) throw new Invalid(problems)
  return sites
}

export function parseStringList(input: unknown, field: string, base: string[]): string[] {
  if (input === undefined) return base
  const problems: string[] = []
  const list = strList(input, field, problems)
  if (problems.length) throw new Invalid(problems)
  return list
}
