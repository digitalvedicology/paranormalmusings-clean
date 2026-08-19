import SectionLink from '../SectionLink'
import { artwork, getContent } from '@/lib/content'

export default async function About() {
  const content = await getContent()
  return (
    <section id="about" className="border-y border-rule bg-mist scroll-mt-24">
      <div className="wrap py-12 lg:py-16">
        <div className="grid lg:grid-cols-[auto_1fr] gap-8 lg:gap-12 items-center reveal">
          <div className="flex items-center gap-5">
            <img
              src={artwork(content.site.authorImage, 'pm-praveen', 200, 200)}
              alt={content.site.author}
              className="w-24 h-24 lg:w-28 lg:h-28 rounded-2xl object-cover shadow-card moody-soft"
            />
            <div className="lg:hidden">
              <p className="label text-gold-600">The Investigator</p>
              <h2 className="mt-1.5 font-display text-[24px] text-ink">{content.site.author}</h2>
            </div>
          </div>
          <div>
            <p className="label text-gold-600 hidden lg:block">The Investigator</p>
            <h2 className="mt-1.5 font-display text-[26px] lg:text-[30px] text-ink hidden lg:block">{content.site.author}</h2>
            <p className="mt-3 max-w-3xl text-[15.5px] leading-[1.7]">
              Welcome to my blog. I have been a paranormal investigator for more than twenty-five years now. Here you
              can find a lot of information on my paranormal explorations and perspectives on &ldquo;life after
              death&rdquo; from the Indian (Eastern) and Western viewpoints. You can also read about my encounters with
              inhuman energies and my thoughts on the paranormal energy spectrum. Please enjoy!
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-6 text-[13px] text-muted">
              <span>
                <strong className="text-ink font-semibold">124</strong> articles published
              </span>
              <span>
                <strong className="text-ink font-semibold">25+</strong> years investigating
              </span>
              <span>
                <strong className="text-ink font-semibold">4</strong> categories
              </span>
            </div>

            <SectionLink href="/about" className="mt-6">
              More about the work
            </SectionLink>
          </div>
        </div>
      </div>
    </section>
  )
}
