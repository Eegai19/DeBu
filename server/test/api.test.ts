import { test } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { products, combos, WIRE_BAG_COLLECTION } from '@debu/shared';

process.env.NODE_ENV = 'test';
const { createApp } = await import('../src/app.js');
const { createMemoryCatalog } = await import('../src/services/catalog.repository.js');

const app = createApp({ catalog: createMemoryCatalog(products, combos) });

test('GET /api/health responds', async () => {
  const res = await request(app).get('/api/health').expect(200);
  assert.equal(res.body.status, 'ok');
});

test('GET /api/products filters by category and price', async () => {
  const res = await request(app).get('/api/products?category=earrings&maxPrice=300&sort=price-asc').expect(200);
  assert.ok(res.body.data.length > 0);
  for (const p of res.body.data) {
    assert.equal(p.category, 'earrings');
    assert.ok(p.price <= 300);
  }
});

test('GET /api/products rejects bad query', async () => {
  await request(app).get('/api/products?category=shoes').expect(400);
});

test('GET /api/products/:slug returns related items', async () => {
  const res = await request(app).get('/api/products/grand-silk-jhumkas').expect(200);
  assert.equal(res.body.data.name, 'Grand Silk Jhumkas');
  assert.ok(res.body.related.every((p: { category: string }) => p.category === 'earrings'));
  await request(app).get('/api/products/does-not-exist').expect(404);
});

test('POST /api/cart/quote prices from the catalogue, not the client', async () => {
  const bag = products.find((p) => p.type === 'wire-bag')!;
  const res = await request(app)
    .post('/api/cart/quote')
    .send({
      items: [
        { slug: bag.slug, size: 'small', color: 'pink', quantity: 1, unitPrice: 1 },
        { slug: bag.slug, size: 'medium', color: 'pink', quantity: 1 },
        { slug: bag.slug, size: 'large', color: 'custom', customColor: 'Peacock blue', quantity: 1 },
        { kind: 'combo', slug: 'bridal-combo', color: 'maroon', quantity: 1 },
      ],
      couponCode: 'festive150',
    })
    .expect(200);
  const { totals, lines } = res.body.data;
  const bagTotal = bag.sizes!.reduce((s, o) => s + o.price, 0);
  assert.equal(lines[0].unitPrice, bag.sizes![0].price);
  assert.equal(totals.subtotal, bagTotal + combos[0].price);
  assert.equal(totals.collectionDiscount, WIRE_BAG_COLLECTION.discount);
  assert.equal(totals.couponDiscount, 150);
});

test('POST /api/cart/quote requires a size for wire bags and a custom colour description', async () => {
  const res = await request(app)
    .post('/api/cart/quote')
    .send({ items: [{ slug: 'classic-basket-wire-bag', color: 'red', quantity: 1 }] })
    .expect(400);
  assert.match(res.body.details[0].message, /size/i);

  await request(app)
    .post('/api/cart/quote')
    .send({ items: [{ slug: 'kundan-maang-tikka', color: 'custom', quantity: 1 }] })
    .expect(400);
});

test('POST /api/coupons/validate', async () => {
  const ok = await request(app).post('/api/coupons/validate').send({ code: 'DEBU10', amount: 1000 }).expect(200);
  assert.equal(ok.body.data.discount, 100);
  await request(app).post('/api/coupons/validate').send({ code: 'DEBU10', amount: 100 }).expect(422);
});

test('POST /api/orders validates customer details', async () => {
  const res = await request(app)
    .post('/api/orders')
    .send({
      items: [{ slug: 'kundan-maang-tikka', color: 'red', quantity: 1 }],
      customer: { name: 'A', phone: '12345', address: 'x', city: '', state: 'Nowhere', pincode: '000' },
      paymentMethod: 'cod',
    })
    .expect(400);
  const fields = res.body.details.map((d: { field: string }) => d.field);
  for (const f of ['customer.name', 'customer.phone', 'customer.address', 'customer.state', 'customer.pincode']) {
    assert.ok(fields.includes(f), `expected error for ${f}`);
  }
});

test('POST /api/bookings validates by service type', async () => {
  const res = await request(app)
    .post('/api/bookings')
    .send({ service: 'mehandi', name: 'Priya', phone: '9876543210', eventType: 'Birthday', eventDate: '2000-01-01' })
    .expect(400);
  const fields = res.body.details.map((d: { field: string }) => d.field);
  assert.deepEqual(fields.sort(), ['eventDate', 'eventType']);
});

test('admin routes require an API key', async () => {
  const res = await request(app).get('/api/admin/stats');
  assert.ok([401, 503].includes(res.status));
});

test('unknown routes return JSON 404', async () => {
  const res = await request(app).get('/api/nope').expect(404);
  assert.equal(res.body.success, false);
});
