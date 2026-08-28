'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { SearchIcon } from './icons'
import type { NavLink, SiteSettings } from '@/lib/content'

/**
 * The header runs on the client (sticky state, drawer, search overlay), so its
 * copy is handed down from the layout rather than fetched here.
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
  const [stuck, setStuck] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const searchInput = useRef<HTMLInputElement>(null)

  /* Header shadow once the page has scrolled */
  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!searchOpen) return
    const focus = setTimeout(() => searchInput.current?.focus(), 60)
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSearchOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => {
      clearTimeout(focus)
      document.removeEventListener('keydown', onKey)
    }
  }, [searchOpen])

  return (
    <>
      <header
        id="siteHeader"
        className={`sticky top-0 z-50 bg-paper/95 backdrop-blur border-b border-rule${stuck ? ' stuck' : ''}`}
      >
        <div className="wrap">
          <div className="flex items-center gap-6 h-[74px]">
            <Link href="/" className="flex items-center shrink-0" aria-label={`${site.name} — home`}>
              <img src="/images/paranormalmusings-logo.webp" alt={site.name} className="h-12 sm:h-[52px] w-auto" />
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
              <a href="#newsletter" className="hidden sm:block text-[14px] font-semibold text-ink px-3 py-2 rounded-full hover:bg-mist transition">
                Sign In
              </a>
              <a
                href="#newsletter"
                className="hidden sm:inline-flex items-center h-10 px-5 rounded-full bg-gold-500 text-white text-[14px] font-semibold hover:bg-gold-600 transition shadow-soft"
              >
                Subscribe
              </a>

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
              <a
                href="#newsletter"
                onClick={() => setDrawerOpen(false)}
                className="mt-3 inline-flex justify-center items-center h-11 rounded-full bg-gold-500 text-white font-semibold"
              >
                Subscribe
              </a>
            </div>
          </div>
        )}
      </header>

      {/* Search overlay */}
      <div
        id="searchOverlay"
        className={`fixed inset-0 z-[60] bg-night-900/60 backdrop-blur-sm${searchOpen ? ' open' : ''}`}
        onClick={(e) => {
          if (e.target === e.currentTarget) setSearchOpen(false)
        }}
      >
        <div className="wrap pt-24">
          <div className="mx-auto max-w-2xl bg-paper rounded-2xl shadow-float p-5">
            <div className="flex items-center gap-3">
              <SearchIcon className="w-5 h-5 text-muted" />
              <input
                ref={searchInput}
                type="search"
                placeholder="Search…"
                className="flex-1 h-11 text-[16px] text-ink placeholder:text-muted outline-none bg-transparent"
              />
              <button onClick={() => setSearchOpen(false)} className="text-[13px] font-semibold text-muted hover:text-ink px-2">
                ESC
              </button>
            </div>
            <div className="mt-4 pt-4 border-t border-rule">
              <p className="label text-muted mb-3">Popular searches</p>
              <div className="flex flex-wrap gap-2">
                {popularSearches.map((term) => (
                  <a key={term} href="#" className="chip px-3 py-1.5 rounded-full bg-mist text-[13px] font-medium text-ink">
                    {term}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
