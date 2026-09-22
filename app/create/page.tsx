import type { Metadata } from 'next';
import { getProducts } from '@/lib/products';
import { CreateFlow } from './CreateFlow';

export const metadata: Metadata = {
  title: 'Custom orders',
  description:
    'Tell us what you want — a name, a date, a photo, a design. We draw a proof before anything is cut, and hand-finish it in California.',
  alternates: { canonical: '/create' },
};

export default async function CreatePage({
  searchParams,
}: {
  searchParams: { product?: string; text?: string };
}) {
  const products = await getProducts();
  const initialSlug =
    searchParams.product && products.some((p) => p.slug === searchParams.product)
      ? searchParams.product
      : null;

  return (
    <section className="section">
      <div className="wrap">
        <div className="head">
          <p className="eyebrow">Free personalization</p>
          <h1>
            Tell us what you <em>want</em>
          </h1>
          <p className="lede">
            A name, a date, a photo, a design. Answer three short steps and we will
            send a proof before anything is cut.
          </p>
        </div>

        <CreateFlow
          products={products}
          initialSlug={initialSlug}
          initialText={(searchParams.text ?? "").slice(0, 60)}
        />
      </div>
    </section>
  );
}
