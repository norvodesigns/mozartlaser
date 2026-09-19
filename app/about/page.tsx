import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About',
  description:
    'Mozart Laser is a small Christian studio in California making laser engraved pieces. Craftsmanship matters, meaning matters, and every order is handled personally.',
  alternates: { canonical: '/about' },
};

const VALUES = [
  {
    term: 'Craftsmanship',
    detail:
      'Every piece is designed with intention and engraved with care. We do not cut corners — we cut wood, precisely, and finish everything by hand.',
  },
  {
    term: 'Meaning',
    detail:
      'We create pieces that carry weight — scripture, landmarks, personal moments. Things worth keeping. Things worth giving.',
  },
  {
    term: 'Excellence',
    detail:
      'We only ship what we would be proud to display in our own home. If it is not right, we run it again until it is.',
  },
];

export default function AboutPage() {
  return (
    <>
      <section className="section section--hero">
        <div className="container">
          <div className="ml-section-head">
            <p className="ml-section-head__eyebrow">Mozart Laser · California</p>
            <h1 className="ml-section-head__title">
              About <em>us</em>
            </h1>
            <p className="ml-section-head__lede">
              Small business. Big care. Made in California.
            </p>
          </div>
        </div>
      </section>

      <section className="section--tight">
        <div className="container">
          <dl className="ml-trust">
            <div className="ml-trust__item">
              <dt className="ml-trust__term">Hand-finished</dt>
              <dd className="ml-trust__detail">Every piece, without exception</dd>
            </div>
            <div className="ml-trust__item">
              <dt className="ml-trust__term">3–5 day turnaround</dt>
              <dd className="ml-trust__detail">Cut and finished to order</dd>
            </div>
            <div className="ml-trust__item">
              <dt className="ml-trust__term">Made in California</dt>
              <dd className="ml-trust__detail">One studio, one pair of hands</dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="section">
        <div className="container split">
          <div className="ml-section-head">
            <p className="ml-section-head__eyebrow">Who we are</p>
            <h2 className="ml-section-head__title">
              A small Christian <em>studio</em> in California
            </h2>
            <p className="ml-section-head__lede">
              Mozart Laser is a small Christian company based in California dedicated
              to bringing beauty into people&rsquo;s homes through laser engravings.
            </p>
            <p className="body text-muted">
              We believe craftsmanship matters, meaning matters, and the things you
              surround yourself with should point to what is good, true, and lasting.
              Every piece we create is designed with intention and engraved with care —
              whether it is a meaningful scripture plaque, a custom keepsake, or a
              timeless decorative piece.
            </p>
          </div>
          <div className="split__media">
            <Image
              src="/media/workshop.jpeg"
              alt="The Mozart Laser workshop, with finished pieces on the bench"
              width={1200}
              height={900}
              sizes="(max-width: 900px) 100vw, 560px"
            />
          </div>
        </div>
      </section>

      <section className="section section--sunken">
        <div className="container">
          <div className="ml-section-head section__head">
            <p className="ml-section-head__eyebrow">What we hold to</p>
            <h2 className="ml-section-head__title">
              Three things we do not <em>bend</em> on
            </h2>
          </div>
          <div className="product-grid">
            {VALUES.map((value) => (
              <div key={value.term} className="stack" style={{ gap: 'var(--space-3)' }}>
                <hr className="rule" />
                <h3 className="display-s">{value.term}</h3>
                <p className="body text-muted">{value.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <figure className="ml-quote">
            <blockquote className="ml-quote__text">
              Our mission is to create engraved pieces that inspire faith, spark
              conversation, and stand the test of time.
            </blockquote>
            <figcaption className="ml-quote__attr">
              Caleb · founder · Mozart Laser
            </figcaption>
          </figure>
        </div>
      </section>

      <section className="section section--sunken">
        <div className="container">
          <div className="ml-section-head section__head section__head--center">
            <p className="ml-section-head__eyebrow">Get in touch</p>
            <h2 className="ml-section-head__title">
              Let&rsquo;s make something <em>together</em>
            </h2>
            <p className="ml-section-head__lede">
              Questions, custom orders, or just want to say hi — we would love to hear
              from you. Every order is handled personally, from design to finishing.
            </p>
          </div>
          <div className="row" style={{ justifyContent: 'center' }}>
            <Link href="/create" className="ml-btn ml-btn--lg">
              Start your order
            </Link>
            <a
              href="mailto:mozartlaser@gmail.com"
              className="ml-btn ml-btn--secondary ml-btn--lg"
            >
              mozartlaser@gmail.com
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
