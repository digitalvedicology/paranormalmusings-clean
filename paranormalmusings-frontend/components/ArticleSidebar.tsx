import Image from 'next/image'
import Link from 'next/link'
import SubscribeForm from './SubscribeForm'
import { artwork, getContent, type Post } from '@/lib/content'

/** A boxed sidebar widget — hairline card, small caps heading. */
function Widget({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-rule bg-paper p-6">
      <h2 className="label text-ink pb-4 border-b border-rule">{title}</h2>
      <div className="mt-5">{children}</div>
    </section>
  )
}

/**
 * The rail beside an article: who wrote it, the opt-in, what else to read, and
 * the ways into the archive. Sticks once the article scrolls past it.
 */
export default async function ArticleSidebar({ post }: { post: Post }) {
  const content = await getContent()
  const popular = content.footerPopular.filter((other) => other.slug !== post.slug).slice(0, 5)

  return (
    <div className="lg:sticky lg:top-[98px] grid gap-6">
      {/* About the author */}
      <Widget title="About the author">
        <div className="flex items-center gap-4">
          <Image
            src={artwork(content.site.authorImage, 'pm-praveen', 160, 160)}
            alt={content.site.author}
            width={56}
            height={56}
            className="w-14 h-14 rounded-full object-cover moody-soft shrink-0"
          />
          <div>
            <p className="font-display text-[18px] text-ink">{content.site.author}</p>
            <p className="text-[12.5px] text-muted">Paranormal investigator</p>
          </div>
        </div>
        <p className="mt-4 text-[13.5px] leading-relaxed text-muted">
          Twenty-five years in the field, writing on life after death from Indian (Eastern) and Western viewpoints.
        </p>
        <Link
          href="/about"
          className="mt-4 inline-flex items-center h-9 px-4 rounded-full border border-rule text-[13px] font-semibold text-ink hover:bg-mist transition"
        >
          Read the full bio
        </Link>
      </Widget>

      {/* Email opt-in — the one accented card in the rail */}
      <section className="rounded-2xl bg-night-800 text-white p-6">
        <p className="label text-gold-300">Newsletter</p>
        <h2 className="mt-2.5 font-display text-[21px] leading-snug">Notes from the field, once a week</h2>
        <p className="mt-2.5 text-[13.5px] leading-relaxed text-white/60">
          New investigations, case notes and perspectives on life after death.
        </p>
        <SubscribeForm variant="sidebar" />
      </section>

      {/* Popular posts */}
      <Widget title="Popular posts">
        <ol className="grid gap-4">
          {popular.map((other, i) => (
            <li key={other.slug}>
              <Link href={content.postHref(other)} className="flex gap-3.5 group">
                <span className="w-5 shrink-0 pt-0.5 font-extrabold text-[13px] text-ink/20 tabular-nums">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="zoom-wrap relative rounded-lg shrink-0 w-[54px] h-[54px]">
                  <Image src={artwork(other.image, other.seed, 160, 160)} alt="" fill sizes="54px" className="object-cover moody" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-display text-[14.5px] leading-snug text-ink hover-title">{other.title}</h3>
                  <p className="mt-1 text-[12px] text-muted">{other.readTime}</p>
                </div>
              </Link>
            </li>
          ))}
        </ol>
      </Widget>

      {/* Categories */}
      <Widget title="Categories">
        <ul className="grid gap-1">
          {content.categoryOrder.map((key) => {
            const category = content.categoryMeta(key)
            const current = key === post.category
            return (
              <li key={key}>
                <Link
                  href={category.href}
                  aria-current={current ? 'page' : undefined}
                  className={`flex items-center justify-between gap-3 py-2.5 border-b border-rule/70 last:border-0 text-[14px] transition-colors ${
                    current ? 'text-gold-600 font-semibold' : 'text-ink hover:text-gold-600'
                  }`}
                >
                  {category.title}
                  <span className="text-[12.5px] text-muted tabular-nums">{category.count}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </Widget>

      {/* Topics */}
      <Widget title="Topics">
        <div className="flex flex-wrap gap-2">
          {content.topics.map((topic) => (
            <Link
              key={topic.label}
              href={topic.href}
              className="chip px-3 py-1.5 rounded-full bg-mist text-[12.5px] font-medium text-ink"
            >
              {topic.label}
            </Link>
          ))}
        </div>
      </Widget>
    </div>
  )
}
