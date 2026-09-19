import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { posts } from '@/lib/posts';

export const metadata: Metadata = {
  title: 'Journal',
  description:
    'How the pieces get made: the woods we use and why, how a design becomes a cut file, and why we started Mozart Laser.',
  alternates: { canonical: '/blog' },
};

export default function BlogPage() {
  return (
    <section className="section">
      <div className="container">
        <div className="ml-section-head section__head">
          <p className="ml-section-head__eyebrow">From the studio</p>
          <h1 className="ml-section-head__title">
            The <em>journal</em>
          </h1>
          <p className="ml-section-head__lede">
            How the pieces get made, what the woods do differently, and the thinking
            behind the designs.
          </p>
        </div>

        <div className="post-list">
          {posts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="post-item">
              {post.hero ? (
                <div className="post-item__media">
                  <Image
                    src={post.hero.src}
                    alt={post.hero.alt}
                    width={600}
                    height={450}
                    sizes="(max-width: 720px) 100vw, 220px"
                  />
                </div>
              ) : (
                <div className="post-item__media" aria-hidden="true" />
              )}
              <div className="post-item__body">
                <p className="post-item__meta">
                  {[post.tag, post.date].filter(Boolean).join(' · ')}
                </p>
                <h2
                  className="post-item__title"
                  dangerouslySetInnerHTML={{ __html: post.titleHtml }}
                />
                <p className="post-item__excerpt">{post.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
