import { createReadStream } from 'node:fs'
import { promises as fs } from 'node:fs'
import path from 'node:path'
import { Readable } from 'node:stream'
import { uploadDir } from '@/lib/media'

export const dynamic = 'force-dynamic'

/**
 * Serves an uploaded picture straight from this app.
 *
 * The site normally serves these itself, reading the same folder — that keeps
 * the pictures loading even when the admin is down. But that only works if both
 * apps genuinely share a filesystem, and some hosts isolate each app so they
 * cannot. This route is the fallback for that case: set MEDIA_BASE_URL to point
 * here and the stored URLs become absolute, so no sharing is required.
 *
 * Deliberately unauthenticated. These are pictures published on a public blog;
 * requiring a key would mean no reader could see them.
 */

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
  const { name } = await params

  // `basename` strips any traversal; the equality check refuses outright rather
  // than quietly serving a different file.
  const safe = path.basename(name)
  if (safe !== name || !safe) return new Response('Not found', { status: 404 })

  const type = TYPES[path.extname(safe).toLowerCase()]
  if (!type) return new Response('Not found', { status: 404 })

  try {
    const file = path.join(uploadDir(), safe)
    const stat = await fs.stat(file)
    if (!stat.isFile()) return new Response('Not found', { status: 404 })

    return new Response(Readable.toWeb(createReadStream(file)) as ReadableStream, {
      headers: {
        'content-type': type,
        'content-length': String(stat.size),
        // Uploads are immutable — a new picture gets a new name.
        'cache-control': 'public, max-age=31536000, immutable',
      },
    })
  } catch {
    return new Response('Not found', { status: 404 })
  }
}
