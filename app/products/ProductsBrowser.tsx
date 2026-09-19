'use client';

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
      {/* Filter chips are the one place radius-pill is allowed. */}
      <div className="filter-row" role="group" aria-label="Filter by category">
        {categories.map((name) => (
          <button
            key={name}
            type="button"
            className="ml-btn ml-btn--secondary ml-btn--sm filter-chip"
            aria-pressed={category === name}
            onClick={() => setCategory(name)}
          >
            {name}
          </button>
        ))}
      </div>

      <p className="body-sm text-subtle" aria-live="polite" style={{ marginBottom: 'var(--space-5)' }}>
        {visible.length} {visible.length === 1 ? 'piece' : 'pieces'}
      </p>

      <div className="product-grid">
        {visible.map((product, index) => (
          <ProductCard key={product.slug} product={product} priority={index < 4} />
        ))}
      </div>
    </>
  );
}
