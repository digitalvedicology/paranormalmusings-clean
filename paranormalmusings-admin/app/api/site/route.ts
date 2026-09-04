import { body, handle, json, requireAuth } from '@/lib/api'
import { saved } from '@/lib/revalidate'
import { readDoc, update } from '@/lib/store'
import { parseSite } from '@/lib/validate'

export const dynamic = 'force-dynamic'

export async function GET() {
  return handle(async () => json({ site: (await readDoc()).site }))
}

export async function PATCH(request: Request) {
  return handle(async () => {
    await requireAuth(request)

    const doc = await readDoc()
    const site = parseSite(await body(request), doc.site)

    await update((draft) => {
      draft.site = site
    })

    return json({ site, ...(await saved()) })
  })
}
