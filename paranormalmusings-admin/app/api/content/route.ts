import { handle, json, requireAuth } from '@/lib/api'
import { publishedView } from '@/lib/published'
import { readDoc } from '@/lib/store'

export const dynamic = 'force-dynamic'

/**
 * The one endpoint the public site reads.
 *
 * By default it serves the published view — see `lib/published.ts` for what
 * that strips. `?preview=1` returns the unfiltered document instead and
 * requires auth; that is what the admin's own previews and any export use.
 */
export async function GET(request: Request) {
  return handle(async () => {
    const preview = new URL(request.url).searchParams.get('preview') === '1'
    const doc = await readDoc()

    if (preview) {
      await requireAuth(request)
      const response = json(doc)
      response.headers.set('Cache-Control', 'private, no-store')
      return response
    }

    const response = json(publishedView(doc))
    response.headers.set('Cache-Control', 'public, s-maxage=30, stale-while-revalidate=60')
    return response
  })
}
