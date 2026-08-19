import { promises as fs } from 'node:fs'
import path from 'node:path'
import type { CategoryPage, ContentDoc, Post } from './types'

/**
 * Persistence for the whole content document.
 *
 * It is a single JSON file, written atomically (temp file + rename) so a
 * crashed save can never leave a half-written document behind, and serialised
 * through one promise chain so two concurrent requests cannot interleave a
 * read-modify-write and lose an edit.
 *
 * Every read and write in the app goes through this module. Swapping the file
 * for a database means reimplementing `readDoc` and `writeDoc` and nothing
 * else — no route or component touches the filesystem directly.
 */

/**
 * On a host that redeploys by replacing the app folder, anything written inside
 * it is lost on the next deploy. `DATA_DIR` points the document at a directory
 * outside the app — set it in production and the content survives; leave it
 * unset and it sits in `data/` beside the code, which is what you want locally.
 */
const DATA_DIR = process.env.DATA_DIR ?? path.join(process.cwd(), 'data')
const FILE = path.join(DATA_DIR, 'content.json')

/**
 * First run against an empty `DATA_DIR` has nothing to read. Rather than fail,
 * seed it from the copy committed with the code — so a fresh deploy comes up
 * with the site intact and starts saving to the persistent location.
 */
const SEED = path.join(process.cwd(), 'data', 'content.json')

/** Serialises writes; each save chains onto the previous one. */
let queue: Promise<unknown> = Promise.resolve()

export async function readDoc(): Promise<ContentDoc> {
  try {
    return JSON.parse(await fs.readFile(FILE, 'utf8')) as ContentDoc
  } catch (error) {
    // Only an absent file falls back to the seed. A corrupt or unreadable one
    // must surface, not be silently replaced with older content.
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error
    if (FILE === SEED) throw error

    console.warn(`[store] ${FILE} is empty — seeding it from the committed copy`)
    const doc = JSON.parse(await fs.readFile(SEED, 'utf8')) as ContentDoc
    await fs.mkdir(DATA_DIR, { recursive: true })
    await fs.writeFile(FILE, JSON.stringify(doc, null, 2), 'utf8')
    return doc
  }
}

async function writeDoc(doc: ContentDoc): Promise<ContentDoc> {
  doc.updatedAt = new Date().toISOString()
  const tmp = `${FILE}.${process.pid}.tmp`
  await fs.mkdir(DATA_DIR, { recursive: true })
  await fs.writeFile(tmp, JSON.stringify(doc, null, 2), 'utf8')
  await fs.rename(tmp, FILE)
  return doc
}

/**
 * Read, apply `mutate`, write back — with no other save able to slip in
 * between. Returns the saved document.
 *
 * `mutate` may replace the document wholesale by returning a new one, or edit
 * the draft in place and return nothing.
 */
export function update(mutate: (doc: ContentDoc) => ContentDoc | void | Promise<ContentDoc | void>): Promise<ContentDoc> {
  const run = queue.then(async () => {
    const doc = await readDoc()
    const next = (await mutate(doc)) ?? doc
    return writeDoc(next)
  })
  // Keep the chain alive even when this save rejects, so one failure does not
  // poison every save that follows it.
  queue = run.catch(() => {})
  return run
}

/* ── Lookups ─────────────────────────────────────────────────────────── */

export const findCategory = (doc: ContentDoc, key: string): CategoryPage | undefined =>
  doc.categories.find((category) => category.key === key)

export const findPost = (doc: ContentDoc, slug: string): Post | undefined =>
  doc.posts.find((post) => post.slug === slug)

/** Posts whose primary category is `key`, plus those cross-filed into it. */
export const postsIn = (doc: ContentDoc, key: string): Post[] =>
  doc.posts.filter((post) => post.category === key)

/**
 * Where a category's own key still appears once it is about to be removed or
 * renamed — used to explain a blocked delete rather than cascade one.
 */
export function categoryUsage(doc: ContentDoc, key: string) {
  return {
    posts: doc.posts.filter((post) => post.category === key).map((post) => post.slug),
    alsoIn: doc.posts.filter((post) => post.alsoIn.includes(key)).map((post) => post.slug),
    home: [
      doc.home.featureCategory === key && 'feature band',
      doc.home.cardBandCategory === key && 'card band',
    ].filter(Boolean) as string[],
  }
}

/** Where a post's slug is referenced, so deleting one cannot leave a dead link. */
export function postUsage(doc: ContentDoc, slug: string) {
  const inList = (list: string[]) => list.includes(slug)
  return {
    home: [
      inList(doc.home.highlights) && 'highlights',
      inList(doc.home.investigationRows) && 'investigation rows',
      inList(doc.home.latestPosts) && 'latest posts',
      doc.home.spotlight.slug === slug && 'spotlight',
    ].filter(Boolean) as string[],
    footer: inList(doc.footerPopular) ? ['popular posts'] : [],
    hubs: doc.categories
      .filter(
        (category) =>
          category.hub.pillar === slug ||
          category.hub.clusters.some((cluster) => cluster.slugs.includes(slug)) ||
          category.hub.questions.some((question) => question.slug === slug),
      )
      .map((category) => category.key),
  }
}

/**
 * Strips every reference to a slug from the curation lists. Called on delete so
 * the document is never left pointing at a post that no longer exists.
 */
export function forgetPost(doc: ContentDoc, slug: string) {
  const without = (list: string[]) => list.filter((entry) => entry !== slug)

  doc.home.highlights = without(doc.home.highlights)
  doc.home.investigationRows = without(doc.home.investigationRows)
  doc.home.latestPosts = without(doc.home.latestPosts)
  doc.footerPopular = without(doc.footerPopular)

  if (doc.home.spotlight.slug === slug) doc.home.spotlight = { slug: '', alt: '' }

  for (const category of doc.categories) {
    if (category.hub.pillar === slug) category.hub.pillar = null
    category.hub.clusters = category.hub.clusters.map((cluster) => ({ ...cluster, slugs: without(cluster.slugs) }))
    category.hub.questions = category.hub.questions.filter((question) => question.slug !== slug)
  }
}

/** Rewrites every reference to `from` so it points at `to`. Used when a slug changes. */
export function renamePost(doc: ContentDoc, from: string, to: string) {
  const swap = (list: string[]) => list.map((entry) => (entry === from ? to : entry))

  doc.home.highlights = swap(doc.home.highlights)
  doc.home.investigationRows = swap(doc.home.investigationRows)
  doc.home.latestPosts = swap(doc.home.latestPosts)
  doc.footerPopular = swap(doc.footerPopular)

  if (doc.home.spotlight.slug === from) doc.home.spotlight.slug = to

  for (const category of doc.categories) {
    if (category.hub.pillar === from) category.hub.pillar = to
    category.hub.clusters = category.hub.clusters.map((cluster) => ({ ...cluster, slugs: swap(cluster.slugs) }))
    category.hub.questions = category.hub.questions.map((question) =>
      question.slug === from ? { ...question, slug: to } : question,
    )
  }
}
