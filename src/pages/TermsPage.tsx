import PageHero from '../components/ui/PageHero';

export default function TermsPage() {
  return (
    <>
      <PageHero eyebrow="Legal" title="Terms of Service" />
      <section className="mx-auto max-w-3xl px-6 pb-24">
        <div className="prose prose-lg prose-stone max-w-none space-y-8 text-[#14110f]/80">
          <p className="text-sm text-[#14110f]/50">Last updated: March 2026</p>

          <div>
            <h2 className="serif text-2xl">1. Scope</h2>
            <p className="mt-3">
              These terms apply to all use of the Mwijay Studio website and any services booked
              through it. By using the site or submitting a contact inquiry, you agree to these
              terms.
            </p>
          </div>

          <div>
            <h2 className="serif text-2xl">2. Services</h2>
            <p className="mt-3">
              Mwijay Studio provides web development, business systems, AI automation, and design
              services. All pricing is indicative and will be confirmed in a formal proposal. Starter
              prices listed on the Services page are guidelines and may vary based on scope.
            </p>
          </div>

          <div>
            <h2 className="serif text-2xl">3. Intellectual property</h2>
            <p className="mt-3">
              All content on this website — including text, images, design assets, code, and the
              Mwijay Studio name and logo — is owned by Mwijay Studio. You may not reproduce,
              distribute, or create derivative works without our written permission.
            </p>
          </div>

          <div>
            <h2 className="serif text-2xl">4. Project deliverables</h2>
            <p className="mt-3">
              Final deliverables become the client&apos;s property upon full payment. Mwijay Studio
              reserves the right to showcase completed work in our portfolio, case studies, and
              marketing unless a non-disclosure agreement specifies otherwise.
            </p>
          </div>

          <div>
            <h2 className="serif text-2xl">5. Limitation of liability</h2>
            <p className="mt-3">
              Mwijay Studio is not liable for indirect, incidental, or consequential damages arising
              from the use of our website or services. Our total liability for any claim is capped at
              the fees paid for the specific service in question.
            </p>
          </div>

          <div>
            <h2 className="serif text-2xl">6. Payment terms</h2>
            <p className="mt-3">
              Standard terms are 50% upfront and 50% on delivery, unless otherwise agreed in writing.
              Late payments may incur a 5% monthly fee. All amounts are in USD unless otherwise
              specified.
            </p>
          </div>

          <div>
            <h2 className="serif text-2xl">7. Governing law</h2>
            <p className="mt-3">
              These terms are governed by the laws of Tanzania. Any disputes shall be brought before
              the courts of Dar es Salaam, Tanzania.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
