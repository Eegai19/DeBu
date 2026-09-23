import { z } from 'zod';
import { ORDER_STATUSES, PAYMENT_STATUSES } from '../models/Order.js';
import { BOOKING_STATUSES } from '../models/Booking.js';

export const orderStatusSchema = z
  .object({
    status: z.enum(ORDER_STATUSES).optional(),
    paymentStatus: z.enum(PAYMENT_STATUSES).optional(),
  })
  .refine((v) => v.status || v.paymentStatus, 'Provide status or paymentStatus');

export const bookingStatusSchema = z.object({ status: z.enum(BOOKING_STATUSES) });
export const messageStatusSchema = z.object({ status: z.enum(['new', 'replied', 'closed']) });

export const listQuerySchema = z.object({
  status: z.string().trim().max(30).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(25),
});
