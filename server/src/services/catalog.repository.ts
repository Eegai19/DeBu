import type { Combo, Product } from '@debu/shared';
import { ComboModel, ProductModel } from '../models/index.js';
import type { ProductQuery } from '../validators/product.js';

export interface ProductPage {
  items: Product[];
  total: number;
  page: number;
  pages: number;
}

/** Read-side access to the catalogue. Swappable for tests. */
export interface CatalogRepository {
  listProducts(query: ProductQuery): Promise<ProductPage>;
  findProduct(slug: string): Promise<Product | null>;
  listCombos(): Promise<Combo[]>;
  findCombo(slug: string): Promise<Combo | null>;
}

const SORTS: Record<ProductQuery['sort'], Record<string, 1 | -1>> = {
  featured: { featured: -1, rating: -1, reviews: -1 },
  'price-asc': { price: 1 },
  'price-desc': { price: -1 },
  rating: { rating: -1, reviews: -1 },
  newest: { createdAt: -1 },
};

const escapeRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export const mongoCatalog: CatalogRepository = {
  async listProducts(q) {
    const filter: Record<string, unknown> = { isActive: true };
    if (q.category) filter.category = q.category;
    if (q.type) filter.type = q.type;
    if (q.color) filter.colors = q.color;
    if (q.featured !== undefined) filter.featured = q.featured;
    if (q.minPrice !== undefined || q.maxPrice !== undefined) {
      filter.price = {
        ...(q.minPrice !== undefined && { $gte: q.minPrice }),
        ...(q.maxPrice !== undefined && { $lte: q.maxPrice }),
      };
    }
    if (q.q) {
      const rx = new RegExp(escapeRegex(q.q), 'i');
      filter.$or = [{ name: rx }, { description: rx }, { tags: rx }, { category: rx }];
    }

    const [docs, total] = await Promise.all([
      ProductModel.find(filter)
        .sort(SORTS[q.sort])
        .skip((q.page - 1) * q.limit)
        .limit(q.limit),
      ProductModel.countDocuments(filter),
    ]);
    return {
      items: docs.map((d) => d.toJSON() as unknown as Product),
      total,
      page: q.page,
      pages: Math.max(1, Math.ceil(total / q.limit)),
    };
  },

  async findProduct(slug) {
    const doc = await ProductModel.findOne({ slug, isActive: true });
    return doc ? (doc.toJSON() as unknown as Product) : null;
  },

  async listCombos() {
    const docs = await ComboModel.find({ isActive: true }).sort({ price: -1 });
    return docs.map((d) => d.toJSON() as unknown as Combo);
  },

  async findCombo(slug) {
    const doc = await ComboModel.findOne({ slug, isActive: true });
    return doc ? (doc.toJSON() as unknown as Combo) : null;
  },
};

/** In-memory catalogue backed by the shared sample data (used in tests). */
export function createMemoryCatalog(products: Product[], combos: Combo[]): CatalogRepository {
  return {
    async listProducts(q) {
      const text = q.q?.toLowerCase();
      let items = products.filter(
        (p) =>
          (!q.category || p.category === q.category) &&
          (!q.type || p.type === q.type) &&
          (!q.color || p.colors.includes(q.color)) &&
          (q.featured === undefined || Boolean(p.featured) === q.featured) &&
          (q.minPrice === undefined || p.price >= q.minPrice) &&
          (q.maxPrice === undefined || p.price <= q.maxPrice) &&
          (!text || [p.name, p.description, p.category, ...p.tags].some((s) => s.toLowerCase().includes(text))),
      );
      if (q.sort === 'price-asc') items = [...items].sort((a, b) => a.price - b.price);
      if (q.sort === 'price-desc') items = [...items].sort((a, b) => b.price - a.price);
      if (q.sort === 'rating') items = [...items].sort((a, b) => b.rating - a.rating);
      const total = items.length;
      return {
        items: items.slice((q.page - 1) * q.limit, q.page * q.limit),
        total,
        page: q.page,
        pages: Math.max(1, Math.ceil(total / q.limit)),
      };
    },
    async findProduct(slug) {
      return products.find((p) => p.slug === slug) ?? null;
    },
    async listCombos() {
      return combos;
    },
    async findCombo(slug) {
      return combos.find((c) => c.slug === slug) ?? null;
    },
  };
}
