'use client';

import Link from 'next/link';
import { useCart } from './CartProvider';
import type { Product } from '@/lib/products';

export function AddToCart({ product }: { product: Product }) {
  const { add } = useCart();

  // A made-to-order piece is priced after we see the design, so it goes
  // through the custom flow rather than straight into the cart.
  if (product.custom || !product.stripePriceId) {
    return (
      <div className="product__actions">
        <Link href={`/create?product=${product.slug}`} className="ml-btn ml-btn--lg">
          Start your order
        </Link>
        <Link href="/products" className="ml-btn ml-btn--secondary ml-btn--lg">
          Browse products
        </Link>
      </div>
    );
  }

  return (
    <div className="product__actions">
      <button
        type="button"
        className="ml-btn ml-btn--lg"
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
      <Link
        href={`/create?product=${product.slug}`}
        className="ml-btn ml-btn--secondary ml-btn--lg"
      >
        Personalize it
      </Link>
    </div>
  );
}
