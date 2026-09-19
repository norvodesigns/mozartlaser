import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ProductBuy } from '@/components/ProductBuy';
import { ProductCard } from '@/components/ProductCard';
import { ProductGallery } from '@/components/ProductGallery';
import { formatPrice, getProduct, getProducts, getRelated } from '@/lib/products';

export function generateStaticParams() {
  return getProducts().map((product) => ({ slug: product.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const product = getProduct(params.slug);
  if (!product) return { title: 'Product not found' };

  return {
    title: product.name,
    // The old site shipped one description, about a train, on every product.
    description: `${product.description.slice(0, 150)}… ${product.material}. Ships in 3–5 days.`,
    alternates: { canonical: `/products/${product.slug}` },
    openGraph: {
      title: `${product.name} | Mozart Laser`,
      description: product.description,
      images: product.images[0] ? [product.images[0]] : undefined,
      type: 'website',
    },
  };
}

export default function ProductPage({ params }: { params: { slug: string } }) {
  const product = getProduct(params.slug);
  if (!product) notFound();

  const related = getRelated(product.slug, 3);
  const onSale = product.compareAtPrice !== null;
  const woodName = product.wood ?? product.material.split('·')[0]?.trim().toLowerCase();

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.images.map((src) => `https://mozartlaser.com${src}`),
    material: product.material.split('·')[0]?.trim(),
    brand: { '@type': 'Brand', name: 'Mozart Laser' },
    offers: {
      '@type': 'Offer',
      price: product.price.toFixed(2),
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      itemCondition: 'https://schema.org/NewCondition',
      url: `https://mozartlaser.com/products/${product.slug}`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <section className="wrap section">
        <div className="pdp">
          <ProductGallery
            images={product.images}
            name={product.name}
            wood={woodName}
          />

          <div className="pdp__info">
            <div className="stack" style={{ gap: 'var(--space-3)' }}>
              <p className="eyebrow">
                <Link href={`/products?category=${encodeURIComponent(product.category)}`}>
                  {product.category}
                </Link>
              </p>
              <h1 className="pdp__title">{product.name}</h1>
            </div>

            <p className="pdp__price">
              {onSale ? (
                <>
                  <s>{formatPrice(product.compareAtPrice as number)}</s>
                  <span className="now now--sale">{formatPrice(product.price)}</span>
                </>
              ) : (
                <span className="now">{formatPrice(product.price)}</span>
              )}
            </p>

            <p className="pdp__meta">
              {product.wood ? (
                <span className={`swatch swatch--${product.wood}`} aria-hidden="true" />
              ) : null}
              {product.material}
            </p>

            <hr className="rule" />

            <p className="pdp__desc">{product.description}</p>

            {product.bullets.length > 0 ? (
              <ul className="pdp__bullets">
                {product.bullets.map((bullet) => (
                  <li key={bullet}>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            ) : null}

            <ProductBuy product={product} />

            {/* The homepage carries the spec strip, so this states the same
                promises as a line rather than repeating the component. */}
            <p className="pdp__note">
              Design preview included · Ships in 3–5 days · Hand-finished in California
            </p>
          </div>
        </div>
      </section>

      {related.length > 0 ? (
        <section className="wrap section">
          <hr className="rule" style={{ marginBottom: 'var(--space-8)' }} />
          <div className="head head--sub">
            <p className="eyebrow">More from the shop</p>
            <h2>
              You might also <em>like</em>
            </h2>
          </div>
          <div className="grid grid--three">
            {related.map((item, index) => (
              <ProductCard key={item.slug} product={item} revealDelay={index * 60} />
            ))}
          </div>
        </section>
      ) : null}
    </>
  );
}
