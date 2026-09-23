import { z } from 'zod';
import { INDIAN_STATES, PATTERNS } from '@debu/shared';
import { nameSchema, phoneSchema } from './common.js';

export const colorSchema = z.enum(['red', 'green', 'blue', 'pink', 'maroon', 'yellow', 'gold', 'custom']);

export const cartItemSchema = z
  .object({
    kind: z.enum(['product', 'combo']).default('product'),
    slug: z.string().trim().min(1).max(120),
    size: z.enum(['small', 'medium', 'large']).optional(),
    color: colorSchema,
    customColor: z.string().trim().max(80).optional(),
    notes: z.string().trim().max(500).optional(),
    quantity: z.coerce.number().int().min(1).max(50),
  })
  .refine((i) => i.color !== 'custom' || (i.customColor && i.customColor.length > 1), {
    message: 'Describe your custom colour',
    path: ['customColor'],
  });

export const quoteSchema = z.object({
  items: z.array(cartItemSchema).min(1, 'Your cart is empty').max(50),
  couponCode: z.string().trim().max(30).optional().nullable(),
});

export const customerSchema = z.object({
  name: nameSchema,
  phone: phoneSchema,
  email: z.email('Enter a valid email').optional().or(z.literal('').transform(() => undefined)),
  address: z.string().trim().min(8, 'Please enter your full address').max(300),
  city: z.string().trim().min(2, 'Enter your city').max(60),
  state: z.enum(INDIAN_STATES as [string, ...string[]], { error: 'Select your state' }),
  pincode: z.string().trim().regex(PATTERNS.pincode, 'Enter a valid 6-digit pincode'),
});

export const orderSchema = quoteSchema.extend({
  customer: customerSchema,
  paymentMethod: z.enum(['cod', 'upi', 'online']),
  notes: z.string().trim().max(1000).optional(),
});

export const couponSchema = z.object({
  code: z.string().trim().min(1).max(30),
  amount: z.coerce.number().min(0),
});

export type CartItemInput = z.infer<typeof cartItemSchema>;
export type OrderInput = z.infer<typeof orderSchema>;
