import Link from 'next/link'
import ArticleSidebar from './ArticleSidebar'
import CommentForm from './CommentForm'
import PostCard from './PostCard'
import SectionLink from './SectionLink'
import { artwork, articleSections, getContent, headingId, type Block, type Post } from '@/lib/content'

/* ── Prose ─────────────────────────────────────────────────────────────── */

function Prose({ blocks }: { blocks: Block[] }) {
  return (
    <>
      {blocks.map((block, i) =>
        block.type === 'quote' ? (
          <blockquote key={i} className="my-10">
            <span aria-hidden="true" className="block w-10 h-px bg-gold-500" />
            <p className="mt-5 font-display text-[22px] sm:text-[25px] leading-[1.45] text-ink">{block.text}</p>
          </blockquote>
        ) : block.type === 'h3' ? (
          <h3
            key={i}
            id={headingId(block.text)}
            className="mt-10 font-display text-[19px] sm:text-[21px] leading-[1.35] text-ink scroll-mt-24"
          >
            {block.text}
          </h3>
        ) : block.type === 'list' ? (
          <ul key={i} className="mt-6 grid gap-2.5">
            {block.items.map((item) => (
              <li key={item} className="flex gap-3 text-[16.5px] leading-[1.7]">
                <span aria-hidden="true" className="mt-[11px] w-1.5 h-1.5 rounded-full bg-gold-500 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        ) : block.type === 'image' ? (
          /* Held to the width of the text it sits in. The height follows the
             picture's own proportions — nothing is cropped. */
          <figure key={i} className="my-9">
            <div className="zoom-wrap rounded-2xl shadow-card">
              <img src={block.src} alt={block.alt} className="w-full moody" />
            </div>
            {block.caption ? (
              <figcaption className="mt-3 text-center text-[13.5px] leading-relaxed text-muted">
                {block.caption}
              </figcaption>
            ) : null}
          </figure>
        ) : block.type === 'p' ? (
          <p key={i} className="mt-6 text-[16.5px] leading-[1.8]">
            {block.text}
          </p>
        ) : null,
      )}
    </>
  )
}

/** Small meta item with its icon, for the row under the headline. */
function Meta({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <svg viewBox="0 0 24 24" className="w-[15px] h-[15px] text-gold-500" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        {icon}
      </svg>
      {children}
    </span>
  )
}

/* ── Page ──────────────────────────────────────────────────────────────── */

export default async function ArticlePage({ post }: { post: Post }) {
  const content = await getContent()
  const meta = content.categoryMeta(post.category)
  const { intro, sections } = articleSections(post.body)
  const related = content.relatedPosts(post)

  return (
    <>
      <div className="wrap pt-8 lg:pt-10 pb-14 lg:pb-20">
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-[12.5px] text-muted">
          <Link href="/" className="hover:text-ink transition">
            Home
          </Link>
          <span className="opacity-50">/</span>
          <Link href={meta.href} className="hover:text-ink transition">
            {meta.title}
          </Link>
        </nav>

        <div className="mt-7 grid gap-10 lg:gap-14 lg:grid-cols-[minmax(0,1fr)_330px] xl:grid-cols-[minmax(0,1fr)_352px]">
          {/* ── MAIN CONTENT ─────────────────────────────────────────── */}
          <article>
            {/* The featured image opens the piece when it is the lead. */}
            {post.imagePlacement === 'lead' && (
              <div className="mb-8 rounded-2xl overflow-hidden shadow-card">
                <img
                  src={artwork(post.image, post.seed, 1600, 900)}
                  alt=""
                  className="w-full moody"
                />
              </div>
            )}

            {/* Title & meta */}
            <div className="flex flex-wrap items-center gap-2">
              <Link
                href={meta.href}
                className="inline-flex items-center h-7 px-3.5 rounded-full bg-gold-500 text-white label hover:bg-gold-600 transition"
              >
                {meta.label}
              </Link>
              {post.alsoIn?.map((key) => (
                <Link
                  key={key}
                  href={content.categoryMeta(key).href}
                  className="inline-flex items-center h-7 px-3.5 rounded-full border border-rule text-ink label hover:bg-mist transition"
                >
                  {content.categoryMeta(key).label}
                </Link>
              ))}
            </div>

            <h1 className="mt-5 font-display text-[31px] sm:text-[40px] lg:text-[46px] leading-[1.13] text-ink">
              {post.title}
            </h1>

            {post.dek && <p className="mt-5 max-w-3xl text-[17px] lg:text-[18px] leading-[1.6] text-muted">{post.dek}</p>}

            <div className="mt-7 py-4 border-y border-rule flex flex-wrap items-center gap-x-6 gap-y-3 text-[13px] text-muted">
              <span className="inline-flex items-center gap-2.5">
                <img src={artwork(content.site.authorImage, 'pm-praveen', 80, 80)} alt="" className="w-7 h-7 rounded-full object-cover moody-soft" />
                <span className="font-semibold text-ink">{content.site.author}</span>
              </span>
              <Meta icon={<><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M8 3v4M16 3v4M3 11h18" /></>}>
                {post.date}
              </Meta>
              <Meta icon={<><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>}>{post.readTime}</Meta>
              <Meta icon={<path d="M21 12a8 8 0 0 1-11.5 7.2L3 21l1.8-6.5A8 8 0 1 1 21 12Z" />}>0 comments</Meta>
            </div>

            {/* Featured image, in its usual place under the byline row. */}
            {post.imagePlacement === 'standard' && (
              <div className="mt-8 rounded-2xl overflow-hidden shadow-card">
                <img
                  src={artwork(post.image, post.seed, 1600, 900)}
                  alt=""
                  className="w-full moody"
                />
              </div>
            )}

            {/* Article body */}
            <div className="mt-9">
              <Prose blocks={intro} />

              {sections.map((section) =>
                section.tone === 'note' ? (
                  <section key={section.id} className="mt-12 rounded-2xl border border-rule bg-mist p-6 sm:p-8 scroll-mt-24">
                    <p className="label text-gold-600">A note from the investigator</p>
                    <h2 id={section.id} className="mt-3 font-display text-[23px] sm:text-[26px] leading-[1.3] text-ink scroll-mt-24">
                      {section.title}
                    </h2>
                    <Prose blocks={section.blocks} />
                  </section>
                ) : (
                  <section key={section.id} className="scroll-mt-24">
                    <h2
                      id={section.id}
                      className="mt-12 font-display text-[25px] sm:text-[29px] leading-[1.3] text-ink scroll-mt-24"
                    >
                      {section.title}
                    </h2>
                    <Prose blocks={section.blocks} />
                  </section>
                ),
              )}
            </div>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="mt-12 pt-7 border-t border-rule flex flex-wrap items-center gap-2">
                <span className="label text-muted mr-1">Tags</span>
                {post.tags.map((tag) => (
                  <span key={tag} className="px-3.5 py-1.5 rounded-full bg-mist text-[12.5px] text-body">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Author bio */}
            <div className="mt-10 rounded-2xl border border-rule p-6 sm:p-7 flex flex-col sm:flex-row gap-5">
              <img
                src={artwork(content.site.authorImage, 'pm-praveen', 200, 200)}
                alt={content.site.author}
                className="w-16 h-16 rounded-full object-cover shrink-0 moody-soft"
              />
              <div>
                <p className="label text-gold-600">Written by</p>
                <h2 className="mt-1.5 font-display text-[21px] text-ink">{content.site.author}</h2>
                <p className="mt-2 text-[14.5px] leading-relaxed text-muted">
                  Paranormal investigator for more than twenty-five years, writing on life after death from Indian
                  (Eastern) and Western viewpoints, encounters with inhuman energies, and the paranormal energy
                  spectrum.
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-5">
                  <SectionLink href="/about">More about the work</SectionLink>
                  <SectionLink href="/contact">Get in touch</SectionLink>
                </div>
              </div>
            </div>

            {/* Comments */}
            <section className="mt-12 pt-8 border-t border-rule">
              <h2 className="font-display text-[24px] text-ink">Comments</h2>
              <div className="mt-5 rounded-2xl border border-dashed border-rule px-6 py-8 text-center">
                <p className="text-[15px] text-muted">
                  No comments on this story yet — yours would be the first.
                </p>
              </div>
              <h3 className="mt-10 font-display text-[20px] text-ink">Leave a reply</h3>
              <CommentForm />
            </section>
          </article>

          {/* ── SIDEBAR ──────────────────────────────────────────────── */}
          <aside>
            <ArticleSidebar post={post} />
          </aside>
        </div>
      </div>

      {/* ── Read next ──────────────────────────────────────────────────── */}
      {related.length > 0 && (
        <section className="bg-mist border-t border-rule">
          <div className="wrap py-14 lg:py-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-display text-[24px] lg:text-[28px] text-ink">Read next</h2>
              <SectionLink href={meta.href} className="hidden sm:inline-flex">
                All {meta.count} stories
              </SectionLink>
            </div>
            <div className="grid sm:grid-cols-3 gap-7 reveal">
              {related.map((other) => (
                <PostCard key={other.slug} post={other} imageHeight="h-[180px]" />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
