'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { SearchIcon } from './icons'
import type { CardData, NavLink, SiteSettings } from '@/lib/content'

/**
 * The header runs on the client (sticky state, drawer, search overlay).
 * Site copy is handed down from the layout; search index is fetched lazily
 * via /api/search-index when the user opens the search overlay.
 */
export default function SiteHeader({
  site,
  navLinks,
  popularSearches,
}: {
  site: SiteSettings
  navLinks: NavLink[]
  popularSearches: string[]
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [stuck, setStuck] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [searchIndex, setSearchIndex] = useState<CardData[]>([])
  const [searchLoading, setSearchLoading] = useState(false)
  const searchInput = useRef<HTMLInputElement>(null)

  const q = query.trim().toLowerCase()
  const results = q
    ? searchIndex.filter((post) => post.title.toLowerCase().includes(q)).slice(0, 8)
    : []

  const closeSearch = () => {
    setSearchOpen(false)
    setQuery('')
  }

  /* Header shadow once the page has scrolled */
  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!searchOpen) return

    // Fetch search index lazily when overlay opens
    if (searchIndex.length === 0 && !searchLoading) {
      setSearchLoading(true)
      fetch('/api/search-index')
        .then((res) => res.json() as Promise<CardData[]>)
        .then((data) => setSearchIndex(data))
        .catch((error) => console.error('[search] Failed to load index:', error))
        .finally(() => setSearchLoading(false))
    }

    const focus = setTimeout(() => searchInput.current?.focus(), 60)
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeSearch()
    }
    document.addEventListener('keydown', onKey)
    return () => {
      clearTimeout(focus)
      document.removeEventListener('keydown', onKey)
    }
  }, [searchOpen, searchIndex.length, searchLoading])

  return (
    <>
      <header
        id="siteHeader"
        className={`sticky top-0 z-50 bg-paper/95 backdrop-blur border-b border-rule${stuck ? ' stuck' : ''}`}
      >
        <div className="wrap">
          <div className="flex items-center gap-6 h-[74px]">
            <Link href="/" className="flex items-center shrink-0" aria-label={`${site.name} — home`}>
              {/* Its own proportions, so the row keeps its height before the
                  file arrives and the header does not jump. */}
              <Image
                src="/images/paranormalmusings-logo.png"
                alt={`${site.name} logo featuring mystical third eye symbol`}
                width={310}
                height={124}
                className="h-12 sm:h-[52px] w-auto"
              />
            </Link>

            {/* Primary nav */}
            <nav className="hidden xl:flex items-center gap-7 mx-auto text-[14px] font-medium text-ink/80">
              {navLinks.map((link) => {
                const active = pathname === link.href
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    aria-current={active ? 'page' : undefined}
                    className={`nav-link${active ? ' is-active text-ink' : ''}`}
                  >
                    {link.label}
                  </Link>
                )
              })}
            </nav>

            <div className="flex items-center gap-2 ml-auto xl:ml-0">
              <button
                onClick={() => setSearchOpen(true)}
                aria-label="Search"
                className="grid place-items-center w-10 h-10 rounded-full text-ink hover:bg-mist transition"
              >
                <SearchIcon />
              </button>

              <button
                onClick={() => setDrawerOpen((v) => !v)}
                aria-label="Menu"
                aria-expanded={drawerOpen}
                className="xl:hidden grid place-items-center w-10 h-10 rounded-full text-ink hover:bg-mist transition"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M4 7h16M4 12h16M4 17h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile drawer */}
        {drawerOpen && (
          <div className="xl:hidden border-t border-rule bg-paper">
            <div className="wrap py-4 grid gap-1 text-[15px] font-medium text-ink">
              {navLinks.map((link, i) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setDrawerOpen(false)}
                  aria-current={pathname === link.href ? 'page' : undefined}
                  className={`py-2.5${i < navLinks.length - 1 ? ' border-b border-rule/70' : ''}${
                    pathname === link.href ? ' text-gold-600' : ''
                  }`}
                >
                  {link.mobileLabel || link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Search overlay */}
      <div
        id="searchOverlay"
        role="dialog"
        aria-modal="true"
        aria-label="Search"
        hidden={!searchOpen}
        className={`fixed inset-0 z-[60] bg-night-900/60 backdrop-blur-sm transition-opacity${searchOpen ? ' opacity-100' : ' opacity-0 pointer-events-none'}`}
        onClick={(e) => {
          if (e.target === e.currentTarget) closeSearch()
        }}
      >
        <div className="wrap pt-24">
          <div className="mx-auto max-w-2xl bg-paper rounded-2xl shadow-float p-5">
            <div className="flex items-center gap-3">
              <SearchIcon className="w-5 h-5 text-muted" />
              <input
                ref={searchInput}
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && results[0]) {
                    router.push(results[0].href)
                    closeSearch()
                  }
                }}
                placeholder="Search articles…"
                className="flex-1 h-11 text-[16px] text-ink placeholder:text-muted outline-none bg-transparent"
              />
              <button onClick={closeSearch} className="text-[13px] font-semibold text-muted hover:text-ink px-2">
                ESC
              </button>
            </div>

            <div className="mt-4 pt-4 border-t border-rule">
              {searchLoading && (
                <p className="px-3 py-2 text-[14px] text-muted">Loading search index…</p>
              )}
              {!searchLoading && q ? (
                results.length ? (
                  <ul className="grid gap-1">
                    {results.map((post) => (
                      <li key={post.slug}>
                        <Link
                          href={post.href}
                          onClick={closeSearch}
                          className="flex items-center justify-between gap-4 rounded-lg px-3 py-2.5 hover:bg-mist transition"
                        >
                          <span className="text-[14.5px] leading-snug text-ink">{post.title}</span>
                          <span className="label text-gold-600 shrink-0">{post.label}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="px-3 py-2 text-[14px] text-muted">
                    No articles match &ldquo;{query.trim()}&rdquo;.
                  </p>
                )
              ) : (
                <>
                  <p className="label text-muted mb-3">Popular searches</p>
                  <div className="flex flex-wrap gap-2">
                    {popularSearches.map((term) => (
                      <button
                        key={term}
                        onClick={() => {
                          setQuery(term)
                          searchInput.current?.focus()
                        }}
                        className="chip px-3 py-1.5 rounded-full bg-mist text-[13px] font-medium text-ink hover:bg-rule/60 transition"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
