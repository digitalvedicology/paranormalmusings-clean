import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import PostGrid from '@/components/PostGrid'
import { getTopic, getPostsByTopic, getAllTopics } from '@/lib/tags'
import { getContent } from '@/lib/content'
import WriteToUs from '@/components/sections/WriteToUs'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const topic = getTopic(slug)
  if (!topic) return { title: 'Not Found' }

  return {
    title: `${topic.label} · Paranormal Musings`,
    description: topic.description,
    openGraph: {
      title: `${topic.label} · Paranormal Musings`,
      description: topic.description,
      type: 'website',
      url: `https://paranormalmusings.com/topics/${slug}`,
    },
  }
}

export async function generateStaticParams() {
  return getAllTopics().map((topic) => ({
    slug: topic.slug,
  }))
}

export default async function TopicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const topic = getTopic(slug)
  if (!topic) notFound()

  const posts = await getPostsByTopic(slug)
  const content = await getContent()

  return (
    <>
      {/* Header */}
      <section className="bg-night-900 text-white py-12 lg:py-16">
        <div className="wrap">
          <nav className="text-sm text-white/60 mb-4 flex items-center gap-2">
            <Link href="/" className="hover:text-white transition">
              Home
            </Link>
            <span>/</span>
            <span className="text-white">{topic.label}</span>
          </nav>
          <h1 className="font-display text-4xl lg:text-5xl mb-4">{topic.label}</h1>
          <p className="text-lg text-white/70 max-w-2xl">{topic.description}</p>
          <p className="mt-4 text-sm text-white/50">
            {posts.length} {posts.length === 1 ? 'post' : 'posts'} tagged with {topic.label}
          </p>
        </div>
      </section>

      {/* Posts */}
      <section className="wrap py-12 lg:py-16">
        {posts.length > 0 ? (
          <PostGrid posts={posts.map(content.toCard)} author={content.site.author} authorImage={content.site.authorImage} />
        ) : (
          <div className="text-center py-12">
            <p className="text-body mb-6">No posts found with this tag yet.</p>
            <Link href="/" className="text-gold-500 hover:text-gold-400 font-semibold">
              ← Back to home
            </Link>
          </div>
        )}
      </section>

      {/* Related tags */}
      <section className="wrap py-12 lg:py-16 border-t border-rule">
        <h2 className="font-display text-2xl mb-8">Explore Other Topics</h2>
        <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {getAllTopics()
            .filter((t) => t.slug !== slug)
            .map((t) => (
              <Link
                key={t.slug}
                href={`/topics/${t.slug}`}
                className="group p-4 rounded-lg border border-rule hover:border-gold-500 bg-paper hover:bg-paper/80 transition"
              >
                <h3 className="font-semibold text-ink group-hover:text-gold-500 transition mb-1">
                  {t.label}
                </h3>
                <p className="text-sm text-body/70 group-hover:text-body transition">{t.description}</p>
              </Link>
            ))}
        </div>
      </section>

      <WriteToUs />
    </>
  )
}
