import { z } from 'zod';
import { COLOR_KEYS, PRODUCT_CATEGORIES, ART_KINDS } from '../models/Product.js';

export const productQuerySchema = z.object({
  category: z.enum(PRODUCT_CATEGORIES).optional(),
  type: z.enum(['jewellery', 'wire-bag']).optional(),
  color: z.enum(COLOR_KEYS).optional(),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
  q: z.string().trim().max(80).optional(),
  featured: z
    .enum(['true', 'false'])
    .transform((v) => v === 'true')
    .optional(),
  sort: z.enum(['featured', 'price-asc', 'price-desc', 'rating', 'newest']).default('featured'),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(48),
});
export type ProductQuery = z.infer<typeof productQuerySchema>;

const slugSchema = z
  .string()
  .trim()
  .toLowerCase()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use lowercase letters, numbers and dashes');

const productBaseSchema = z.object({
  id: z.string().trim().min(2).max(40),
  slug: slugSchema,
  name: z.string().trim().min(2).max(120),
  type: z.enum(['jewellery', 'wire-bag']),
  category: z.enum(PRODUCT_CATEGORIES),
  price: z.number().min(0),
  compareAtPrice: z.number().min(0).optional(),
  sizes: z
    .array(
      z.object({
        size: z.enum(['small', 'medium', 'large']),
        price: z.number().min(0),
        dimensions: z.string().max(60).default(''),
      }),
    )
    .length(3)
    .optional(),
  description: z.string().trim().min(10).max(2000),
  highlights: z.array(z.string().trim().max(120)).max(12).default([]),
  colors: z.array(z.enum(COLOR_KEYS)).min(1).default([...COLOR_KEYS]),
  defaultColor: z.enum(COLOR_KEYS),
  art: z.object({ kind: z.enum(ART_KINDS), variant: z.number().int().min(0).default(0) }),
  images: z.array(z.string().trim().max(500)).max(12).default([]),
  tags: z.array(z.string().trim().max(40)).max(20).default([]),
  badge: z.string().trim().max(30).optional(),
  featured: z.boolean().default(false),
  inStock: z.boolean().default(true),
  customizationNotes: z.string().trim().max(500).optional(),
});

export const productCreateSchema = productBaseSchema.refine((p) => p.type !== 'wire-bag' || p.sizes, {
  message: 'Wire bags need Small, Medium and Large sizes',
  path: ['sizes'],
});

export const productUpdateSchema = productBaseSchema.partial().omit({ id: true });
