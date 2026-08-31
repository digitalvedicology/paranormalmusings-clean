import Link from 'next/link'

export default function WriteToUs() {
  return (
    <section id="write-to-us" className="wrap pb-14 lg:pb-20 scroll-mt-24">
      <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-r from-mist via-gold-50 to-gold-100 px-6 sm:px-10 lg:px-14 py-10 lg:py-12 reveal">
        <div className="grid lg:grid-cols-[1fr_1.05fr_auto] gap-8 lg:gap-10 items-center">
          <h2 className="font-display text-[28px] lg:text-[34px] leading-[1.15] text-ink">
            Share your
            <br className="hidden lg:block" /> paranormal stories.
          </h2>

          <div>
            <p className="text-[14.5px] leading-relaxed text-body/90 max-w-md">
              Have experiences to share? Questions about the paranormal? Get in touch — I'd love to hear from you.
            </p>
            <div className="mt-5 flex flex-col gap-3">
              <a
                href="mailto:paranormalmusings@proton.me"
                className="inline-block px-5 py-3 bg-ink text-paper rounded-lg font-semibold hover:bg-ink/90 transition text-[15px]"
              >
                Email us
              </a>
              <Link
                href="/about#contact"
                className="inline-block text-gold-600 hover:text-gold-700 font-semibold text-[14px] underline"
              >
                Use contact form →
              </Link>
            </div>
          </div>

          <div className="hidden lg:block">
            <div className="w-[150px] h-[110px] rounded-2xl bg-paper shadow-float grid place-items-center rotate-[-6deg]">
              <svg viewBox="0 0 24 24" className="w-14 h-14 text-gold-500" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
