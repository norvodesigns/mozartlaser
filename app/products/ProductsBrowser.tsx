'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { ProductCard } from '@/components/ProductCard';
import type { Product } from '@/lib/products';

export function ProductsBrowser({
  products,
  categories,
  initialCategory,
}: {
  products: Product[];
  categories: string[];
  initialCategory: string;
}) {
  const [category, setCategory] = useState(initialCategory);

  const visible = useMemo(
    () =>
      category === 'All'
        ? products
        : products.filter((product) => product.category === category),
    [products, category],
  );

  return (
    <>
      {/* Pill radius is reserved for these. The sweep fills with ember when the
          chip is the selected one, and with ink when it is not. */}
      <div className="chips" role="group" aria-label="Filter by category">
        {categories.map((name) => (
          <button
            key={name}
            type="button"
            className="btn btn--secondary btn--sm chip"
            aria-pressed={category === name}
            onClick={() => setCategory(name)}
          >
            {name}
          </button>
        ))}
      </div>

      <p className="count" aria-live="polite">
        {visible.length} {visible.length === 1 ? 'piece' : 'pieces'}
      </p>

      {visible.length === 0 ? (
        <div className="empty">
          <h2>Nothing in {category} yet</h2>
          <p>
            We make new pieces most months. Everything we have made so far is under
            All — or tell us what you want and we will cut it.
          </p>
          <div className="row" style={{ justifyContent: 'center' }}>
            <button
              type="button"
              className="btn btn--secondary"
              onClick={() => setCategory('All')}
            >
              Show everything
            </button>
            <Link className="btn" href="/create">
              Create Your Gift
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid">
          {visible.map((product, index) => (
            <ProductCard
              key={product.slug}
              product={product}
              priority={index < 4}
              revealDelay={(index % 4) * 60}
            />
          ))}
        </div>
      )}
    </>
  );
}
