'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

/** Nothing stays hidden longer than this, whatever happens. */
const FAILSAFE_MS = 4000;

/**
 * Fade-and-rise on scroll, wired once per route.
 *
 * The brief's rule is that every element is visible at rest, so the hidden
 * state is deliberately hard to get stuck in:
 *
 *  - anything already in the viewport is revealed *before* the document is
 *    armed, so nothing above the fold ever flashes out;
 *  - an IntersectionObserver handles ordinary scrolling;
 *  - a passive scroll/resize sweep catches instant jumps — an anchor link or
 *    Cmd+End moves past elements without the observer ever seeing them
 *    intersect, which would otherwise leave them invisible for good;
 *  - a failsafe timer reveals whatever is left regardless.
 *
 * Without JS, with reduced motion, or in a link preview, the page just renders.
 */
export function Reveal() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const root = document.documentElement;
    const targets = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));
    if (targets.length === 0) return;

    const pending = new Set<HTMLElement>();
    for (const el of targets) {
      if (el.getBoundingClientRect().top < window.innerHeight * 0.9) {
        el.classList.add('is-in');
      } else {
        pending.add(el);
      }
    }

    root.classList.add('reveal-armed');

    const timers: number[] = [];

    const show = (el: HTMLElement, delay: number) => {
      if (!pending.has(el)) return;
      pending.delete(el);
      observer.unobserve(el);
      if (delay > 0) {
        timers.push(window.setTimeout(() => el.classList.add('is-in'), delay));
      } else {
        el.classList.add('is-in');
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const el = entry.target as HTMLElement;
          show(el, Number(el.dataset.revealDelay ?? 0) || 0);
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.05 },
    );

    pending.forEach((el) => observer.observe(el));

    // Instant jumps never produce an intersection, so sweep on scroll too.
    let frame = 0;
    const sweep = () => {
      frame = 0;
      if (pending.size === 0) return;
      for (const el of Array.from(pending)) {
        if (el.getBoundingClientRect().top < window.innerHeight) show(el, 0);
      }
    };
    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(sweep);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    const failsafe = window.setTimeout(() => {
      for (const el of Array.from(pending)) show(el, 0);
      root.classList.remove('reveal-armed');
    }, FAILSAFE_MS);

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      window.clearTimeout(failsafe);
      if (frame) window.cancelAnimationFrame(frame);
      timers.forEach(window.clearTimeout);
      root.classList.remove('reveal-armed');
      targets.forEach((el) => el.classList.remove('is-in'));
    };
  }, [pathname]);

  return null;
}
