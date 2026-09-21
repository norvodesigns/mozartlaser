import Image from 'next/image';
import Link from 'next/link';
import { formatPrice, type Product } from '@/lib/products';

/** Wood name plus one short fact — the card stays terse, the PDP carries the rest. */
function metaLine(product: Product): string {
  const parts = product.material.split('·').map((part) => part.trim());
  const wood = product.wood
    ? product.wood.charAt(0).toUpperCase() + product.wood.slice(1)
    : parts[0];
  const qualifier = parts[1] && parts[1].length <= 18 ? parts[1] : null;
  return [wood, qualifier].filter(Boolean).join(' · ');
}

/** The whole tile is one link, so the entire card is the target. */
export function ProductCard({
  product,
  priority = false,
  revealDelay,
}: {
  product: Product;
  priority?: boolean;
  revealDelay?: number;
}) {
  const [hero] = product.images;
  const onSale = product.compareAtPrice !== null;
  const woodName = product.wood ?? product.material.split('·')[0]?.trim().toLowerCase();

  return (
    <Link
      href={`/products/${product.slug}`}
      className="card"
      data-reveal
      data-reveal-delay={revealDelay}
    >
      <div className="card__media">
        {/* One tag only — two would stack in the same corner. */}
        {onSale ? (
          <span className="tag">Sale</span>
        ) : product.custom ? (
          <span className="tag">Made to order</span>
        ) : null}
        {hero ? (
          <Image
            src={hero.src}
            alt={`${product.name}, engraved ${woodName}`}
            width={hero.width}
            height={hero.height}
            sizes="(max-width: 560px) 45vw, (max-width: 1000px) 30vw, 260px"
            priority={priority}
          />
        ) : null}
      </div>
      <div className="card__body">
        <h3 className="card__title">{product.name}</h3>
        <p className="card__meta">
          {product.wood ? (
            <span className={`swatch swatch--${product.wood}`} aria-hidden="true" />
          ) : null}
          {metaLine(product)}
        </p>
        <p className="card__price">
          {onSale ? (
            <>
              <s>{formatPrice(product.compareAtPrice as number)}</s>
              <span className="sale">{formatPrice(product.price)}</span>
            </>
          ) : (
            <span>{formatPrice(product.price)}</span>
          )}
        </p>
        <span className="card__cta">View Product</span>
      </div>
    </Link>
  );
}
