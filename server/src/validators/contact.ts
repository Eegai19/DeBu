import { z } from 'zod';
import { nameSchema, phoneSchema } from './common.js';

export const contactSchema = z.object({
  name: nameSchema,
  phone: phoneSchema,
  email: z.email('Enter a valid email').optional().or(z.literal('').transform(() => undefined)),
  topic: z
    .enum(['silk-thread-jewellery', 'wire-bags', 'blouse-alteration', 'mehandi', 'general'])
    .default('general'),
  message: z.string().trim().min(5, 'Please write a short message').max(2000),
});
