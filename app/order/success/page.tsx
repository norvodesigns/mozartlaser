import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { ClearCart } from './ClearCart';
import { reveal } from '@/lib/reveal';

export const metadata: Metadata = {
  title: 'Order confirmed',
  description: 'Your Mozart Laser order is confirmed.',
  robots: { index: false, follow: false },
};

export default function SuccessPage() {
  return (
    <section className="wrap status">
      <Suspense fallback={null}>
        <ClearCart />
      </Suspense>
      <div className="head head--center" {...reveal('stagger')}>
        <p className="eyebrow">Order confirmed</p>
        <h1>
          Thank you — we are <em>on</em> it
        </h1>
        <p className="lede">
          A receipt is on its way to your inbox. We cut and finish to order, so your
          piece ships in 3–5 days. If it carries a custom design, we will email a proof
          before anything is cut.
        </p>
      </div>
      <div className="row" style={{ justifyContent: 'center' }} {...reveal('stagger')}>
        <Link href="/products" className="btn">
          Keep browsing
        </Link>
        <a href="mailto:mozartlaser@gmail.com" className="btn btn--secondary">
          Email the studio
        </a>
      </div>
    </section>
  );
}
