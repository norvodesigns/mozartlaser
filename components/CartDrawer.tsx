'use client';

import { useEffect, useRef } from 'react';
import { useCart } from './CartProvider';
import { formatPrice } from '@/lib/products';

export function CartDrawer() {
  const { items, isOpen, close, total, setQuantity, remove, checkout, checkoutState } =
    useCart();
  const panelRef = useRef<HTMLDivElement>(null);

  // Modal behaviour: lock the page, trap focus, Escape closes, focus returns.
  useEffect(() => {
    if (!isOpen) return;

    const opener = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    panelRef.current?.querySelector<HTMLElement>('button, a, input')?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        close();
        return;
      }
      if (event.key !== 'Tab') return;

      const focusable = panelRef.current?.querySelectorAll<HTMLElement>(
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
      opener?.focus();
    };
  }, [isOpen, close]);

  if (!isOpen) return null;

  return (
    <>
      <div className="drawer-scrim" onClick={close} aria-hidden="true" />
      <aside
        className="drawer"
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Your cart"
      >
        <div className="drawer__head">
          <h2 className="drawer__title">Your cart</h2>
          <button type="button" className="btn btn--secondary btn--sm" onClick={close}>
            Close
          </button>
        </div>

        <div className="drawer__body">
          {items.length === 0 ? (
            <p className="drawer__empty">
              Nothing here yet. Every piece is made to order and ships in 3–5 days.
            </p>
          ) : (
            <ul className="lines">
              {items.map((line) => (
                <li key={line.id}>
                  <span className="line__name">{line.name}</span>
                  <span className="line__price">
                    {formatPrice(line.price * line.quantity)}
                  </span>
                  {line.detail ? <p className="line__detail">{line.detail}</p> : null}
                  <div className="line__controls">
                    <span className="qty">
                      <button
                        type="button"
                        onClick={() => setQuantity(line.id, line.quantity - 1)}
                        aria-label={`Reduce quantity of ${line.name}`}
                      >
                        −
                      </button>
                      <span aria-live="polite">{line.quantity}</span>
                      <button
                        type="button"
                        onClick={() => setQuantity(line.id, line.quantity + 1)}
                        aria-label={`Increase quantity of ${line.name}`}
                      >
                        +
                      </button>
                    </span>
                    <button
                      type="button"
                      className="line__remove"
                      onClick={() => remove(line.id)}
                    >
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 ? (
          <div className="drawer__foot">
            <p className="drawer__total">
              <span>Subtotal</span>
              <strong>{formatPrice(total)}</strong>
            </p>
            <button
              type="button"
              className="btn btn--lg"
              onClick={checkout}
              aria-disabled={checkoutState === 'loading' ? 'true' : undefined}
            >
              {checkoutState === 'loading' ? 'Opening checkout' : 'Checkout'}
            </button>
            {checkoutState === 'error' ? (
              <p className="ml-field__error" role="alert">
                Checkout did not open. Try again, or email us and we will send you a
                payment link.
              </p>
            ) : (
              <p className="caption">Shipping and tax are calculated at checkout.</p>
            )}
          </div>
        ) : null}
      </aside>
    </>
  );
}
