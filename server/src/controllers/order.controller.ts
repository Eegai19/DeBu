import type { RequestHandler } from 'express';
import type { CatalogRepository } from '../services/catalog.repository.js';
import { quoteCart } from '../services/pricing.service.js';
import { notifier } from '../services/notification.service.js';
import { OrderModel } from '../models/index.js';
import type { OrderInput } from '../validators/cart.js';
import { generateReference } from '../utils/reference.js';
import { ApiError } from '../utils/ApiError.js';
import { PATTERNS } from '@debu/shared';

export function orderController(catalog: CatalogRepository) {
  const create: RequestHandler = async (_req, res) => {
    const input = res.locals.body as OrderInput;
    const { lines, totals } = await quoteCart(catalog, input.items, input.couponCode);

    const order = await OrderModel.create({
      orderNumber: generateReference('DEBU'),
      customer: input.customer,
      items: lines.map((l) => ({
        kind: l.kind,
        productId: l.productId,
        slug: l.slug,
        name: l.name,
        size: l.size,
        color: l.color,
        customColor: l.customColor,
        notes: l.notes,
        unitPrice: l.unitPrice,
        quantity: l.quantity,
        lineTotal: l.lineTotal,
      })),
      pricing: {
        subtotal: totals.subtotal,
        collectionDiscount: totals.collectionDiscount,
        couponCode: totals.coupon?.code,
        couponDiscount: totals.couponDiscount,
        shipping: totals.shipping,
        gst: totals.gst,
        total: totals.total,
      },
      paymentMethod: input.paymentMethod,
      paymentStatus: input.paymentMethod === 'cod' ? 'pending' : 'awaiting-verification',
      notes: input.notes,
    });

    void notifier.orderPlaced({
      orderNumber: order.orderNumber,
      customer: input.customer,
      pricing: { total: totals.total },
    });
    res.status(201).json({ success: true, message: 'Order placed successfully', data: order.toJSON() });
  };

  /** Order tracking — requires the phone number used at checkout. */
  const track: RequestHandler<{ orderNumber: string }> = async (req, res) => {
    const phone = String(req.query.phone ?? '').replace(/\D/g, '').slice(-10);
    if (!PATTERNS.phone.test(phone)) throw ApiError.badRequest('Enter the mobile number used for this order');
    const order = await OrderModel.findOne({
      orderNumber: req.params.orderNumber.toUpperCase(),
      'customer.phone': phone,
    });
    if (!order) throw ApiError.notFound('We could not find an order with those details');
    res.json({ success: true, data: order.toJSON() });
  };

  return { create, track };
}
