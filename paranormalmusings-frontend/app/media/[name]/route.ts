import { createReadStream } from 'node:fs'
import { promises as fs } from 'node:fs'
import path from 'node:path'
import { Readable } from 'node:stream'

/**
 * Serves pictures uploaded through the admin.
 *
 * On a host that redeploys by replacing the app folder, anything written into
 * `public/` is lost on the next deploy. So uploads live in a directory outside
 * both apps — `MEDIA_DIR` here, the same path the admin writes to as
 * `UPLOAD_DIR` — and this route streams them out.
 *
 * It stays on the site rather than the admin deliberately: the pictures keep
 * loading whether or not the admin is running, which is the same reasoning as
 * the bundled content fallback.
 *
 * `public/images/` is untouched and still serves the committed artwork; this
 * route owns `/media/` so the two can never shadow each other.
 */

const MEDIA_DIR = process.env.MEDIA_DIR ?? ''

const TYPES: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
}

export async function GET(_request: Request, { params }: { params: Promise<{ name: string }> }) {
  if (!MEDIA_DIR) return new Response('Media directory is not configured', { status: 404 })

  const { name } = await params

  // `basename` strips any traversal; the equality check refuses the request
  // outright rather than quietly serving something else.
  const safe = path.basename(name)
  if (safe !== name || !safe) return new Response('Not found', { status: 404 })

  const type = TYPES[path.extname(safe).toLowerCase()]
  if (!type) return new Response('Not found', { status: 404 })

  const file = path.join(MEDIA_DIR, safe)

  try {
    const stat = await fs.stat(file)
    if (!stat.isFile()) return new Response('Not found', { status: 404 })

    const stream = Readable.toWeb(createReadStream(file)) as ReadableStream

    return new Response(stream, {
      headers: {
        'content-type': type,
        'content-length': String(stat.size),
        // Uploads are immutable once written — a new picture gets a new name.
        'cache-control': 'public, max-age=31536000, immutable',
      },
    })
  } catch {
    return new Response('Not found', { status: 404 })
  }
}
