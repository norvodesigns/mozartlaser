import type { Metadata } from 'next';
import { categories, getProducts } from '@/lib/products';
import { ProductsBrowser } from './ProductsBrowser';

export const metadata: Metadata = {
  title: 'Products',
  description:
    'Every piece in the shop: laser engraved plaques, bookmarks, coasters, coins and cutting boards in poplar, pine and acacia. Hand-finished in California.',
  alternates: { canonical: '/products' },
};

export default function ProductsPage({
  searchParams,
}: {
  searchParams: { category?: string };
}) {
  const products = getProducts();
  const requested = searchParams.category;
  const initialCategory =
    requested && categories.includes(requested) ? requested : 'All';

  return (
    <section className="section">
      <div className="container">
        <div className="ml-section-head section__head">
          <p className="ml-section-head__eyebrow">The shop</p>
          <h1 className="ml-section-head__title">
            Crafted <em>pieces</em>
          </h1>
          <p className="ml-section-head__lede">
            Twenty-two pieces, cut and finished to order. Anything here can carry a
            name, a date or a design of your own.
          </p>
        </div>

        <ProductsBrowser
          products={products}
          categories={categories}
          initialCategory={initialCategory}
        />
      </div>
    </section>
  );
}
