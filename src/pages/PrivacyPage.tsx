import PageHero from '../components/ui/PageHero';

export default function PrivacyPage() {
  return (
    <>
      <PageHero eyebrow="Legal" title="Privacy Policy" />
      <section className="mx-auto max-w-3xl px-6 pb-24">
        <div className="prose prose-lg prose-stone max-w-none space-y-8 text-[#14110f]/80">
          <p className="text-sm text-[#14110f]/50">Last updated: March 2026</p>

          <div>
            <h2 className="serif text-2xl">1. What we collect</h2>
            <p className="mt-3">
              When you contact us via our contact form, we store the name, email, company, budget
              preference, selected services, and message you provide. This data is stored in your
              browser&apos;s localStorage — it never touches our servers.
            </p>
          </div>

          <div>
            <h2 className="serif text-2xl">2. Newsletter</h2>
            <p className="mt-3">
              If you subscribe to our journal newsletter, your email is stored locally in your
              browser. We use a Firebase backend (when configured) to manage email lists — you can
              unsubscribe at any time.
            </p>
          </div>

          <div>
            <h2 className="serif text-2xl">3. Saved items</h2>
            <p className="mt-3">
              Projects and articles you bookmark are stored in localStorage and are never transmitted
              to any server. Clearing your browser data removes them.
            </p>
          </div>

          <div>
            <h2 className="serif text-2xl">4. Third-party services</h2>
            <p className="mt-3">
              We use Google Fonts for typography. When the admin panel is configured with Firebase,
              Google authentication may apply Google&apos;s own privacy policies.
            </p>
          </div>

          <div>
            <h2 className="serif text-2xl">5. Cookies</h2>
            <p className="mt-3">
              This site does not use tracking cookies. LocalStorage is used for functional purposes
              only (saved items, contact form history, newsletter signup).
            </p>
          </div>

          <div>
            <h2 className="serif text-2xl">6. Your rights</h2>
            <p className="mt-3">
              You can clear all stored data at any time by clearing your browser storage for this
              site, or by using the &quot;Clear all&quot; button on your Saved page. For any data held on
              our Firebase backend, contact us at mwijaydavie@gmail.com.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
