import type { Metadata } from 'next';
import { Cormorant_Garamond, Work_Sans } from 'next/font/google';
import { CartProvider } from '@/components/CartProvider';
import { CartDrawer } from '@/components/CartDrawer';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';

import '@/styles/tokens.css';
import '@/styles/components.css';
import '@/styles/site.css';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-cormorant',
});

const workSans = Work_Sans({
  subsets: ['latin'],
  weight: ['400', '500'],
  display: 'swap',
  variable: '--font-work-sans',
});

const SITE_URL = 'https://mozartlaser.com';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Mozart Laser — laser engraved wood, hand-finished in California',
    template: '%s | Mozart Laser',
  },
  description:
    'Laser engraved plaques, bookmarks, coasters and cutting boards in poplar, pine and acacia. Every piece crafted with care, built to last. Ships in 3–5 days.',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    siteName: 'Mozart Laser',
    url: SITE_URL,
    title: 'Mozart Laser — laser engraved wood, hand-finished in California',
    description:
      'Laser engraved plaques, bookmarks, coasters and cutting boards. Every piece crafted with care, built to last.',
  },
  robots: { index: true, follow: true },
};

const ORGANIZATION_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'Mozart Laser',
  url: SITE_URL,
  address: {
    '@type': 'PostalAddress',
    addressRegion: 'CA',
    addressCountry: 'US',
  },
  areaServed: 'US',
  priceRange: '$$',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${workSans.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ORGANIZATION_SCHEMA) }}
        />
        <CartProvider>
          <a className="skip-link" href="#main">
            Skip to content
          </a>
          <SiteHeader />
          <main id="main">{children}</main>
          <SiteFooter />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
