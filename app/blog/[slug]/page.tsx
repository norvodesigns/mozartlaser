import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { imageSize } from '@/lib/image-sizes';
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
    <article className="wrap section">
      <div className="head">
        <p className="eyebrow">{[post.tag, post.date].filter(Boolean).join(' · ')}</p>
        <h1
          className="post-item__title"
          style={{ fontSize: 44, lineHeight: '48px', fontWeight: 300 }}
          dangerouslySetInnerHTML={{ __html: post.titleHtml }}
        />
        {post.subtitle ? <p className="lede">{post.subtitle}</p> : null}
      </div>

      {post.hero ? (
        <figure className="post-hero">
          <Image
            src={post.hero.src}
            alt={post.hero.alt}
            width={imageSize(post.hero.src).w}
            height={imageSize(post.hero.src).h}
            sizes="(max-width: 1160px) 92vw, 1112px"
            priority
          />
          {post.heroCaption ? (
            <figcaption className="caption">{post.heroCaption}</figcaption>
          ) : null}
        </figure>
      ) : null}

      <div className="prose">
        {post.blocks.map((block, index) => {
          if (block.type === 'p') {
            return <p key={index} dangerouslySetInnerHTML={{ __html: block.html }} />;
          }
          if (block.type === 'quote') {
            return <blockquote key={index}>{block.text}</blockquote>;
          }
          if (block.type === 'image') {
            return (
              <Image
                key={index}
                src={block.src}
                alt={block.alt}
                width={imageSize(block.src).w}
                height={imageSize(block.src).h}
                sizes="(max-width: 720px) 92vw, 640px"
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
        <Link href="/blog" className="btn btn--secondary">
          All posts
        </Link>
        <Link href="/products" className="textlink">
          See the pieces →
        </Link>
      </div>
    </article>
  );
}
