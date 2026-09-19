'use client';

import { useCart } from './CartProvider';
import { formatPrice } from '@/lib/products';

export function CartDrawer() {
  const { items, isOpen, close, total, setQuantity, remove, checkout, checkoutState } =
    useCart();

  if (!isOpen) return null;

  return (
    <>
      <div className="cart-scrim" onClick={close} aria-hidden="true" />
      <aside
        className="cart-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Your cart"
      >
        <div className="cart-drawer__head">
          <h2 className="cart-drawer__title">Your cart</h2>
          <button type="button" className="ml-btn ml-btn--secondary ml-btn--sm" onClick={close}>
            Close
          </button>
        </div>

        <div className="cart-drawer__body">
          {items.length === 0 ? (
            <p className="cart-drawer__empty">
              Nothing here yet. Every piece is made to order and ships in 3–5 days.
            </p>
          ) : (
            <ul className="cart-list">
              {items.map((line) => (
                <li key={line.id}>
                  <span className="cart-item__name">{line.name}</span>
                  <span className="cart-item__price">
                    {formatPrice(line.price * line.quantity)}
                  </span>
                  {line.detail ? (
                    <span className="cart-item__detail">{line.detail}</span>
                  ) : null}
                  <div className="cart-item__controls">
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
                      className="cart-remove"
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
          <div className="cart-drawer__foot">
            <p className="cart-total">
              <span>Subtotal</span>
              <strong>{formatPrice(total)}</strong>
            </p>
            <button
              type="button"
              className="ml-btn ml-btn--lg"
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
              <p className="caption text-subtle">
                Shipping and tax are calculated at checkout.
              </p>
            )}
          </div>
        ) : null}
      </aside>
    </>
  );
}
