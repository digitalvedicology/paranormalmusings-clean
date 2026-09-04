import Link from 'next/link'
import type { ReactNode } from 'react'

/**
 * The banner every inner page opens with — a shortened version of the home
 * hero. It reuses the same drawn backdrops (`art-1` … `art-4`), fog and scrim,
 * so a page reads as the same publication without repeating the full slider.
 */
export default function PageHero({
  art,
  eyebrow,
  title,
  lede,
  meta,
  silhouette,
  children,
}: {
  art: string
  eyebrow: string
  title: string
  lede: string
  meta?: string
  silhouette?: ReactNode
  children?: ReactNode
}) {
  return (
    <section className="relative w-full overflow-hidden bg-night-900 text-white">
      <div className={`art ${art}`} style={{ transform: 'none' }}>
        {silhouette}
        <span className="fog fog-a" />
        <span className="fog fog-b" />
      </div>
      <div className="hslide-scrim" />

      <div className="wrap relative py-14 lg:py-20">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-[12.5px] text-white/45">
          <Link href="/" className="hover:text-white transition">
            Home
          </Link>
          <span className="opacity-50">/</span>
          <span className="text-white/75">{eyebrow}</span>
        </nav>

        <h1 className="mt-5 max-w-4xl font-extrabold tracking-[-0.03em] uppercase leading-[0.98] text-[34px] sm:text-[46px] lg:text-[58px]">
          {title}
        </h1>

        <p className="mt-5 max-w-2xl text-[15.5px] lg:text-[17px] leading-[1.65] text-white/70">{lede}</p>

        {meta && (
          <p className="mt-6 inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 label text-white">{meta}</p>
        )}

        {children}
      </div>
    </section>
  )
}
