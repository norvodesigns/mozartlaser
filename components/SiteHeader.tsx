'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useCart } from './CartProvider';

const NAV = [
  { href: '/products', label: 'Products' },
  { href: '/create', label: 'Create' },
  { href: '/blog', label: 'Journal' },
  { href: '/about', label: 'About' },
];

export function SiteHeader() {
  const pathname = usePathname();
  const { count, open } = useCart();
  const [navOpen, setNavOpen] = useState(false);

  useEffect(() => {
    setNavOpen(false);
  }, [pathname]);

  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <Link href="/" className="site-header__brand" aria-label="Mozart Laser — home">
          {/* The mark carries its own ink, so the ground picks the file. */}
          <Image
            src="/brand/wordmark-ink.png"
            alt="Mozart Laser"
            width={470}
            height={128}
            className="site-header__wordmark site-header__wordmark--ink"
            priority
          />
          <Image
            src="/brand/wordmark-light.png"
            alt=""
            aria-hidden="true"
            width={470}
            height={128}
            className="site-header__wordmark site-header__wordmark--light"
            priority
          />
        </Link>

        <nav
          className={navOpen ? 'site-nav site-nav--open' : 'site-nav'}
          aria-label="Main"
        >
          <ul>
            {NAV.map((item) => {
              const active =
                pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <li key={item.href}>
                  <Link href={item.href} aria-current={active ? 'page' : undefined}>
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="site-header__actions">
          <button
            type="button"
            className="cart-button"
            onClick={open}
            aria-label={`Open cart, ${count} ${count === 1 ? 'item' : 'items'}`}
          >
            <span className="cart-button__label">Cart</span>
            <span className="cart-button__count" aria-hidden="true">
              {count}
            </span>
          </button>
          <button
            type="button"
            className="nav-toggle"
            onClick={() => setNavOpen((value) => !value)}
            aria-expanded={navOpen}
            aria-label={navOpen ? 'Close navigation' : 'Open navigation'}
          >
            {navOpen ? 'Close' : 'Menu'}
          </button>
        </div>
      </div>
    </header>
  );
}
