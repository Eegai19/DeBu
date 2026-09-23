import { z } from 'zod';
import { BLOUSE_SERVICES, MEHANDI_EVENTS } from '@debu/shared';
import { futureDateSchema, nameSchema, phoneSchema } from './common.js';

const blouseBooking = z.object({
  service: z.literal('blouse-alteration'),
  name: nameSchema,
  phone: phoneSchema,
  requirement: z.string().trim().min(3, 'Tell us what you need').max(500),
  preferredDate: futureDateSchema,
  message: z.string().trim().max(1000).optional(),
});

const mehandiBooking = z.object({
  service: z.literal('mehandi'),
  name: nameSchema,
  phone: phoneSchema,
  eventType: z.enum(MEHANDI_EVENTS as [string, ...string[]], { error: 'Choose an event type' }),
  eventDate: futureDateSchema,
  message: z.string().trim().max(1000).optional(),
});

export const bookingSchema = z.discriminatedUnion('service', [blouseBooking, mehandiBooking]);
export type BookingInput = z.infer<typeof bookingSchema>;

export const blouseServiceNames = BLOUSE_SERVICES;
