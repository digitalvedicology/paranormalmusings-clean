import Image from 'next/image'
import Link from 'next/link'
import SectionLink from '../SectionLink'
import { artwork, getContent, type Category } from '@/lib/content'

/**
 * The prominent band: one lead story, a stack of three beside it, and a two-up
 * strip underneath. Shows the six most recent posts in whichever category it is
 * given, so the layout is not tied to any one of them.
 */
export default async function FeatureBand({ category }: { category: Category }) {
  const content = await getContent()
  const meta = content.categoryMeta(category)
  const [lead, ...rest] = content.postsIn(category).slice(0, 6)
  const side = rest.slice(0, 3)
  const strip = rest.slice(3, 5)

  // A band with nothing to lead on is a heading over empty space, so it drops
  // out of the page entirely rather than rendering hollow.
  if (!lead) return null

  return (
    <section id={category} className="scroll-mt-24">
      <div className="wrap py-12 lg:py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-display text-[26px] lg:text-[30px] text-ink">{meta.title}</h2>
          <SectionLink href={meta.href}>See all {meta.count} stories</SectionLink>
        </div>

        <div className="grid lg:grid-cols-[1.15fr_1fr] gap-8 lg:gap-12 reveal">
          {/* Lead story */}
          <article>
            <Link href={content.postHref(lead)} className="block">
              <div className="zoom-wrap relative rounded-2xl shadow-card h-[240px] sm:h-[330px] lg:h-[360px]">
                <Image
                  src={artwork(lead.image, lead.seed, 1200, 760)}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 53vw, 100vw"
                  className="object-cover moody"
                />
              </div>
              <p className="label text-gold-600 mt-5">{content.categoryLabel(lead)}</p>
              <h3 className="mt-2 font-display text-[27px] sm:text-[32px] leading-[1.15] text-ink hover-title">
                {lead.title}
              </h3>
              <p className="mt-3 max-w-2xl text-[15px] leading-relaxed">{lead.excerpt}</p>
              <div className="mt-4 flex items-center gap-2.5 text-[12.5px] text-muted">
                <Image src={artwork(content.site.authorImage, 'pm-praveen', 80, 80)} alt="" width={24} height={24} className="w-6 h-6 rounded-full object-cover moody-soft" />
                <span className="font-semibold text-ink/80">{content.site.author}</span>
                <span className="opacity-50">•</span>
                <span>{lead.date}</span>
                <span className="opacity-50">•</span>
                <span>{lead.readTime}</span>
              </div>
            </Link>
          </article>

          {/* Side stack */}
          <div className="flex flex-col divide-y divide-rule">
            {side.map((post, i) => (
              <Link key={post.slug} href={content.postHref(post)} className={`flex gap-5 ${['pb-6', 'py-6', 'pt-6'][i]}`}>
                <div className="zoom-wrap relative rounded-2xl shrink-0 w-[130px] sm:w-[168px] h-[104px] sm:h-[122px]">
                  <Image src={artwork(post.image, post.seed, 480, 360)} alt="" fill sizes="(min-width: 640px) 168px, 130px" className="object-cover moody" />
                </div>
                <div className="min-w-0">
                  <p className="label text-gold-600">{content.categoryLabel(post)}</p>
                  <h3 className="mt-1.5 font-display text-[19px] sm:text-[21px] leading-snug text-ink hover-title">
                    {post.title}
                  </h3>
                  <p className="mt-2.5 text-[12.5px] text-muted">
                    {post.date} <span className="opacity-50">•</span> {post.readTime}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Two-up strip */}
        <div className="mt-10 pt-10 border-t border-rule grid sm:grid-cols-2 gap-8 sm:gap-0 sm:divide-x divide-rule reveal">
          {strip.map((post, i) => (
            <Link key={post.slug} href={content.postHref(post)} className={`flex gap-5 ${i === 0 ? 'sm:pr-8' : 'sm:pl-8'}`}>
              <div className="zoom-wrap relative rounded-2xl shrink-0 w-[130px] sm:w-[150px] h-[100px] sm:h-[110px]">
                <Image src={artwork(post.image, post.seed, 480, 360)} alt="" fill sizes="(min-width: 640px) 150px, 130px" className="object-cover moody" />
              </div>
              <div className="min-w-0">
                <p className="label text-gold-600">{content.categoryLabel(post)}</p>
                <h3 className="mt-1.5 font-display text-[19px] leading-snug text-ink hover-title">{post.title}</h3>
                <p className="mt-2.5 text-[12.5px] text-muted">
                  {post.date} <span className="opacity-50">•</span> {post.readTime}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
