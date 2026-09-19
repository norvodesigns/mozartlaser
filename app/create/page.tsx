import type { Metadata } from 'next';
import { getProducts } from '@/lib/products';
import { CreateFlow } from './CreateFlow';

export const metadata: Metadata = {
  title: 'Custom orders',
  description:
    'Tell us what you want — a name, a date, a photo, a design. We draw a proof before anything is cut, and hand-finish it in California.',
  alternates: { canonical: '/create' },
};

export default function CreatePage({
  searchParams,
}: {
  searchParams: { product?: string };
}) {
  const products = getProducts();
  const initialSlug =
    searchParams.product && products.some((p) => p.slug === searchParams.product)
      ? searchParams.product
      : null;

  return (
    <section className="section">
      <div className="container">
        <div className="ml-section-head section__head">
          <p className="ml-section-head__eyebrow">Free personalization</p>
          <h1 className="ml-section-head__title">
            Tell us what you <em>want</em>
          </h1>
          <p className="ml-section-head__lede">
            A name, a date, a photo, a design. Answer three short steps and we will
            send a proof before anything is cut.
          </p>
        </div>

        <CreateFlow products={products} initialSlug={initialSlug} />
      </div>
    </section>
  );
}
