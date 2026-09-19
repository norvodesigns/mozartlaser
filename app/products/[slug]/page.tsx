import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { AddToCart } from '@/components/AddToCart';
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
    // The old site shipped the same description on every product page.
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

  const related = getRelated(product.slug);
  const saving = product.compareAtPrice
    ? product.compareAtPrice - product.price
    : null;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.images,
    material: product.material.split('·')[0]?.trim(),
    brand: { '@type': 'Brand', name: 'Mozart Laser' },
    offers: {
      '@type': 'Offer',
      price: product.price.toFixed(2),
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      url: `https://mozartlaser.com/products/${product.slug}`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <section className="section">
        <div className="container product">
          <ProductGallery
            images={product.images}
            name={product.name}
            material={product.material}
          />

          <div className="product__info">
            <div className="stack" style={{ gap: 'var(--space-3)' }}>
              <p className="eyebrow" style={{ color: 'var(--ink-subtle)' }}>
                <Link href={`/products?category=${encodeURIComponent(product.category)}`}>
                  {product.category.toUpperCase()}
                </Link>
              </p>
              <h1 className="product__title">{product.name}</h1>
            </div>

            <div className="product__price-row">
              <span className="product__price">{formatPrice(product.price)}</span>
              {product.compareAtPrice ? (
                <>
                  <span className="product__price-was">
                    {formatPrice(product.compareAtPrice)}
                  </span>
                  <span className="ml-badge">
                    SAVE {formatPrice(saving ?? 0)}
                  </span>
                </>
              ) : null}
            </div>

            <p className="product__meta">
              {product.wood ? (
                <span
                  className={`ml-swatch ml-swatch--${product.wood}`}
                  aria-hidden="true"
                />
              ) : null}
              {product.material}
            </p>

            <hr className="rule" />

            <p className="product__desc">{product.description}</p>

            {product.bullets.length > 0 ? (
              <ul className="product__bullets">
                {product.bullets.map((bullet) => (
                  <li key={bullet}>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            ) : null}

            <AddToCart product={product} />

            {/* The homepage carries the trust row, so this page states the
                same promises as a line rather than repeating the component. */}
            <p className="product__note">
              Design preview · Ships in 3–5 days · Hand-finished in California
            </p>
          </div>
        </div>
      </section>

      {related.length > 0 ? (
        <section className="section section--sunken">
          <div className="container">
            <div className="ml-section-head section__head">
              <p className="ml-section-head__eyebrow">More from the shop</p>
              <h2 className="ml-section-head__title">
                You might also <em>like</em>
              </h2>
            </div>
            <div className="product-grid">
              {related.map((item) => (
                <ProductCard key={item.slug} product={item} />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
