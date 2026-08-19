'use client'

import Link from 'next/link'
import { useRef, useState } from 'react'
import { artwork, type CardData } from '@/lib/content'

/**
 * Builds the page control: always the first and last page, the current page and
 * its neighbours, and an ellipsis wherever that leaves a gap.
 */
function pageList(current: number, total: number): (number | 'gap')[] {
  if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1)

  const wanted = [1, total, current, current - 1, current + 1]
    .filter((page) => page >= 1 && page <= total)
    .sort((a, b) => a - b)

  const out: (number | 'gap')[] = []
  let previous = 0
  for (const page of wanted) {
    if (page === previous) continue
    if (previous && page - previous > 1) out.push('gap')
    out.push(page)
    previous = page
  }
  return out
}

const box = 'grid place-items-center w-9 h-9 rounded-lg text-[14px] font-semibold transition'

/**
 * The three-up card grid with numbered pagination. Takes flat CardData rather
 * than Post so article bodies stay out of the client payload.
 */
export default function PostGrid({
  posts,
  author,
  authorImage,
  perPage = 6,
}: {
  posts: CardData[]
  /** The byline and its portrait. Passed in because this runs on the client. */
  author: string
  authorImage: string
  perPage?: number
}) {
  const [page, setPage] = useState(1)
  const top = useRef<HTMLDivElement>(null)

  const total = Math.max(1, Math.ceil(posts.length / perPage))
  const visible = posts.slice((page - 1) * perPage, page * perPage)

  const go = (next: number) => {
    setPage(Math.min(total, Math.max(1, next)))
    top.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <>
      <div ref={top} className="scroll-mt-28 grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
        {visible.map((post) => (
          <Link key={post.slug} href={post.href} className="card-lift group flex flex-col">
            <div className="zoom-wrap rounded-[12px]">
              <img src={artwork(post.image, post.seed, 800, 560)} alt="" className="w-full h-[200px] object-cover moody" />
            </div>

            <h3 className="mt-5 font-display text-[20px] leading-snug text-ink hover-title">{post.title}</h3>

            {post.excerpt && <p className="mt-2.5 text-[14px] leading-[1.6] text-muted">{post.excerpt}</p>}

            <div className="mt-5 flex items-center gap-2.5 text-[12.5px] text-muted">
              <img src={artwork(authorImage, 'pm-praveen', 80, 80)} alt="" className="w-6 h-6 rounded-full object-cover moody-soft" />
              <span className="font-semibold text-ink/85">{author}</span>
              <span className="opacity-50">•</span>
              <span>{post.date}</span>
              {!post.written && (
                <span className="ml-auto px-2.5 py-1 rounded-full bg-mist text-[11px] font-semibold">Coming soon</span>
              )}
            </div>
          </Link>
        ))}
      </div>

      {total > 1 && (
        <nav aria-label="Pagination" className="mt-14 flex items-center justify-center gap-2">
          {page > 1 && (
            <button onClick={() => go(page - 1)} aria-label="Previous page" className={`${box} border border-rule text-gold-600 hover:bg-mist`}>
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 5l-7 7 7 7" />
              </svg>
            </button>
          )}

          {pageList(page, total).map((entry, i) =>
            entry === 'gap' ? (
              <span key={`gap-${i}`} className="px-1 text-[14px] text-muted select-none">
                …
              </span>
            ) : (
              <button
                key={entry}
                onClick={() => go(entry)}
                aria-label={`Page ${entry}`}
                aria-current={entry === page ? 'page' : undefined}
                className={
                  entry === page
                    ? `${box} bg-gold-500 text-white`
                    : `${box} border border-rule text-ink hover:bg-mist`
                }
              >
                {entry}
              </button>
            ),
          )}

          {page < total && (
            <button onClick={() => go(page + 1)} aria-label="Next page" className={`${box} border border-rule text-gold-600 hover:bg-mist`}>
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </nav>
      )}
    </>
  )
}
