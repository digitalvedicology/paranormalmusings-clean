import { createHmac, timingSafeEqual } from 'node:crypto'
import { revalidateTag } from 'next/cache'

export const dynamic = 'force-dynamic'

/**
 * The hook the admin calls after every save.
 *
 * Content is fetched under the `content` tag, so clearing that one tag drops
 * the cached document and every page rebuilt from it — no path list to keep in
 * step with the routes as sections are added or renamed.
 *
 * Without this the site would still catch up on its own within the revalidate
 * window; this only makes an edit appear at once instead.
 */

/** Length-independent constant-time compare. */
function safeEqual(a: string, b: string): boolean {
  const left = createHmac('sha256', 'compare').update(a).digest()
  const right = createHmac('sha256', 'compare').update(b).digest()
  return timingSafeEqual(left, right)
}

export async function POST(request: Request) {
  const expected = process.env.REVALIDATE_SECRET
  const provided = request.headers.get('x-revalidate-secret')

  // An unset secret closes the hook rather than opening it — otherwise a
  // forgotten env var would leave a public cache-buster on the site.
  if (!expected || !provided || !safeEqual(provided, expected)) {
    return Response.json({ error: 'Not authorised' }, { status: 401 })
  }

  await revalidateTag('content', 'purge')
  return Response.json({ revalidated: true })
}
