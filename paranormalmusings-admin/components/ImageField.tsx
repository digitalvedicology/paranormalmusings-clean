'use client'

import { useEffect, useRef, useState } from 'react'

type MediaFile = { url: string; name: string; size: number }

/**
 * One picture, chosen any of the three ways that actually come up: upload a new
 * file, reuse one already uploaded, or paste a URL from somewhere else.
 *
 * The preview is the point of the control. A path in a text box tells you
 * nothing about whether you picked the right photograph, so the picture is
 * always on screen — including when it fails to load, which is reported rather
 * than left as a silent broken box.
 */
export default function ImageField({
  label,
  value,
  onChange,
  hint,
  /** Site origin, so a stored `/images/x.jpg` can be previewed from here. */
  siteUrl,
  shape = 'landscape',
}: {
  label: string
  value: string
  onChange: (next: string) => void
  hint?: string
  siteUrl: string
  shape?: 'landscape' | 'square'
}) {
  const input = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [broken, setBroken] = useState(false)
  const [library, setLibrary] = useState<MediaFile[] | null>(null)

  // A stored path is relative to the site, which is served from a different
  // origin than the admin — so previews here need the site prefixed back on.
  const preview = value.startsWith('/') ? `${siteUrl.replace(/\/$/, '')}${value}` : value

  useEffect(() => setBroken(false), [value])

  async function upload(file: File) {
    setBusy(true)
    setError(null)

    const form = new FormData()
    form.append('file', file)

    const response = await fetch('/api/media', { method: 'POST', body: form }).catch(() => null)
    const data = await response?.json().catch(() => ({}))

    if (!response?.ok) {
      setError(data?.error ?? 'That did not upload')
    } else {
      onChange(data.file.url)
      // The library is stale the moment a new file lands.
      setLibrary(null)
    }

    setBusy(false)
  }

  async function openLibrary() {
    setBusy(true)
    setError(null)

    const response = await fetch('/api/media').catch(() => null)
    const data = await response?.json().catch(() => ({}))

    if (!response?.ok) setError(data?.error ?? 'Could not open the media library')
    else setLibrary(data.files)

    setBusy(false)
  }

  return (
    <div>
      <span className="label">{label}</span>

      <div className="mt-1.5 flex flex-wrap items-start gap-4">
        <div
          className={`relative shrink-0 overflow-hidden rounded-lg border border-rule bg-mist ${
            shape === 'square' ? 'h-24 w-24' : 'h-24 w-40'
          }`}
        >
          {value && !broken ? (
            <img src={preview} alt="" className="h-full w-full object-cover" onError={() => setBroken(true)} />
          ) : (
            <div className="grid h-full w-full place-items-center px-2 text-center text-[11px] leading-tight text-muted">
              {broken ? 'Will not load' : 'Placeholder in use'}
            </div>
          )}
        </div>

        <div className="min-w-[240px] flex-1 space-y-2">
          <div className="flex flex-wrap gap-2">
            <button type="button" className="btn-ghost btn-sm" onClick={() => input.current?.click()} disabled={busy}>
              {busy ? 'Working…' : 'Upload'}
            </button>
            <button type="button" className="btn-ghost btn-sm" onClick={openLibrary} disabled={busy}>
              Choose existing
            </button>
            {value ? (
              <button type="button" className="btn-ghost btn-sm" onClick={() => onChange('')}>
                Clear
              </button>
            ) : null}
          </div>

          <input
            ref={input}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0]
              if (file) upload(file)
              // Reset, so re-picking the same file still fires a change.
              event.target.value = ''
            }}
          />

          <input
            className="field"
            value={value}
            placeholder="/images/photo.jpg or https://…"
            onChange={(event) => onChange(event.target.value)}
          />

          {error ? <p className="text-[12.5px] font-semibold text-red-700">{error}</p> : null}
          {broken && value ? (
            <p className="text-[12.5px] text-red-700">
              Nothing loads from that address. Check the site is running and the file is in its{' '}
              <code className="font-mono">public/images</code> folder.
            </p>
          ) : null}
          {hint ? <p className="text-[12.5px] leading-snug text-muted">{hint}</p> : null}
        </div>
      </div>

      {library ? (
        <MediaLibrary
          files={library}
          siteUrl={siteUrl}
          onPick={(url) => {
            onChange(url)
            setLibrary(null)
          }}
          onClose={() => setLibrary(null)}
        />
      ) : null}
    </div>
  )
}

function MediaLibrary({
  files,
  siteUrl,
  onPick,
  onClose,
}: {
  files: MediaFile[]
  siteUrl: string
  onPick: (url: string) => void
  onClose: () => void
}) {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  const origin = siteUrl.replace(/\/$/, '')

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-night-900/50 p-4 backdrop-blur-sm"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div className="max-h-[80vh] w-full max-w-3xl overflow-hidden rounded-xl bg-paper shadow-float">
        <div className="flex items-center justify-between border-b border-rule px-5 py-4">
          <div>
            <h2 className="font-display text-[19px] text-ink">Media library</h2>
            <p className="mt-0.5 text-[12.5px] text-muted">
              {files.length} image{files.length === 1 ? '' : 's'} in the site&rsquo;s images folder.
            </p>
          </div>
          <button type="button" className="btn-ghost btn-sm" onClick={onClose}>
            Close
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-5">
          {files.length === 0 ? (
            <p className="rounded-lg bg-mist px-3.5 py-3 text-[13px] text-muted">
              Nothing uploaded yet. Use <strong className="font-semibold">Upload</strong> and it will appear here for
              reuse.
            </p>
          ) : (
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {files.map((file) => (
                <li key={file.url}>
                  <button
                    type="button"
                    onClick={() => onPick(file.url)}
                    className="group block w-full overflow-hidden rounded-lg border border-rule text-left transition-colors hover:border-gold-500"
                  >
                    <div className="h-24 w-full bg-mist">
                      <img src={`${origin}${file.url}`} alt="" className="h-full w-full object-cover" />
                    </div>
                    <p className="truncate px-2 py-1.5 text-[11.5px] text-body group-hover:text-ink">{file.name}</p>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
