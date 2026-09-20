'use client';

import { useEffect, useRef, useState } from 'react';

const FOCUSABLE = 'a[href], button:not([disabled]), input, select, textarea';

/**
 * Shared behaviour for the full-screen menu and the cart drawer.
 *
 * React unmounts instantly, which is why an overlay can animate in and then
 * just vanish. This keeps the panel mounted for `exitMs` after it is closed
 * and exposes `closing` so the markup can run an exit animation, then it
 * unmounts for real.
 *
 * While open it also locks the page, moves focus into the panel, traps Tab,
 * closes on Escape, and returns focus to whatever opened it.
 */
export function useOverlay({
  isOpen,
  onClose,
  exitMs,
}: {
  isOpen: boolean;
  onClose: () => void;
  exitMs: number;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [rendered, setRendered] = useState(false);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setRendered(true);
      setClosing(false);
      return;
    }
    setClosing(true);
    const timer = window.setTimeout(() => {
      setRendered(false);
      setClosing(false);
    }, exitMs);
    return () => window.clearTimeout(timer);
  }, [isOpen, exitMs]);

  useEffect(() => {
    if (!isOpen) return;

    const opener = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Wait a frame so the panel is in the DOM before focus moves.
    const frame = window.requestAnimationFrame(() => {
      panelRef.current?.querySelector<HTMLElement>(FOCUSABLE)?.focus();
    });

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
        return;
      }
      if (event.key !== 'Tab') return;

      const focusable = panelRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE);
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
      window.cancelAnimationFrame(frame);
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
      opener?.focus();
    };
  }, [isOpen, onClose]);

  return { rendered, closing, panelRef };
}
