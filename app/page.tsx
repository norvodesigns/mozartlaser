import Link from 'next/link';
import Image from 'next/image';
import { ProductCard } from '@/components/ProductCard';
import { getProducts } from '@/lib/products';
import { posts } from '@/lib/posts';

export default function HomePage() {
  const products = getProducts();
  // The pieces that best show the range: a board, a plaque, a bookmark, a set.
  const featuredSlugs = ['ship', 'moon', 'wanderer-bookmark', 'np-coasters'];
  const featured = featuredSlugs
    .map((slug) => products.find((p) => p.slug === slug))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));
  const latest = posts[0];

  return (
    <>
      {/* Hero — the one display-xl and the one ember element above the fold. */}
      <section className="section section--hero">
        <div className="container hero">
          <div className="hero__copy">
            <p className="eyebrow" style={{ color: 'var(--ember)' }}>
              PRECISION LASER ENGRAVED
            </p>
            <h1 className="hero__title">
              Wood that keeps a <em>record</em>
            </h1>
            <p className="hero__lede">
              Plaques, bookmarks, coasters and cutting boards, engraved in poplar,
              pine and acacia. Every piece crafted with care, built to last.
            </p>
            <div className="hero__actions">
              <Link href="/products" className="ml-btn ml-btn--lg">
                Browse products
              </Link>
              <Link href="/create" className="ml-btn ml-btn--secondary ml-btn--lg">
                Make something custom
              </Link>
            </div>
          </div>
          <div className="hero__media">
            <Image
              src="/products/ship/display.jpg"
              alt="An acacia cutting board with a ship engraved into the grain, on a workbench"
              width={1200}
              height={1500}
              priority
              sizes="(max-width: 900px) 100vw, 560px"
            />
          </div>
        </div>
      </section>

      {/* The three promises, held between two hairlines. Once per page. */}
      <section className="section--tight">
        <div className="container">
          <dl className="ml-trust">
            <div className="ml-trust__item">
              <dt className="ml-trust__term">Hand-finished in California</dt>
              <dd className="ml-trust__detail">Sanded, sealed and polished by hand</dd>
            </div>
            <div className="ml-trust__item">
              <dt className="ml-trust__term">Ships in 3–5 days</dt>
              <dd className="ml-trust__detail">Cut and finished to order, not stocked</dd>
            </div>
            <div className="ml-trust__item">
              <dt className="ml-trust__term">Design preview included</dt>
              <dd className="ml-trust__detail">You approve the proof before we cut</dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="ml-section-head section__head">
            <p className="ml-section-head__eyebrow">Made this month</p>
            <h2 className="ml-section-head__title">
              Crafted <em>pieces</em>
            </h2>
            <p className="ml-section-head__lede">
              Four of the twenty-two pieces in the shop. Each one is cut, finished and
              packed by hand.
            </p>
          </div>
          <div className="product-grid">
            {featured.map((product, index) => (
              <ProductCard key={product.slug} product={product} priority={index < 2} />
            ))}
          </div>
          <div className="row" style={{ marginTop: 'var(--space-7)' }}>
            <Link href="/products" className="ml-btn ml-btn--secondary">
              See all products
            </Link>
          </div>
        </div>
      </section>

      {/* Personalisation: text beside the image, never over it. */}
      <section className="section section--sunken">
        <div className="container split">
          <div className="ml-section-head">
            <p className="ml-section-head__eyebrow">Free personalization</p>
            <h2 className="ml-section-head__title">
              Tell us what you <em>want</em>
            </h2>
            <p className="ml-section-head__lede">
              A name, a date, a photo, a design. Send it over and we will draw up a
              proof before anything is cut.
            </p>
            <div className="row" style={{ marginTop: 'var(--space-3)' }}>
              <Link href="/create" className="ml-btn">
                Start your order
              </Link>
            </div>
          </div>
          <div className="split__media">
            <Image
              src="/products/animal-plaque/display.jpg"
              alt="A pet photograph engraved into a pine plaque, held in one hand for scale"
              width={1200}
              height={900}
              sizes="(max-width: 900px) 100vw, 560px"
            />
          </div>
        </div>
      </section>

      {/* The quote is the section: space-9 above and below, nothing beside it. */}
      <section className="section">
        <div className="container">
          <figure className="ml-quote">
            <blockquote className="ml-quote__text">
              Craftsmanship matters. Meaning matters. The things you surround yourself
              with should point to what is good, true, and lasting.
            </blockquote>
            <figcaption className="ml-quote__attr">
              Caleb · founder · Mozart Laser
            </figcaption>
          </figure>
        </div>
      </section>

      {latest ? (
        <section className="section section--sunken">
          <div className="container split split--reverse">
            <div className="ml-section-head">
              <p className="ml-section-head__eyebrow">From the journal</p>
              <h2
                className="ml-section-head__title"
                dangerouslySetInnerHTML={{ __html: latest.titleHtml }}
              />
              <p className="ml-section-head__lede">{latest.subtitle}</p>
              <div className="row" style={{ marginTop: 'var(--space-3)' }}>
                <Link href={`/blog/${latest.slug}`} className="ml-btn ml-btn--secondary">
                  Read the story
                </Link>
              </div>
            </div>
            {latest.hero ? (
              <div className="split__media">
                <Image
                  src={latest.hero.src}
                  alt={latest.hero.alt}
                  width={1200}
                  height={900}
                  sizes="(max-width: 900px) 100vw, 560px"
                />
              </div>
            ) : null}
          </div>
        </section>
      ) : null}
    </>
  );
}
