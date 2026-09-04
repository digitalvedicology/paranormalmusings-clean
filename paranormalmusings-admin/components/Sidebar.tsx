'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

const LINKS = [
  { href: '/', label: 'Overview', hint: 'What is live right now' },
  { href: '/pages', label: 'Pages', hint: 'Eastern, Western, Investigation, Cases' },
  { href: '/posts', label: 'Posts', hint: 'Every article' },
  { href: '/home', label: 'Home page', hint: 'The curated bands' },
  { href: '/navigation', label: 'Navigation', hint: 'Menu, topics, footer' },
  { href: '/subscribers', label: 'Newsletter Subscribers', hint: 'Manage subscriber list' },
  { href: '/settings', label: 'Site details', hint: 'Name, author, contact' },
]

export default function Sidebar({ siteUrl }: { siteUrl: string }) {
  const pathname = usePathname()
  const router = useRouter()

  async function signOut() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.replace('/login')
    router.refresh()
  }

  return (
    <aside className="flex h-full flex-col border-r border-rule bg-paper">
      <div className="border-b border-rule px-5 py-5">
        <p className="label text-gold-600">Paranormal Musings</p>
        <p className="mt-1 font-display text-[19px] text-ink">Admin</p>
      </div>

      <nav className="flex-1 overflow-y-auto p-3">
        {LINKS.map((link) => {
          // "/" only matches itself; the rest match their whole subtree.
          const active = link.href === '/' ? pathname === '/' : pathname.startsWith(link.href)
          return (
            <Link
              key={link.href}
              href={link.href}
              aria-current={active ? 'page' : undefined}
              className={`mb-0.5 block rounded-lg px-3 py-2.5 transition-colors ${
                active ? 'bg-gold-50 text-ink' : 'text-body hover:bg-mist'
              }`}
            >
              <span className={`block text-[14px] ${active ? 'font-bold' : 'font-medium'}`}>{link.label}</span>
              <span className="mt-0.5 block text-[11.5px] leading-snug text-muted">{link.hint}</span>
            </Link>
          )
        })}
      </nav>

      <div className="space-y-2 border-t border-rule p-3">
        <a href={siteUrl} target="_blank" rel="noreferrer" className="btn-ghost btn-sm w-full">
          View the site ↗
        </a>
        <button type="button" onClick={signOut} className="btn-ghost btn-sm w-full">
          Sign out
        </button>
      </div>
    </aside>
  )
}
