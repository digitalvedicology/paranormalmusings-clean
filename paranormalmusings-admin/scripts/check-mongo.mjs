// One-off: is there content in MongoDB, and what layout is Case Studies on?
//
//   MONGODB_URI="mongodb+srv://user:pass@cluster.mongodb.net/" node scripts/check-mongo.mjs
//
// Reads only. Prints the collection counts and the `cases` category's layout.
import { MongoClient } from 'mongodb'

const URI = process.env.MONGODB_URI
const DB_NAME = process.env.MONGODB_DB ?? 'paranormalmusings'

if (!URI) {
  console.error('Set MONGODB_URI first, e.g.\n  MONGODB_URI="mongodb+srv://..." node scripts/check-mongo.mjs')
  process.exit(1)
}

const client = new MongoClient(URI, { serverSelectionTimeoutMS: 8000 })

try {
  await client.connect()
  const db = client.db(DB_NAME)

  const [postCount, categoryCount, settings] = await Promise.all([
    db.collection('posts').countDocuments(),
    db.collection('categories').countDocuments(),
    db.collection('settings').findOne({ _id: 'settings' }),
  ])

  console.log(`DB: ${DB_NAME}`)
  console.log(`posts:      ${postCount}`)
  console.log(`categories: ${categoryCount}`)
  console.log(`settings:   ${settings ? 'present' : 'MISSING (empty DB → will seed on first read)'}`)

  const cases = await db.collection('categories').findOne({ _id: 'cases' })
  if (!cases) {
    console.log('\ncases category: NOT FOUND')
  } else {
    console.log('\ncases category:')
    console.log(`  layout: ${cases.layout}`)
    console.log(`  hub.pillar: ${cases.hub?.pillar ?? 'null'}`)
  }
} catch (error) {
  console.error(`Failed: ${error.message}`)
  process.exit(1)
} finally {
  await client.close()
}
