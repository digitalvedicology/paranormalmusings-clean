import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Legal Disclaimer',
  description: 'Important legal disclaimer for Paranormal Musings content',
}

export default function LegalPage() {
  return (
    <article className="wrap py-12 lg:py-16 max-w-4xl mx-auto prose prose-invert">
      <h1 className="text-4xl font-display mb-8">Legal Disclaimer</h1>
      <p className="text-base text-body leading-relaxed mb-6">Last updated: August 31, 2026</p>

      <section className="mb-10">
        <h2 className="text-2xl font-display mt-10 mb-4">Important Medical & Psychological Disclaimer</h2>
        <div className="bg-gold-500/10 border-l-4 border-gold-500 p-6 mb-6">
          <p className="font-semibold mb-2">⚠️ NOT MEDICAL OR PSYCHOLOGICAL ADVICE</p>
          <p>The content on Paranormal Musings, including discussions of spirit possession, depossession, and psychological phenomena, is for informational and educational purposes only. It does not constitute medical, psychological, or professional advice of any kind.</p>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-display mt-10 mb-4">1. Nature of Content</h2>
        <p>Paranormal Musings explores paranormal phenomena, spiritual practices, and related topics from Indian (Eastern) and Western perspectives. This website presents:</p>
        <ul className="list-disc pl-6 mb-4">
          <li>Paranormal investigation techniques and observations</li>
          <li>Spiritual and philosophical perspectives on life, death, and the afterlife</li>
          <li>Historical and contemporary accounts of paranormal experiences</li>
          <li>Vedic, Hindu, and traditional perspectives on spiritual matters</li>
        </ul>
        <p>This content represents explorations of these topics and should not be interpreted as definitive scientific fact or professional guidance.</p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-display mt-10 mb-4">2. Not a Substitute for Professional Help</h2>
        <p className="font-semibold mb-4">If you are experiencing symptoms of mental illness, psychiatric conditions, or psychological distress, please seek help from a qualified mental health professional.</p>
        <p>Conditions such as hallucinations, delusions, dissociation, anxiety, depression, and other psychological symptoms require evaluation and treatment by licensed professionals, not paranormal investigation or spiritual practices alone.</p>
        <p className="mt-4">This website is not a substitute for professional medical, psychiatric, or psychological care.</p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-display mt-10 mb-4">3. Depossession and Spiritual Practices</h2>
        <p>While this website discusses depossession practices and spiritual approaches to possession phenomena, these should not be undertaken without proper guidance from qualified spiritual teachers or practitioners.</p>
        <p className="mt-4">If you or someone you know is experiencing symptoms consistent with possession, spirit attachment, or other psychological distress, please consult with both:</p>
        <ul className="list-disc pl-6 mb-4">
          <li>A qualified medical or psychiatric professional to rule out physical or psychological causes</li>
          <li>A qualified spiritual teacher or counselor experienced in such matters</li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-display mt-10 mb-4">4. Paranormal Investigation</h2>
        <p>Paranormal investigation techniques and equipment discussed on this site are for informational purposes. They are not intended to provide conclusive scientific evidence of paranormal phenomena. Always prioritize personal safety during any investigation activities.</p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-display mt-10 mb-4">5. Vedic and Spiritual Content</h2>
        <p>Content related to Vedic teachings, Hindu philosophy, astrology, and spiritual practices represents one person&apos;s perspective and interpretation. These subjects are vast, complex, and interpreted differently across traditions and teachers. This website does not claim to represent the only or &quot;correct&quot; interpretation.</p>
        <p className="mt-4">Readers are encouraged to explore these traditions through multiple sources and qualified teachers.</p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-display mt-10 mb-4">6. No Liability for Third-Party Links</h2>
        <p>This website contains links to third-party websites and resources. Paranormal Musings is not responsible for the content, accuracy, or practices of external sites. Links do not constitute endorsement.</p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-display mt-10 mb-4">7. Personal Results Vary</h2>
        <p>Any spiritual practices, meditation techniques, or approaches discussed on this site may have different effects on different people. Results are not guaranteed and depend on individual circumstances, beliefs, and practices. Your mileage may vary.</p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-display mt-10 mb-4">8. Author Credentials</h2>
        <p>While the author of this site has extensive experience in paranormal investigation, psychology, and spiritual traditions, this does not constitute professional medical or psychological licensure. Readers should verify the qualifications of any advisor they consult.</p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-display mt-10 mb-4">9. Assumption of Risk</h2>
        <p>By reading this website and applying any information contained herein, you assume full responsibility for any consequences resulting from your actions. Paranormal Musings and its author are not liable for any harm, loss, or damage arising from your use of this site's content.</p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-display mt-10 mb-4">10. Children and Sensitive Content</h2>
        <p>Some content on this site discusses disturbing topics including death, violence, possession, and psychological trauma. While not gratuitous, this content may not be appropriate for children. Parents and guardians should monitor younger readers' access to this site.</p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-display mt-10 mb-4">11. Modifications to Disclaimer</h2>
        <p>This disclaimer may be updated at any time without notice. Your continued use of this site constitutes acceptance of any modified disclaimer.</p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-display mt-10 mb-4">12. Contact for Questions</h2>
        <p>If you have questions about this Legal Disclaimer, please contact:</p>
        <p className="mt-4">
          <a href="mailto:support@vedicology.com" className="text-gold-500 hover:text-gold-400 underline">support@vedicology.com</a>
        </p>
      </section>

      <section className="mb-10 bg-gold-500/10 border-l-4 border-gold-500 p-6">
        <h3 className="text-lg font-semibold mb-3">Seeking Professional Help?</h3>
        <p className="mb-3">If you or someone you know needs professional help:</p>
        <ul className="list-disc pl-6">
          <li><strong>Mental Health Crisis:</strong> Contact your local emergency services or mental health crisis line</li>
          <li><strong>Medical Emergency:</strong> Call emergency services immediately</li>
          <li><strong>Ongoing Support:</strong> Consult with a licensed therapist, psychiatrist, or medical doctor</li>
        </ul>
      </section>
    </article>
  )
}
