import 'server-only';
import { combos as sampleCombos, products as sampleProducts, type Combo, type Product, type ProductCategory } from '@debu/shared';
import { API_URL } from './config';

/**
 * Catalogue access for Server Components. Reads from the DeBu API when
 * NEXT_PUBLIC_API_URL is configured (cached & revalidated every 5 minutes)
 * and falls back to the bundled sample catalogue so the storefront always
 * renders — even during a backend outage or a static build.
 */

const REVALIDATE = 300;

async function fromApi<T>(path: string): Promise<T | null> {
  if (!API_URL) return null;
  try {
    const res = await fetch(`${API_URL}/api${path}`, {
      next: { revalidate: REVALIDATE, tags: ['catalog'] },
      signal: AbortSignal.timeout(4000),
    });
    if (!res.ok) return null;
    const json = (await res.json()) as { data: T };
    return json.data;
  } catch {
    return null;
  }
}

export async function getProducts(): Promise<Product[]> {
  const data = await fromApi<Product[]>('/products?limit=100');
  return data && data.length ? data : sampleProducts;
}

export async function getProductsByCategory(category: ProductCategory): Promise<Product[]> {
  return (await getProducts()).filter((p) => p.category === category);
}

export async function getProduct(slug: string): Promise<Product | undefined> {
  return (await getProducts()).find((p) => p.slug === slug);
}

export async function getRelatedProducts(product: Product, limit = 4): Promise<Product[]> {
  const all = await getProducts();
  const same = all.filter((p) => p.category === product.category && p.slug !== product.slug);
  const others = all.filter((p) => p.type === product.type && p.category !== product.category);
  return [...same, ...others].slice(0, limit);
}

export async function getFeaturedProducts(limit = 8): Promise<Product[]> {
  return (await getProducts()).filter((p) => p.featured).slice(0, limit);
}

export async function getCombos(): Promise<Combo[]> {
  const data = await fromApi<Combo[]>('/combos');
  return data && data.length ? data : sampleCombos;
}
