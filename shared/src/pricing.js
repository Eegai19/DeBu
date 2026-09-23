// Pure pricing engine shared by the cart UI and the order API, so the total a
// customer sees is exactly the total the server charges.

import { COUPONS, GST, SHIPPING, WIRE_BAG_COLLECTION, CURRENCY } from './config.js';

const rupees = (n) => Math.round(n);

export function formatINR(amount) {
  return new Intl.NumberFormat(CURRENCY.locale, {
    style: 'currency',
    currency: CURRENCY.code,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function findCoupon(code) {
  if (!code) return undefined;
  const normalized = String(code).trim().toUpperCase();
  return COUPONS.find((c) => c.code === normalized);
}

/**
 * @param {string | undefined | null} code
 * @param {number} amount order value the coupon applies to
 */
export function evaluateCoupon(code, amount) {
  const coupon = findCoupon(code);
  if (!coupon) return { valid: false, discount: 0, message: 'This coupon code is not valid.' };
  if (amount < coupon.minOrder) {
    return {
      valid: false,
      discount: 0,
      coupon,
      message: `Add ${formatINR(coupon.minOrder - amount)} more to use ${coupon.code}.`,
    };
  }
  let discount = coupon.type === 'percent' ? (amount * coupon.value) / 100 : coupon.value;
  if (coupon.maxDiscount) discount = Math.min(discount, coupon.maxDiscount);
  discount = rupees(Math.min(discount, amount));
  return { valid: true, discount, coupon, message: `${coupon.code} applied — you save ${formatINR(discount)}!` };
}

/**
 * Number of complete Small + Medium + Large sets per wire bag in the cart.
 * Colours may differ between sizes; the set is counted per product.
 * @param {import('./index').PricingLine[]} lines
 */
export function wireBagCollections(lines) {
  /** @type {Map<string, {productId: string, name: string, small: number, medium: number, large: number}>} */
  const byProduct = new Map();
  for (const line of lines) {
    if (line.kind !== 'product' || !line.size) continue;
    const entry = byProduct.get(line.productId) ?? {
      productId: line.productId,
      name: line.name,
      small: 0,
      medium: 0,
      large: 0,
    };
    entry[line.size] += line.quantity;
    byProduct.set(line.productId, entry);
  }
  return [...byProduct.values()]
    .map((e) => ({ productId: e.productId, name: e.name, sets: Math.min(e.small, e.medium, e.large) }))
    .filter((e) => e.sets > 0);
}

/**
 * @param {import('./index').PricingLine[]} lines
 * @param {string | null | undefined} couponCode
 * @returns {import('./index').CartTotals}
 */
export function computeTotals(lines, couponCode) {
  const subtotal = lines.reduce((sum, l) => sum + l.unitPrice * l.quantity, 0);
  const itemCount = lines.reduce((sum, l) => sum + l.quantity, 0);

  const collections = wireBagCollections(lines);
  const collectionDiscount = collections.reduce((sum, c) => sum + c.sets * WIRE_BAG_COLLECTION.discount, 0);

  const afterCollection = subtotal - collectionDiscount;
  const couponResult = couponCode ? evaluateCoupon(couponCode, afterCollection) : null;
  const couponDiscount = couponResult?.valid ? couponResult.discount : 0;

  const discountedSubtotal = Math.max(0, afterCollection - couponDiscount);
  const shipping =
    itemCount === 0 || discountedSubtotal >= SHIPPING.freeAbove ? 0 : SHIPPING.flatRate;
  const gst = GST.enabled ? rupees(discountedSubtotal * GST.rate) : 0;
  const total = discountedSubtotal + gst + shipping;

  return {
    itemCount,
    subtotal,
    collections,
    collectionDiscount,
    coupon: couponResult?.valid
      ? { code: couponResult.coupon.code, description: couponResult.coupon.description }
      : null,
    couponMessage: couponResult?.message ?? null,
    couponDiscount,
    discountedSubtotal,
    shipping,
    gst,
    gstRate: GST.enabled ? GST.rate : 0,
    total,
    freeShippingRemaining: Math.max(0, SHIPPING.freeAbove - discountedSubtotal),
  };
}
