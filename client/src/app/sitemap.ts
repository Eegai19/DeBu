import type { MetadataRoute } from 'next';
import { JEWELLERY_CATEGORIES } from '@debu/shared';
import { getProducts } from '@/lib/catalog';
import { SITE_URL } from '@/lib/config';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getProducts();
  const staticRoutes = ['', '/silk-thread-jewellery', '/wire-bags', '/blouse-alteration', '/mehandi', '/contact', '/gallery'];
  return [
    ...staticRoutes.map((r) => ({ url: `${SITE_URL}${r}`, changeFrequency: 'weekly' as const, priority: r ? 0.8 : 1 })),
    ...JEWELLERY_CATEGORIES.map((c) => ({ url: `${SITE_URL}/silk-thread-jewellery/${c.slug}`, changeFrequency: 'weekly' as const, priority: 0.7 })),
    ...products.map((p) => ({ url: `${SITE_URL}/product/${p.slug}`, changeFrequency: 'weekly' as const, priority: 0.6 })),
  ];
}
