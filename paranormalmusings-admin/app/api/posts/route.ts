import { body, handle, json, requireAuth } from '@/lib/api'
import { saved } from '@/lib/revalidate'
import { readDoc, update } from '@/lib/store'
import { parsePost } from '@/lib/validate'

export const dynamic = 'force-dynamic'

/**
 * GET /api/posts?category=eastern&status=draft&q=ghost
 *
 * Bodies are stripped from the list response — a list of 37 articles carrying
 * full bodies is most of a megabyte, and no listing screen renders them.
 */
export async function GET(request: Request) {
  return handle(async () => {
    const params = new URL(request.url).searchParams
    const category = params.get('category')
    const status = params.get('status')
    const query = params.get('q')?.toLowerCase().trim()

    const doc = await readDoc()

    const posts = doc.posts
      .filter((post) => !category || post.category === category || post.alsoIn.includes(category))
      .filter((post) => !status || post.status === status)
      .filter((post) => !query || `${post.title} ${post.excerpt} ${post.slug}`.toLowerCase().includes(query))
      .map(({ body: content, ...rest }) => ({ ...rest, written: content.length > 0, blocks: content.length }))

    return json({ posts, total: doc.posts.length })
  })
}

/** POST /api/posts — create. New posts start as drafts unless told otherwise. */
export async function POST(request: Request) {
  return handle(async () => {
    await requireAuth(request)

    const doc = await readDoc()
    const post = parsePost(await body(request), doc)

    await update((draft) => {
      // Newest first, matching how every listing on the site reads.
      draft.posts.unshift(post)
    })

    return json({ post, ...(await saved()) }, 201)
  })
}
