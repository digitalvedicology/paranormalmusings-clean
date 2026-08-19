import { fail, handle, json, requireAuth } from '@/lib/api'
import { remove } from '@/lib/media'
import { readDoc } from '@/lib/store'

export const dynamic = 'force-dynamic'

type Params = { params: Promise<{ name: string }> }

/**
 * DELETE /api/media/[name]
 *
 * Refused while anything still points at the file. Deleting a picture that is
 * on the home page would leave a broken image with no clue as to why, so the
 * response names what is using it instead.
 */
export async function DELETE(request: Request, { params }: Params) {
  return handle(async () => {
    await requireAuth(request)

    const { name } = await params
    const doc = await readDoc()
    const url = `${(process.env.MEDIA_BASE_URL ?? '/images').replace(/\/$/, '')}/${name}`

    const used = [
      ...doc.posts.filter((post) => post.image === url).map((post) => `post "${post.title}"`),
      ...doc.categories.filter((category) => category.image === url).map((category) => `page "${category.label}"`),
      ...doc.relatedSites.filter((site) => site.image === url).map((site) => `related site "${site.name}"`),
      ...(doc.site.authorImage === url ? ['the author portrait'] : []),
    ]

    if (used.length) return fail(`That image is still in use by ${used.join(', ')}.`, 409, used)

    try {
      await remove(name)
    } catch {
      return fail('That file is not in the media library', 404)
    }

    return json({ ok: true })
  })
}
