import { body, fail, handle, json, requireAuth } from '@/lib/api'
import { saved } from '@/lib/revalidate'
import { findPost, forgetPost, postUsage, readDoc, renamePost, update } from '@/lib/store'
import { parsePost } from '@/lib/validate'

export const dynamic = 'force-dynamic'

type Params = { params: Promise<{ slug: string }> }

export async function GET(_request: Request, { params }: Params) {
  return handle(async () => {
    const { slug } = await params
    const doc = await readDoc()
    const post = findPost(doc, slug)
    if (!post) return fail(`No post with the slug "${slug}"`, 404)

    return json({
      post,
      categories: doc.categories.map((category) => ({ key: category.key, label: category.label })),
      /** Where this post is pinned, so the editor can warn before a delete. */
      usage: postUsage(doc, slug),
    })
  })
}

export async function PATCH(request: Request, { params }: Params) {
  return handle(async () => {
    await requireAuth(request)

    const { slug } = await params
    const doc = await readDoc()
    const existing = findPost(doc, slug)
    if (!existing) return fail(`No post with the slug "${slug}"`, 404)

    const next = parsePost(await body(request), doc, existing)

    await update((draft) => {
      const index = draft.posts.findIndex((post) => post.slug === slug)
      draft.posts[index] = next
      // A slug is the URL. If it moved, every curated list that pinned the old
      // one has to follow, or the home page starts pointing at nothing.
      if (next.slug !== slug) renamePost(draft, slug, next.slug)
    })

    return json({ post: next, ...(await saved()) })
  })
}

export async function DELETE(request: Request, { params }: Params) {
  return handle(async () => {
    await requireAuth(request)

    const { slug } = await params
    const doc = await readDoc()
    if (!findPost(doc, slug)) return fail(`No post with the slug "${slug}"`, 404)

    // Unlike a category, a post is safe to remove: every reference to it is a
    // curation slot, and `forgetPost` empties those in the same write.
    await update((draft) => {
      draft.posts = draft.posts.filter((post) => post.slug !== slug)
      forgetPost(draft, slug)
    })

    return json({ ok: true, ...(await saved()) })
  })
}
