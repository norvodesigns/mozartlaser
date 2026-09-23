import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { imageSize } from '@/lib/image-sizes';
import { posts } from '@/lib/posts';
import { reveal } from '@/lib/reveal';

export const metadata: Metadata = {
  title: 'Blog',
  description:
    'How the pieces get made: the woods we use and why, how a design becomes a cut file, and why we started Mozart Laser.',
  alternates: { canonical: '/blog' },
};

export default function BlogPage() {
  return (
    <section className="wrap section">
      <div className="head" {...reveal('stagger')}>
        <p className="eyebrow">From the studio</p>
        <h1>
          The <em>Blog</em>
        </h1>
        <p className="lede">
          How the pieces get made, what the woods do differently, and the thinking
          behind the designs.
        </p>
      </div>

      <div className="posts">
        {posts.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`} className="post-item" {...reveal()}>
            <div className="post-item__media">
              {post.hero ? (
                <Image
                  src={post.hero.src}
                  alt={post.hero.alt}
                  width={imageSize(post.hero.src).w}
                  height={imageSize(post.hero.src).h}
                  sizes="(max-width: 720px) 92vw, 220px"
                />
              ) : null}
            </div>
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
    </section>
  );
}
