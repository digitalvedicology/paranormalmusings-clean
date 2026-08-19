import { body, fail, handle, json, requireAuth } from '@/lib/api'
import { saved } from '@/lib/revalidate'
import { postsIn, readDoc, update } from '@/lib/store'
import { Invalid } from '@/lib/validate'

export const dynamic = 'force-dynamic'

/** GET /api/categories — the page list, each with its live post count. */
export async function GET() {
  return handle(async () => {
    const doc = await readDoc()
    return json({
      categories: doc.categories.map((category) => ({
        ...category,
        posts: postsIn(doc, category.key).length,
        drafts: postsIn(doc, category.key).filter((post) => post.status === 'draft').length,
      })),
    })
  })
}

/**
 * PUT /api/categories — reorder the pages.
 *
 * The array order *is* the display order everywhere the categories are listed,
 * so reordering is its own operation rather than a field on each category.
 * Expects every existing key exactly once; a partial list would silently drop
 * a page, so it is rejected instead.
 */
export async function PUT(request: Request) {
  return handle(async () => {
    await requireAuth(request)

    const { order } = ((await body(request)) ?? {}) as { order?: unknown }
    if (!Array.isArray(order)) throw new Invalid(['order must be a list of category keys'])

    const doc = await readDoc()
    const wanted = order.map(String)
    const existing = doc.categories.map((category) => category.key)

    const missing = existing.filter((key) => !wanted.includes(key))
    const unknown = wanted.filter((key) => !existing.includes(key))
    if (missing.length || unknown.length || wanted.length !== existing.length) {
      throw new Invalid(
        [
          missing.length ? `order is missing: ${missing.join(', ')}` : '',
          unknown.length ? `order names categories that do not exist: ${unknown.join(', ')}` : '',
        ].filter(Boolean),
      )
    }

    const updated = await update((draft) => {
      draft.categories = wanted.map((key) => draft.categories.find((category) => category.key === key)!)
    })

    return json({ categories: updated.categories, ...(await saved()) })
  })
}

/** POST /api/categories — add a page. */
export async function POST(request: Request) {
  return handle(async () => {
    await requireAuth(request)

    const raw = ((await body(request)) ?? {}) as Record<string, unknown>
    const key = String(raw.key ?? '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '')
    const label = String(raw.label ?? '').trim()

    const problems: string[] = []
    if (!key) problems.push('key is required (lowercase letters and digits)')
    if (!label) problems.push('label is required')
    if (problems.length) throw new Invalid(problems)

    const doc = await readDoc()
    if (doc.categories.some((category) => category.key === key)) {
      return fail(`A page with the key "${key}" already exists`, 409)
    }

    const href = String(raw.href ?? `/${key}`)
    const updated = await update((draft) => {
      draft.categories.push({
        key,
        label,
        title: String(raw.title ?? label),
        href: href.startsWith('/') ? href : `/${href}`,
        count: 0,
        image: '',
        seed: String(raw.seed ?? `pm-${key}`),
        art: 'art-1',
        blurb: String(raw.blurb ?? ''),
        lede: String(raw.lede ?? ''),
        layout: 'archive',
        // New pages start hidden — you write the copy first, then publish.
        published: false,
        hub: { pillar: null, clusters: [], questions: [] },
      })
    })

    return json({ category: updated.categories.at(-1), ...(await saved()) }, 201)
  })
}
