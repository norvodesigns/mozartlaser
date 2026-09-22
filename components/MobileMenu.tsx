'use client';

import type { CSSProperties } from 'react';
import Link from 'next/link';
import { CONTACT_EMAIL } from '@/lib/site';
import { useOverlay } from './useOverlay';

export const MENU_EXIT_MS = 320;

export function MobileMenu({
  items,
  pathname,
  isOpen,
  onClose,
}: {
  items: { href: string; label: string }[];
  pathname: string;
  isOpen: boolean;
  onClose: () => void;
}) {
  const { rendered, closing, panelRef } = useOverlay({
    isOpen,
    onClose,
    exitMs: MENU_EXIT_MS,
  });

  if (!rendered) return null;

  return (
    <div
      className="menu"
      ref={panelRef}
      data-closing={closing || undefined}
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
    >
      <div className="wrap menu__top">
        <span className="mark" aria-hidden="true" />
        <button type="button" className="menu__close" onClick={onClose} aria-label="Close menu">
          <span />
          <span />
        </button>
      </div>

      <nav className="wrap menu__nav" aria-label="Main">
        {items.map((item, index) => {
          const active =
            item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className="menu__link"
              style={{ '--i': index } as CSSProperties}
              aria-current={active ? 'page' : undefined}
            >
              <span className="menu__word">{item.label}</span>
              <span className="menu__rule" aria-hidden="true" />
            </Link>
          );
        })}
      </nav>

      <div className="wrap menu__foot" style={{ '--i': items.length } as CSSProperties}>
        <Link className="btn btn--lg" href="/create">
          Create Your Gift
        </Link>
        <p className="caption">
          Hand-finished in California ·{' '}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
        </p>
      </div>
    </div>
  );
}
