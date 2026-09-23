import Image from 'next/image';
import Link from 'next/link';
import { ProductCard } from '@/components/ProductCard';
import { Newsletter } from '@/components/Newsletter';
import { reveal } from '@/lib/reveal';
import { getProducts } from '@/lib/products';
import { PROMISES } from '@/lib/site';

/** The shelf: three real pieces stood on one line. Optical sizes, not equal ones. */
/** The piece that leads the page. The most striking thing in the catalogue. */
const HERO_SLUG = 'golden-gate-bridge';

/* The shelf takes the ship board where the Golden Gate used to sit, since the
   hero now carries that one. Nothing on this page appears twice. */
const SHELF = [
  { slug: 'wanderer-bookmark', variant: 'a', caption: 'Wanderer Bookmark' },
  { slug: 'ship', variant: 'b', caption: 'Cutting Board with Ship' },
  { slug: 'dragon-coin', variant: 'c', caption: 'Book Dragon Coin' },
] as const;

/* Six pieces the shelf does not already show. The shelf and this grid sat
   three products apart before, so the top of the page introduced the same
   objects twice and the catalogue looked half its real size. */
const FEATURED = [
  'np-coasters',
  'dove',
  'tolkien-bookmark',
  'celtic-cross',
  'moon',
  'catalina',
];

const STEPS = [
  {
    n: '01',
    title: 'You Share Your Vision',
    body: 'Tell us what you want — a name, a date, a photo, a design. Our Create tool or a simple message is all it takes.',
  },
  {
    n: '02',
    title: 'We Design & Preview',
    body: 'We compose your design and send a visual proof before anything is engraved. You approve it — or we refine it.',
  },
  {
    n: '03',
    title: 'Precision Engraving',
    body: 'Your piece is laser-engraved on premium hardwood with professional equipment, hand-finished in California.',
  },
  {
    n: '04',
    title: 'Delivered to Your Door',
    body: 'Carefully packaged and shipped within 3–5 business days. A lasting keepsake, ready to give.',
  },
];

const TESTIMONIALS = [
  {
    quote:
      '“The detail on the Golden Gate Bridge plaque is unreal. It looks like something you’d find in a high-end boutique, not a small business.”',
    who: '— Sarah',
  },
  {
    quote:
      '“Bought the Wooden Dove Plaque as a personalized gift for my mom. She actually teared up. The quality and the scripture on it made it feel really special.”',
    who: '— James',
  },
  {
    quote:
      '“Came quickly, packaged beautifully, and the engraving was crisp and clean. Already ordered a second one.”',
    who: '— Matt',
  },
];

export default async function HomePage() {
  const products = await getProducts();
  const bySlug = (slug: string) => products.find((p) => p.slug === slug);
  const featured = FEATURED.map(bySlug).filter(
    (p): p is NonNullable<typeof p> => Boolean(p),
  );
  const shelf = SHELF.map((entry) => ({ ...entry, product: bySlug(entry.slug) }));
  const heroPiece = bySlug(HERO_SLUG);

  return (
    <>
      {/* Hero — the one display-xl and the one ember element above the fold.
          The headline is split per word so each can wipe up from its own line.
          The delays are the first screen's choreography, in ms from the moment
          the fonts are in; the piece also waits on its own photograph. */}
      <section className="hero">
        <div className="wrap hero__in">
          <div className="hero__copy">
            <p className="eyebrow" {...reveal('rise', 40)}>
              Custom laser engraving
            </p>
            <h1 className="hero__title">
              <span className="hero__word" {...reveal('mask', 90)}>
                <span>Precision</span>
              </span>{' '}
              <span className="hero__word" {...reveal('mask', 180)}>
                <span>
                  <em>Laser</em>
                </span>
              </span>{' '}
              <span className="hero__word" {...reveal('mask', 270)}>
                <span>Engraved</span>
              </span>
            </h1>
            <p className="hero__blurb" {...reveal('rise', 380)}>
              A California studio cutting names, dates and designs into premium
              hardwood. You approve a proof before anything is engraved.
            </p>
            <div className="hero__cta" {...reveal('stagger', 460)}>
              <Link className="btn btn--lg" href="/create">
                Create Your Gift
              </Link>
              <Link className="btn btn--secondary btn--lg" href="/products">
                Browse Products
              </Link>
            </div>
            <p className="hero__assure" {...reveal('fade', 600)}>
              Free personalization · Design preview included · Ships in 3–5 days
            </p>
          </div>

          {heroPiece && heroPiece.images[0] ? (
            <div className="hero__piece">
              <span className="hero__object" {...reveal('object', 160)}>
                <Image
                  src={heroPiece.images[0].src}
                  alt={`${heroPiece.name}, engraved ${heroPiece.wood ?? 'hardwood'}`}
                  width={heroPiece.images[0].width}
                  height={heroPiece.images[0].height}
                  sizes="(max-width: 900px) 72vw, 460px"
                  priority
                />
              </span>
              <p className="hero__caption" {...reveal('fade', 720)}>
                <Link href={`/products/${heroPiece.slug}`}>
                  {heroPiece.name} · Poplar · Hand-finished
                </Link>
              </p>
            </div>
          ) : null}
        </div>
      </section>

      <div className="wrap">
        {/* Each piece links through. The object sits in its own wrapper so it
            can lift off a ground shadow instead of floating flat. On a wide
            screen the shelf sits along the bottom of the first view and follows
            the hero in; on a phone it's below the fold and cascades on arrival.
            Not preloaded: on a phone these three competed with the hero's own
            photograph for the connection and pushed it back by a second. */}
        <div className="shelf">
          {shelf.map(({ product, variant, caption }, index) =>
            product && product.images[0] ? (
              <Link
                key={product.slug}
                href={`/products/${product.slug}`}
                className={`shelf__item shelf--${variant}`}
                {...reveal('object', 660 + index * 100)}
              >
                <figure>
                  <span className="shelf__object">
                    <Image
                      src={product.images[0].src}
                      alt={`${product.name}, engraved ${product.wood ?? 'hardwood'}`}
                      width={product.images[0].width}
                      height={product.images[0].height}
                      sizes="(max-width: 420px) 30vw, (max-width: 860px) 26vw, 320px"
                    />
                  </span>
                  <figcaption>{caption}</figcaption>
                </figure>
              </Link>
            ) : null,
          )}
        </div>

        <ul className="spec" {...reveal('stagger')}>
          {PROMISES.map((promise) => (
            <li key={promise}>{promise}</li>
          ))}
        </ul>
      </div>

      <section className="wrap section" id="products">
        <div className="head head--split">
          <div {...reveal('stagger')}>
            <p className="eyebrow">Featured Work</p>
            <h2>
              Gallery of <em>Crafted Pieces</em>
            </h2>
          </div>
          <Link className="textlink" href="/products" {...reveal('fade')}>
            View all products →
          </Link>
        </div>
        <div className="grid grid--three">
          {featured.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </section>

      <hr className="rule" {...reveal('line')} />

      <section className="wrap section">
        <div className="head" {...reveal('stagger')}>
          <p className="eyebrow">Our Process</p>
          <h2>
            From Idea to <em>Heirloom</em>
          </h2>
        </div>
        <div className="steps">
          {STEPS.map((step) => (
            <div className="step" key={step.n} {...reveal()}>
              <span className="step__n">{step.n}</span>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </div>
          ))}
        </div>
      </section>

      <hr className="rule" {...reveal('line')} />

      <section className="wrap section">
        <div className="head" {...reveal('stagger')}>
          <p className="eyebrow">What Customers Say</p>
          <h2>
            Words from <em>Real People</em>
          </h2>
        </div>
        <div className="quotes quotes--lead">
          <figure {...reveal()}>
            <blockquote>
              “I found Mozart Laser last minute before Mother&rsquo;s Day. The owner
              suggested switching to vertical orientation to better fit my photo — a
              detail I never would have thought of. My mom loved it. 10/10, between the
              carving and the support.”
            </blockquote>
            <figcaption>— Peyton</figcaption>
          </figure>
        </div>
        <div className="quotes">
          {TESTIMONIALS.map((item) => (
            <figure key={item.who} {...reveal()}>
              <blockquote>{item.quote}</blockquote>
              <figcaption>{item.who}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      <hr className="rule" {...reveal('line')} />

      <section className="wrap section" id="about">
        <div className="craft">
          <div {...reveal('stagger')}>
            <p className="eyebrow">Craftsmanship</p>
            <p className="craft__quote">
              “Every mark the laser makes is a mark that <em>lasts</em>.”
            </p>
          </div>
          <div {...reveal('stagger')}>
            <p>
              Mozart Laser is a California-based studio dedicated to the art of precision
              engraving. We work with premium hardwoods to create gifts and decor that
              carry meaning — personalized for the people who matter most.
            </p>
            <p>
              Whether you start from a product we&rsquo;ve designed or a blank page with
              your own idea, we treat every order as a collaboration. The result is
              something that feels genuinely made — because it is.
            </p>
            <dl className="stats">
              <div>
                <dt>100%</dt>
                <dd>Hand-finished</dd>
              </div>
              <div>
                <dt>3–5</dt>
                <dd>Day turnaround</dd>
              </div>
              <div>
                <dt>∞</dt>
                <dd>Custom orders</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      <section className="wrap" style={{ paddingBottom: 'var(--space-9)' }}>
        <div className="promise" {...reveal()}>
          <h2>Not happy with your order? We&rsquo;ll make it right.</h2>
          <p>
            Every Mozart Laser piece is backed by our satisfaction guarantee — reach out
            and we&rsquo;ll fix it, no hassle.
          </p>
        </div>
      </section>

      <section className="band" id="create">
        <div className="wrap band__in" {...reveal('stagger')}>
          <p className="eyebrow">Made to order</p>
          <h2>
            Ready to <em>Create?</em>
          </h2>
          <p>
            Tell us your idea — we handle everything else. Custom gifts starting at
            $5.99. Free personalization on every order.
          </p>
          <Link className="btn btn--inverse btn--lg" href="/create">
            Start Your Custom Order
          </Link>
          <p className="band__or">
            Or <Link href="/products">browse ready-made products</Link>
          </p>
        </div>
      </section>

      <div className="wrap">
        <Newsletter />
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            itemListElement: products.slice(0, 6).map((product, index) => ({
              '@type': 'ListItem',
              position: index + 1,
              url: `https://mozartlaser.com/products/${product.slug}`,
              name: product.name,
            })),
          }),
        }}
      />
    </>
  );
}
