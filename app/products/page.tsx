import type { Metadata } from 'next';
import { toCardProduct } from '@/components/ProductCard';
import { reveal } from '@/lib/reveal';
import { getCategories, getProducts } from '@/lib/products';
import { ProductsBrowser } from './ProductsBrowser';

export const metadata: Metadata = {
  title: 'Products',
  description:
    'Every piece in the shop: laser engraved plaques, bookmarks, coasters, coins and cutting boards in poplar, pine and acacia. Hand-finished in California, ships in 3–5 days.',
  alternates: { canonical: '/products' },
};

/* Static, not rendered per request: reading `searchParams` here made every
   visit a cold serverless render, and made the page impossible to prefetch —
   the header's link to it fetched nothing, so every click waited on the
   server. The ?category= a PDP links with is read on the client instead. */
export default async function ProductsPage() {
  const [products, categories] = await Promise.all([getProducts(), getCategories()]);

  return (
    <section className="wrap section">
      <div className="head" {...reveal('stagger')}>
        <p className="eyebrow">The shop</p>
        <h1>
          Gallery of <em>Crafted Pieces</em>
        </h1>
        <p className="lede">
          Twenty-two pieces, cut and finished to order. Anything here can carry a name,
          a date or a design of your own.
        </p>
      </div>

      <ProductsBrowser products={products.map(toCardProduct)} categories={categories} />
    </section>
  );
}
