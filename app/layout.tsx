import type { Metadata } from 'next';
import { Cormorant_Garamond, Work_Sans } from 'next/font/google';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/next';
import { CartProvider } from '@/components/CartProvider';
import { CartDrawer } from '@/components/CartDrawer';
import { EmailFlyout } from '@/components/EmailFlyout';
import { Reveal } from '@/components/Reveal';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';

import '@/styles/tokens.css';
import '@/styles/components.css';
import '@/styles/site.css';

// Only the weights the system uses. next/font self-hosts these, so there is no
// render-blocking request to Google and no preconnect to pay for.
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
    default: 'Custom Laser Engraved Gifts & Home Decor | Mozart Laser – California',
    template: '%s | Mozart Laser',
  },
  description:
    'Mozart Laser is a California-based studio dedicated to the art of precision engraving. Custom laser-engraved gifts and home decor on premium hardwood.',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    siteName: 'Mozart Laser',
    url: SITE_URL,
    title: 'Custom Laser Engraved Gifts & Home Decor | Mozart Laser – California',
    description:
      'Custom laser-engraved gifts and home decor on premium hardwood. Hand-finished in California, ships in 3–5 days.',
    images: ['/brand/wordmark-ink.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Custom Laser Engraved Gifts & Home Decor | Mozart Laser',
    description:
      'Custom laser-engraved gifts and home decor on premium hardwood. Hand-finished in California.',
    images: ['/brand/wordmark-ink.png'],
  },
  robots: { index: true, follow: true },
};

const ORGANIZATION_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'Mozart Laser',
  url: SITE_URL,
  email: 'mozartlaser@gmail.com',
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
          <div className="announce">
            <p>Hand-finished in California · Est. 2024</p>
          </div>
          <SiteHeader />
          <main id="main">{children}</main>
          <SiteFooter />
          <CartDrawer />
          <EmailFlyout />
          <Reveal />
        </CartProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
