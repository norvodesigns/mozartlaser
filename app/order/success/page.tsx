import type { Metadata } from 'next';
import Link from 'next/link';
import { ClearCart } from './ClearCart';

export const metadata: Metadata = {
  title: 'Order confirmed',
  description: 'Your Mozart Laser order is confirmed.',
  robots: { index: false, follow: false },
};

export default function SuccessPage() {
  return (
    <section className="container status-page">
      <ClearCart />
      <div className="ml-section-head">
        <p className="ml-section-head__eyebrow">Order confirmed</p>
        <h1 className="ml-section-head__title">
          Thank you — we are <em>on</em> it
        </h1>
        <p className="ml-section-head__lede">
          A receipt is on its way to your inbox. We cut and finish to order, so your
          piece ships in 3–5 days. If it carries a custom design, we will email a proof
          before anything is cut.
        </p>
      </div>
      <div className="row" style={{ justifyContent: 'center' }}>
        <Link href="/products" className="ml-btn">
          Keep browsing
        </Link>
        <a href="mailto:mozartlaser@gmail.com" className="ml-btn ml-btn--secondary">
          Email the studio
        </a>
      </div>
    </section>
  );
}
