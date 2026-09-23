import type { Metadata } from 'next';
import { reveal } from '@/lib/reveal';
import { getProducts } from '@/lib/products';
import { CreateFlow } from './CreateFlow';

export const metadata: Metadata = {
  title: 'Custom orders',
  description:
    'Tell us what you want — a name, a date, a photo, a design. We draw a proof before anything is cut, and hand-finish it in California.',
  alternates: { canonical: '/create' },
};

/* Static, so it's served from the edge and prefetched from every link to it.
   The ?product=&text= a product page hands over is read in the flow itself.
   Only the three fields the picker draws are sent to the client — the full
   catalogue with every description and bullet list made this the heaviest
   page on the site. */
export default async function CreatePage() {
  const products = (await getProducts()).map((product) => ({
    slug: product.slug,
    name: product.name,
    images: product.images.slice(0, 1),
  }));

  return (
    <section className="section">
      <div className="wrap">
        <div className="head" {...reveal('stagger')}>
          <p className="eyebrow">Free personalization</p>
          <h1>
            Tell us what you <em>want</em>
          </h1>
          <p className="lede">
            A name, a date, a photo, a design. Answer three short steps and we will
            send a proof before anything is cut.
          </p>
        </div>

        <CreateFlow products={products} />
      </div>
    </section>
  );
}
