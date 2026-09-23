import { Router } from 'express';
import { requireAdmin } from '../middleware/adminAuth.js';
import { validate } from '../middleware/validate.js';
import * as admin from '../controllers/admin.controller.js';
import { productCreateSchema, productUpdateSchema } from '../validators/product.js';
import { bookingStatusSchema, listQuerySchema, messageStatusSchema, orderStatusSchema } from '../validators/admin.js';

/** Product management & back-office endpoints. All require `x-api-key`. */
export function adminRouter(): Router {
  const router = Router();
  router.use(requireAdmin);

  router.get('/stats', admin.adminStats);

  router.get('/products', admin.adminListProducts);
  router.post('/products', validate(productCreateSchema), admin.adminCreateProduct);
  router.patch('/products/:slug', validate(productUpdateSchema), admin.adminUpdateProduct);
  router.delete('/products/:slug', admin.adminDeleteProduct);

  router.get('/orders', validate(listQuerySchema, 'query'), admin.adminListOrders);
  router.patch('/orders/:id', validate(orderStatusSchema), admin.adminUpdateOrder);

  router.get('/bookings', validate(listQuerySchema, 'query'), admin.adminListBookings);
  router.patch('/bookings/:id', validate(bookingStatusSchema), admin.adminUpdateBooking);

  router.get('/messages', validate(listQuerySchema, 'query'), admin.adminListMessages);
  router.patch('/messages/:id', validate(messageStatusSchema), admin.adminUpdateMessage);

  return router;
}
