import { promises as fs } from 'node:fs'
import path from 'node:path'

/**
 * Uploaded artwork.
 *
 * Files are written into the *site's* own `public/images`, not the admin's, and
 * stored as site-relative paths like `/images/hero.jpg`. That is deliberate: the
 * site then serves its own pictures and keeps rendering them whether or not the
 * admin is running — the same reason the content has a bundled fallback.
 *
 * Both apps sit in one workspace here, so the default path just works. Point
 * `UPLOAD_DIR` somewhere else if they are ever split across machines, and
 * `MEDIA_BASE_URL` at whatever serves that directory.
 */

/** Where the files land. */
export const uploadDir = () =>
  process.env.UPLOAD_DIR ?? path.join(process.cwd(), '..', 'paranormalmusings-frontend', 'public', 'images')

/** The URL prefix those files are served under. */
export const baseUrl = () => (process.env.MEDIA_BASE_URL ?? '/images').replace(/\/$/, '')

const EXTENSIONS: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/avif': '.avif',
  'image/gif': '.gif',
  'image/svg+xml': '.svg',
}

export const ACCEPT = Object.keys(EXTENSIONS).join(',')
export const MAX_BYTES = 8 * 1024 * 1024

/**
 * Builds a safe filename from whatever the browser sent.
 *
 * The extension comes from the sniffed MIME type rather than the supplied name,
 * and the stem is stripped to letters, digits and dashes — so an upload cannot
 * name itself `../../etc/passwd` or arrive as `photo.jpg.html`.
 */
export function safeName(original: string, type: string): string {
  const extension = EXTENSIONS[type]
  if (!extension) throw new Error(`${type || 'That file type'} is not an image we accept`)

  const stem =
    path
      .basename(original, path.extname(original))
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 60) || 'image'

  return `${stem}${extension}`
}

/** Adds `-2`, `-3` … rather than overwriting a file something else may be using. */
async function unused(dir: string, name: string): Promise<string> {
  const extension = path.extname(name)
  const stem = path.basename(name, extension)

  for (let n = 1; n < 500; n++) {
    const candidate = n === 1 ? name : `${stem}-${n}${extension}`
    try {
      await fs.access(path.join(dir, candidate))
    } catch {
      return candidate
    }
  }

  throw new Error('Too many files with that name')
}

export type Upload = { url: string; name: string; size: number }

export async function save(file: File): Promise<Upload> {
  if (file.size > MAX_BYTES) {
    throw new Error(`That file is ${(file.size / 1024 / 1024).toFixed(1)}MB — the limit is 8MB`)
  }

  const dir = uploadDir()
  await fs.mkdir(dir, { recursive: true })

  const name = await unused(dir, safeName(file.name, file.type))
  await fs.writeFile(path.join(dir, name), Buffer.from(await file.arrayBuffer()))

  return { url: `${baseUrl()}/${name}`, name, size: file.size }
}

/** Everything already uploaded, newest first, so a picture can be reused. */
export async function list(): Promise<Upload[]> {
  const dir = uploadDir()

  let names: string[]
  try {
    names = await fs.readdir(dir)
  } catch {
    // No directory yet simply means nothing has been uploaded.
    return []
  }

  const files = await Promise.all(
    names
      .filter((name) => Object.values(EXTENSIONS).includes(path.extname(name).toLowerCase()))
      .map(async (name) => {
        const stat = await fs.stat(path.join(dir, name))
        return { url: `${baseUrl()}/${name}`, name, size: stat.size, at: stat.mtimeMs }
      }),
  )

  // Sort by modification time, then drop it — callers only need the file.
  files.sort((a, b) => b.at - a.at)
  return files.map((file) => ({ url: file.url, name: file.name, size: file.size }))
}

export async function remove(name: string): Promise<void> {
  // Never let a name escape the upload directory.
  const bare = path.basename(name)
  if (bare !== name || !bare) throw new Error('That is not a file in the media library')

  await fs.unlink(path.join(uploadDir(), bare))
}
