'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useCart } from './CartProvider';

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
  const toggleRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close on navigation.
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

  // Modal behaviour: lock the page, trap focus, Escape closes, focus returns.
  useEffect(() => {
    if (!menuOpen) return;

    const previousOverflow = document.body.style.overflow;
    const toggle = toggleRef.current;
    document.body.style.overflow = 'hidden';
    const firstLink = menuRef.current?.querySelector<HTMLElement>('a, button');
    firstLink?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false);
        return;
      }
      if (event.key !== 'Tab') return;

      const focusable = menuRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input, select, textarea',
      );
      if (!focusable || focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
      toggle?.focus();
    };
  }, [menuOpen]);

  return (
    <>
      <header className="masthead">
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
              <b aria-live="polite" aria-label={`${count} items in cart`}>
                {count}
              </b>
            </button>
            <Link className="btn" href="/create">
              Create Your Gift
            </Link>
            <button
              ref={toggleRef}
              type="button"
              className="menu-toggle"
              aria-expanded={menuOpen}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              onClick={() => setMenuOpen((value) => !value)}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>

      {menuOpen ? (
        <>
          <div
            className="mobile-scrim"
            aria-hidden="true"
            onClick={() => setMenuOpen(false)}
          />
          <div
            className="mobile-menu"
            ref={menuRef}
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
          >
            <div className="wrap">
              <div className="mobile-menu__head">
                <span className="mark" aria-hidden="true" />
                <button
                  type="button"
                  className="menu-toggle menu-toggle--close"
                  aria-label="Close menu"
                  onClick={() => setMenuOpen(false)}
                >
                  <span />
                  <span />
                  <span />
                </button>
              </div>
              <nav aria-label="Main">
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
              <Link className="btn" href="/create">
                Create Your Gift
              </Link>
            </div>
          </div>
        </>
      ) : null}
    </>
  );
}
