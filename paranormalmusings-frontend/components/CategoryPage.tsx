import Link from 'next/link'
import PageHero from './PageHero'
import PostCard from './PostCard'
import SectionLink from './SectionLink'
import { ArrowRight } from './icons'
import { silhouetteFor } from './hero/heroSlides'
import Newsletter from './sections/Newsletter'
import { artwork, getContent, type Category } from '@/lib/content'

/**
 * All four category pages are the same page with different content, so they
 * share one component: banner, lead story, archive grid, then the way across
 * to the other three perspectives.
 */
export default async function CategoryPage({ category }: { category: Category }) {
  const content = await getContent()
  const meta = content.categoryMeta(category)
  const [lead, ...rest] = content.postsIn(category)
  const others = content.categoryOrder.filter((key) => key !== category)

  return (
    <>
      <PageHero
        art={meta.art}
        eyebrow={meta.label}
        title={meta.title}
        lede={meta.lede}
        meta={`${meta.count} stories · ${content.site.author}`}
        silhouette={silhouetteFor(meta.art)}
      />

      {/* Lead story. A section can be emptied from the admin, so this is
          conditional rather than assumed. */}
      {lead && (
      <section className="wrap py-12 lg:py-16">
        <div className="grid lg:grid-cols-[1.1fr_1fr] gap-8 lg:gap-12 items-center reveal">
          <Link href={content.postHref(lead)} className="zoom-wrap rounded-2xl shadow-card block">
            <img
              src={artwork(lead.image, lead.seed, 1200, 760)}
              alt=""
              className="w-full h-[240px] sm:h-[340px] lg:h-[400px] object-cover moody"
            />
          </Link>
          <div>
            <p className="label text-gold-600">Latest in {meta.label}</p>
            <h2 className="mt-3 font-display text-[28px] sm:text-[36px] leading-[1.14] text-ink">
              <Link href={content.postHref(lead)} className="hover-title">
                {lead.title}
              </Link>
            </h2>
            <p className="mt-4 max-w-xl text-[15.5px] leading-[1.7]">{lead.excerpt}</p>
            <div className="mt-5 flex items-center gap-2.5 text-[12.5px] text-muted">
              <img src={artwork(content.site.authorImage, 'pm-praveen', 80, 80)} alt="" className="w-6 h-6 rounded-full object-cover moody-soft" />
              <span className="font-semibold text-ink/80">{content.site.author}</span>
              <span className="opacity-50">•</span>
              <span>{lead.date}</span>
              <span className="opacity-50">•</span>
              <span>{lead.readTime}</span>
            </div>
            <Link
              href={content.postHref(lead)}
              className="link-arrow mt-7 inline-flex items-center gap-2 h-11 px-6 rounded-full bg-gold-500 text-white text-[14px] font-semibold hover:bg-gold-600 transition shadow-soft"
            >
              Read the story
              <ArrowRight />
            </Link>
          </div>
        </div>
      </section>
      )}

      {/* Archive grid */}
      <section className="border-t border-rule">
        <div className="wrap py-12 lg:py-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-display text-[26px] lg:text-[30px] text-ink">All {meta.label}</h2>
            <SectionLink href="/" className="hidden sm:inline-flex">
              Back to the front page
            </SectionLink>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-7 gap-y-10 reveal">
            {rest.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>

          {/* Pagination */}
          {meta.count > rest.length + 1 && (
            <div className="mt-12 flex items-center justify-center gap-2">
              <span className="grid place-items-center w-10 h-10 rounded-full bg-ink text-white text-[14px] font-semibold">
                1
              </span>
              {['2', '3'].map((page) => (
                <a
                  key={page}
                  href="#"
                  className="grid place-items-center w-10 h-10 rounded-full border border-rule text-ink text-[14px] font-semibold hover:border-ink/25 transition"
                >
                  {page}
                </a>
              ))}
              <span className="px-1 text-muted">…</span>
              <a
                href="#"
                aria-label="Next page"
                className="ml-1 grid place-items-center w-10 h-10 rounded-full border border-rule text-ink hover:border-ink/25 transition"
              >
                <ArrowRight />
              </a>
            </div>
          )}
        </div>
      </section>

      {/* The other perspectives */}
      <section className="bg-mist border-y border-rule">
        <div className="wrap py-12 lg:py-16">
          <h2 className="font-display text-[26px] lg:text-[30px] text-ink mb-8">Read on</h2>
          <div className="grid sm:grid-cols-3 gap-5 lg:gap-7 reveal">
            {others.map((key) => {
              const other = content.categoryMeta(key)
              return (
                <Link
                  key={key}
                  href={other.href}
                  className="card-lift rounded-2xl border border-rule bg-paper overflow-hidden hover:shadow-card"
                >
                  <div className="zoom-wrap">
                    <img src={artwork(other.image, other.seed, 600, 440)} alt="" className="w-full h-[150px] object-cover moody" />
                  </div>
                  <div className="p-5">
                    <p className="label text-gold-600">{other.count} articles</p>
                    <h3 className="mt-2 font-display text-[19px] text-ink hover-title">{other.title}</h3>
                    <p className="mt-2 text-[13.5px] leading-relaxed text-muted">{other.blurb}</p>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      <div className="pt-12 lg:pt-16">
        <Newsletter />
      </div>
    </>
  )
}
