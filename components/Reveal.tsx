'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useLayoutEffect } from 'react';

/** Nothing stays hidden longer than this, whatever happens. */
const FAILSAFE_MS = 4000;

// useLayoutEffect runs before the browser's next paint, so arming the
// document happens before anything is shown rather than after — the same
// guarantee a plain SSR/no-JS request already has for free. Falls back to
// useEffect on the server, where neither ever runs anyway.
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

/**
 * Fade-and-rise on scroll, wired once per route.
 *
 * The hero does this with a pure CSS animation, which is why it always plays
 * — it doesn't wait on scroll or JS timing, it's just how the element paints.
 * Everything else on the page used to skip straight to visible if it
 * happened to already be on screen at load, so only the hero ever actually
 * arrived. Now whatever's already in view gets the same short, staggered
 * entrance the hero uses (scheduled here, not scroll-triggered — there's
 * nothing to scroll to yet); whatever's below the fold still waits for the
 * IntersectionObserver, now tuned to fire once it's meaningfully on screen
 * rather than the instant its tip clears the bottom edge, so the transition
 * has room to actually be watched.
 *
 * Nothing stays hidden for good:
 *  - a passive scroll/resize sweep catches instant jumps — an anchor link or
 *    Cmd+End moves past elements without the observer ever seeing them
 *    intersect, which would otherwise leave them invisible for good;
 *  - a failsafe timer reveals whatever is left regardless.
 *
 * Without JS, with reduced motion, or in a link preview, the page just renders.
 */
export function Reveal() {
  const pathname = usePathname();

  useIsomorphicLayoutEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const root = document.documentElement;
    const targets = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));
    if (targets.length === 0) return;

    const pending = new Set<HTMLElement>();
    const onLoad: { el: HTMLElement; delay: number }[] = [];

    targets.forEach((el, i) => {
      const explicit = Number(el.dataset.revealDelay);
      const delay = Number.isFinite(explicit) ? explicit : Math.min(i, 5) * 70;
      if (el.getBoundingClientRect().top < window.innerHeight * 0.9) {
        onLoad.push({ el, delay });
      } else {
        pending.add(el);
      }
    });

    // Armed before the browser paints, so the first frame already shows the
    // resting (hidden) state rather than a visible frame that then hides.
    root.classList.add('reveal-armed');

    const timers: number[] = [];

    const show = (el: HTMLElement, delay: number) => {
      if (delay > 0) {
        timers.push(window.setTimeout(() => el.classList.add('is-in'), delay));
      } else {
        el.classList.add('is-in');
      }
    };

    // A small base delay so the very first element doesn't cut straight in —
    // the hero's own first line waits 80ms for the same reason.
    onLoad.forEach(({ el, delay }) => show(el, delay + 60));

    const scrollShow = (el: HTMLElement, delay: number) => {
      if (!pending.has(el)) return;
      pending.delete(el);
      observer.unobserve(el);
      show(el, delay);
    };

    // Triggering the instant an element's tip clears the bottom edge means
    // the (brief) transition is already done by the time it's actually in
    // view, so it reads as a pop rather than a reveal. Waiting until it's
    // meaningfully inside the viewport gives the motion somewhere to happen
    // while it's actually being watched.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const el = entry.target as HTMLElement;
          scrollShow(el, Number(el.dataset.revealDelay ?? 0) || 0);
        }
      },
      { rootMargin: '0px 0px -20% 0px', threshold: 0.15 },
    );

    pending.forEach((el) => observer.observe(el));

    // Instant jumps never produce an intersection, so sweep on scroll too.
    let frame = 0;
    const sweep = () => {
      frame = 0;
      if (pending.size === 0) return;
      for (const el of Array.from(pending)) {
        if (el.getBoundingClientRect().top < window.innerHeight) scrollShow(el, 0);
      }
    };
    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(sweep);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    const failsafe = window.setTimeout(() => {
      for (const el of Array.from(pending)) scrollShow(el, 0);
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
