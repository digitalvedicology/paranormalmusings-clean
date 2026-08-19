import Link from 'next/link'
import { artwork, getContent, type Post } from '@/lib/content'

/** The standard grid card, shared by the home page and every category page. */
export default async function PostCard({
  post,
  imageHeight = 'h-[190px]',
}: {
  post: Post
  imageHeight?: string
}) {
  const content = await getContent()

  return (
    <Link href={content.postHref(post)} className="card-lift">
      <div className="zoom-wrap rounded-2xl shadow-card">
        <img src={artwork(post.image, post.seed, 800, 560)} alt="" className={`w-full ${imageHeight} object-cover moody`} />
      </div>
      <p className="label text-gold-600 mt-4">{content.categoryLabel(post)}</p>
      <h3 className="mt-2 font-display text-[20px] leading-snug text-ink hover-title">{post.title}</h3>
      {post.excerpt && <p className="mt-2.5 text-[14.5px] leading-relaxed">{post.excerpt}</p>}
      <p className="mt-3 text-[12.5px] text-muted">
        {post.date} <span className="opacity-50">•</span> {post.readTime}
      </p>
    </Link>
  )
}
