import Image from 'next/image'
import Link from 'next/link'
import PostCard from '../PostCard'
import SectionLink from '../SectionLink'
import { artwork, getContent, type Category } from '@/lib/content'

/**
 * The quieter band: three cards over a compact three-up list. Like FeatureBand
 * it takes whichever category it is given and shows that category's six most
 * recent posts.
 */
export default async function CardBand({ category }: { category: Category }) {
  const content = await getContent()
  const meta = content.categoryMeta(category)
  const recent = content.postsIn(category).slice(0, 6)
  const cards = recent.slice(0, 3)
  const compact = recent.slice(3, 6)

  // An emptied section would leave a heading over a blank grid.
  if (!recent.length) return null

  return (
    <section id={category} className="scroll-mt-24">
      <div className="wrap py-12 lg:py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="label text-gold-600 mb-2">{meta.count} stories</p>
            <h2 className="font-display text-[26px] lg:text-[30px] text-ink">{meta.title}</h2>
          </div>
          <SectionLink href={meta.href}>See all</SectionLink>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7 reveal">
          {cards.map((post) => (
            <PostCard key={post.slug} post={post} imageHeight="h-[210px]" />
          ))}
        </div>

        {/* compact list */}
        <div className="mt-10 pt-8 border-t border-rule grid md:grid-cols-3 gap-6 md:gap-0 md:divide-x divide-rule reveal">
          {compact.map((post, i) => (
            <Link key={post.slug} href={content.postHref(post)} className={`flex gap-4 ${['md:pr-7', 'md:px-7', 'md:pl-7'][i]}`}>
              <div className="zoom-wrap relative rounded-xl shrink-0 w-[74px] h-[74px]">
                <Image src={artwork(post.image, post.seed, 240, 240)} alt="" fill sizes="74px" className="object-cover moody" />
              </div>
              <div>
                <h3 className="font-display text-[17px] leading-snug text-ink hover-title">{post.title}</h3>
                <p className="mt-2 text-[12.5px] text-muted">{post.date}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
