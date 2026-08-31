import Image from 'next/image'
import Link from 'next/link'
import SectionLink from '../SectionLink'
import { artwork, getContent } from '@/lib/content'

/** The card artwork for each section, used unless the admin sets its own. */
const CARD_IMAGE: Record<string, string> = {
  eastern: '/images/four-ways-in/eastern.webp',
  western: '/images/four-ways-in/western.webp',
  investigation: '/images/four-ways-in/investigation.webp',
  cases: '/images/four-ways-in/cases.webp',
}

/** Alt text for category card images */
const CARD_ALT: Record<string, string> = {
  eastern: 'Hindu temple architecture representing Eastern spiritual perspectives',
  western: 'Western paranormal investigation concept imagery',
  investigation: 'Paranormal investigation equipment and techniques visualization',
  cases: 'Paranormal case study documentation and research records',
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
              {/* The height moves onto the frame so the space is held before
                  the picture lands — and so the picture can fill it. */}
              <div className="zoom-wrap relative h-[150px] sm:h-[170px]">
                <Image
                  src={artwork(category.image || CARD_IMAGE[key], category.seed, 600, 440)}
                  alt={CARD_ALT[key] || category.title}
                  fill
                  sizes="(min-width: 1024px) 23vw, 47vw"
                  className="object-cover moody"
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
