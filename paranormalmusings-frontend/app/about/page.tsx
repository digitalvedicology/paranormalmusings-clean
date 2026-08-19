import type { Metadata } from 'next'
import Link from 'next/link'
import Newsletter from '@/components/sections/Newsletter'
import { ArrowRight, TopicIcon } from '@/components/icons'
import { artwork, getContent } from '@/lib/content'

export async function generateMetadata(): Promise<Metadata> {
  const { site } = await getContent()
  return {
    title: 'About',
    description: `${site.author} — psychotherapist, family business advisor and life coach, founder of Vedicology, and a paranormal consultant of more than twenty-five years.`,
  }
}

/* ── Editorial copy ──────────────────────────────────────────────────────
   Kept here rather than in the CMS: this page is a single authored piece,
   not a list of records, and its sections are laid out individually.      */

/** The stat band beside the portrait — each one a verifiable affiliation. */
const standing = [
  {
    figure: '1862',
    label: 'The Ghost Club',
    body: 'Life member of the oldest organisation in the world associated with psychical research, still investigating hauntings across the globe.',
  },
  {
    figure: '1952',
    label: 'New England Society for Psychic Research',
    body: 'Member of the earliest paranormal research and ghost exploration group in New England, founded by Ed and Lorraine Warren.',
  },
  {
    figure: 'PhD',
    label: 'Clinical and counselling psychology',
    body: 'University of Canterbury, Christchurch — alongside a Master of Counselling from the same faculty.',
  },
  {
    figure: '3',
    label: 'Practices',
    body: 'Individuals and family businesses advised through offices in Dubai, Kuala Lumpur and Singapore.',
  },
]

const qualifications = [
  {
    icon: 'book',
    title: 'Doctoral',
    body: 'Doctor of Philosophy (PhD), University of Canterbury, Christchurch, New Zealand — clinical, counselling and allied psychology.',
  },
  {
    icon: 'heart',
    title: 'Counselling',
    body: 'Master of Counselling, University of Canterbury, Christchurch, New Zealand — counselling psychology.',
  },
  {
    icon: 'gear',
    title: 'Executive MBA',
    body: 'IMD Business School, Lausanne, Switzerland — business administration and management.',
  },
  {
    icon: 'sun',
    title: 'MBA',
    body: 'Master of Business Administration, Madras University — finance.',
  },
]

const specialisations = [
  'Clinical Hypnotherapist and Past Life Regression Therapist — National Guild of Hypnotists, Inc (Merrimack, NH, USA)',
  'Integrated Clinical Hypnotherapist — California Hypnosis Institute of India, Mumbai',
  'Advanced Hatha Yoga Practitioner and Teacher’s Trainer (Therapeutic) — certified by Yoga Alliance USA, International Yoga Academy (Hong Kong), Manonmaniam Sundaranar University and the Tamilnadu State Physical Education Department',
  'Award of Excellence, Project Edge — Counselling Adolescents — Medical University of South Carolina and the National Guild of Hypnotists',
  'Certification in the Essentials of General Marriage and Family Counselling Therapy — Harold Abel School of Social and Behavioural Science, Capella University',
  'Patron Member — The Ed and Lorraine Warren Inner Group, and All Access Patron of The Warren Inner Circle',
]

/** A titled band of prose, so the long biography stays readable. */
function Chapter({ eyebrow, title, children }: { eyebrow: string; title: string; children: React.ReactNode }) {
  return (
    <section className="wrap py-12 lg:py-16">
      <div className="grid lg:grid-cols-[300px_1fr] gap-8 lg:gap-16 reveal">
        <div>
          <p className="label text-gold-600">{eyebrow}</p>
          <h2 className="mt-2 font-display text-[25px] lg:text-[29px] leading-[1.2] text-ink">{title}</h2>
        </div>
        <div className="max-w-3xl space-y-4 text-[15.5px] leading-[1.75]">{children}</div>
      </div>
    </section>
  )
}

export default async function AboutPage() {
  const content = await getContent()
  const portrait = artwork(content.site.authorImage, 'pm-praveen', 900, 1100)

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="wrap pt-8 lg:pt-12 pb-4">
        <div className="rounded-[28px] bg-mist border border-rule px-6 sm:px-10 lg:px-14 py-10 lg:py-14">
          <div className="grid lg:grid-cols-[1.05fr_1fr] gap-10 lg:gap-14 items-center">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-paper border border-rule px-3.5 py-1.5 text-[12.5px] font-semibold text-ink shadow-soft">
                <span aria-hidden="true" className="w-1.5 h-1.5 rounded-full bg-gold-500" />
                Paranormal consultant · 25+ years
              </span>

              <h1 className="mt-6 font-display text-[32px] sm:text-[42px] lg:text-[50px] leading-[1.1] text-ink">
                About Paranormal Musings with {content.site.author}
              </h1>

              <p className="mt-5 max-w-xl text-[15.5px] lg:text-[16.5px] leading-[1.7] text-muted">
                Psychotherapist, family business advisor and life coach. Founder of Vedicology, and a globally
                recognised scholar on Sanatana Dharma — writing here on the paranormal from inside both the Indian and
                the Western traditions.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  href="/contact"
                  className="link-arrow inline-flex items-center gap-2 h-11 px-6 rounded-full bg-gold-500 text-white text-[14px] font-semibold hover:bg-gold-600 transition shadow-soft"
                >
                  Get in touch
                  <ArrowRight />
                </Link>
                <Link
                  href="/western-views"
                  className="inline-flex items-center h-11 px-6 rounded-full border border-rule bg-paper text-[14px] font-semibold text-ink hover:bg-mist transition"
                >
                  Read the blog
                </Link>
              </div>
            </div>

            <div className="zoom-wrap rounded-2xl shadow-card">
              <img
                src={portrait}
                alt={content.site.author}
                className="w-full h-[280px] sm:h-[360px] lg:h-[420px] object-cover moody-soft"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Standing: portrait beside the affiliations ───────────────── */}
      <section className="wrap py-8 lg:py-10">
        <div className="rounded-[28px] bg-mist border border-rule px-6 sm:px-8 lg:px-10 py-8 lg:py-10">
          <div className="grid lg:grid-cols-[1fr_1.25fr] gap-6 lg:gap-8 items-stretch reveal">
            <div className="zoom-wrap rounded-2xl min-h-[320px]">
              <img
                src={artwork(content.site.authorImage, 'pm-praveen', 800, 1000)}
                alt=""
                className="w-full h-full min-h-[320px] object-cover moody"
              />
            </div>

            <div className="grid gap-4 content-between">
              {standing.map((item) => (
                <div key={item.label} className="rounded-2xl bg-paper border border-rule p-5 lg:p-6 shadow-soft">
                  <div className="grid sm:grid-cols-[150px_1fr] gap-2 sm:gap-6">
                    <div>
                      <p className="font-display text-[30px] lg:text-[34px] leading-none text-ink">{item.figure}</p>
                      <p className="mt-2 text-[12.5px] leading-snug text-muted">{item.label}</p>
                    </div>
                    <p className="text-[13.5px] leading-relaxed text-muted">{item.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── The biography ────────────────────────────────────────────── */}
      <Chapter eyebrow="The work" title="Vedic scholarship, read alongside modern psychology">
        <p>
          Mr Praveen Saanker is a psychotherapist, family business advisor and life coach. He is the founder of
          Vedicology and a globally renowned scholar on Sanatana Dharma, recognised for his expertise in and use of
          Indian spirituality. He is considered a specialist on Vedic scriptures, traditional Indian rituals and
          customs, astrology, Vastu Shastra and numerology.
        </p>
        <p>
          Praveen successfully incorporates the fundamentals of the Vedas with contemporary psychology and business
          administration. He works with business entrepreneurs, working professionals and next-generation leaders,
          advising them on the household ministry and on locating a subtle balance between family and business
          priorities.
        </p>
        <p>
          He is a gifted natural speaker, mediator and facilitator. His intensive research and coaching across
          psychotherapy — both Western and Indian — Vedic disciplines, traditional scriptures, astrology and Vastu
          Shastra have allowed him to develop a profound understanding of individuals, structures and relationships.
        </p>
      </Chapter>

      <Chapter eyebrow="The paranormal" title="A student of the field since childhood">
        <p>
          Praveen Saanker has been an ardent student of the paranormal arena ever since he was a child. He has
          considerable experience as a renowned paranormal consultant and holds a strong reputation in the detection of
          the paranormal energy spectrum. He is widely considered a subject matter expert in the traditional Indian
          paranormal arena, and is well versed in the ancient Indian scriptures, rituals, customs and practices
          concerning the after-death aspects.
        </p>
        <p>
          Apart from that Eastern lineage, Praveen has been part of the New England Society for Psychic Research — the
          earliest paranormal research and ghost exploration group in New England, begun by Ed and Lorraine Warren in
          1952. He is an All Access Patron Member with The Ed and Lorraine Warren Inner Group and a member of The
          Warren Inner Circle.
        </p>
        <p>
          He holds life membership of The Ghost Club. Founded in 1862, it is the oldest organisation in the world
          associated with psychical research, and remains active in investigating hauntings and paranormal events
          across the world.
        </p>
      </Chapter>

      <Chapter eyebrow="Upbringing" title="Kerala, and initiation into the Vedic disciplines">
        <p>
          Praveen brings his knowledge of the traditional Indian aspects of astrology, Vastu Shastra, Mantrikam and
          Tantra Vidya back to his family roots in Kerala and to his traditional upbringing. He comes from one of the
          reputed families in Kerala that have always given great importance to the study of conventional Vedic
          sciences, and he uses that knowledge to carry the teachings of India’s spiritual heritage through modern
          scientific technique.
        </p>
        <p>
          Ever since his initiation into The Tantra Vidyalaya — an ancient institution for the study of Jyothisham,
          Vastu Shastra and other Vedic disciplines — his appetite for the intricacies of the Vedic sciences has had no
          bounds. He was later initiated into the Meppad Mantreeka Sampradayam, one of the oldest and most potent
          Mantrika Sampradayas of North Kerala. The Meppad tradition follows Kaula philosophy through Brahma Vidya
          Sampradaya, the path to Nirvana, and was well known in ancient days for astrology and Ayurvedic treatment.
        </p>
      </Chapter>

      <Chapter eyebrow="Professionally" title="Advising individuals and family businesses">
        <p>
          Currently a psychotherapist, corporate consultant, life coach and family business advisor, Praveen Saanker
          works with individuals and family businesses through his offices in Dubai, Kuala Lumpur and Singapore.
        </p>
        <p>
          He draws on extensive corporate experience to help professionals, entrepreneurs and family companies —
          identifying their goals and objectives, and advising on how to pursue them in a dharmic way. He was
          previously Senior Vice President with HSBC in the Wealth Management and Private Banking division of the
          global bank, and Director of Family Wealth Advisory Services with the ASK Group.
        </p>
      </Chapter>

      {/* ── Qualifications ───────────────────────────────────────────── */}
      <section className="bg-mist border-y border-rule">
        <div className="wrap py-12 lg:py-16">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-display text-[27px] sm:text-[33px] leading-[1.2] text-ink">
              Academic qualifications behind the practice
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-muted">
              Four degrees across psychology and business, taken at faculties in New Zealand, Switzerland and India.
            </p>
          </div>

          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6 reveal">
            {qualifications.map((item) => (
              <div key={item.title} className="rounded-2xl bg-paper border border-rule p-6 shadow-soft">
                <span className="grid place-items-center w-10 h-10 rounded-xl bg-gold-500 text-white">
                  <TopicIcon name={item.icon} />
                </span>
                <h3 className="mt-4 font-display text-[19px] leading-snug text-ink">{item.title}</h3>
                <p className="mt-2 text-[13.5px] leading-relaxed text-muted">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Specialisations ──────────────────────────────────────────── */}
      <section className="wrap py-12 lg:py-16">
        <div className="grid lg:grid-cols-[300px_1fr] gap-8 lg:gap-16 reveal">
          <div>
            <p className="label text-gold-600">Also certified</p>
            <h2 className="mt-2 font-display text-[25px] lg:text-[29px] leading-[1.2] text-ink">
              Specialisations and memberships
            </h2>
          </div>

          <ul className="max-w-3xl grid gap-3.5">
            {specialisations.map((item) => (
              <li key={item} className="flex gap-3.5 text-[15px] leading-[1.7]">
                <span aria-hidden="true" className="mt-[10px] w-1.5 h-1.5 rounded-full bg-gold-500 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Get in touch ─────────────────────────────────────────────── */}
      <section className="wrap pb-12 lg:pb-16">
        <div className="rounded-[28px] bg-night-800 text-white px-6 sm:px-10 lg:px-12 py-10 lg:py-12 text-center reveal">
          <p className="label text-gold-300">Consultations</p>
          <h2 className="mt-3 font-display text-[26px] sm:text-[32px] leading-tight">
            Something happening you cannot explain?
          </h2>
          <p className="mt-4 max-w-xl mx-auto text-[15px] leading-relaxed text-white/60">
            Describe what happened, where, and roughly when it began. Every message gets a reply.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/contact"
              className="inline-flex items-center h-11 px-6 rounded-full bg-gold-500 text-[14px] font-semibold hover:bg-gold-600 transition"
            >
              Write to me
            </Link>
            <Link
              href="/case-studies"
              className="inline-flex items-center h-11 px-6 rounded-full border border-white/25 text-[14px] font-semibold hover:bg-white/10 transition"
            >
              Read the case studies
            </Link>
          </div>
        </div>
      </section>

      <Newsletter />
    </>
  )
}
