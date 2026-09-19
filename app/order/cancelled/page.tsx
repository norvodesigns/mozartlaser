import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Checkout cancelled',
  description: 'Your Mozart Laser checkout was cancelled.',
  robots: { index: false, follow: false },
};

export default function CancelledPage() {
  return (
    <section className="container status-page">
      <div className="ml-section-head">
        <p className="ml-section-head__eyebrow">Checkout cancelled</p>
        <h1 className="ml-section-head__title">
          Nothing was <em>charged</em>
        </h1>
        <p className="ml-section-head__lede">
          Your cart is still here, exactly as you left it. Pick up where you stopped,
          or email us if something in checkout did not work.
        </p>
      </div>
      <div className="row" style={{ justifyContent: 'center' }}>
        <Link href="/products" className="ml-btn">
          Back to the shop
        </Link>
        <a href="mailto:mozartlaser@gmail.com" className="ml-btn ml-btn--secondary">
          Email the studio
        </a>
      </div>
    </section>
  );
}
