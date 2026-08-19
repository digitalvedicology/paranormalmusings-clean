import Link from 'next/link'
import PostGrid from './PostGrid'
import { artwork, getContent, type Category } from '@/lib/content'

/**
 * The blog index for a category: one featured piece across the top, the archive
 * as a three-up card grid with pagination, and a closing call to action that
 * runs straight into the footer as one dark block.
 *
 * A category's clusters and questions are still edited and stored in the admin
 * — this layout simply does not render them yet.
 */
export default async function CategoryHub({ category }: { category: Category }) {
  const content = await getContent()
  const meta = content.categoryMeta(category)
  const pillar = content.bySlug(content.hubPillar(category) ?? '')
  const rest = content.postsIn(category).filter((post) => post.slug !== pillar?.slug)

  return (
    <>
      {/* The visible heading is "Recent blog posts", so the page's real subject
          is carried here for screen readers and search engines. */}
      <h1 className="sr-only">{meta.title}</h1>

      {/* ── Featured ───────────────────────────────────────────────────── */}
      {pillar && (
        <div className="wrap pt-6 lg:pt-8">
          <Link href={content.postHref(pillar)} className="group block relative rounded-[16px] overflow-hidden zoom-wrap">
            <img
              src={artwork(pillar.image, pillar.seed, 1800, 1000)}
              alt=""
              className="w-full h-[340px] sm:h-[400px] lg:h-[470px] object-cover moody"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-night-900/90 via-night-900/45 to-night-900/10"
            />

            <div className="absolute inset-x-0 bottom-0 p-7 sm:p-10 lg:p-12">
              <div className="flex items-center justify-between gap-10">
                <div className="max-w-3xl">
                  <p className="text-[14px] font-medium text-white/85">Featured</p>
                  <h2 className="mt-3 font-display text-white text-[27px] sm:text-[36px] lg:text-[44px] leading-[1.14]">
                    {pillar.title}
                  </h2>
                  <p className="mt-5 max-w-xl text-[14px] lg:text-[15px] leading-[1.65] text-white/70">
                    {pillar.dek || pillar.excerpt}
                  </p>
                </div>

                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  className="hidden lg:block w-9 h-9 shrink-0 text-white transition-transform group-hover:translate-x-1.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 12h15M13 6l6 6-6 6" />
                </svg>
              </div>
            </div>
          </Link>
        </div>
      )}

      {/* ── The archive ────────────────────────────────────────────────── */}
      <section className="wrap pt-14 lg:pt-20 pb-16 lg:pb-24">
        <h2 className="font-display text-[22px] lg:text-[24px] text-ink mb-9">Recent blog posts</h2>
        <PostGrid posts={rest.map(content.toCard)} author={content.site.author} authorImage={content.site.authorImage} perPage={9} />
      </section>

      {/* ── Closing CTA — butts against the footer as one dark block ───── */}
      <section className="bg-night-900 text-white">
        <div className="wrap pt-16 lg:pt-20 pb-14 lg:pb-16 text-center">
          <h2 className="font-display text-[26px] sm:text-[32px] leading-tight">Still looking for an explanation?</h2>
          <p className="mt-4 max-w-xl mx-auto text-[15px] leading-relaxed text-white/60">
            Twenty-five years of case notes, and a reply to every message that arrives.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/contact"
              className="inline-flex items-center h-11 px-6 rounded-lg border border-white/25 text-[14px] font-semibold hover:bg-white/10 transition"
            >
              Chat to us
            </Link>
            <Link
              href="#newsletter"
              className="inline-flex items-center h-11 px-6 rounded-lg bg-gold-500 text-[14px] font-semibold hover:bg-gold-600 transition"
            >
              Get started
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
