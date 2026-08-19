import Link from 'next/link'
import SectionLink from '../SectionLink'
import { ArrowRight } from '../icons'
import { artwork, getContent } from '@/lib/content'

export default async function Investigation() {
  const content = await getContent()
  const meta = content.categoryMeta('investigation')
  return (
    <section id="investigation" className="bg-mist border-y border-rule scroll-mt-24">
      <div className="wrap py-12 lg:py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="label text-gold-600 mb-2">{meta.count} stories</p>
            <h2 className="font-display text-[26px] lg:text-[30px] text-ink">Paranormal Investigation</h2>
          </div>
          <SectionLink href={meta.href}>Field guide index</SectionLink>
        </div>

        <div className="bg-paper rounded-2xl border border-rule overflow-hidden reveal">
          {content.investigationRows.map((post, i) => (
            <Link
              key={post.slug}
              href={content.postHref(post)}
              className={`trend-row flex items-center gap-4 sm:gap-6 px-4 sm:px-6 py-4${
                i < content.investigationRows.length - 1 ? ' border-b border-rule' : ''
              }`}
            >
              <span className="w-8 shrink-0 font-extrabold text-[15px] text-ink/25 tabular-nums">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div className="zoom-wrap rounded-lg shrink-0 w-[62px] h-[44px] hidden sm:block">
                <img src={artwork(post.image, post.seed, 200, 140)} alt="" className="w-full h-full object-cover moody" />
              </div>
              <p className="label text-gold-600 w-[112px] shrink-0 hidden lg:block">{content.categoryLabel(post)}</p>
              <h3 className="flex-1 min-w-0 font-display text-[17px] sm:text-[18px] text-ink hover-title truncate">
                {post.title}
              </h3>
              <span className="hidden xl:block text-[13px] text-muted w-[130px] shrink-0">{content.site.author}</span>
              <span className="hidden sm:block text-[13px] text-muted w-[86px] shrink-0">{post.readTime}</span>
              <ArrowRight className="go w-4 h-4 shrink-0 text-ink" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
