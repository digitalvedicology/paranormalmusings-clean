import PostGrid from '../PostGrid'
import SectionLink from '../SectionLink'
import { getContent } from '@/lib/content'

export default async function LatestPosts() {
  const content = await getContent()

  // Page one stays the curated six; the rest of the archive follows behind
  // them, so the numbered pages now walk the whole catalogue instead of being
  // decorative.
  const curated = content.latestPosts
  const curatedSlugs = new Set(curated.map((post) => post.slug))
  const cards = [...curated, ...content.posts.filter((post) => !curatedSlugs.has(post.slug))].map(content.toCard)

  return (
    <section id="latest" className="scroll-mt-24">
      <div className="wrap py-12 lg:py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-display text-[26px] lg:text-[30px] text-ink">Latest Posts</h2>
          <SectionLink href="/western-views">Browse the archive</SectionLink>
        </div>

        <PostGrid posts={cards} author={content.site.author} authorImage={content.site.authorImage} perPage={6} />
      </div>
    </section>
  )
}
