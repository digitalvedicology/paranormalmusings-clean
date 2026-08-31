import ContactForm from './ContactForm'

/**
 * Contact form module shown at the end of article pages.
 * Encourages readers to write about their own experiences.
 */

export default function EndOfArticleContact() {
  return (
    <section className="mt-16 pt-16 border-t border-divider">
      <div className="max-w-xl">
        <div className="mb-8">
          <h2 className="font-display text-[28px] sm:text-[32px] leading-[1.35] text-ink">
            Have your own story?
          </h2>
          <p className="mt-4 text-[15px] leading-[1.7] text-muted">
            Paranormal experiences are deeply personal. If you have your own story to share or want to discuss what
            you read here, we would like to hear from you.
          </p>
        </div>
        <ContactForm />
      </div>
    </section>
  )
}
