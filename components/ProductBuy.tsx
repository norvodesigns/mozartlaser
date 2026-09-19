'use client';

import { useRouter } from 'next/navigation';
import { useId, useState } from 'react';
import { useCart } from './CartProvider';
import { PERSONALIZE_FALLBACK, personalizePrices } from '@/lib/custom';
import { formatPrice, type Product } from '@/lib/products';

const MAX_ENGRAVING = 60;

/**
 * Add to cart is the single primary. Personalising is priced differently — it
 * carries the proof and the extra setup — so the engraving text is handed to
 * the custom flow rather than quietly changing the price here.
 */
export function ProductBuy({ product }: { product: Product }) {
  const id = useId();
  const router = useRouter();
  const { add } = useCart();
  const [text, setText] = useState('');

  const personalizePrice = personalizePrices[product.slug] ?? PERSONALIZE_FALLBACK;

  function personalize() {
    const params = new URLSearchParams({ product: product.slug });
    if (text.trim()) params.set('text', text.trim());
    router.push(`/create?${params.toString()}`);
  }

  // A made-to-order piece is priced after we see the design, so it has no
  // straight add-to-cart at all.
  if (product.custom || !product.stripePriceId) {
    return (
      <div className="pdp__actions">
        <button type="button" className="btn btn--lg" onClick={personalize}>
          Start your order
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="ml-field">
        <label className="ml-field__label" htmlFor={`${id}-engraving`}>
          Engraving text
        </label>
        <input
          id={`${id}-engraving`}
          className="ml-field__input"
          value={text}
          maxLength={MAX_ENGRAVING}
          onChange={(event) => setText(event.target.value)}
          placeholder="A name, a date, a line"
          aria-describedby={`${id}-hint`}
        />
        <p className="ml-field__hint" id={`${id}-hint`}>
          Optional. Adding your own text or photo goes through our custom flow —{' '}
          {formatPrice(personalizePrice)} for this piece, including the proof before we
          cut. <span className="tabular">{text.length}</span>/{MAX_ENGRAVING} characters.
        </p>
      </div>

      <div className="pdp__actions">
        <button
          type="button"
          className="btn btn--lg"
          onClick={() =>
            add({
              name: product.name,
              checkoutName: product.checkoutName,
              price: product.price,
              priceId: product.stripePriceId,
            })
          }
        >
          Add to cart
        </button>
        <button type="button" className="btn btn--secondary btn--lg" onClick={personalize}>
          {text.trim() ? 'Personalize it' : 'Personalize this piece'}
        </button>
      </div>
    </>
  );
}
