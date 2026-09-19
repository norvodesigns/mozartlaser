import Image from 'next/image';
import Link from 'next/link';
import { formatPrice, type Product } from '@/lib/products';

/** The whole tile is one link, so there is never a second action inside it. */
export function ProductCard({
  product,
  priority = false,
}: {
  product: Product;
  priority?: boolean;
}) {
  const [hero] = product.images;
  const dimension = product.material.split('·')[1]?.trim();
  const woodName = product.wood
    ? product.wood.charAt(0).toUpperCase() + product.wood.slice(1)
    : product.material.split('·')[0]?.trim();

  return (
    <Link href={`/products/${product.slug}`} className="ml-card">
      <div className="ml-card__media">
        {hero ? (
          <Image
            src={hero}
            alt={`${product.name} in ${woodName?.toLowerCase() ?? 'wood'}`}
            width={800}
            height={600}
            className="card-media-img"
            sizes="(max-width: 560px) 50vw, (max-width: 1000px) 33vw, 280px"
            priority={priority}
          />
        ) : null}
      </div>
      <div className="ml-card__body">
        {product.custom ? (
          <span className="ml-badge" style={{ alignSelf: 'flex-start' }}>
            MADE TO ORDER
          </span>
        ) : null}
        <h3 className="ml-card__title">{product.name}</h3>
        <p className="ml-card__meta">
          {product.wood ? (
            <span className={`ml-swatch ml-swatch--${product.wood}`} aria-hidden="true" />
          ) : null}
          {[woodName, dimension].filter(Boolean).join(' · ')}
        </p>
        <p className="ml-card__price">
          {formatPrice(product.price)}
          {product.compareAtPrice ? (
            <span className="text-subtle">
              {' '}
              <s>{formatPrice(product.compareAtPrice)}</s>
            </span>
          ) : null}
        </p>
      </div>
    </Link>
  );
}
