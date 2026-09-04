import Link from 'next/link'

/**
 * The category tab strip — the same underlined treatment the public site uses
 * to switch between Eastern Views and Western Views, reused here so the admin
 * is navigated the way the site is read.
 *
 * Links rather than buttons: each tab is a real URL, so a filtered list can be
 * bookmarked, opened in a new tab, and survives a refresh.
 */
export default function Tabs({
  tabs,
  active,
}: {
  tabs: { key: string; label: string; href: string; count?: number }[]
  active: string
}) {
  return (
    <div className="border-b border-rule">
      <nav className="-mb-px flex gap-1 overflow-x-auto" aria-label="Pages">
        {tabs.map((tab) => {
          const current = tab.key === active
          return (
            <Link
              key={tab.key}
              href={tab.href}
              aria-current={current ? 'page' : undefined}
              className={`shrink-0 border-b-2 px-4 py-3 text-[14.5px] transition-colors ${
                current
                  ? 'border-gold-600 font-bold text-ink'
                  : 'border-transparent font-medium text-muted hover:border-rule hover:text-ink'
              }`}
            >
              {tab.label}
              {tab.count !== undefined ? (
                <span className={`ml-2 text-[12px] ${current ? 'text-gold-600' : 'text-muted/70'}`}>{tab.count}</span>
              ) : null}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
