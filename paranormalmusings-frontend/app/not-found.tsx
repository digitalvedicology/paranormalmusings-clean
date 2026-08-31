import Link from 'next/link'
import { getContent } from '@/lib/content'

/**
 * Custom 404 page for missing articles after URL migration.
 * Shows site search, recent categories, and helpful links.
 */

export default async function NotFound() {
  const content = await getContent()

  return (
    <div className="wrap py-16 lg:py-24">
      <div className="max-w-2xl">
        {/* Error heading */}
        <div className="mb-12">
          <h1 className="font-display text-[56px] sm:text-[72px] lg:text-[96px] leading-[0.9] text-ink mb-4">
            404
          </h1>
          <p className="text-[18px] sm:text-[20px] leading-[1.6] text-muted max-w-xl">
            The article you're looking for has either been moved, renamed, or doesn't exist.
          </p>
        </div>

        {/* Search suggestion */}
        <div className="mb-12 p-6 sm:p-8 rounded-2xl bg-mist border border-divider">
          <p className="text-[14px] font-medium text-ink mb-4">Try searching for it:</p>
          <div className="flex items-center gap-3 bg-paper rounded-lg border border-divider px-4 py-3">
            <svg className="w-5 h-5 text-muted shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="search"
              placeholder="Search articles…"
              className="flex-1 outline-none bg-transparent text-ink placeholder:text-muted"
              onFocus={(e) => {
                // Trigger search overlay if it exists
                const searchButton = document.querySelector('[aria-label="Search"]') as HTMLButtonElement
                if (searchButton) searchButton.click()
                e.target.blur()
              }}
            />
          </div>
        </div>

        {/* Categories */}
        <div className="mb-12">
          <h2 className="font-display text-[22px] text-ink mb-6">Explore by category</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {content.categories.map((category) => {
              const meta = content.categoryMeta(category.key)
              return (
                <Link
                  key={category.key}
                  href={meta.href}
                  className="group p-5 rounded-xl border border-divider hover:border-ink/25 hover:bg-mist transition"
                >
                  <h3 className="font-display text-[16px] text-ink group-hover:text-gold-600 transition mb-2">
                    {meta.title}
                  </h3>
                  <p className="text-[13px] text-muted">{meta.count} articles</p>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Quick links */}
        <div>
          <h2 className="font-display text-[22px] text-ink mb-6">Or go to</h2>
          <div className="flex flex-wrap gap-3">
            <Link href="/" className="px-6 py-3 rounded-full bg-ink text-paper font-medium text-[14px] hover:opacity-90 transition">
              Home
            </Link>
            <Link href="/about" className="px-6 py-3 rounded-full border border-ink text-ink font-medium text-[14px] hover:bg-mist transition">
              About
            </Link>
          </div>
        </div>

        {/* Help text */}
        <p className="mt-12 text-[13px] leading-[1.7] text-muted">
          If you clicked a link that brought you here, it may have changed during our site redesign.{' '}
          <span className="text-ink font-medium">
            Try the search above or browse the categories
          </span>
          . If the problem persists, feel free to{' '}
          <Link href="#contact" className="text-ink hover:underline">
            get in touch
          </Link>
          .
        </p>
      </div>
    </div>
  )
}
