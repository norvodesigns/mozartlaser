'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useLayoutEffect, useMemo, useState } from 'react';
import { ProductCard, type CardProduct } from '@/components/ProductCard';
import { reveal } from '@/lib/reveal';

/**
 * Applies ?category= from the URL. Its own Suspense boundary keeps the
 * search-param read from pulling the grid out of the prerendered HTML — only
 * this renders client-side. A layout effect, so arriving from a PDP's
 * category link commits the filtered grid before the first paint.
 */
function CategoryFromUrl({
  categories,
  onCategory,
}: {
  categories: string[];
  onCategory: (category: string) => void;
}) {
  const requested = useSearchParams().get('category');
  useLayoutEffect(() => {
    if (requested && categories.includes(requested)) onCategory(requested);
  }, [requested, categories, onCategory]);
  return null;
}

export function ProductsBrowser({
  products,
  categories,
}: {
  products: CardProduct[];
  categories: string[];
}) {
  const [category, setCategory] = useState('All');

  const visible = useMemo(
    () =>
      category === 'All'
        ? products
        : products.filter((product) => product.category === category),
    [products, category],
  );

  return (
    <>
      <Suspense fallback={null}>
        <CategoryFromUrl categories={categories} onCategory={setCategory} />
      </Suspense>

      {/* Pill radius is reserved for these. The sweep fills with ember when the
          chip is the selected one, and with ink when it is not. */}
      <div className="chips" role="group" aria-label="Filter by category" {...reveal('stagger')}>
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

      <p className="count" aria-live="polite" {...reveal('fade')}>
        {visible.length} {visible.length === 1 ? 'piece' : 'pieces'}
      </p>

      {visible.length === 0 ? (
        <div className="empty" {...reveal()}>
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
            <ProductCard key={product.slug} product={product} priority={index < 2} />
          ))}
        </div>
      )}
    </>
  );
}
