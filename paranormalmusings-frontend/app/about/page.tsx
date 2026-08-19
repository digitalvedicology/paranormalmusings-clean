import type { Metadata } from 'next'
import Link from 'next/link'
import PageHero from '@/components/PageHero'
import Newsletter from '@/components/sections/Newsletter'
import { ArrowRight } from '@/components/icons'
import { silhouetteFor } from '@/components/hero/heroSlides'
import { artwork, getContent } from '@/lib/content'

export async function generateMetadata(): Promise<Metadata> {
  const { site } = await getContent()
  return {
    title: 'About',
    description: `${site.author} has been a paranormal investigator for more than twenty-five years. About the work, the method, and why both traditions are read side by side.`,
  }
}

/* How the work is approached. Editorial copy — review before publishing. */
const principles = [
  {
    title: 'Rule out the ordinary first',
    body: 'Most of what is reported resolves into plumbing, wiring, airflow or expectation. The residue that survives an honest attempt at a mundane explanation is the only part worth calling anomalous.',
  },
  {
    title: 'Read both traditions',
    body: 'The Western literature is strong on phenomena and weak on what follows death. The Eastern is the reverse. Held together they describe far more than either does alone.',
  },
  {
    title: 'The witness is evidence',
    body: 'An account is data, and it is the piece an investigator contaminates most easily. Interviews come before instruments, and the questions stay open.',
  },
  {
    title: 'Record what did not happen',
    body: 'A file that lists only the hits is not a record, it is an advertisement. The quiet nights and the failed sessions belong in the write-up too.',
  },
]

export default async function AboutPage() {
  const content = await getContent()
  return (
    <>
      <PageHero
        art="art-1"
        eyebrow="About"
        title="Twenty-five years at the edge of the explainable"
        lede="Paranormal explorations and perspectives on life after death, written from inside two traditions rather than about them."
        meta={`${content.site.author} · Chennai, India`}
        silhouette={silhouetteFor('art-1')}
      />

      {/* Portrait + bio */}
      <section className="wrap py-12 lg:py-16">
        <div className="grid lg:grid-cols-[320px_1fr] gap-10 lg:gap-16 items-start reveal">
          <div>
            <div className="zoom-wrap rounded-2xl shadow-card">
              <img
                src={artwork(content.site.authorImage, 'pm-praveen', 700, 820)}
                alt={content.site.author}
                className="w-full h-[320px] lg:h-[380px] object-cover moody-soft"
              />
            </div>
            <p className="label text-gold-600 mt-5">The Investigator</p>
            <h2 className="mt-1.5 font-display text-[26px] text-ink">{content.site.author}</h2>
            <p className="mt-2 text-[13.5px] leading-relaxed text-muted">
              Paranormal investigator, writer, and the voice behind {content.site.name}.
            </p>
          </div>

          <div>
            <p className="text-[17px] lg:text-[19px] leading-[1.6] text-ink font-display">
              Welcome to my blog. I have been a paranormal investigator for more than twenty-five years now.
            </p>
            <p className="mt-5 text-[15.5px] leading-[1.75]">
              Here you can find a lot of information on my paranormal explorations and perspectives on &ldquo;life after
              death&rdquo; from the Indian (Eastern) and Western viewpoints. You can also read about my encounters with
              inhuman energies and my thoughts on the paranormal energy spectrum.
            </p>
            <p className="mt-4 text-[15.5px] leading-[1.75]">
              The two traditions are usually kept apart, and I think that is a loss. The Western literature is precise
              about phenomena — what was recorded, at what temperature, on which instrument — and comparatively thin on
              what any of it means for the person it happened to. The Eastern material is the reverse: unhurried and
              detailed about the passage of the soul, largely uninterested in proving it to anyone. Reading them
              together is most of what this site does.
            </p>
            <p className="mt-4 text-[15.5px] leading-[1.75]">
              What follows is written for the reader who wants neither the theatre nor the debunking — just an account
              of what was found, how it was checked, and what remained once the ordinary explanations had been used up.
            </p>

            <div className="mt-8 grid grid-cols-3 gap-4 max-w-lg">
              {[
                { figure: '124', label: 'articles published' },
                { figure: '25+', label: 'years investigating' },
                { figure: '4', label: 'categories' },
              ].map((stat) => (
                <div key={stat.label} className="rounded-2xl bg-mist border border-rule px-4 py-5">
                  <p className="font-display text-[28px] leading-none text-ink">{stat.figure}</p>
                  <p className="mt-2 text-[12.5px] leading-snug text-muted">{stat.label}</p>
                </div>
              ))}
            </div>

            <Link
              href="/contact"
              className="link-arrow mt-8 inline-flex items-center gap-2 h-11 px-6 rounded-full bg-gold-500 text-white text-[14px] font-semibold hover:bg-gold-600 transition shadow-soft"
            >
              Get in touch
              <ArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* How the work is done */}
      <section className="bg-mist border-y border-rule">
        <div className="wrap py-12 lg:py-16">
          <div className="max-w-2xl">
            <p className="label text-gold-600">The Method</p>
            <h2 className="mt-2 font-display text-[26px] lg:text-[32px] text-ink">How the work is done</h2>
            <p className="mt-3 text-[15px] leading-relaxed">
              Four things that have not changed across twenty-five years of case files.
            </p>
          </div>

          <div className="mt-10 grid sm:grid-cols-2 gap-6 lg:gap-8 reveal">
            {principles.map((principle, i) => (
              <div key={principle.title} className="rounded-2xl bg-paper border border-rule p-6 lg:p-7 shadow-soft">
                <p className="font-extrabold text-[15px] text-gold-500 tabular-nums">
                  {String(i + 1).padStart(2, '0')}
                </p>
                <h3 className="mt-3 font-display text-[21px] leading-snug text-ink">{principle.title}</h3>
                <p className="mt-2.5 text-[14.5px] leading-relaxed">{principle.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Where to start reading */}
      <section className="wrap py-12 lg:py-16">
        <h2 className="font-display text-[26px] lg:text-[30px] text-ink mb-8">Where to start reading</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-7 reveal">
          {content.categoryOrder.map((key) => {
            const category = content.categoryMeta(key)
            return (
              <Link
                key={key}
                href={category.href}
                className="card-lift rounded-2xl border border-rule bg-paper overflow-hidden hover:shadow-card"
              >
                <div className="zoom-wrap">
                  <img
                    src={artwork(category.image, category.seed, 600, 440)}
                    alt=""
                    className="w-full h-[150px] sm:h-[170px] object-cover moody"
                  />
                </div>
                <div className="p-5">
                  <p className="label text-gold-600">{category.count} articles</p>
                  <h3 className="mt-2 font-display text-[19px] text-ink hover-title">{category.title}</h3>
                  <p className="mt-2 text-[13.5px] leading-relaxed text-muted">{category.blurb}</p>
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* Elsewhere */}
      <section className="wrap pb-12 lg:pb-16">
        <div className="rounded-[28px] bg-night-800 text-white px-6 sm:px-10 lg:px-12 py-10 lg:py-12 reveal">
          <p className="label text-gold-300">Elsewhere</p>
          <h2 className="mt-2 font-display text-[24px] lg:text-[28px]">The rest of the work</h2>
          <p className="mt-3 max-w-2xl text-[14.5px] leading-relaxed text-white/60">
            This blog is one part of a wider practice across coaching, Vedic study and advisory work.
          </p>
          <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {content.relatedSites.map((related) => (
              <a
                key={related.name}
                href={related.href}
                className="block overflow-hidden rounded-xl bg-white/[0.04] hover:bg-white/[0.08] transition"
              >
                {/* Optional — a card with no picture keeps its original look. */}
                {related.image && (
                  <img src={related.image} alt="" className="w-full h-[96px] object-cover moody" />
                )}
                <div className="p-5">
                  <p className="text-[12.5px] font-bold tracking-label uppercase text-gold-300">{related.name}</p>
                  <p className="mt-2.5 text-[13px] leading-relaxed text-white/55">{related.blurb}</p>
                  <p className="mt-3 text-[12px] text-white/40">{related.domain}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <Newsletter />
    </>
  )
}
