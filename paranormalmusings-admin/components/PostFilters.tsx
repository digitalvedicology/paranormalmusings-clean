'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

/**
 * Search and status, kept in the URL alongside the category tab.
 *
 * The typed query is debounced before it becomes a navigation — filtering on
 * every keystroke would push a history entry per character and make the back
 * button useless.
 */
export default function PostFilters({ category, status, q }: { category: string; status: string; q: string }) {
  const router = useRouter()
  const [query, setQuery] = useState(q)

  const url = (next: { status?: string; q?: string }) => {
    const params = new URLSearchParams()
    if (category !== 'all') params.set('category', category)

    const nextStatus = next.status ?? status
    if (nextStatus !== 'all') params.set('status', nextStatus)

    const nextQuery = next.q ?? query
    if (nextQuery) params.set('q', nextQuery)

    const suffix = params.toString()
    return suffix ? `/posts?${suffix}` : '/posts'
  }

  useEffect(() => {
    if (query === q) return
    const timer = setTimeout(() => router.replace(url({ q: query })), 250)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query])

  return (
    <div className="flex flex-wrap items-center gap-2">
      <input
        className="field max-w-xs"
        type="search"
        value={query}
        placeholder="Search titles and excerpts…"
        onChange={(event) => setQuery(event.target.value)}
      />

      <div className="flex items-center gap-1">
        {[
          { value: 'all', label: 'All' },
          { value: 'published', label: 'Live' },
          { value: 'draft', label: 'Drafts' },
        ].map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => router.replace(url({ status: option.value }))}
            className={`rounded-lg border px-3 py-2 text-[13px] font-semibold transition-colors ${
              status === option.value
                ? 'border-gold-600 bg-gold-50 text-ink'
                : 'border-rule bg-paper text-body hover:border-bark-100'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  )
}
