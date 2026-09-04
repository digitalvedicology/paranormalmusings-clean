import { fail, handle, json, requireAuth } from '@/lib/api'
import { ACCEPT, MAX_BYTES, list, save } from '@/lib/media'

export const dynamic = 'force-dynamic'

/** GET /api/media — everything already uploaded, so a picture can be reused. */
export async function GET(request: Request) {
  return handle(async () => {
    await requireAuth(request)
    return json({ files: await list(), accept: ACCEPT, maxBytes: MAX_BYTES })
  })
}

/** POST /api/media — multipart upload of one image. */
export async function POST(request: Request) {
  return handle(async () => {
    await requireAuth(request)

    const form = await request.formData().catch(() => null)
    const file = form?.get('file')

    if (!(file instanceof File) || !file.size) return fail('No file was sent', 400)

    try {
      return json({ file: await save(file) }, 201)
    } catch (error) {
      // save() throws for the two things a person can actually get wrong —
      // wrong type, too big — and both deserve the reason, not a 500.
      return fail((error as Error).message, 422)
    }
  })
}
