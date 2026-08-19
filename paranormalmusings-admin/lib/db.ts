import { MongoClient, type Collection, type Db } from 'mongodb'
import type { CategoryPage, ContentDoc, Post } from './types'

/**
 * The MongoDB connection.
 *
 * One client for the whole process, cached on `globalThis` because Next
 * re-evaluates modules on every edit in development — without that cache each
 * save would open another pool and the connection limit would be reached in a
 * few minutes of work.
 */

const URI = process.env.MONGODB_URI ?? ''
const DB_NAME = process.env.MONGODB_DB ?? 'paranormalmusings'

/** Whether the app is configured to use a database at all. */
export const usingDatabase = () => Boolean(URI)

/* Stored shapes. Each carries the id it is keyed by, plus its place in order. */
export type PostDoc = Post & { _id: string; order: number }
export type CategoryDoc = CategoryPage & { _id: string; order: number }

/**
 * Everything that is not a post or a section, kept in one record — there is
 * only ever one of it, and it is always read and written whole.
 */
export type SettingsDoc = {
  _id: 'settings'
  version: number
  updatedAt: string
  site: ContentDoc['site']
  home: ContentDoc['home']
  navLinks: ContentDoc['navLinks']
  popularSearches: string[]
  topics: ContentDoc['topics']
  relatedSites: ContentDoc['relatedSites']
  footerPopular: string[]
}

type Cache = { client: MongoClient | null; promise: Promise<MongoClient> | null }
const globalCache = globalThis as typeof globalThis & { __pmMongo?: Cache }
const cache: Cache = (globalCache.__pmMongo ??= { client: null, promise: null })

async function client(): Promise<MongoClient> {
  if (cache.client) return cache.client
  if (!URI) throw new Error('MONGODB_URI is not set')

  cache.promise ??= new MongoClient(URI, {
    // A serverless-ish app opens and closes bursts of requests; a small pool
    // with a short queue surfaces a bad connection string quickly instead of
    // hanging the first save for half a minute.
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 8000,
  }).connect()

  cache.client = await cache.promise
  return cache.client
}

export async function db(): Promise<Db> {
  return (await client()).db(DB_NAME)
}

export const posts = async (): Promise<Collection<PostDoc>> => (await db()).collection<PostDoc>('posts')
export const categories = async (): Promise<Collection<CategoryDoc>> =>
  (await db()).collection<CategoryDoc>('categories')
export const settings = async (): Promise<Collection<SettingsDoc>> => (await db()).collection<SettingsDoc>('settings')

/**
 * Indexes the app relies on. Creating an index that already exists is a no-op,
 * so this is safe to call on every cold start.
 */
export async function ensureIndexes(): Promise<void> {
  const [postCol, categoryCol] = [await posts(), await categories()]
  await Promise.all([
    postCol.createIndex({ order: 1 }),
    postCol.createIndex({ category: 1 }),
    categoryCol.createIndex({ order: 1 }),
  ])
}

/** Closes the pool. Only used by scripts and tests; the app keeps it open. */
export async function disconnect(): Promise<void> {
  await cache.client?.close()
  cache.client = null
  cache.promise = null
}
