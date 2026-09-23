import { test } from 'node:test';
import assert from 'node:assert/strict';
import { computeTotals, evaluateCoupon, products, combos, WIRE_BAG_COLLECTION, SHIPPING, GST } from './index.js';

const line = (over) => ({ kind: 'product', productId: 'p1', name: 'P', unitPrice: 100, quantity: 1, ...over });

test('catalogue has unique ids and slugs', () => {
  const all = [...products, ...combos];
  assert.equal(new Set(all.map((p) => p.id)).size, all.length);
  assert.equal(new Set(all.map((p) => p.slug)).size, all.length);
});

test('every wire bag offers small, medium and large', () => {
  for (const p of products.filter((p) => p.type === 'wire-bag')) {
    assert.deepEqual(p.sizes.map((s) => s.size), ['small', 'medium', 'large']);
    assert.equal(p.price, p.sizes[0].price);
  }
});

test('combos are cheaper than buying items separately', () => {
  for (const c of combos) {
    assert.ok(c.price < c.originalPrice, c.slug);
    assert.equal(c.savings, c.originalPrice - c.price);
  }
});

test('empty cart totals to zero with no shipping', () => {
  const t = computeTotals([], null);
  assert.equal(t.total, 0);
  assert.equal(t.shipping, 0);
});

test('wire bag complete collection discount applies per full S+M+L set', () => {
  const lines = [
    line({ productId: 'bag', size: 'small', unitPrice: 299, quantity: 2 }),
    line({ productId: 'bag', size: 'medium', unitPrice: 449, quantity: 2 }),
    line({ productId: 'bag', size: 'large', unitPrice: 599, quantity: 1 }),
    line({ productId: 'other', size: 'small', unitPrice: 199, quantity: 1 }),
  ];
  const t = computeTotals(lines, null);
  assert.equal(t.collections.length, 1);
  assert.equal(t.collections[0].sets, 1);
  assert.equal(t.collectionDiscount, WIRE_BAG_COLLECTION.discount);
});

test('coupon respects minimum order and cap', () => {
  assert.equal(evaluateCoupon('debu10', 400).valid, false);
  assert.equal(evaluateCoupon('DEBU10', 1000).discount, 100);
  assert.equal(evaluateCoupon('DEBU10', 10000).discount, 300);
  assert.equal(evaluateCoupon('NOPE', 10000).valid, false);
});

test('shipping, GST and total add up', () => {
  const small = computeTotals([line({ unitPrice: 500 })], null);
  assert.equal(small.shipping, SHIPPING.flatRate);
  assert.equal(small.gst, GST.enabled ? Math.round(500 * GST.rate) : 0);
  assert.equal(small.total, 500 + small.gst + small.shipping);

  const big = computeTotals([line({ unitPrice: 2000 })], 'FESTIVE150');
  assert.equal(big.couponDiscount, 150);
  assert.equal(big.shipping, 0);
  assert.equal(big.total, 1850 + big.gst);
});
