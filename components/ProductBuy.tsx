'use client';

import { useRouter } from 'next/navigation';
import { useId, useState } from 'react';
import { useCart } from './CartProvider';
import { PERSONALIZE_FALLBACK, personalizePrices } from '@/lib/custom';
import { formatPrice } from '@/lib/format';
import type { Product } from '@/lib/products';

const MAX_ENGRAVING = 60;

/**
 * Personalising is priced differently — it carries the proof and the extra
 * setup — so engraving text is handed to the custom flow rather than quietly
 * attached to a catalogue-priced line.
 *
 * That used to leave a trap: type your text, press the primary "Add to cart"
 * beside it, and the text was dropped without a word. So the primary action
 * follows the field. Empty, it's Add to cart. Once there's text, it becomes
 * "Personalize" — carrying the text on — and the plain option says out loud
 * that it's without engraving. One primary either way.
 */
export function ProductBuy({ product }: { product: Product }) {
  const id = useId();
  const router = useRouter();
  const { add } = useCart();
  const [text, setText] = useState('');

  const personalizePrice = personalizePrices[product.slug] ?? PERSONALIZE_FALLBACK;
  const engraving = text.trim();

  function personalize() {
    const params = new URLSearchParams({ product: product.slug });
    if (engraving) params.set('text', engraving);
    router.push(`/create?${params.toString()}`);
  }

  function addPlain() {
    add({
      name: product.name,
      checkoutName: product.checkoutName,
      price: product.price,
      priceId: product.stripePriceId,
    });
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
        <p className="ml-field__hint" id={`${id}-hint`} aria-live="polite">
          {engraving
            ? `Next you choose the font and placement, and we email you a proof before anything is cut — ${formatPrice(personalizePrice)} for this piece, personalized.`
            : `Optional. Adding your own text or photo goes through our custom flow — ${formatPrice(personalizePrice)} for this piece, including the proof before we cut.`}{' '}
          <span className="tabular">{text.length}</span>/{MAX_ENGRAVING} characters.
        </p>
      </div>

      <div className="pdp__actions">
        {engraving ? (
          <>
            {/* Kept no wider than the empty-field pair, so typing the first
                character never wraps the row and shoves the page down. */}
            <button type="button" className="btn btn--lg" onClick={personalize}>
              Personalize it
            </button>
            <button type="button" className="btn btn--secondary btn--lg" onClick={addPlain}>
              Add without text
            </button>
          </>
        ) : (
          <>
            <button type="button" className="btn btn--lg" onClick={addPlain}>
              Add to cart
            </button>
            <button type="button" className="btn btn--secondary btn--lg" onClick={personalize}>
              Personalize this piece
            </button>
          </>
        )}
      </div>
    </>
  );
}
