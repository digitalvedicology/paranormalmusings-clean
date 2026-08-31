import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms & Conditions',
  description: 'Terms and conditions for using Paranormal Musings website',
}

export default function TermsPage() {
  return (
    <article className="wrap py-12 lg:py-16 max-w-4xl mx-auto prose prose-invert">
      <h1 className="text-4xl font-display mb-8">Terms & Conditions</h1>
      <p className="text-base text-body leading-relaxed mb-6">Last updated: August 31, 2026</p>

      <section className="mb-10">
        <h2 className="text-2xl font-display mt-10 mb-4">1. Acceptance of Terms</h2>
        <p>By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.</p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-display mt-10 mb-4">2. Use License</h2>
        <p>Permission is granted to temporarily download one copy of the materials (information or software) on Paranormal Musings for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:</p>
        <ul className="list-disc pl-6 mb-4">
          <li>Modify or copy the materials</li>
          <li>Use the materials for any commercial purpose or for any public display</li>
          <li>Attempt to decompile or reverse engineer any software contained on the website</li>
          <li>Remove any copyright or other proprietary notations from the materials</li>
          <li>Transmit the materials to anyone or duplicate them on any other server</li>
          <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
          <li>Violate any applicable laws or regulations</li>
          <li>Encourage or conduct any illegal activity</li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-display mt-10 mb-4">3. Disclaimer</h2>
        <p className="font-semibold mb-4">IMPORTANT: The materials on Paranormal Musings are provided on an 'as is' basis without warranties of any kind, either expressed or implied.</p>
        <p>Paranormal Musings disclaims all warranties including, without limitation, warranties of merchantability, fitness for a particular purpose, and non-infringement. Further, Paranormal Musings does not warrant the accuracy, completeness, or usefulness of any information on this website or related to the materials.</p>
        <p className="mt-4 font-semibold">This website is for informational and educational purposes only. Content is not a substitute for professional advice.</p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-display mt-10 mb-4">4. Limitations of Liability</h2>
        <p>In no event shall Paranormal Musings or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Paranormal Musings, even if we have been notified orally or in writing of the possibility of such damage.</p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-display mt-10 mb-4">5. Accuracy of Materials</h2>
        <p>The materials appearing on Paranormal Musings could include technical, typographical, or photographic errors. Paranormal Musings does not warrant that any of the materials on this website are accurate, complete, or current. Paranormal Musings may make changes to the materials contained on this website at any time without notice.</p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-display mt-10 mb-4">6. Materials and Content</h2>
        <p>The materials on Paranormal Musings are provided for informational purposes relating to paranormal investigation, spiritual practices, and related topics. The views expressed are those of the author and do not constitute professional medical, psychological, or spiritual advice.</p>
        <p className="mt-4">Readers are encouraged to conduct their own research and consult qualified professionals before acting on information presented here.</p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-display mt-10 mb-4">7. Limitations</h2>
        <p>The materials appearing on Paranormal Musings' website could include technical, typographical, or photographic errors. Paranormal Musings does not warrant that any of the materials on this website are accurate, complete, or current. Paranormal Musings may make changes to the materials contained on this website at any time without notice. However, Paranormal Musings does not make any commitment to update the materials.</p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-display mt-10 mb-4">8. Intellectual Property</h2>
        <p>All materials on Paranormal Musings (including text, graphics, logos, images, and audio/video clips) are the property of Paranormal Musings or its content suppliers and are protected by international copyright laws. You may not reproduce, republish, or distribute the content without express written permission.</p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-display mt-10 mb-4">9. User Conduct</h2>
        <p>When using this website, you agree not to:</p>
        <ul className="list-disc pl-6 mb-4">
          <li>Post or transmit any unlawful, obscene, or defamatory content</li>
          <li>Spam or send unsolicited messages</li>
          <li>Attempt to hack, penetrate, or damage the website</li>
          <li>Collect or track personal information of others</li>
          <li>Violate the rights of others or violate any laws</li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-display mt-10 mb-4">10. Third-Party Links</h2>
        <p>This website may contain links to third-party websites. Paranormal Musings is not responsible for the content, accuracy, or practices of linked websites. Your use of third-party websites is governed by their terms and conditions.</p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-display mt-10 mb-4">11. Changes to Terms</h2>
        <p>Paranormal Musings may revise these terms of service for this website at any time without notice. By using this website, you are agreeing to be bound by the then current version of these terms of service.</p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-display mt-10 mb-4">12. Governing Law</h2>
        <p>These terms and conditions are governed by and construed in accordance with the laws of India, and you irrevocably submit to the exclusive jurisdiction of the courts in that location.</p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-display mt-10 mb-4">Contact</h2>
        <p>If you have any questions about these Terms & Conditions, please contact us at:</p>
        <p className="mt-4">
          <a href="mailto:support@vedicology.com" className="text-gold-500 hover:text-gold-400 underline">support@vedicology.com</a>
        </p>
      </section>
    </article>
  )
}
