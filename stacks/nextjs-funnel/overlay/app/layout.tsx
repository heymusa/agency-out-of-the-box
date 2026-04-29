import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: { default: 'Funnel', template: '%s' },
  description: 'Funnel scaffold — replace via /new-funnel or /new-landing-page',
  robots: { index: false, follow: false }, // scaffold defaults to noindex; production funnels override
  openGraph: {
    type: 'website',
    images: [{ url: '/og-default.png', width: 1200, height: 630, alt: 'OG image' }],
  },
  twitter: { card: 'summary_large_image' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter+Tight:wght@600;700;800&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        {/* Plausible — replace data-domain after agency-context §13 is set */}
        <script
          defer
          data-domain="example.com"
          src="https://plausible.io/js/script.tagged-events.js"
        />
      </head>
      <body className="bg-white text-neutral-900">
        {children}

        {/* CTA tracking delegation — fires cta_clicked on any [data-tracking-id] anchor / button */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              document.addEventListener('click', function(e) {
                var el = e.target.closest('[data-tracking-id]');
                if (!el) return;
                var id = el.getAttribute('data-tracking-id');
                var label = (el.textContent || '').trim();
                var dest = el.getAttribute('href') || '';
                if (typeof window.plausible === 'function') {
                  window.plausible('cta_clicked', { props: { cta_id: id, cta_label: label, cta_destination: dest } });
                }
              });
            `,
          }}
        />
      </body>
    </html>
  );
}
