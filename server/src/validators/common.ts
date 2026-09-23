import { z } from 'zod';
import { PATTERNS } from '@debu/shared';

export const phoneSchema = z
  .string()
  .trim()
  .transform((v) => v.replace(/[\s-]/g, '').replace(/^(\+91|0)/, ''))
  .refine((v) => PATTERNS.phone.test(v), 'Enter a valid 10-digit Indian mobile number');

export const nameSchema = z.string().trim().min(2, 'Please enter your name').max(80);

/** A date string (YYYY-MM-DD or ISO) that is today or later. */
export const futureDateSchema = z.coerce.date({ error: 'Choose a valid date' }).refine((d) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return d.getTime() >= today.getTime() - 24 * 60 * 60 * 1000; // allow for timezone skew
}, 'Please pick today or a future date');
