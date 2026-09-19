import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="wrap status">
      <div className="head head--center">
        <p className="eyebrow">Page not found</p>
        <h1>
          This one is not <em>here</em>
        </h1>
        <p className="lede">
          The page you are after has moved or never existed. Everything we make is in
          the shop.
        </p>
      </div>
      <div className="row" style={{ justifyContent: 'center' }}>
        <Link href="/products" className="btn">
          Browse products
        </Link>
        <Link href="/" className="btn btn--secondary">
          Home
        </Link>
      </div>
    </section>
  );
}
