import Link from 'next/link'
import SectionLink from '../SectionLink'
import { artwork, getContent } from '@/lib/content'

/** The card artwork for each section, used unless the admin sets its own. */
const CARD_IMAGE: Record<string, string> = {
  eastern: '/images/four-ways-in/eastern.png',
  western: '/images/four-ways-in/western.png',
  investigation: '/images/four-ways-in/investigation.png',
  cases: '/images/four-ways-in/cases.png',
}

export default async function FourWaysIn() {
  const content = await getContent()
  return (
    <section className="wrap py-12 lg:py-16">
      <div className="flex items-center justify-between mb-8">
        <h2 className="font-display text-[26px] lg:text-[30px] text-ink">Four Ways In</h2>
        <SectionLink href="/about" className="hidden sm:inline-flex">
          All categories
        </SectionLink>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-7 reveal">
        {content.categoryOrder.map((key) => {
          const category = content.categoryMeta(key)
          return (
            <Link
              key={key}
              href={category.href}
              className="card-lift rounded-2xl border border-rule bg-paper overflow-hidden hover:shadow-card"
            >
              <div className="zoom-wrap">
                <img
                  src={artwork(category.image || CARD_IMAGE[key], category.seed, 600, 440)}
                  alt=""
                  className="w-full h-[150px] sm:h-[170px] object-cover moody"
                />
              </div>
              <div className="p-5">
                <p className="label text-gold-600">{category.count} articles</p>
                <h3 className="mt-2 font-display text-[19px] text-ink hover-title">{category.title}</h3>
                <p className="mt-2 text-[13.5px] leading-relaxed text-muted">{category.blurb}</p>
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
