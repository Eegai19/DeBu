import { Router } from 'express';
import mongoose from 'mongoose';
import type { CatalogRepository } from '../services/catalog.repository.js';
import { catalogController } from '../controllers/catalog.controller.js';
import { orderController } from '../controllers/order.controller.js';
import { createBooking, createContactMessage } from '../controllers/booking.controller.js';
import { validate } from '../middleware/validate.js';
import { formLimiter } from '../middleware/rateLimit.js';
import { productQuerySchema } from '../validators/product.js';
import { couponSchema, orderSchema, quoteSchema } from '../validators/cart.js';
import { bookingSchema } from '../validators/booking.js';
import { contactSchema } from '../validators/contact.js';
import { adminRouter } from './admin.routes.js';

export function apiRouter(catalog: CatalogRepository): Router {
  const router = Router();
  const products = catalogController(catalog);
  const orders = orderController(catalog);

  router.get('/health', (_req, res) => {
    res.json({
      success: true,
      status: 'ok',
      database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
      uptime: Math.round(process.uptime()),
    });
  });

  // Catalogue
  router.get('/products', validate(productQuerySchema, 'query'), products.listProducts);
  router.get('/products/:slug', products.getProduct);
  router.get('/combos', products.listCombos);
  router.get('/combos/:slug', products.getCombo);

  // Cart & checkout
  router.post('/cart/quote', validate(quoteSchema), products.quote);
  router.get('/coupons', products.listCoupons);
  router.post('/coupons/validate', validate(couponSchema), products.validateCoupon);
  router.post('/orders', formLimiter, validate(orderSchema), orders.create);
  router.get('/orders/:orderNumber', orders.track);

  // Services & enquiries
  router.post('/bookings', formLimiter, validate(bookingSchema), createBooking);
  router.post('/contact', formLimiter, validate(contactSchema), createContactMessage);

  // Management
  router.use('/admin', adminRouter());

  return router;
}
