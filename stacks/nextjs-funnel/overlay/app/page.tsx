/**
 * Reference funnel scaffold. The /new-landing-page and /new-funnel commands
 * replace this with operator-specific composition based on agency-context.md
 * and the campaign brief.
 *
 * The scaffold uses TODO markers throughout so the QA gate refuses to ship
 * this as-is.
 */
export default function Page() {
  return (
    <main className="min-h-screen">
      <header className="w-full border-b border-neutral-200">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 py-4 flex items-center justify-between">
          <span className="text-xl font-extrabold tracking-tight text-neutral-900">
            {/* TODO: replace with REAL agency / client logo — DO NOT SHIP */}
            Funnel
          </span>
        </div>
      </header>

      <section className="w-full">
        <div className="mx-auto max-w-5xl px-6 lg:px-8 py-24 lg:py-32 text-center">
          <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-neutral-900">
            {/* TODO: REAL message-matched headline — within 2 word-shifts of the ad creative — DO NOT SHIP */}
            Your headline goes here
          </h1>
          <p className="mt-6 text-lg lg:text-xl text-neutral-600 leading-relaxed max-w-2xl mx-auto">
            {/* TODO: REAL specific subheadline — DO NOT SHIP */}
            Your specific, anchored subheadline goes here.
          </p>

          <div className="mt-10">
            <a
              href="#cta"
              data-tracking-id="hero-primary"
              className="inline-flex items-center justify-center rounded-lg bg-brand-600 hover:bg-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2 px-8 py-4 text-base font-semibold text-white transition-colors"
            >
              {/* TODO: REAL value-bearing CTA copy — DO NOT SHIP */}
              Replace with real CTA copy
            </a>
          </div>
        </div>
      </section>

      <section id="cta" className="w-full bg-brand-600 text-white">
        <div className="mx-auto max-w-3xl px-6 lg:px-8 py-20 text-center">
          <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight">
            {/* TODO: REAL final-CTA heading — DO NOT SHIP */}
            Final CTA heading
          </h2>
          <a
            href="/contact"
            data-tracking-id="final-cta"
            className="mt-8 inline-flex items-center justify-center rounded-lg bg-white hover:bg-neutral-100 px-8 py-4 text-base font-semibold text-brand-700 transition-colors"
          >
            {/* TODO: REAL CTA copy — DO NOT SHIP */}
            Real CTA goes here
          </a>
        </div>
      </section>

      <footer className="w-full bg-neutral-900 text-neutral-400">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 py-8 text-sm flex flex-col sm:flex-row gap-4 justify-between">
          <p>© {new Date().getFullYear()} TODO: agency name. All rights reserved.</p>
          <ul className="flex gap-6">
            <li><a href="/privacy" className="hover:text-white">Privacy</a></li>
            <li><a href="/terms" className="hover:text-white">Terms</a></li>
          </ul>
        </div>
      </footer>
    </main>
  );
}
