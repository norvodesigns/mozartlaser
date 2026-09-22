import type { Metadata } from 'next';
import { getCategories, getProducts } from '@/lib/products';
import { ProductsBrowser } from './ProductsBrowser';

export const metadata: Metadata = {
  title: 'Products',
  description:
    'Every piece in the shop: laser engraved plaques, bookmarks, coasters, coins and cutting boards in poplar, pine and acacia. Hand-finished in California, ships in 3–5 days.',
  alternates: { canonical: '/products' },
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { category?: string };
}) {
  const [products, categories] = await Promise.all([getProducts(), getCategories()]);
  const requested = searchParams.category;
  const initialCategory =
    requested && categories.includes(requested) ? requested : 'All';

  return (
    <section className="wrap section">
      <div className="head">
        <p className="eyebrow">The shop</p>
        <h1>
          Gallery of <em>Crafted Pieces</em>
        </h1>
        <p className="lede">
          Twenty-two pieces, cut and finished to order. Anything here can carry a name,
          a date or a design of your own.
        </p>
      </div>

      <ProductsBrowser
        products={products}
        categories={categories}
        initialCategory={initialCategory}
      />
    </section>
  );
}
