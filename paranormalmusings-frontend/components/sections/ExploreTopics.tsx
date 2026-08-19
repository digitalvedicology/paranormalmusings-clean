import Link from 'next/link'
import { TopicIcon } from '../icons'
import { getContent } from '@/lib/content'

export default async function ExploreTopics() {
  const content = await getContent()
  return (
    <section className="wrap">
      <div className="rounded-[28px] bg-gradient-to-br from-gold-50 via-mist to-bark-100/50 px-6 sm:px-10 lg:px-12 py-10 lg:py-12 reveal">
        <div className="grid lg:grid-cols-[300px_1fr] gap-8 lg:gap-12 items-center">
          <div>
            <h2 className="font-display text-[28px] lg:text-[32px] leading-tight text-ink">
              Explore What
              <br />
              Interests You
            </h2>
            <p className="mt-3 text-[14.5px] leading-relaxed text-body/90">
              Follow the threads that pull at you — from field technique to the journey of the soul.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {content.topics.map((topic) => (
              <Link
                key={topic.label}
                href={topic.href}
                className="chip inline-flex items-center gap-2 bg-paper rounded-full pl-3.5 pr-4 py-2.5 shadow-soft"
              >
                <span className="grid place-items-center w-7 h-7 rounded-lg bg-gold-100 text-gold-600">
                  <TopicIcon name={topic.icon} />
                </span>
                <span className="text-[14px] font-semibold text-ink">{topic.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
