import type { MetadataRoute } from 'next';
import { getProducts } from '@/lib/products';
import { posts } from '@/lib/posts';

const SITE = 'https://mozartlaser.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const products = await getProducts();

  return [
    { url: SITE, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE}/products`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${SITE}/create`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE}/about`, lastModified: now, changeFrequency: 'yearly', priority: 0.5 },
    { url: `${SITE}/blog`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    ...products.map((product) => ({
      url: `${SITE}/products/${product.slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
    ...posts.map((post) => ({
      url: `${SITE}/blog/${post.slug}`,
      lastModified: now,
      changeFrequency: 'yearly' as const,
      priority: 0.5,
    })),
  ];
}
