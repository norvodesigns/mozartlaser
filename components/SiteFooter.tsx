import Image from 'next/image';
import Link from 'next/link';

const SHOP = [
  { href: '/products', label: 'All products' },
  { href: '/products?category=Bookmarks', label: 'Bookmarks' },
  { href: '/products?category=Plaques', label: 'Plaques' },
  { href: '/products?category=Coasters', label: 'Coasters' },
  { href: '/products?category=Cutting+boards', label: 'Cutting boards' },
];

const MORE = [
  { href: '/create', label: 'Custom orders' },
  { href: '/about', label: 'About' },
  { href: '/blog', label: 'Journal' },
];

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="site-footer__grid">
          <div className="site-footer__brand">
            {/* surface-inverse is dark in the light theme and light in the
                dark one, so the two files swap relative to the header. */}
            <Image
              src="/brand/wordmark-light.png"
              alt="Mozart Laser"
              width={470}
              height={128}
              className="site-footer__wordmark site-footer__wordmark--light"
            />
            <Image
              src="/brand/wordmark-ink.png"
              alt=""
              aria-hidden="true"
              width={470}
              height={128}
              className="site-footer__wordmark site-footer__wordmark--ink"
            />
            <p className="site-footer__tagline">
              Hand-finished in California. Every piece crafted with care, built to
              last.
            </p>
            <div className="site-footer__social">
              <a
                href="https://www.facebook.com/profile.php?id=61585614995027"
                target="_blank"
                rel="noopener"
                aria-label="Mozart Laser on Facebook"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>
              <a
                href="https://instagram.com/mozartlaser"
                target="_blank"
                rel="noopener"
                aria-label="Mozart Laser on Instagram"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
              <a
                href="https://X.com/mozartlaser"
                target="_blank"
                rel="noopener"
                aria-label="Mozart Laser on X"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
            </div>
          </div>

          <div>
            <h2 className="site-footer__heading">Shop</h2>
            <ul className="site-footer__list">
              {SHOP.map((item) => (
                <li key={item.href}>
                  <Link href={item.href}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="site-footer__heading">Studio</h2>
            <ul className="site-footer__list">
              {MORE.map((item) => (
                <li key={item.href}>
                  <Link href={item.href}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="site-footer__base">
          <p>© {new Date().getFullYear()} Mozart Laser. All rights reserved.</p>
          <p>Hand-finished in California</p>
        </div>
      </div>
    </footer>
  );
}
