import { body, fail, handle, json, requireAuth } from '@/lib/api'
import { saved } from '@/lib/revalidate'
import { categoryUsage, findCategory, postsIn, readDoc, update } from '@/lib/store'
import { parseCategory } from '@/lib/validate'

export const dynamic = 'force-dynamic'

type Params = { params: Promise<{ key: string }> }

export async function GET(_request: Request, { params }: Params) {
  return handle(async () => {
    const { key } = await params
    const doc = await readDoc()
    const category = findCategory(doc, key)
    if (!category) return fail(`No page with the key "${key}"`, 404)

    return json({
      category,
      // The editor needs the whole slug list to populate its pickers.
      posts: postsIn(doc, key).map((post) => ({ slug: post.slug, title: post.title, status: post.status })),
      allPosts: doc.posts.map((post) => ({ slug: post.slug, title: post.title, category: post.category })),
    })
  })
}

export async function PATCH(request: Request, { params }: Params) {
  return handle(async () => {
    await requireAuth(request)

    const { key } = await params
    const doc = await readDoc()
    const existing = findCategory(doc, key)
    if (!existing) return fail(`No page with the key "${key}"`, 404)

    const next = parseCategory(await body(request), existing)

    const updated = await update((draft) => {
      const index = draft.categories.findIndex((category) => category.key === key)
      const before = draft.categories[index]
      draft.categories[index] = next

      // The nav stores hrefs, not keys, so moving a page has to carry its
      // nav entry with it or the link quietly 404s.
      if (before.href !== next.href) {
        draft.navLinks = draft.navLinks.map((link) => (link.href === before.href ? { ...link, href: next.href } : link))
        draft.topics = draft.topics.map((topic) => (topic.href === before.href ? { ...topic, href: next.href } : topic))
      }
    })

    return json({ category: findCategory(updated, key), ...(await saved()) })
  })
}

/**
 * DELETE /api/categories/[key]
 *
 * Refused while anything still points at the page. Cascading would take posts
 * down with it, and losing an article to a mis-clicked delete is not a trade
 * worth making — the response names what has to be moved first.
 */
export async function DELETE(request: Request, { params }: Params) {
  return handle(async () => {
    await requireAuth(request)

    const { key } = await params
    const doc = await readDoc()
    if (!findCategory(doc, key)) return fail(`No page with the key "${key}"`, 404)

    const usage = categoryUsage(doc, key)
    const blockers = [
      usage.posts.length ? `${usage.posts.length} post(s) live in it` : '',
      usage.alsoIn.length ? `${usage.alsoIn.length} post(s) are cross-filed into it` : '',
      usage.home.length ? `the home page uses it for the ${usage.home.join(' and ')}` : '',
    ].filter(Boolean)

    if (blockers.length) {
      return fail(`That page is still in use: ${blockers.join(', ')}.`, 409, [...usage.posts, ...usage.alsoIn])
    }

    const category = findCategory(doc, key)!
    await update((draft) => {
      draft.categories = draft.categories.filter((entry) => entry.key !== key)
      draft.navLinks = draft.navLinks.filter((link) => link.href !== category.href)
      draft.topics = draft.topics.filter((topic) => topic.href !== category.href)
    })

    return json({ ok: true, ...(await saved()) })
  })
}
