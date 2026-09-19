import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPost, posts } from '@/lib/posts';

export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const post = getPost(params.slug);
  if (!post) return { title: 'Post not found' };

  return {
    title: post.title,
    description: post.subtitle || post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: 'article',
      title: `${post.title} | Mozart Laser`,
      description: post.subtitle || post.excerpt,
      images: post.hero ? [post.hero.src] : undefined,
    },
  };
}

export default function PostPage({ params }: { params: { slug: string } }) {
  const post = getPost(params.slug);
  if (!post) notFound();

  return (
    <article className="section">
      <div className="container">
        <div className="ml-section-head section__head">
          <p className="ml-section-head__eyebrow">
            {[post.tag, post.date].filter(Boolean).join(' · ')}
          </p>
          <h1
            className="ml-section-head__title"
            dangerouslySetInnerHTML={{ __html: post.titleHtml }}
          />
          {post.subtitle ? (
            <p className="ml-section-head__lede">{post.subtitle}</p>
          ) : null}
        </div>

        {post.hero ? (
          <figure style={{ marginBottom: 'var(--space-7)' }}>
            <Image
              src={post.hero.src}
              alt={post.hero.alt}
              width={1400}
              height={900}
              sizes="(max-width: 1200px) 100vw, 1200px"
              priority
            />
            {post.heroCaption ? (
              <figcaption
                className="caption text-subtle"
                style={{ marginTop: 'var(--space-3)' }}
              >
                {post.heroCaption}
              </figcaption>
            ) : null}
          </figure>
        ) : null}

        <div className="prose">
          {post.blocks.map((block, index) => {
            if (block.type === 'p') {
              return (
                <p key={index} dangerouslySetInnerHTML={{ __html: block.html }} />
              );
            }
            if (block.type === 'quote') {
              return (
                <figure key={index} className="ml-quote" style={{ marginBlock: 'var(--space-6)' }}>
                  <blockquote className="ml-quote__text">{block.text}</blockquote>
                </figure>
              );
            }
            if (block.type === 'image') {
              return (
                <Image
                  key={index}
                  src={block.src}
                  alt={block.alt}
                  width={1200}
                  height={900}
                  sizes="(max-width: 720px) 100vw, 640px"
                />
              );
            }
            return (
              <video
                key={index}
                src={block.src}
                controls
                muted
                loop
                playsInline
                preload="metadata"
                style={{ maxWidth: 320, marginInline: 'auto', width: '100%' }}
              />
            );
          })}
        </div>

        <div className="row" style={{ marginTop: 'var(--space-8)' }}>
          <Link href="/blog" className="ml-btn ml-btn--secondary">
            All posts
          </Link>
          <Link href="/products" className="ml-btn ml-btn--ghost">
            See the pieces
          </Link>
        </div>
      </div>
    </article>
  );
}
