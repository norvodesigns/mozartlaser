import type { Metadata } from 'next';
import Link from 'next/link';
import { CONTACT_EMAIL, PROMISES } from '@/lib/site';

export const metadata: Metadata = {
  title: 'About',
  description:
    'Mozart Laser is a California-based studio dedicated to the art of precision engraving. One person, premium hardwoods, every order handled personally.',
  alternates: { canonical: '/about' },
};

export default function AboutPage() {
  return (
    <>
      <section className="wrap section">
        <div className="head">
          <p className="eyebrow">Mozart Laser · California</p>
          <h1>
            Every mark the laser makes is a mark that <em>lasts</em>
          </h1>
          <p className="lede">
            Small business. Big care. Hand-finished in California, one piece at a time.
          </p>
        </div>
      </section>

      <div className="wrap">
        <ul className="spec" data-reveal>
          {PROMISES.map((promise) => (
            <li key={promise}>{promise}</li>
          ))}
        </ul>
      </div>

      <section className="wrap section">
        <div className="craft">
          <div data-reveal>
            <p className="eyebrow">Who we are</p>
            <p className="craft__quote">
              A small Christian studio in <em>California</em>
            </p>
          </div>
          <div data-reveal data-reveal-delay={90}>
            <p>
              Mozart Laser is a small Christian company based in California dedicated to
              bringing beauty into people&rsquo;s homes through laser engravings. We
              believe craftsmanship matters, meaning matters, and the things you
              surround yourself with should point to what is good, true, and lasting.
            </p>
            <p>
              Every piece we create is designed with intention and engraved with care —
              whether it is a meaningful scripture plaque, a custom keepsake, or a
              timeless decorative piece. Whether you start from a product we&rsquo;ve
              designed or a blank page with your own idea, we treat every order as a
              collaboration.
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

      <hr className="rule" />

      <section className="wrap section">
        <div className="head">
          <p className="eyebrow">What we hold to</p>
          <h2>
            Three things we do not <em>bend</em> on
          </h2>
        </div>
        <div className="steps">
          <div className="step" data-reveal>
            <span className="step__n">01</span>
            <h3>Craftsmanship</h3>
            <p>
              Every piece is designed with intention and engraved with care. We
              don&rsquo;t cut corners — we cut wood, precisely, and finish everything by
              hand.
            </p>
          </div>
          <div className="step" data-reveal data-reveal-delay={60}>
            <span className="step__n">02</span>
            <h3>Meaning</h3>
            <p>
              We create pieces that carry weight — scripture, landmarks, personal
              moments. Things worth keeping. Things worth giving.
            </p>
          </div>
          <div className="step" data-reveal data-reveal-delay={120}>
            <span className="step__n">03</span>
            <h3>Excellence</h3>
            <p>
              We only ship what we&rsquo;d be proud to display in our own home. If
              it&rsquo;s not right, we run it again until it is.
            </p>
          </div>
        </div>
      </section>

      <hr className="rule" />

      <section className="wrap section">
        <div className="quotes quotes--lead">
          <figure data-reveal>
            <blockquote>
              “Our mission is to create engraved pieces that inspire faith, spark
              conversation, and stand the test of time.”
            </blockquote>
            <figcaption>— Caleb, founder</figcaption>
          </figure>
        </div>
      </section>

      <section className="band">
        <div className="wrap band__in" data-reveal>
          <p className="eyebrow">Get in touch</p>
          <h2>
            Let&rsquo;s make something <em>together</em>
          </h2>
          <p>
            Questions, custom orders, or just want to say hi — we&rsquo;d love to hear
            from you. Every order is handled personally, from design to finishing.
          </p>
          <Link className="btn btn--inverse btn--lg" href="/create">
            Start Your Custom Order
          </Link>
          <p className="band__or">
            Or email <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
          </p>
        </div>
      </section>
    </>
  );
}
