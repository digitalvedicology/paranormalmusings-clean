'use client'

import { useCallback, useState } from 'react'
import { useRouter } from 'next/navigation'

export type Notice = { kind: 'ok' | 'error'; text: string; problems?: string[] }

/**
 * One request lifecycle, shared by every editing screen.
 *
 * Each screen holds its own draft state and calls `send` with the payload; this
 * hook owns the parts that are the same everywhere — the in-flight flag, the
 * `{ error, problems }` unwrapping the API guarantees, and the router refresh
 * that pulls the server components back in step with what was just written.
 */
export function useSave() {
  const router = useRouter()
  const [pending, setPending] = useState(false)
  const [notice, setNotice] = useState<Notice | null>(null)

  const send = useCallback(
    async <T,>(
      url: string,
      {
        method = 'PATCH',
        payload,
        onDone,
      }: {
        method?: string
        payload?: unknown
        /**
         * The parsed response body. Each route returns a different shape, so
         * the caller names it: `send<{ post: Post }>(…)`.
         */
        onDone?: (data: T) => void
      } = {},
    ): Promise<boolean> => {
      setPending(true)
      setNotice(null)

      try {
        const response = await fetch(url, {
          method,
          headers: { 'content-type': 'application/json' },
          body: payload === undefined ? undefined : JSON.stringify(payload),
        })

        const data = await response.json().catch(() => ({}))

        if (!response.ok) {
          setNotice({ kind: 'error', text: data.error ?? 'That did not save', problems: data.problems })
          return false
        }

        // `note` carries whether the public site could be refreshed too.
        setNotice({ kind: 'ok', text: data.note ?? 'Saved.' })
        onDone?.(data as T)
        router.refresh()
        return true
      } catch {
        setNotice({ kind: 'error', text: 'Could not reach the server.' })
        return false
      } finally {
        setPending(false)
      }
    },
    [router],
  )

  return { pending, notice, setNotice, send }
}
