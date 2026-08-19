import { promises as fs } from 'node:fs'
import path from 'node:path'
import { categories, ensureIndexes, posts, settings, usingDatabase, type CategoryDoc, type PostDoc, type SettingsDoc } from './db'
import type { CategoryPage, ContentDoc, Post } from './types'

/**
 * Persistence for the whole content document.
 *
 * There are two backends behind one interface. Set `MONGODB_URI` and the
 * content lives in MongoDB, a record per post; leave it unset and it lives in
 * `data/content.json`, which is what makes a fresh clone runnable with nothing
 * installed. Everything above this file — every route, every screen — works the
 * same either way, because both backends expose only `readDoc` and `update`.
 *
 * Writes are serialised through one promise chain so two concurrent requests
 * cannot interleave a read-modify-write and lose an edit.
 */

const DATA_DIR = process.env.DATA_DIR ?? path.join(process.cwd(), 'data')
const FILE = path.join(DATA_DIR, 'content.json')
/** The copy committed with the code, used to seed an empty store. */
const SEED = path.join(process.cwd(), 'data', 'content.json')

/** Serialises writes; each save chains onto the previous one. */
let queue: Promise<unknown> = Promise.resolve()

const readSeed = async (): Promise<ContentDoc> => JSON.parse(await fs.readFile(SEED, 'utf8')) as ContentDoc

/* ── File backend ────────────────────────────────────────────────────── */

async function readFileDoc(): Promise<ContentDoc> {
  try {
    return JSON.parse(await fs.readFile(FILE, 'utf8')) as ContentDoc
  } catch (error) {
    // Only an absent file falls back to the seed. A corrupt or unreadable one
    // must surface, not be silently replaced with older content.
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error
    if (FILE === SEED) throw error

    console.warn(`[store] ${FILE} is empty — seeding it from the committed copy`)
    const doc = await readSeed()
    await fs.mkdir(DATA_DIR, { recursive: true })
    await fs.writeFile(FILE, JSON.stringify(doc, null, 2), 'utf8')
    return doc
  }
}

async function writeFileDoc(doc: ContentDoc): Promise<ContentDoc> {
  const tmp = `${FILE}.${process.pid}.tmp`
  await fs.mkdir(DATA_DIR, { recursive: true })
  await fs.writeFile(tmp, JSON.stringify(doc, null, 2), 'utf8')
  await fs.rename(tmp, FILE)
  return doc
}

/* ── Database backend ────────────────────────────────────────────────── */

/** Strips the fields that belong to storage rather than to the content. */
const stripPost = ({ _id, order, ...post }: PostDoc): Post => post
const stripCategory = ({ _id, order, ...category }: CategoryDoc): CategoryPage => category

async function readDbDoc(): Promise<ContentDoc> {
  const [postCol, categoryCol, settingsCol] = [await posts(), await categories(), await settings()]
  const config = await settingsCol.findOne({ _id: 'settings' })

  // An empty database is a first run, not a fault: fill it from the committed
  // copy so a fresh deployment comes up with the site intact.
  if (!config) {
    console.warn('[store] the database is empty — seeding it from the committed copy')
    const seeded = await writeDbDoc(await readSeed())
    return seeded
  }

  const [postDocs, categoryDocs] = await Promise.all([
    postCol.find().sort({ order: 1 }).toArray(),
    categoryCol.find().sort({ order: 1 }).toArray(),
  ])

  const { _id, ...rest } = config
  return { ...rest, categories: categoryDocs.map(stripCategory), posts: postDocs.map(stripPost) }
}

/**
 * Writes only what actually changed.
 *
 * Saving one article should touch one record, not rewrite all hundred and ten —
 * both because it is faster and because two people editing different posts then
 * cannot overwrite each other.
 */
async function writeDbDoc(doc: ContentDoc, before?: ContentDoc): Promise<ContentDoc> {
  const [postCol, categoryCol, settingsCol] = [await posts(), await categories(), await settings()]

  const { categories: nextCategories, posts: nextPosts, ...config } = doc

  /* Posts, keyed by slug. A renamed slug is a delete and an insert. */
  const beforePosts = new Map((before?.posts ?? []).map((post, index) => [post.slug, JSON.stringify({ post, index })]))
  const postOps = nextPosts
    .map((post, index) => ({ post, index }))
    .filter(({ post, index }) => beforePosts.get(post.slug) !== JSON.stringify({ post, index }))
    .map(({ post, index }) => ({
      replaceOne: { filter: { _id: post.slug }, replacement: { ...post, _id: post.slug, order: index }, upsert: true },
    }))

  const liveSlugs = new Set(nextPosts.map((post) => post.slug))
  const goneSlugs = [...beforePosts.keys()].filter((slug) => !liveSlugs.has(slug))

  /* Sections, keyed by their stable key. */
  const beforeCategories = new Map(
    (before?.categories ?? []).map((category, index) => [category.key, JSON.stringify({ category, index })]),
  )
  const categoryOps = nextCategories
    .map((category, index) => ({ category, index }))
    .filter(({ category, index }) => beforeCategories.get(category.key) !== JSON.stringify({ category, index }))
    .map(({ category, index }) => ({
      replaceOne: {
        filter: { _id: category.key },
        replacement: { ...category, _id: category.key, order: index },
        upsert: true,
      },
    }))

  const liveKeys = new Set(nextCategories.map((category) => category.key))
  const goneKeys = [...beforeCategories.keys()].filter((key) => !liveKeys.has(key))

  await Promise.all([
    postOps.length ? postCol.bulkWrite(postOps as never) : null,
    goneSlugs.length ? postCol.deleteMany({ _id: { $in: goneSlugs } }) : null,
    categoryOps.length ? categoryCol.bulkWrite(categoryOps as never) : null,
    goneKeys.length ? categoryCol.deleteMany({ _id: { $in: goneKeys } }) : null,
    // Settings is one small record; comparing it is not worth the code.
    settingsCol.replaceOne({ _id: 'settings' }, { ...config, _id: 'settings' } as SettingsDoc, { upsert: true }),
  ])

  return doc
}

/* ── The interface everything else uses ──────────────────────────────── */

export async function readDoc(): Promise<ContentDoc> {
  if (!usingDatabase()) return readFileDoc()
  await ensureIndexes()
  return readDbDoc()
}

/**
 * Read, apply `mutate`, write back — with no other save able to slip in
 * between. Returns the saved document.
 *
 * `mutate` may replace the document wholesale by returning a new one, or edit
 * the draft in place and return nothing.
 */
export function update(
  mutate: (doc: ContentDoc) => ContentDoc | void | Promise<ContentDoc | void>,
): Promise<ContentDoc> {
  const run = queue.then(async () => {
    const current = await readDoc()
    // The mutator edits in place, so the diff needs a copy taken beforehand.
    const before = structuredClone(current)

    const next = (await mutate(current)) ?? current
    next.updatedAt = new Date().toISOString()

    return usingDatabase() ? writeDbDoc(next, before) : writeFileDoc(next)
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

/** Posts whose primary category is `key`. */
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
