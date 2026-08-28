import Link from 'next/link'
import SectionLink from '../SectionLink'
import { ArrowRight } from '../icons'
import { artwork, getContent } from '@/lib/content'

export default async function Highlights() {
  const content = await getContent()
  return (
    <section id="highlights" className="border-y border-rule scroll-mt-24">
      <div className="wrap py-10 lg:py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-display text-[24px] lg:text-[28px] text-ink">Today&rsquo;s Highlights</h2>
          <SectionLink href="#latest" className="hidden sm:inline-flex">
            View all highlights
          </SectionLink>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-7 reveal">
          {content.highlights.map((post) => (
            <Link
              key={post.slug}
              href={content.postHref(post)}
              className="card-lift group flex flex-col rounded-2xl border border-rule bg-paper overflow-hidden hover:shadow-card"
            >
              <div className="zoom-wrap relative">
                <img src={artwork(post.image, post.seed, 800, 500)} alt="" className="w-full h-[190px] object-cover" />
                <span className="absolute top-3 left-3 inline-flex items-center rounded-full bg-night-900/70 backdrop-blur px-3 py-1 label text-white">
                  {content.categoryLabel(post)}
                </span>
              </div>

              <div className="flex flex-1 flex-col p-5">
                <h3 className="font-display text-[19px] leading-snug text-ink hover-title">{post.title}</h3>

                {post.excerpt && <p className="mt-2.5 text-[13.5px] leading-relaxed text-muted">{post.excerpt}</p>}

                <div className="mt-4 pt-4 border-t border-rule/70 flex items-center gap-2.5 text-[12.5px] text-muted">
                  <img
                    src={artwork(content.site.authorImage, 'pm-praveen', 80, 80)}
                    alt=""
                    className="w-6 h-6 rounded-full object-cover"
                  />
                  <span className="font-semibold text-ink/85">{content.site.author}</span>
                  <span className="opacity-50">•</span>
                  <span>{post.readTime}</span>
                  <span className="ml-auto text-gold-600 transition-transform group-hover:translate-x-1">
                    <ArrowRight />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
