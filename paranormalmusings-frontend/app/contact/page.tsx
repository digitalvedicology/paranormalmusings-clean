import type { Metadata } from 'next'
import ContactForm from '@/components/ContactForm'
import PageHero from '@/components/PageHero'
import Newsletter from '@/components/sections/Newsletter'
import { silhouetteFor } from '@/components/hero/heroSlides'
import { getContent } from '@/lib/content'

export async function generateMetadata(): Promise<Metadata> {
  const { site } = await getContent()
  return {
    title: 'Contact',
    description: `Write to ${site.author} about a case, an article, or an invitation to speak.`,
  }
}

/* Editorial copy — review before publishing. */
const expectations = [
  {
    title: 'Case enquiries',
    body: 'Describe what happened, where, and roughly when it began. Dates and the order of events matter more than the drama of any single incident.',
  },
  {
    title: 'Questions about an article',
    body: 'Name the piece and quote the line you are asking about. Corrections are welcome and are made openly.',
  },
  {
    title: 'Speaking and media',
    body: 'Include the date, the format and the audience. I decline anything framed as a stunt.',
  },
]

export default async function ContactPage() {
  const { site } = await getContent()
  return (
    <>
      <PageHero
        art="art-2"
        eyebrow="Contact"
        title="Write to me"
        lede="If something is happening in your home, if an article raised a question, or if you would like me to speak — this is the way through."
        meta="Chennai, India · Replies within a few days"
        silhouette={silhouetteFor('art-2')}
      />

      <section className="wrap py-12 lg:py-16">
        <div className="grid lg:grid-cols-[1.15fr_1fr] gap-10 lg:gap-16 items-start reveal">
          <ContactForm />

          <div>
            <p className="label text-gold-600">Direct</p>
            <h2 className="mt-2 font-display text-[26px] lg:text-[30px] text-ink">Or reach me another way</h2>

            <ul className="mt-7 space-y-6">
              <li className="flex gap-4">
                <span className="grid place-items-center w-11 h-11 shrink-0 rounded-xl bg-gold-100 text-gold-600">
                  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round">
                    <path d="M12 21s-6.5-5.2-6.5-10a6.5 6.5 0 0 1 13 0c0 4.8-6.5 10-6.5 10Z" />
                    <circle cx="12" cy="11" r="2.2" />
                  </svg>
                </span>
                <div>
                  <p className="label text-muted">Address</p>
                  <p className="mt-1.5 text-[15px] leading-relaxed text-ink">
                    {site.address[0]}
                    <br />
                    {site.address[1]}
                  </p>
                </div>
              </li>

              <li className="flex gap-4">
                <span className="grid place-items-center w-11 h-11 shrink-0 rounded-xl bg-gold-100 text-gold-600">
                  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round">
                    <path d="M4.5 5.5c0 8 6 14 14 14l1.8-3.2-4-2.1-1.9 1.9a13 13 0 0 1-4.4-4.4l1.9-1.9-2.1-4L6.6 5.5Z" />
                  </svg>
                </span>
                <div>
                  <p className="label text-muted">Phone</p>
                  <a href={site.phone.href} className="mt-1.5 block text-[15px] text-ink hover:text-gold-600 transition">
                    {site.phone.label}
                  </a>
                </div>
              </li>

              <li className="flex gap-4">
                <span className="grid place-items-center w-11 h-11 shrink-0 rounded-xl bg-gold-100 text-gold-600">
                  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round">
                    <rect x="3" y="5" width="18" height="14" rx="2" />
                    <path d="m3.5 7 8.5 5.5L20.5 7" />
                  </svg>
                </span>
                <div>
                  <p className="label text-muted">Email</p>
                  <a href={site.email.href} className="mt-1.5 block text-[15px] text-ink hover:text-gold-600 transition">
                    {site.email.label}
                  </a>
                </div>
              </li>
            </ul>

            <div className="mt-9 rounded-2xl bg-mist border border-rule p-6">
              <p className="label text-gold-600">Before you write</p>
              <p className="mt-3 text-[14.5px] leading-relaxed">
                If someone is in immediate danger or in medical distress, contact emergency services first. Investigation
                is not a substitute for medical or psychiatric care, and I will say so plainly if that is what a case
                needs.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-mist border-y border-rule">
        <div className="wrap py-12 lg:py-16">
          <h2 className="font-display text-[26px] lg:text-[30px] text-ink mb-8">What to include</h2>
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8 reveal">
            {expectations.map((item) => (
              <div key={item.title} className="rounded-2xl bg-paper border border-rule p-6 shadow-soft">
                <h3 className="font-display text-[20px] leading-snug text-ink">{item.title}</h3>
                <p className="mt-2.5 text-[14.5px] leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="pt-12 lg:pt-16">
        <Newsletter />
      </div>
    </>
  )
}
