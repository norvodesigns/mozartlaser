import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="container status-page">
      <div className="ml-section-head">
        <p className="ml-section-head__eyebrow">Page not found</p>
        <h1 className="ml-section-head__title">
          This one is not <em>here</em>
        </h1>
        <p className="ml-section-head__lede">
          The page you are after has moved or never existed. Everything we make is in
          the shop.
        </p>
      </div>
      <div className="row" style={{ justifyContent: 'center' }}>
        <Link href="/products" className="ml-btn">
          Browse products
        </Link>
        <Link href="/" className="ml-btn ml-btn--secondary">
          Home
        </Link>
      </div>
    </section>
  );
}
