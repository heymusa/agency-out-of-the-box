import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Thanks — your request is in',
  robots: { index: false, follow: false },
};

export default function ThankYouPage() {
  return (
    <main className="min-h-screen">
      <section className="w-full">
        <div className="mx-auto max-w-3xl px-6 lg:px-8 py-32 text-center">
          <h1 className="text-5xl lg:text-6xl font-extrabold tracking-tight text-neutral-900">
            Thanks — we&apos;ll be in touch.
          </h1>
          <p className="mt-6 text-lg text-neutral-600 leading-relaxed">
            {/* TODO: real thank-you body, soft up-sell to call booking — DO NOT SHIP */}
            Replace with real thank-you message + soft up-sell.
          </p>

          {/* Fire lead_submitted event via 1px tracking script */}
          <script
            dangerouslySetInnerHTML={{
              __html: `if (typeof window.plausible === 'function') { window.plausible('lead_submitted', { props: { form_type: 'lead-magnet' } }); }`,
            }}
          />
        </div>
      </section>
    </main>
  );
}
