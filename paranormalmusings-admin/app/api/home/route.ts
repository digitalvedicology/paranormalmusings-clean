import { body, handle, json, requireAuth } from '@/lib/api'
import { saved } from '@/lib/revalidate'
import { readDoc, update } from '@/lib/store'
import { parseHome } from '@/lib/validate'

export const dynamic = 'force-dynamic'

/** The home page's curated slots: which posts fill which band, and in what order. */
export async function GET() {
  return handle(async () => {
    const doc = await readDoc()
    return json({
      home: doc.home,
      // Pickers need something readable to show beside each slug.
      posts: doc.posts.map((post) => ({
        slug: post.slug,
        title: post.title,
        category: post.category,
        status: post.status,
      })),
      categories: doc.categories.map((category) => ({ key: category.key, label: category.label })),
    })
  })
}

export async function PATCH(request: Request) {
  return handle(async () => {
    await requireAuth(request)

    const doc = await readDoc()
    const home = parseHome(await body(request), doc)

    await update((draft) => {
      draft.home = home
    })

    return json({ home, ...(await saved()) })
  })
}
