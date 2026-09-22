import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Checkout cancelled',
  description: 'Your Mozart Laser checkout was cancelled.',
  robots: { index: false, follow: false },
};

export default function CancelledPage() {
  return (
    <section className="wrap status">
      <div className="head head--center">
        <p className="eyebrow">Checkout cancelled</p>
        <h1>
          Nothing was <em>charged</em>
        </h1>
        <p className="lede">
          Your cart is still here, exactly as you left it. Pick up where you stopped,
          or email us if something in checkout did not work.
        </p>
      </div>
      <div className="row" style={{ justifyContent: 'center' }}>
        <Link href="/products" className="btn">
          Back to the shop
        </Link>
        <a href="mailto:mozartlaser@gmail.com" className="btn btn--secondary">
          Email the studio
        </a>
      </div>
    </section>
  );
}
