'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useId, useState } from 'react';
import { MESSAGES, isValidEmail, subscribe } from '@/lib/email';

const DISMISS_KEY = 'mozartlaser_flyout_dismissed';
/** Never sooner than this after arriving on a page. */
const MIN_MS = 9000;
/** Read this far down the page — the offer lands on interest, not arrival. */
const DEPTH = 0.55;
/** Or stayed this long without getting that far. */
const DWELL_MS = 45000;
/** How long the exit plays before it unmounts; matches --dur-base. */
const EXIT_MS = 320;

/**
 * Pages where an overlay is an interruption rather than an offer. The create
 * flow keeps the piece, the running brief and the price in a panel the flyout
 * lands directly on top of; a product page is where someone is deciding; and
 * the order pages are the worst possible moment to ask for an email address.
 */
const QUIET = (path: string) =>
  path.startsWith('/create') || path.startsWith('/order') || path.startsWith('/products/');

type State = 'idle' | 'sending' | 'ok' | 'error';

/**
 * The 5%-off signup, carried over from the old site: same delay, same
 * session-scoped dismissal key, same copy.
 *
 * It does not take focus when it appears — an overlay that arrives on a timer
 * and steals the caret is hostile to anyone typing or using a screen reader.
 * It is reachable in tab order, Escape dismisses it, and it never re-opens in
 * the same session once closed.
 */
export function EmailFlyout() {
  const id = useId();
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);
  const [email, setEmail] = useState('');
  const [state, setState] = useState<State>('idle');
  const [message, setMessage] = useState('');

  // It used to arrive 4.5s after landing — on a phone, square over the hero's
  // two buttons. Now it waits for a sign of interest: most of the way down the
  // page, or a long stay, and never in the first seconds of a visit.
  useEffect(() => {
    if (QUIET(pathname)) {
      setVisible(false);
      return;
    }
    let dismissed = false;
    try {
      dismissed = window.sessionStorage.getItem(DISMISS_KEY) === '1';
    } catch {
      /* Storage can be unavailable; the flyout simply shows. */
    }
    if (dismissed) return;

    const arrived = Date.now();
    let frame = 0;
    const open = () => {
      setVisible(true);
      cleanup();
    };
    const check = () => {
      frame = 0;
      if (Date.now() - arrived < MIN_MS) return;
      const root = document.documentElement;
      if ((window.scrollY + window.innerHeight) / root.scrollHeight >= DEPTH) open();
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(check);
    };
    const dwell = window.setTimeout(open, DWELL_MS);
    const late = window.setTimeout(check, MIN_MS);
    window.addEventListener('scroll', onScroll, { passive: true });
    function cleanup() {
      window.clearTimeout(dwell);
      window.clearTimeout(late);
      window.removeEventListener('scroll', onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    }
    return cleanup;
  }, [pathname]);

  useEffect(() => {
    if (!visible) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') dismiss();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  });

  function dismiss() {
    setClosing(true);
    window.setTimeout(() => {
      setVisible(false);
      setClosing(false);
    }, EXIT_MS);
    try {
      window.sessionStorage.setItem(DISMISS_KEY, '1');
    } catch {
      /* Nothing here depends on it. */
    }
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!isValidEmail(email)) {
      setState('error');
      setMessage(MESSAGES.invalid);
      return;
    }
    setState('sending');
    setMessage('');
    try {
      await subscribe(email);
      setState('ok');
      setMessage(MESSAGES.success);
      window.setTimeout(dismiss, 2500);
    } catch {
      setState('error');
      setMessage(MESSAGES.failed);
    }
  }

  if (!visible) return null;

  return (
    <aside
      className="flyout"
      data-closing={closing || undefined}
      role="dialog"
      aria-labelledby={`${id}-heading`}
      aria-label="Email signup"
    >
      <button
        type="button"
        className="flyout__close"
        onClick={dismiss}
        aria-label="Close email signup"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
          <path
            d="M1 1l12 12M13 1L1 13"
            stroke="currentColor"
            strokeWidth="1.5"
            fill="none"
          />
        </svg>
      </button>
      <p className="eyebrow">Mozart Laser</p>
      <h2 id={`${id}-heading`} className="flyout__heading">
        Stay in the loop &amp; get 5% off
      </h2>

      {state === 'ok' ? (
        <p className="flyout__status" data-state="ok" role="status">
          {message}
        </p>
      ) : (
        <>
          <p className="flyout__body">
            Early access to new products and exclusive discounts. Enter your email for a
            5% off coupon.
          </p>
          <form onSubmit={onSubmit} noValidate className="flyout__form">
            <label className="visually-hidden" htmlFor={`${id}-email`}>
              Email address
            </label>
            <input
              id={`${id}-email`}
              className="ml-field__input"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                if (state === 'error') {
                  setState('idle');
                  setMessage('');
                }
              }}
              aria-invalid={state === 'error' || undefined}
              aria-describedby={message ? `${id}-status` : undefined}
            />
            {message ? (
              <p
                className="flyout__status"
                id={`${id}-status`}
                data-state="error"
                role="alert"
              >
                {message}
              </p>
            ) : null}
            <button
              className="btn"
              type="submit"
              aria-disabled={state === 'sending' || undefined}
            >
              {state === 'sending' ? 'Sending…' : 'Subscribe'}
            </button>
          </form>
        </>
      )}
    </aside>
  );
}
