import { computeTotals, type CartTotals, type PricingLine } from '@debu/shared';
import type { CatalogRepository } from './catalog.repository.js';
import type { CartItemInput } from '../validators/cart.js';
import { ApiError } from '../utils/ApiError.js';

export interface ResolvedLine extends PricingLine {
  slug: string;
  color: string;
  customColor?: string;
  notes?: string;
  lineTotal: number;
}

export interface Quote {
  lines: ResolvedLine[];
  totals: CartTotals;
}

/**
 * Resolves cart items against the catalogue so prices always come from the
 * database — never from the client — and computes authoritative totals.
 */
export async function quoteCart(
  catalog: CatalogRepository,
  items: CartItemInput[],
  couponCode?: string | null,
): Promise<Quote> {
  const problems: { field: string; message: string }[] = [];
  const lines: ResolvedLine[] = [];

  for (const [index, item] of items.entries()) {
    const field = `items.${index}`;
    let unitPrice: number;
    let productId: string;
    let name: string;
    let size: PricingLine['size'];

    if (item.kind === 'combo') {
      const combo = await catalog.findCombo(item.slug);
      if (!combo || !combo.inStock) {
        problems.push({ field, message: `${item.slug} is no longer available` });
        continue;
      }
      unitPrice = combo.price;
      productId = combo.id;
      name = combo.name;
    } else {
      const product = await catalog.findProduct(item.slug);
      if (!product || !product.inStock) {
        problems.push({ field, message: `${item.slug} is no longer available` });
        continue;
      }
      productId = product.id;
      name = product.name;
      if (product.sizes?.length) {
        const option = product.sizes.find((s) => s.size === item.size);
        if (!option) {
          problems.push({ field: `${field}.size`, message: `Choose a size for ${product.name}` });
          continue;
        }
        unitPrice = option.price;
        size = option.size;
      } else {
        unitPrice = product.price;
      }
    }

    lines.push({
      kind: item.kind,
      productId,
      name,
      size,
      slug: item.slug,
      color: item.color,
      customColor: item.color === 'custom' ? item.customColor : undefined,
      notes: item.notes,
      unitPrice,
      quantity: item.quantity,
      lineTotal: unitPrice * item.quantity,
    });
  }

  if (problems.length) throw ApiError.badRequest('Some items in your cart need attention.', problems);

  return { lines, totals: computeTotals(lines, couponCode) };
}
