import SubscribeForm from '../SubscribeForm'

export default function Newsletter() {
  return (
    <section id="newsletter" className="wrap pb-14 lg:pb-20 scroll-mt-24">
      <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-r from-mist via-gold-50 to-gold-100 px-6 sm:px-10 lg:px-14 py-10 lg:py-12 reveal">
        <div className="grid lg:grid-cols-[1fr_1.05fr_auto] gap-8 lg:gap-10 items-center">
          <h2 className="font-display text-[28px] lg:text-[34px] leading-[1.15] text-ink">
            Stories from the field
            <br className="hidden lg:block" /> deserve your attention.
          </h2>

          <div>
            <p className="text-[14.5px] leading-relaxed text-body/90 max-w-md">
              New investigations, case notes and perspectives on life after death — delivered once a week.
            </p>
            <SubscribeForm />
          </div>

          <div className="hidden lg:block">
            <div className="w-[150px] h-[110px] rounded-2xl bg-paper shadow-float grid place-items-center rotate-[-6deg]">
              <svg viewBox="0 0 24 24" className="w-14 h-14 text-gold-500" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round">
                <rect x="2.5" y="5" width="19" height="14" rx="2.5" />
                <path d="m3 7 9 6 9-6" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
