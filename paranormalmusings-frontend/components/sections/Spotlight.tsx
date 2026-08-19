import Link from 'next/link'
import { ArrowRight } from '../icons'
import { artwork, getContent } from '@/lib/content'

export default async function Spotlight() {
  const content = await getContent()
  const spotlight = content.spotlight

  // The spotlight is a single chosen post; if it has been unpublished or
  // cleared in the admin, the band steps aside rather than rendering empty.
  if (!spotlight) return null

  const href = content.postHref(spotlight)

  return (
    <section id="cases" className="wrap mt-12 lg:mt-16 scroll-mt-24">
      <div className="relative overflow-hidden rounded-[28px] bg-night-800 text-white px-6 sm:px-10 lg:px-12 py-10 lg:py-12 reveal">
        {/* decorative orb */}
        <div className="pointer-events-none absolute -top-16 -right-16 w-64 h-64 rounded-full bg-gold-500 opacity-30 blur-[2px]" />
        <div className="pointer-events-none absolute -top-10 -right-10 w-52 h-52 rounded-full bg-night-800" />

        <h2 className="relative font-display text-[24px] lg:text-[26px] mb-7">Investigator&rsquo;s Spotlight</h2>

        <div className="relative grid lg:grid-cols-[1.05fr_1fr] gap-8 lg:gap-12 items-center">
          <Link href={href} className="zoom-wrap rounded-2xl block">
            <img
              src={artwork(spotlight.image, spotlight.seed, 1200, 760)}
              alt={spotlight.alt}
              className="w-full h-[240px] sm:h-[320px] object-cover moody"
            />
          </Link>

          <div>
            <p className="label text-gold-300">{content.categoryMeta(spotlight.category).title}</p>
            <h3 className="mt-3 font-display text-[28px] sm:text-[34px] leading-[1.15]">{spotlight.title}</h3>
            <p className="mt-4 text-[15px] leading-relaxed text-white/70 max-w-xl">{spotlight.excerpt}</p>
            <div className="mt-5 flex items-center gap-2.5 text-[12.5px] text-white/55">
              <img src={artwork(content.site.authorImage, 'pm-praveen', 80, 80)} alt="" className="w-6 h-6 rounded-full object-cover" />
              <span className="font-semibold text-white/85">{content.site.author}</span>
              <span className="opacity-50">•</span>
              <span>{spotlight.date}</span>
              <span className="opacity-50">•</span>
              <span>{spotlight.readTime}</span>
            </div>
            <Link
              href={href}
              className="link-arrow mt-7 inline-flex items-center gap-2 h-11 px-6 rounded-full bg-gold-500 text-white text-[14px] font-semibold hover:bg-gold-600 transition"
            >
              Read the story
              <ArrowRight />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
