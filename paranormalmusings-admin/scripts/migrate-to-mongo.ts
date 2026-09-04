/**
 * Moves the content into MongoDB, once.
 *
 * Reads whatever the file store currently holds — the live `DATA_DIR` copy if
 * one is set, otherwise the committed seed — and writes it into the database a
 * record per post. Safe to re-run: it refuses to overwrite a database that
 * already has content unless told to.
 *
 *   npx tsx scripts/migrate-to-mongo.ts          # import, refusing to clobber
 *   npx tsx scripts/migrate-to-mongo.ts --force  # replace what is there
 */
import { promises as fs } from 'node:fs'
import path from 'node:path'
import { categories, disconnect, ensureIndexes, posts, settings, usingDatabase } from '../lib/db'
import type { ContentDoc } from '../lib/types'

const force = process.argv.includes('--force')

async function main() {
  if (!usingDatabase()) {
    console.error('MONGODB_URI is not set — nothing to migrate into.')
    process.exit(1)
  }

  const dataDir = process.env.DATA_DIR ?? path.join(process.cwd(), 'data')
  const file = path.join(dataDir, 'content.json')
  const doc = JSON.parse(await fs.readFile(file, 'utf8')) as ContentDoc
  console.log(`read ${file}: ${doc.posts.length} posts, ${doc.categories.length} sections`)

  const [postCol, categoryCol, settingsCol] = [await posts(), await categories(), await settings()]
  const existing = await postCol.countDocuments()

  if (existing && !force) {
    console.error(`\nThe database already holds ${existing} posts. Re-run with --force to replace them.`)
    process.exit(1)
  }

  if (existing) {
    console.log(`clearing ${existing} existing posts`)
    await Promise.all([postCol.deleteMany({}), categoryCol.deleteMany({}), settingsCol.deleteMany({})])
  }

  await ensureIndexes()

  const { categories: cats, posts: items, ...config } = doc
  await Promise.all([
    postCol.insertMany(items.map((post, order) => ({ ...post, _id: post.slug, order })) as never),
    categoryCol.insertMany(cats.map((category, order) => ({ ...category, _id: category.key, order })) as never),
    settingsCol.insertOne({ ...config, _id: 'settings' } as never),
  ])

  console.log(
    `\nwrote ${await postCol.countDocuments()} posts, ` +
      `${await categoryCol.countDocuments()} sections, ` +
      `${await settingsCol.countDocuments()} settings record`,
  )
  console.log('Set MONGODB_URI on the admin and redeploy; the file is no longer read.')
}

main()
  .catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(disconnect)
