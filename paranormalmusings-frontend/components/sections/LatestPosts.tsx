import PostCard from '../PostCard'
import SectionLink from '../SectionLink'
import { ArrowRight } from '../icons'
import { getContent } from '@/lib/content'

export default async function LatestPosts() {
  const content = await getContent()
  return (
    <section id="latest" className="scroll-mt-24">
      <div className="wrap py-12 lg:py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-display text-[26px] lg:text-[30px] text-ink">Latest Posts</h2>
          <SectionLink href="/western-views">Browse the archive</SectionLink>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-7 gap-y-10 reveal">
          {content.latestPosts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>

        {/* Pagination */}
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
            className="grid place-items-center w-10 h-10 rounded-full border border-rule text-ink text-[14px] font-semibold hover:border-ink/25 transition"
          >
            13
          </a>
          <a
            href="#"
            aria-label="Next page"
            className="ml-1 grid place-items-center w-10 h-10 rounded-full border border-rule text-ink hover:border-ink/25 transition"
          >
            <ArrowRight />
          </a>
        </div>
      </div>
    </section>
  )
}
