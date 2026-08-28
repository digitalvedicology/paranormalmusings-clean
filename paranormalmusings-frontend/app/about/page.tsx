import type { Metadata } from 'next'
import { getContent } from '@/lib/content'

export async function generateMetadata(): Promise<Metadata> {
  const { site } = await getContent()
  return { title: 'About', description: `About Paranormal Musings with ${site.author}` }
}

const qualifications = [
  ['Doctoral Program', 'Doctor of Philosophy (PhD), University of Canterbury, Christchurch, New Zealand', 'Field of Study – Clinical, Counselling and Allied Psychology'],
  ['Post Graduate Programs', 'Master of Counselling, University of Canterbury, Christchurch, New Zealand', 'Field of Study – Counselling Psychology'],
  ['Post Graduate Programs', 'Executive MBA, IMD Business School, Lausanne, Switzerland', 'Field Of Study – Business Administration and Management, General'],
  ['Post Graduate Programs', 'Master of Business Administration – MBA, Madras University', 'Field Of Study – Finance, General'],
]

const specialisations = [
  'Clinical Hypnotherapist and Past Life Regression Therapist, National Guild of Hypnotists, Inc (Merrimack, NH, USA)',
  'Integrated Clinical Hypnotherapist (California Hypnosis Institute of India, Mumbai, India)',
  'Advanced Hatha Yoga Practitioner & Teacher’s Trainer (Therapeutic) Certified by the Yoga Alliance USA. International Yoga Academy (Hongkong), Manonmaniam Sundaranar University and Tamilnadu State Physical Education Department',
  'Award of Excellence (Project Edge – Counselling Adolescents), Medical University of South Carolina & National Guild of Hypnotists',
  'Certification in the Essentials of General Marriage and Family Counselling Therapy, Harold Abel School of Social and Behavioural Science, Capella University',
  'Member – New England Society For Psychic Research (The oldest Paranormal Research and Ghost Hunting Group in New England found by Ed and Lorraine Warren in 1952)',
  'Patron Member – The Ed and Lorraine Warren Inner Group & All Access Patron – The Warren Inner Circle',
  'Life Member – The Ghost Club – Founded in 1862, and is the oldest organisation in the world associated with psychical research. Prime interest is that of paranormal phenomena associated with ghosts and hauntings.',
]

function Kicker({ children }: { children: React.ReactNode }) {
  return <p className="label flex items-center gap-3 text-gold-600 before:h-px before:w-9 before:bg-gold-500">{children}</p>
}

function CopySection({ title, children, dark = false }: { title: string; children: React.ReactNode; dark?: boolean }) {
  return <section className={dark ? 'bg-night-800 text-white' : 'bg-paper'}><div className="wrap py-14 lg:py-20"><div className="max-w-6xl"><Kicker>Paranormal Musings</Kicker><h2 className={`mt-4 font-display text-[30px] leading-[1.17] sm:text-[35px] ${dark ? 'text-white' : 'text-ink'}`}>{title}</h2><div className={`mt-8 max-w-6xl space-y-5 text-[17px] leading-[1.85] ${dark ? 'text-white/70' : 'text-body'}`}>{children}</div></div></div></section>
}

export default async function AboutPage() {
  const portrait = '/images/about/study.png'

  return <>
    <section className="relative isolate flex min-h-[360px] items-center overflow-hidden bg-night-900 text-white lg:min-h-[400px]">
      <div className="absolute inset-0 opacity-40"><img src="/images/about/about-header.png" alt="" className="h-full w-full object-cover" /></div>
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(16,12,7,.94),rgba(16,12,7,.5))]" />
      <div className="wrap relative py-10 lg:py-12"><p className="label text-gold-300">paranormal musings with Praveen Saanker</p><h1 className="mt-3 max-w-3xl font-display text-[38px] leading-[1.05] sm:text-[50px] lg:text-[60px]">About Paranormal Musings with Praveen Saanker</h1></div>
    </section>

    <section className="wrap py-14 lg:py-20">
      <div className="grid items-center gap-10 lg:grid-cols-[.75fr_1.25fr] lg:gap-16">
        <div className="relative mx-auto w-full max-w-[410px] pb-8 pr-8"><img src={portrait} alt="Praveen Saanker" className="h-[400px] w-full object-cover shadow-float sm:h-[500px]" /><div className="absolute bottom-0 right-0 h-28 w-28 border-[8px] border-paper bg-gold-500" /></div>
        <div><Kicker>paranormal musings with Praveen Saanker</Kicker><div className="mt-5 space-y-5 text-[15.5px] leading-[1.85] text-body"><p>Mr Praveen Saanker is a Psychotherapist, Family Business Advisor and Life Coach. Sri Praveen Saanker is the founder of “Vedicology” and is a globally renowned scholar on Sanatana Dharma recognized for his expertise and use of Indian Spirituality. He’s considered as a specialist on Vedic Scriptures, Traditional Indian Rituals and Customs, Astrology, Vastu Shastra and Numerology.</p><p>Praveen successfully incorporates the fundamentals of Vedas with contemporary psychology and business administration. Mr Praveen Saanker functions with business entrepreneurs, working professionals and next-generation leaders advising them on the household ministry and locating a subtle balance between household and business priorities.</p><p>Mr Praveen Saanker is a gifted all-natural speaker, mediator, and facilitator. His intensive research and coaching into various aspects of Psychotherapy (Western and Indian), Vedic areas, traditional scriptures, Astrology and Vastu Shastra have allowed him to create a profound comprehension of individuals, structures and relationships.</p></div></div>
      </div>
    </section>

    <CopySection title="Praveen Saanker’s Interest in the “Paranormal”" dark><p>Praveen Saanker has been an ardent student of the paranormal arena ever since he has been a child. Praveen has impressive experience as a renowned “Paranormal Consultant” and enjoys a strong reputation in the detection of “Paranormal Energy Spectrum”. Praveen is widely considered to be a subject matter expert in the traditional Indian Paranormal arena. He is well versed with various ancient Indian scriptures, rituals, customs and practices on the “after death aspects”.</p><p>Apart from Praveen’s extensive Eastern lineage and experience in the Indian Paranormal Arena, Praveen Saanker has been a part of the “New England Society For Psychic Research” (The earliest Paranormal Research and Ghost Exploration Group, New England commenced by Ed and Lorraine Warren during 1952).</p><p>Praveen is also an All Access Patron Member with The Ed and Lorraine Warren Inner Group & and a valuable member of “The Warren Inner Circle”.</p><p>Praveen Saanker is a Life Membership of “The Ghost Club”. The Ghost Club commenced in 1862 and is “the oldest organisation across the world associated with psychical research” associated with ghosts and hauntings. Ghost Club has been actively investigating hauntings and paranormal events across the world.</p></CopySection>

    <CopySection title="Praveen Saanker’s Upbringing and Initiation"><p>Praveen dedicates his wisdom and experience on traditional Indian aspects of Astrology, Vastu Shastra, Mantrikam and Tantra Vidya into his ancient family roots in Kerala along with his traditional upbringing. Praveen comes from one of the reputed families in Kerala that have always given great importance to the study of Conventional Vedic Sciences. He uses his knowledge to spread the teachings of our ancient Indian spiritual heritage via ultra-modern scientific techniques.</p><p>Ever since his initiation into “The Tantra Vidyalaya” (An Ancient institution for the study of Jyothisham, Vastu Shastra and other ancient Vedic disciplines) Praveen Saanker’s fervour for learning the intricacies of our Vedic Sciences had no bounds. Praveen later got initiated into the “Meppad Mantreeka Sampradayam” which is one of the oldest and most potent Mantrika Sampradayas of North Kerala. Meppad tradition follows “Kaula” philosophy through “Brahma Vidya Sampradaya”, which is the path to Nirvana. Meppad was also well known for Astrology and Ayur Veda treatment during the ancient days.</p></CopySection>

    <CopySection title="Praveen’s Professional Credentials" dark><p>Currently, a psychotherapist, corporate consultant, life coach and family business advisor, Praveen Saanker works with individuals and family businesses through his offices in Dubai, Kuala Lumpur and Singapore.</p><p>Mr Praveen Saanker uses his extensive corporate experience to help professionals, entrepreneurs and family companies. Praveen assists in identifying your goals and objectives and advise you on pursuing the same in a dharmic way. Praveen Saanker was a Senior Vice President with HSBC in the Wealth Management and Private Banking Division of the Global Bank. Praveen has amazing experience working together with other reputed organisations such as the ASK Group. Praveen Saanker was the “Director – Family Wealth Advisory Services” with the ASK Group.</p></CopySection>

    <section className="bg-mist border-y border-rule"><div className="wrap py-14 lg:py-20"><div className="max-w-2xl"><Kicker>Academic Qualifications</Kicker><h2 className="mt-4 font-display text-[34px] leading-tight text-ink">Academic Qualifications</h2></div><div className="mt-9 grid gap-4 md:grid-cols-2">{qualifications.map(([level, degree, field]) => <article key={degree} className="border-l-[3px] border-gold-500 bg-paper p-6 shadow-soft"><p className="label text-gold-600">{level}</p><h3 className="mt-3 font-display text-[22px] leading-snug text-ink">{degree}</h3><p className="mt-3 text-[13.5px] leading-relaxed text-muted">{field}</p></article>)}</div></div></section>

    <section className="wrap py-14 lg:py-20"><div className="grid gap-9 lg:grid-cols-[290px_minmax(0,1fr)] lg:gap-16"><div><Kicker>Paranormal Musings</Kicker><h2 className="mt-4 font-display text-[30px] leading-tight text-ink">Other Relevant Specialisations</h2></div><ul className="grid gap-4 border-t border-rule pt-6">{specialisations.map((item) => <li key={item} className="flex gap-3 text-[15px] leading-[1.75] text-body"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold-500" />{item}</li>)}</ul></div></section>
  </>
}
