'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { useCart } from './CartProvider';
import { MobileMenu } from './MobileMenu';

const NAV = [
  { href: '/', label: 'Home' },
  { href: '/products', label: 'Products' },
  { href: '/create', label: 'Create' },
  { href: '/blog', label: 'Blog' },
  { href: '/about', label: 'About' },
];

function isActive(pathname: string, href: string) {
  return href === '/' ? pathname === '/' : pathname.startsWith(href);
}

export function SiteHeader() {
  const pathname = usePathname();
  const { count, open } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  // The masthead is frosted from the start; the hairline and shadow only
  // arrive once there is page underneath it to separate from. rAF-throttled
  // and passive, so it costs nothing on the scroll thread.
  useEffect(() => {
    let frame = 0;
    const read = () => {
      frame = 0;
      setScrolled(window.scrollY > 8);
    };
    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(read);
    };
    read();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Close if the viewport grows past the breakpoint while it is open.
  useEffect(() => {
    if (!menuOpen) return;
    const mq = window.matchMedia('(min-width: 961px)');
    const onChange = () => mq.matches && setMenuOpen(false);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [menuOpen]);

  return (
    <>
      <header className="masthead" data-scrolled={scrolled || undefined}>
        <div className="wrap masthead__in">
          <Link href="/" className="mark" aria-label="Mozart Laser — home" />

          <nav className="nav" aria-label="Main">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive(pathname, item.href) ? 'page' : undefined}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="masthead__end">
            <button type="button" className="cart" onClick={open}>
              <span>Cart</span>{' '}
              {/* Keyed on the count so React remounts it and the pop replays. */}
              <b
                key={count}
                data-bump={count > 0 ? '' : undefined}
                aria-live="polite"
                aria-label={`${count} items in cart`}
              >
                {count}
              </b>
            </button>
            <Link className="btn" href="/create">
              Create Your Gift
            </Link>
            <button
              type="button"
              className="menu-toggle"
              aria-expanded={menuOpen}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              onClick={() => setMenuOpen((value) => !value)}
            >
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>

      <MobileMenu
        items={NAV}
        pathname={pathname}
        isOpen={menuOpen}
        onClose={closeMenu}
      />
    </>
  );
}
