import Link from 'next/link';

const NAV = [
  { href: '/', label: 'Home' },
  { href: '/products', label: 'Products' },
  { href: '/create', label: 'Create' },
  { href: '/blog', label: 'Blog' },
  { href: '/about', label: 'About' },
];

export function SiteFooter() {
  return (
    <>
      <footer className="wrap foot">
        <div>
          <span className="mark" aria-hidden="true" style={{ width: 148, height: 40 }} />
          <span className="caption" style={{ marginTop: 'var(--space-4)' }}>
            Hand-finished in California · Est. 2024 —{' '}
            <a href="mailto:mozartlaser@gmail.com">mozartlaser@gmail.com</a>
          </span>
          <div className="foot__social">
            <a
              href="https://www.facebook.com/profile.php?id=61585614995027"
              target="_blank"
              rel="noopener"
              aria-label="Mozart Laser on Facebook"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
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
                width="18"
                height="18"
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
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
          </div>
        </div>
        <nav aria-label="Footer">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
      </footer>
      <div className="wrap legal">
        <span className="caption">© 2026 Mozart Laser. All rights reserved.</span>
      </div>
    </>
  );
}
