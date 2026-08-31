import Image from 'next/image'
import Link from 'next/link'
import SectionLink from '../SectionLink'
import { artwork, getContent } from '@/lib/content'

export default async function Highlights() {
  const content = await getContent()
  return (
    <section id="highlights" className="border-y border-rule scroll-mt-24">
      <div className="wrap py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-[22px] lg:text-[24px] text-ink">Today&rsquo;s Highlights</h2>
          <SectionLink href="#latest" className="hidden sm:inline-flex">
            View all highlights
          </SectionLink>
        </div>

        <div className="grid md:grid-cols-3 gap-6 md:gap-0 md:divide-x divide-rule reveal">
          {content.highlights.map((post, i) => (
            <Link key={post.slug} href={content.postHref(post)} className={`flex gap-4 ${['md:pr-7', 'md:px-7', 'md:pl-7'][i]}`}>
              <div className="zoom-wrap relative rounded-xl shrink-0 w-[86px] h-[86px]">
                <Image src={artwork(post.image, post.seed, 240, 240)} alt="" fill sizes="86px" className="object-cover moody" />
              </div>
              <div className="min-w-0">
                <p className="label text-gold-600">{content.categoryLabel(post)}</p>
                <h3 className="mt-1.5 font-display text-[17px] leading-snug text-ink hover-title">{post.title}</h3>
                <p className="mt-2 text-[12.5px] text-muted">
                  {content.site.author} <span className="opacity-50">•</span> {post.readTime}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
